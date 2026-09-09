import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = pg;

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || '123456',
  port: parseInt(process.env.DB_PORT || '5432', 10)
};

const DB_NAME = process.env.DB_NAME || 'sena_juicios_db';

async function initDatabase() {
  console.log('--- Iniciando Conexión a PostgreSQL Local ---');
  
  // 1. Conectar a postgres raíz para verificar/crear la BD
  const rootClient = new Client({
    ...dbConfig,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    console.log('✓ Conectado al servidor PostgreSQL');

    const checkDb = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (checkDb.rows.length === 0) {
      await rootClient.query(`CREATE DATABASE ${DB_NAME};`);
      console.log(`✓ Base de datos "${DB_NAME}" creada exitosamente.`);
    } else {
      console.log(`✓ Base de datos "${DB_NAME}" ya existe.`);
    }
  } catch (err) {
    console.error('Error verificando base de datos:', err.message);
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  // 2. Conectar a sena_juicios_db y ejecutar esquema DDL
  const appClient = new Client({
    ...dbConfig,
    database: DB_NAME
  });

  try {
    await appClient.connect();
    console.log(`✓ Conectado a la base de datos "${DB_NAME}"`);

    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await appClient.query(schemaSql);
    console.log('✓ Esquema DDL (tablas, claves primarias, foráneas e índices) creado con éxito.');

    // 3. Insertar Fases del Proyecto Formativo si no existen
    const fases = [
      { id: 1, nombre: 'FASE 1: ANÁLISIS', color: '#2563EB', descripcion: 'Diagnóstico de necesidades y levantamiento de requerimientos.' },
      { id: 2, nombre: 'FASE 2: PLANEACIÓN', color: '#7C3AED', descripcion: 'Diseño de la solución, arquitectura y modelado de datos.' },
      { id: 3, nombre: 'FASE 3: EJECUCIÓN', color: '#39A900', descripcion: 'Desarrollo, codificación y pruebas de aceptación.' },
      { id: 4, nombre: 'FASE 4: EVALUACIÓN', color: '#D97706', descripcion: 'Sustentación final y evaluación del proyecto.' }
    ];

    for (const f of fases) {
      await appClient.query(
        `INSERT INTO fases_proyecto (id, nombre, color, descripcion)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, color = EXCLUDED.color, descripcion = EXCLUDED.descripcion`,
        [f.id, f.nombre, f.color, f.descripcion]
      );
    }
    console.log('✓ Fases del proyecto formativo configuradas.');

    // 4. Verificar si ya hay fichas cargadas, sino cargar datos iniciales
    const checkFichas = await appClient.query('SELECT COUNT(*) FROM fichas_caracterizacion');
    const totalFichas = parseInt(checkFichas.rows[0].count, 10);

    if (totalFichas === 0) {
      console.log('ℹ Poblando datos iniciales desde initialData.json...');
      const dataPath = path.resolve(__dirname, '../../src/data/initialData.json');
      if (fs.existsSync(dataPath)) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const fichasArr = rawData.fichas || [];

        for (const ficha of fichasArr) {
          await insertFichaData(appClient, ficha);
        }
        console.log('✓ Datos iniciales (Ganadería y Gestión Contable) migrados a PostgreSQL.');
      }
    } else {
      console.log(`ℹ La base de datos ya contiene ${totalFichas} fichas registradas.`);
    }

    // 5. Estadísticas finales
    const [apCount, compCount, rapCount, jCount] = await Promise.all([
      appClient.query('SELECT COUNT(*) FROM aprendices'),
      appClient.query('SELECT COUNT(*) FROM competencias'),
      appClient.query('SELECT COUNT(*) FROM resultados_aprendizaje'),
      appClient.query('SELECT COUNT(*) FROM juicios_evaluativos')
    ]);

    console.log('\n=============================================');
    console.log('RESUMEN DE TABLAS EN POSTGRESQL (LOCAL):');
    console.log(`- Aprendices registrados: ${apCount.rows[0].count}`);
    console.log(`- Competencias: ${compCount.rows[0].count}`);
    console.log(`- Resultados de Aprendizaje: ${rapCount.rows[0].count}`);
    console.log(`- Juicios Evaluativos en BD: ${jCount.rows[0].count}`);
    console.log('=============================================\n');

  } catch (err) {
    console.error('Error durante la inicialización de la BD:', err);
  } finally {
    await appClient.end();
  }
}

async function insertFichaData(client, ficha) {
  const meta = ficha.meta || {};
  const fichaNumero = String(meta.ficha || '0');

  // Transacción
  await client.query('BEGIN');
  try {
    // 1. Centro
    const centroCodigo = meta.centro ? meta.centro.split('-')[0].trim() : '9516';
    const centroNombre = meta.centro || 'Centro de Formación SENA';
    const regionalNombre = meta.regional || 'Regional Caquetá';
    await client.query(
      `INSERT INTO centros_formacion (codigo, nombre, regional)
       VALUES ($1, $2, $3)
       ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre, regional = EXCLUDED.regional`,
      [centroCodigo, centroNombre, regionalNombre]
    );

    // 2. Programa
    const progCodigo = String(meta.codigoPrograma || 'PROG01');
    const progVersion = parseInt(meta.version || '1', 10);
    const progDenominacion = meta.programa || 'Programa de Formación';
    await client.query(
      `INSERT INTO programas_formacion (codigo, version, denominacion)
       VALUES ($1, $2, $3)
       ON CONFLICT (codigo) DO UPDATE SET version = EXCLUDED.version, denominacion = EXCLUDED.denominacion`,
      [progCodigo, progVersion, progDenominacion]
    );

    // 3. Ficha
    await client.query(
      `INSERT INTO fichas_caracterizacion (numero, programa_codigo, centro_codigo, estado, modalidad, fecha_reporte)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (numero) DO UPDATE SET estado = EXCLUDED.estado, modalidad = EXCLUDED.modalidad, fecha_reporte = EXCLUDED.fecha_reporte`,
      [fichaNumero, progCodigo, centroCodigo, meta.estadoFicha || 'EN EJECUCION', meta.modalidad || 'PRESENCIAL', String(meta.fechaReporte || '')]
    );

    // 4. Competencias
    for (const c of ficha.competencias || []) {
      await client.query(
        `INSERT INTO competencias (codigo, denominacion, texto_completo, programa_codigo)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (codigo) DO UPDATE SET denominacion = EXCLUDED.denominacion`,
        [c.codigo, c.denominacion, c.textoCompleto || c.denominacion, progCodigo]
      );
    }

    // 5. RAPs
    let idxRap = 0;
    for (const r of ficha.resultadosAprendizaje || []) {
      const faseId = (idxRap % 4) + 1; // Distribución en las 4 fases
      idxRap++;
      await client.query(
        `INSERT INTO resultados_aprendizaje (codigo, competencia_codigo, denominacion, texto_completo, fase_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (codigo) DO UPDATE SET denominacion = EXCLUDED.denominacion, fase_id = COALESCE(resultados_aprendizaje.fase_id, EXCLUDED.fase_id)`,
        [r.codigo, r.competenciaCodigo, r.denominacion, r.textoCompleto || r.denominacion, faseId]
      );
    }

    // 6. Aprendices
    for (const a of ficha.aprendices || []) {
      await client.query(
        `INSERT INTO aprendices (numero_documento, tipo_documento, nombres, apellidos, nombre_completo, estado, ficha_numero)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (numero_documento) DO UPDATE SET estado = EXCLUDED.estado, ficha_numero = EXCLUDED.ficha_numero`,
        [a.numeroDocumento, a.tipoDocumento || 'CC', a.nombres, a.apellidos, a.nombreCompleto, a.estado || 'EN FORMACION', fichaNumero]
      );
    }

    // 7. Funcionarios
    for (const func of ficha.funcionarios || []) {
      if (func.documento) {
        await client.query(
          `INSERT INTO funcionarios (documento, nombre_completo)
           VALUES ($1, $2)
           ON CONFLICT (documento) DO UPDATE SET nombre_completo = EXCLUDED.nombre_completo`,
          [func.documento, func.nombre || 'Funcionario SENA']
        );
      }
    }

    // 8. Juicios Evaluativos
    for (const j of ficha.juicios || []) {
      let funcDoc = null;
      if (j.funcionario && j.funcionario.includes('-')) {
        funcDoc = j.funcionario.split('-')[0].trim();
        // Asegurar que el funcionario existe
        await client.query(
          `INSERT INTO funcionarios (documento, nombre_completo)
           VALUES ($1, $2)
           ON CONFLICT (documento) DO NOTHING`,
          [funcDoc, j.funcionario.split('-').slice(1).join('-').trim() || j.funcionario]
        );
      }

      await client.query(
        `INSERT INTO juicios_evaluativos (aprendiz_documento, competencia_codigo, rap_codigo, ficha_numero, estado_juicio, fecha_hora_evaluacion, funcionario_documento)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT ON CONSTRAINT uq_aprendiz_rap_ficha DO UPDATE 
         SET estado_juicio = EXCLUDED.estado_juicio, fecha_hora_evaluacion = EXCLUDED.fecha_hora_evaluacion, funcionario_documento = EXCLUDED.funcionario_documento`,
        [j.numeroDocumento, j.competenciaCodigo, j.rapCodigo, fichaNumero, j.estadoJuicio, j.fechaHora || null, funcDoc]
      );
    }

    await client.query('COMMIT');
    console.log(`✓ Ficha ${fichaNumero} (${meta.programa}) insertada en PostgreSQL.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error insertando ficha ${fichaNumero}:`, err);
    throw err;
  }
}

initDatabase();
