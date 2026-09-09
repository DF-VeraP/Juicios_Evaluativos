# Módulo 2: Dashboard General y Analítica de Ficha

## 1. Ubicación del Código
- **Componente:** `src/features/dashboard/DashboardView.jsx`
- **Ruta / Tab activa:** `'dashboard'`

---

## 2. Indicadores Clave (KPIs)
- **Aprendices Matriculados:** Total de aprendices y desglose de cuántos se encuentran con estado `EN FORMACION`.
- **Juicios Aprobados:** Cantidad total de calificaciones en estado `APROBADO`.
- **Juicios Por Evaluar:** Evaluaciones pendientes por calificar en Sofia Plus.
- **Estructura Curricular:** Conteo exacto de competencias laborales asociadas y resultados de aprendizaje (RAPs).
- **Avance General de la Ficha:** Porcentaje de cumplimiento global con barra de progreso dinámica.

---

## 3. Gráficas Interactivas (Chart.js)
1. **Ranking de Aprobación por Competencia (Gráfico de Barras):**
   - Muestra las competencias con mayor tasa porcentual de aprobación para detectar fortalezas formativas.
2. **Distribución de Evaluaciones & Estados (Gráfico Doughnut):**
   - Comparativa visual entre juicios calificados (`APROBADO`) vs. pendientes (`POR EVALUAR`), junto con la distribución de los estados de matrícula de los aprendices.

---

## 4. Auditoría de Funcionarios e Instructores
- **Tabla con Alto Fijo y Scroll Vertical:**
  - Encabezados estáticos mediante `position: sticky`.
  - Muestra el nombre de cada funcionario que asentó calificaciones, el total de registros, la cantidad de aprobados y la tasa individual de aprobación.
