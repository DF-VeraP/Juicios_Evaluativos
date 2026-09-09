# Módulo 3: Aprendices y Seguimiento Curricular

## 1. Ubicación del Código
- **Componente:** `src/features/aprendices/AprendicesView.jsx`
- **Ruta / Tab activa:** `'aprendices'`

---

## 2. Capacidades Funcionales
1. **Búsqueda en Tiempo Real:**
   - Input reactivo para filtrar por nombres, apellidos o número de identificación (cédula/tarjeta).
2. **Filtro por Estado de Formación:**
   - Selector dinámico que permite aislar aprendices con estado `EN FORMACION`, `RETIRO VOLUNTARIO`, `TRASLADADO`, etc.
3. **Tarjetas de Progreso Individual:**
   - Cada aprendiz dispone de una tarjeta con su avance porcentual, barra de progreso y badges con conteo de juicios aprobados vs. pendientes.

---

## 3. Modal Detallado de la Sábana de Juicios
Al hacer clic en cualquier aprendiz, se despliega una ventana modal que contiene:
- Datos de identificación y estado de matrícula.
- Barra de avance del aprendiz.
- Selector para filtrar los juicios por una competencia específica.
- **Tabla con Alto Fijo y Scroll Vertical Automático:**
  - Despliega las 85 a 99 calificaciones del aprendiz con cabeceras fijas.
  - Muestra: Competencia, RAP evaluado, Estado (`APROBADO` en verde / `POR EVALUAR` en ámbar), Fecha y hora exacta de la evaluación, y Funcionario que asentó el juicio.
- Botón de **Impresión / Exportación:** Permite generar el reporte para el plan de mejoramiento o comité pedagógico mediante la función de impresión nativa.
