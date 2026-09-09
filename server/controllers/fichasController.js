import { pool } from '../db/connection.js';

export const fichasController = {
  // 1. Obtener catálogo de fichas con métricas calculadas en PostgreSQL
  async getAllFichas(req, res) {
    try {
      const query = `
        SELECT 
          f.numero AS ficha,
          p.codigo AS codigo_programa,
          p.version,
          p.denominacion AS programa,
          f.estado AS estado_ficha,
          f.modalidad,
          f.fecha_reporte,
          c.codigo AS centro_codigo,
          c.nombre AS centro,
          c.regional,
          COALESCE(ap.total_aprendices, 0) AS total_aprendices,
          COALESCE(jc.total_juicios, 0) AS total_juicios,
          COALESCE(jc.juicios_aprobados, 0) AS juicios_aprobados,
          COALESCE(jc.juicios_pendientes, 0) AS juicios_pendientes
        FROM fichas_caracterizacion f
        JOIN programas_formacion p ON f.programa_codigo = p.codigo
        LEFT JOIN centros_formacion c ON f.centro_codigo = c.codigo
        LEFT JOIN (
          SELECT ficha_numero, COUNT(*) AS total_aprendices
          FROM aprendices
          GROUP BY ficha_numero
        ) ap ON ap.ficha_numero = f.numero
        LEFT JOIN (
          SELECT 
            ficha_numero,
            COUNT(*) AS total_juicios,
            COUNT(CASE WHEN estado_juicio = 'APROBADO' THEN 1 END) AS juicios_aprobados,
            COUNT(CASE WHEN estado_juicio = 'POR EVALUAR' THEN 1 END) AS juicios_pendientes
          FROM juicios_evaluativos
          GROUP BY ficha_numero
        ) jc ON jc.ficha_numero = f.numero
        ORDER BY f.numero;
      `;

      const result = await pool.query(query);

      const fichas = result.rows.map(r => ({
        meta: {
          ficha: r.ficha,
          codigoPrograma: r.codigo_programa,
          version: r.version,
          programa: r.programa,
          estadoFicha: r.estado_ficha,
          modalidad: r.modalidad,
          fechaReporte: r.fecha_reporte,
          centro: r.centro,
          regional: r.regional
        },
        stats: {
          totalAprendices: parseInt(r.total_aprendices, 10),
          totalJuicios: parseInt(r.total_juicios, 10),
          aprobados: parseInt(r.juicios_aprobados, 10),
          pendientes: parseInt(r.juicios_pendientes, 10),
          porcentaje: r.total_juicios > 0 ? ((r.juicios_aprobados / r.total_juicios) * 100).toFixed(1) : '0.0'
        }
      }));

      res.json({ success: true, fichas });
    } catch (err) {
      console.error('Error fetching fichas from PostgreSQL:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // 2. Obtener una ficha completa con sus aprendices, competencias y juicios desde PostgreSQL
  async getFichaByNumero(req, res) {
    const { numero } = req.params;
    try {
      // Metadatos
      const metaQuery = `
        SELECT f.numero AS ficha, p.codigo AS codigo_programa, p.version, p.denominacion AS programa,
               f.estado AS estado_ficha, f.modalidad, f.fecha_reporte, c.nombre AS centro, c.regional
        FROM fichas_caracterizacion f
        JOIN programas_formacion p ON f.programa_codigo = p.codigo
        LEFT JOIN centros_formacion c ON f.centro_codigo = c.codigo
        WHERE f.numero = $1;
      `;
      const metaRes = await pool.query(metaQuery, [numero]);
      if (metaRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Ficha no encontrada en PostgreSQL' });
      }
      const r = metaRes.rows[0];
      const meta = {
        ficha: r.ficha,
        codigoPrograma: r.codigo_programa,
        version: r.version,
        programa: r.programa,
        estadoFicha: r.estado_ficha,
        modalidad: r.modalidad,
        fechaReporte: r.fecha_reporte,
        centro: r.centro,
        regional: r.regional
      };

      // Aprendices
      const aprendicesRes = await pool.query(
        `SELECT numero_documento AS "numeroDocumento", tipo_documento AS "tipoDocumento",
                nombres, apellidos, nombre_completo AS "nombreCompleto", estado
         FROM aprendices
         WHERE ficha_numero = $1
         ORDER BY nombre_completo;`,
        [numero]
      );

      // Competencias asociadas al programa de la ficha
      const competenciasRes = await pool.query(
        `SELECT codigo, denominacion, texto_completo AS "textoCompleto"
         FROM competencias
         WHERE programa_codigo = $1
         ORDER BY codigo;`,
        [meta.codigoPrograma]
      );

      // RAPs asociados a las competencias del programa
      const rapsRes = await pool.query(
        `SELECT r.codigo, r.competencia_codigo AS "competenciaCodigo", r.denominacion,
                r.texto_completo AS "textoCompleto", r.fase_id AS "faseId"
         FROM resultados_aprendizaje r
         JOIN competencias c ON r.competencia_codigo = c.codigo
         WHERE c.programa_codigo = $1
         ORDER BY r.codigo;`,
        [meta.codigoPrograma]
      );

      // Juicios Evaluativos
      const juiciosRes = await pool.query(
        `SELECT j.id, j.aprendiz_documento AS "numeroDocumento", j.competencia_codigo AS "competenciaCodigo",
                j.rap_codigo AS "rapCodigo", j.estado_juicio AS "estadoJuicio", j.fecha_hora_evaluacion AS "fechaHora",
                f.nombre_completo AS "funcionario"
         FROM juicios_evaluativos j
         LEFT JOIN funcionarios f ON j.funcionario_documento = f.documento
         WHERE j.ficha_numero = $1
         ORDER BY j.id;`,
        [numero]
      );

      // Funcionarios
      const funcionariosRes = await pool.query(
        `SELECT DISTINCT f.documento, f.nombre_completo AS "nombre"
         FROM funcionarios f
         JOIN juicios_evaluativos j ON j.funcionario_documento = f.documento
         WHERE j.ficha_numero = $1;`,
        [numero]
      );

      res.json({
        success: true,
        ficha: {
          meta,
          aprendices: aprendicesRes.rows,
          competencias: competenciasRes.rows,
          resultadosAprendizaje: rapsRes.rows,
          juicios: juiciosRes.rows,
          funcionarios: funcionariosRes.rows
        }
      });
    } catch (err) {
      console.error('Error fetching ficha detail:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // 3. Importar una nueva ficha o actualizar existente en PostgreSQL
  async importarFicha(req, res) {
    const { ficha } = req.body;
    if (!ficha || !ficha.meta || !ficha.meta.ficha) {
      return res.status(400).json({ success: false, error: 'Estructura de ficha inválida' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const meta = ficha.meta;
      const fichaNumero = String(meta.ficha);

      // Centro
      const centroCodigo = meta.centro ? meta.centro.split('-')[0].trim() : '9516';
      await client.query(
        `INSERT INTO centros_formacion (codigo, nombre, regional)
         VALUES ($1, $2, $3)
         ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre, regional = EXCLUDED.regional;`,
        [centroCodigo, meta.centro || 'Centro de Formación SENA', meta.regional || 'Regional Caquetá']
      );

      // Programa
      const progCodigo = String(meta.codigoPrograma || 'PROG01');
      await client.query(
        `INSERT INTO programas_formacion (codigo, version, denominacion)
         VALUES ($1, $2, $3)
         ON CONFLICT (codigo) DO UPDATE SET version = EXCLUDED.version, denominacion = EXCLUDED.denominacion;`,
        [progCodigo, parseInt(meta.version || '1', 10), meta.programa || 'Programa de Formación']
      );

      // Ficha
      await client.query(
        `INSERT INTO fichas_caracterizacion (numero, programa_codigo, centro_codigo, estado, modalidad, fecha_reporte)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (numero) DO UPDATE SET estado = EXCLUDED.estado, modalidad = EXCLUDED.modalidad, fecha_reporte = EXCLUDED.fecha_reporte;`,
        [fichaNumero, progCodigo, centroCodigo, meta.estadoFicha || 'EN EJECUCION', meta.modalidad || 'PRESENCIAL', String(meta.fechaReporte || '')]
      );

      // Competencias
      for (const c of ficha.competencias || []) {
        await client.query(
          `INSERT INTO competencias (codigo, denominacion, texto_completo, programa_codigo)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (codigo) DO UPDATE SET denominacion = EXCLUDED.denominacion;`,
          [c.codigo, c.denominacion, c.textoCompleto || c.denominacion, progCodigo]
        );
      }

      // RAPs
      let idxRap = 0;
      for (const r of ficha.resultadosAprendizaje || []) {
        const defaultFase = (idxRap % 4) + 1;
        idxRap++;
        await client.query(
          `INSERT INTO resultados_aprendizaje (codigo, competencia_codigo, denominacion, texto_completo, fase_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (codigo) DO UPDATE SET denominacion = EXCLUDED.denominacion;`,
          [r.codigo, r.competenciaCodigo, r.denominacion, r.textoCompleto || r.denominacion, r.faseId || defaultFase]
        );
      }

      // Aprendices
      for (const a of ficha.aprendices || []) {
        await client.query(
          `INSERT INTO aprendices (numero_documento, tipo_documento, nombres, apellidos, nombre_completo, estado, ficha_numero)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (numero_documento) DO UPDATE SET estado = EXCLUDED.estado, ficha_numero = EXCLUDED.ficha_numero;`,
          [a.numeroDocumento, a.tipoDocumento || 'CC', a.nombres, a.apellidos, a.nombreCompleto, a.estado || 'EN FORMACION', fichaNumero]
        );
      }

      // Funcionarios y Juicios
      for (const j of ficha.juicios || []) {
        let funcDoc = null;
        if (j.funcionario && j.funcionario.includes('-')) {
          funcDoc = j.funcionario.split('-')[0].trim();
          await client.query(
            `INSERT INTO funcionarios (documento, nombre_completo)
             VALUES ($1, $2)
             ON CONFLICT (documento) DO NOTHING;`,
            [funcDoc, j.funcionario.split('-').slice(1).join('-').trim() || j.funcionario]
          );
        }

        await client.query(
          `INSERT INTO juicios_evaluativos (aprendiz_documento, competencia_codigo, rap_codigo, ficha_numero, estado_juicio, fecha_hora_evaluacion, funcionario_documento)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT ON CONSTRAINT uq_aprendiz_rap_ficha DO UPDATE 
           SET estado_juicio = EXCLUDED.estado_juicio, fecha_hora_evaluacion = EXCLUDED.fecha_hora_evaluacion, funcionario_documento = EXCLUDED.funcionario_documento;`,
          [j.numeroDocumento, j.competenciaCodigo, j.rapCodigo, fichaNumero, j.estadoJuicio, j.fechaHora || null, funcDoc]
        );
      }

      await client.query('COMMIT');
      res.json({ success: true, message: `Ficha ${fichaNumero} guardada exitosamente en PostgreSQL` });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error importing ficha into PostgreSQL:', err);
      res.status(500).json({ success: false, error: err.message });
    } finally {
      client.release();
    }
  },

  // 4. Eliminar ficha de PostgreSQL
  async deleteFicha(req, res) {
    const { numero } = req.params;
    try {
      const result = await pool.query('DELETE FROM fichas_caracterizacion WHERE numero = $1 RETURNING numero;', [numero]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Ficha no encontrada' });
      }
      res.json({ success: true, message: `Ficha ${numero} eliminada de PostgreSQL` });
    } catch (err) {
      console.error('Error deleting ficha:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // 5. Reasignar fase a un RAP
  async updateRapFase(req, res) {
    const { codigo } = req.params;
    const { faseId } = req.body;
    try {
      await pool.query('UPDATE resultados_aprendizaje SET fase_id = $1 WHERE codigo = $2;', [faseId, codigo]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // 6. Ejecutar consulta SQL en vivo contra PostgreSQL
  async executeSql(req, res) {
    const { sql } = req.body;
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ success: false, error: 'Consulta SQL vacía' });
    }

    // Permitir consultas SELECT únicamente por seguridad
    const trimmed = sql.trim().toUpperCase();
    if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('WITH')) {
      return res.status(403).json({ success: false, error: 'Solo se permiten consultas de lectura (SELECT) en la consola analítica.' });
    }

    try {
      const result = await pool.query(sql);
      const columns = result.fields ? result.fields.map(f => f.name) : [];
      const rows = result.rows.map(r => columns.map(c => r[c]));
      res.json({ success: true, columns, rows });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};
