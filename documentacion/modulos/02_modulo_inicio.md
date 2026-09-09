# Módulo 1: Portal de Inicio y Catálogo de Fichas

## 1. Ubicación del Código
- **Componente:** `src/features/inicio/InicioView.jsx`
- **Ruta / Tab activa:** `'inicio'` (Vista por defecto del sistema)

---

## 2. Funcionalidades Principales
1. **Banner de Bienvenida y Resumen Pedagógico:**
   - Presenta los objetivos de la guía `GA-220501096` del SENA.
   - Detalla las tres capacidades principales: Analítica de Rendimiento, Fases del Proyecto Formativo y Modelo Lógico Relacional 3FN.
2. **Acceso Rápido a Importación:**
   - Botón **"Importar Reporte Sofia Plus"** que dispara la ventana modal de importación masiva (`ImportModal`).
3. **Catálogo de Fichas Cargadas:**
   - Visualiza en tarjetas cada ficha activa en el sistema (por ejemplo, Ficha 3407847 de Producción Ganadera y Ficha 3389756 de Gestión Contable y Financiera).
   - Indicadores por tarjeta:
     * Número de Ficha y Nombre del Programa.
     * Modalidad (Presencial / Virtual).
     * Centro de Formación.
     * Barra de progreso de avance porcentual global.
     * Contador de aprendices y contador de juicios registrados.
4. **Acciones Disponibles por Ficha:**
   - **"Ver Ficha":** Activa la ficha seleccionada y redirige al Dashboard y analítica detallada.
   - **"Eliminar":** Permite remover la ficha del repositorio local previa confirmación en pantalla.
