/**
 * Servicio generador de scripts SQL DDL y DML para MySQL / MariaDB
 */
export const sqlEngineService = {
  generateFullSqlScript(fichaData) {
    const meta = fichaData.meta || {};
    const fichaId = meta.ficha || '0';
    
    function escapeSql(str) {
      if (!str) return '';
      return String(str).replace(/'/g, "''");
    }

    return `-- =============================================================
-- SISTEMA DE GESTIÓN DE JUICIOS EVALUATIVOS SENA
-- Esquema Físico Relacional en Tercera Forma Normal (3FN)
-- Generado para la Ficha: ${fichaId} - ${meta.programa || 'PROGRAMA'}
-- Fecha: ${new Date().toLocaleDateString('es-CO')}
-- =============================================================

CREATE DATABASE IF NOT EXISTS sena_juicios_evaluativos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sena_juicios_evaluativos;

-- 1. TABLA: PROGRAMA DE FORMACIÓN
CREATE TABLE IF NOT EXISTS programa_formacion (
    codigo VARCHAR(20) PRIMARY KEY,
    version INT NOT NULL,
    denominacion VARCHAR(255) NOT NULL
);

-- 2. TABLA: CENTRO DE FORMACIÓN
CREATE TABLE IF NOT EXISTS centro_formacion (
    codigo VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    regional VARCHAR(150) NOT NULL
);

-- 3. TABLA: FICHA DE CARACTERIZACIÓN
CREATE TABLE IF NOT EXISTS ficha_caracterizacion (
    numero VARCHAR(20) PRIMARY KEY,
    programa_codigo VARCHAR(20) NOT NULL,
    centro_codigo VARCHAR(20) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    modalidad VARCHAR(50) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (programa_codigo) REFERENCES programa_formacion(codigo) ON UPDATE CASCADE,
    FOREIGN KEY (centro_codigo) REFERENCES centro_formacion(codigo) ON UPDATE CASCADE
);

-- 4. TABLA: APRENDIZ
CREATE TABLE IF NOT EXISTS aprendiz (
    numero_documento VARCHAR(20) PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    ficha_numero VARCHAR(20) NOT NULL,
    FOREIGN KEY (ficha_numero) REFERENCES ficha_caracterizacion(numero) ON UPDATE CASCADE
);

-- 5. TABLA: FUNCIONARIO (INSTRUCTOR / EVALUADOR)
CREATE TABLE IF NOT EXISTS funcionario (
    documento VARCHAR(30) PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL
);

-- 6. TABLA: FASE DEL PROYECTO FORMATIVO
CREATE TABLE IF NOT EXISTS fase_proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 7. TABLA: COMPETENCIA
CREATE TABLE IF NOT EXISTS competencia (
    codigo VARCHAR(30) PRIMARY KEY,
    denominacion TEXT NOT NULL,
    programa_codigo VARCHAR(20) NOT NULL,
    FOREIGN KEY (programa_codigo) REFERENCES programa_formacion(codigo) ON UPDATE CASCADE
);

-- 8. TABLA: RESULTADO DE APRENDIZAJE (RAP)
CREATE TABLE IF NOT EXISTS resultado_aprendizaje (
    codigo VARCHAR(30) PRIMARY KEY,
    competencia_codigo VARCHAR(30) NOT NULL,
    denominacion TEXT NOT NULL,
    fase_id INT NULL,
    FOREIGN KEY (competencia_codigo) REFERENCES competencia(codigo) ON UPDATE CASCADE,
    FOREIGN KEY (fase_id) REFERENCES fase_proyecto(id) ON SET NULL
);

-- 9. TABLA: JUICIO EVALUATIVO (TABLA TRANSACCIONAL / HECHOS)
CREATE TABLE IF NOT EXISTS juicio_evaluativo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aprendiz_documento VARCHAR(20) NOT NULL,
    rap_codigo VARCHAR(30) NOT NULL,
    estado_juicio ENUM('APROBADO', 'POR EVALUAR') NOT NULL DEFAULT 'POR EVALUAR',
    fecha_hora_evaluacion DATETIME NULL,
    funcionario_documento VARCHAR(30) NULL,
    FOREIGN KEY (aprendiz_documento) REFERENCES aprendiz(numero_documento) ON DELETE CASCADE,
    FOREIGN KEY (rap_codigo) REFERENCES resultado_aprendizaje(codigo) ON UPDATE CASCADE,
    FOREIGN KEY (funcionario_documento) REFERENCES funcionario(documento) ON SET NULL,
    UNIQUE KEY uq_aprendiz_rap (aprendiz_documento, rap_codigo)
);

-- INSERCIÓN DE DATOS DE LA FICHA ${fichaId}
INSERT IGNORE INTO programa_formacion (codigo, version, denominacion) 
VALUES ('${escapeSql(meta.codigoPrograma || 'PROG')}', ${meta.version || 1}, '${escapeSql(meta.programa || 'Programa SENA')}');

INSERT IGNORE INTO centro_formacion (codigo, nombre, regional)
VALUES ('${escapeSql(meta.centro || '9516')}', '${escapeSql(meta.centro || 'CENTRO SENA')}', '${escapeSql(meta.regional || 'REGIONAL')}');

INSERT IGNORE INTO ficha_caracterizacion (numero, programa_codigo, centro_codigo, estado, modalidad)
VALUES ('${escapeSql(fichaId)}', '${escapeSql(meta.codigoPrograma || 'PROG')}', '${escapeSql(meta.centro || '9516')}', '${escapeSql(meta.estadoFicha || 'EN EJECUCION')}', '${escapeSql(meta.modalidad || 'PRESENCIAL')}');

-- Fases Formativas Estándar SENA
INSERT IGNORE INTO fase_proyecto (id, nombre, descripcion) VALUES
(1, 'ANÁLISIS', 'Fase inicial de levantamiento y análisis de requerimientos'),
(2, 'PLANEACIÓN', 'Fase de diseño y planificación técnica'),
(3, 'EJECUCIÓN', 'Fase de desarrollo, pruebas e implementación'),
(4, 'EVALUACIÓN', 'Fase de auditoría, cierre y evaluación de resultados');
`;
  }
};
