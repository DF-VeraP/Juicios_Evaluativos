# Módulo 5: Modelo Lógico, DER, Diccionario y Consola SQL

## 1. Ubicación del Código
- **Componente:** `src/features/modelo-logico/ModeloLogicoView.jsx`
- **Servicio:** `src/services/sqlEngineService.js`
- **Constantes:** `src/constants/academicQueries.js`
- **Ruta / Tab activa:** `'modelo'`

---

## 2. Entregables Técnicos Desarrollados
Este módulo materializa los entregables exigidos en las páginas 2, 3 y 4 de la guía del SENA:

### 2.1. Diagrama Entidad-Relación (DER en 3FN)
Mapea visualmente las 7 entidades relacionales normalizadas para eliminar la redundancia de los reportes planos de Sofia Plus:
1. `PROGRAMA_FORMACION` (PK: `codigo`)
2. `FICHA_CARACTERIZACION` (PK: `numero`, FKs a Programa y Centro)
3. `APRENDIZ` (PK: `numero_documento`, FK a Ficha)
4. `COMPETENCIA` (PK: `codigo`, FK a Programa)
5. `RESULTADO_APRENDIZAJE` (PK: `codigo`, FK a Competencia y Fase)
6. `FUNCIONARIO` (PK: `documento`)
7. `JUICIO_EVALUATIVO` (PK: `id`, FKs a Aprendiz, RAP y Funcionario)

### 2.2. Diccionario de Datos Normalizado
Tabla interactiva con scroll vertical que describe cada uno de los 25 atributos principales: nombre del campo, tipo de dato SQL (`VARCHAR`, `INT`, `DATETIME`, `ENUM`), restricciones de clave (`PK`, `FK`), nulabilidad y descripción técnica.

### 2.3. Consola de Consultas SQL (10 Preguntas de Coordinación)
Botones de acceso directo para responder a las 10 preguntas de la problemática planteada en la página 1 del PDF:
- **P1:** ¿Cuántos aprendices tiene la ficha o programa?
- **P2:** ¿Cuántos aprendices están en formación, retirados o trasladados?
- **P3:** ¿Cuántos resultados de aprendizaje tiene cada aprendiz?
- **P4:** ¿Cuántos resultados de aprendizaje han sido aprobados?
- **P5:** ¿Cuántos resultados están pendientes por evaluar?
- **P6:** ¿Cuál es el avance porcentual de cada aprendiz?
- **P7:** ¿Qué competencias tienen mayor nivel de aprobación?
- **P8:** ¿Qué funcionario registró determinado juicio evaluativo?
- **P9:** ¿En qué fecha y hora se registró cada juicio?
- **P10:** ¿Qué aprendices tienen juicios pendientes?

Al seleccionar una pregunta, se despliega la sentencia SQL oficial y se ejecuta en vivo sobre los datos de la ficha activa, renderizando la tabla de resultados.

### 2.4. Exportador de Script SQL
Botón **"Exportar SQL"** que genera y descarga al instante el script físico `schema_juicios_sena_ficha_[numero].sql` con las sentencias DDL y DML listas para ser ejecutadas en MySQL 8 o MariaDB.
