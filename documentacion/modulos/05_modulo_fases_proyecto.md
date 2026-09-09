# Módulo 4: Fases del Proyecto Formativo (Variante Avanzada)

## 1. Ubicación del Código
- **Componente:** `src/features/fases/FasesProyectoView.jsx`
- **Constantes:** `src/constants/academicQueries.js` (`FASES_DEFECTO`)
- **Ruta / Tab activa:** `'fases'`

---

## 2. Alineación con los Requerimientos del PDF
Responde a los puntos 6 y 7 de la Variante Avanzada del ejercicio de la guía:
- Relacionar competencias y resultados de aprendizaje (RAPs) con las 4 fases del proyecto formativo SENA:
  1. **Fase 1: ANÁLISIS**
  2. **Fase 2: PLANEACIÓN**
  3. **Fase 3: EJECUCIÓN**
  4. **Fase 4: EVALUACIÓN**

---

## 3. Comportamiento y UX de Acordeón
- **Fases Suprimidas por Defecto:**
  - Todas las 4 fases inician colapsadas para evitar la sobrecarga visual inicial.
- **Flecha Interactiva de Despliegue:**
  - Cada fase dispone de un botón con flecha que permite desplegar u ocultar individualmente su contenido.
- **Resumen en la Cabecera de la Fase:**
  - Código de color distintivo por fase.
  - Porcentaje de avance de la fase.
  - Contador de aprendices que tienen la fase 100% aprobada vs. aprendices con juicios pendientes.

---

## 4. Contenido Desplegable
1. **Reasignación Interactiva de RAPs:**
   - Permite vincular cualquier RAP a otra fase del proyecto formativo mediante un selector inmediato.
2. **Tabla de Seguimiento de Aprendices con Scroll Vertical:**
   - Tabla con scroll `Y` automático y cabecera pegajosa (`sticky`) que lista cada aprendiz, sus juicios aprobados en esa fase y el diagnóstico (Badge verde: *Fase Aprobada*, Badge ámbar: *X pendientes*).
