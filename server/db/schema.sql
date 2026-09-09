-- ====================================================================
-- ESQUEMA RELACIONAL POSTGRESQL (3FN) - SISTEMA DE JUICIOS EVALUATIVOS
-- Guía GA-220501096 SENA
-- ====================================================================

-- 1. CENTRO DE FORMACIÓN
CREATE TABLE IF NOT EXISTS centros_formacion (
    codigo VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    regional VARCHAR(150) NOT NULL
);

-- 2. PROGRAMA DE FORMACIÓN
CREATE TABLE IF NOT EXISTS programas_formacion (
    codigo VARCHAR(20) PRIMARY KEY,
    version INT NOT NULL,
    denominacion VARCHAR(255) NOT NULL
);

-- 3. FICHA DE CARACTERIZACIÓN
CREATE TABLE IF NOT EXISTS fichas_caracterizacion (
    numero VARCHAR(20) PRIMARY KEY,
    programa_codigo VARCHAR(20) REFERENCES programas_formacion(codigo) ON UPDATE CASCADE,
    centro_codigo VARCHAR(20) REFERENCES centros_formacion(codigo) ON UPDATE CASCADE,
    estado VARCHAR(50) NOT NULL,
    modalidad VARCHAR(50) NOT NULL,
    fecha_reporte VARCHAR(50),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. APRENDIZ
CREATE TABLE IF NOT EXISTS aprendices (
    numero_documento VARCHAR(30) PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    ficha_numero VARCHAR(20) REFERENCES fichas_caracterizacion(numero) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 5. FUNCIONARIO (INSTRUCTOR / EVALUADOR)
CREATE TABLE IF NOT EXISTS funcionarios (
    documento VARCHAR(50) PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL
);

-- 6. FASE DEL PROYECTO FORMATIVO
CREATE TABLE IF NOT EXISTS fases_proyecto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20),
    descripcion TEXT
);

-- 7. COMPETENCIA LABORAL
CREATE TABLE IF NOT EXISTS competencias (
    codigo VARCHAR(50) PRIMARY KEY,
    denominacion TEXT NOT NULL,
    texto_completo TEXT,
    programa_codigo VARCHAR(20) REFERENCES programas_formacion(codigo) ON UPDATE CASCADE
);

-- 8. RESULTADO DE APRENDIZAJE (RAP)
CREATE TABLE IF NOT EXISTS resultados_aprendizaje (
    codigo VARCHAR(50) PRIMARY KEY,
    competencia_codigo VARCHAR(50) REFERENCES competencias(codigo) ON UPDATE CASCADE,
    denominacion TEXT NOT NULL,
    texto_completo TEXT,
    fase_id INT REFERENCES fases_proyecto(id) ON DELETE SET NULL
);

-- 9. JUICIO EVALUATIVO (TABLA DE HECHOS / CALIFICACIONES)
CREATE TABLE IF NOT EXISTS juicios_evaluativos (
    id BIGSERIAL PRIMARY KEY,
    aprendiz_documento VARCHAR(30) NOT NULL REFERENCES aprendices(numero_documento) ON DELETE CASCADE,
    competencia_codigo VARCHAR(50) NOT NULL REFERENCES competencias(codigo) ON UPDATE CASCADE,
    rap_codigo VARCHAR(50) NOT NULL REFERENCES resultados_aprendizaje(codigo) ON UPDATE CASCADE,
    ficha_numero VARCHAR(20) NOT NULL REFERENCES fichas_caracterizacion(numero) ON UPDATE CASCADE ON DELETE CASCADE,
    estado_juicio VARCHAR(30) NOT NULL CHECK (estado_juicio IN ('APROBADO', 'POR EVALUAR')),
    fecha_hora_evaluacion VARCHAR(60),
    funcionario_documento VARCHAR(50) REFERENCES funcionarios(documento) ON DELETE SET NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_aprendiz_rap_ficha UNIQUE (aprendiz_documento, rap_codigo, ficha_numero)
);

-- ÍNDICES PARA ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_juicios_aprendiz ON juicios_evaluativos(aprendiz_documento);
CREATE INDEX IF NOT EXISTS idx_juicios_ficha ON juicios_evaluativos(ficha_numero);
CREATE INDEX IF NOT EXISTS idx_juicios_estado ON juicios_evaluativos(estado_juicio);
CREATE INDEX IF NOT EXISTS idx_raps_competencia ON resultados_aprendizaje(competencia_codigo);
CREATE INDEX IF NOT EXISTS idx_aprendices_ficha ON aprendices(ficha_numero);
