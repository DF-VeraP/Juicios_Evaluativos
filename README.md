# Sistema de Gestión y Normalización de Juicios Evaluativos SENA

> **Guía de Aprendizaje:** `GA-220501096-95-94-93-92 - Práctico 1`  
> **Institución:** Servicio Nacional de Aprendizaje (SENA) • Centro Tecnológico de la Amazonia • Regional Caquetá

---

## 📌 Descripción del Proyecto
Este sistema fue desarrollado para resolver la problemática de las sábanas de datos planas que exporta la plataforma Sofia Plus. A través de un enfoque de ingeniería de datos y desarrollo web moderno, transforma reportes masivos repetitivos en un **Modelo Relacional en Tercera Forma Normal (3FN)**, permitiendo:

- **Auditar el avance curricular** por aprendiz y por competencia.
- **Controlar el cumplimiento por Fases Formativas** (*Análisis, Planeación, Ejecución y Evaluación*).
- **Consultar indicadores clave** mediante una consola interactiva SQL que responde a las 10 preguntas de la coordinación académica.
- **Cargar masivamente sábanas en caliente** (.xls / .xlsx) con validación de duplicidad exacta o diferencial.

---

## 🏛️ Arquitectura del Software
Se implementó una **Arquitectura Modular Orientada a Características y Servicios (Feature-Sliced Layered Architecture)**:

```
├── documentacion/              # Documentación modular y PDFs del ejercicio
│   ├── pdf/                    # Guía oficial del ejercicio (PDF)
│   ├── modulos/                # Manuales de arquitectura, features y despliegue
│   └── README.md
├── src/
│   ├── components/layout/      # Header (logo SVG, selector de ficha) y Footer
│   ├── constants/              # Consultas de las 10 preguntas, reglas de negocio y DER
│   ├── data/                   # Datasets precargados (Ficha 3407847 y 3389756)
│   ├── features/               # Módulos desacoplados (inicio, dashboard, aprendices, fases, modelo, importador)
│   ├── services/               # Parsers de Sofia Plus, generador SQL y LocalStorage
│   ├── index.css               # Estilos institucionales SENA con scroll Y automático
│   ├── App.jsx                 # Orquestador de estado y navegación
│   └── main.jsx
├── Dockerfile                  # Multi-stage build (Node.js + Nginx Alpine) para Dokploy
├── nginx.conf                  # Configuración de Nginx para SPA y compresión gzip
└── docker-compose.yml          # Despliegue con Docker Compose
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o pnpm

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd JuiciosEvaluativos
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador:
   ```
   http://localhost:5173/
   ```

---

## 🐳 Despliegue en Dokploy

El proyecto está 100% preparado para desplegarse en **Dokploy**:

1. En tu panel de Dokploy, crea una nueva **Application** conectada a tu repositorio Git.
2. Selecciona **Build Type: Dockerfile** (utilizará el `Dockerfile` optimizado multi-stage).
3. Configura el **Container Port** en `80`.
4. Asigna tu dominio y haz clic en **Deploy**.

Para instrucciones detalladas de despliegue, consulta la guía en [documentacion/modulos/08_guia_despliegue_dokploy.md](documentacion/modulos/08_guia_despliegue_dokploy.md).

---

## 📚 Documentación Técnica Detallada

- [Arquitectura General y Flujo de Datos](documentacion/modulos/01_arquitectura_general.md)
- [Módulo 1: Portal de Inicio y Catálogo de Fichas](documentacion/modulos/02_modulo_inicio.md)
- [Módulo 2: Dashboard y Analítica de Juicios](documentacion/modulos/03_modulo_dashboard.md)
- [Módulo 3: Aprendices y Seguimiento Curricular](documentacion/modulos/04_modulo_aprendices.md)
- [Módulo 4: Fases del Proyecto Formativo (Acordeón)](documentacion/modulos/05_modulo_fases_proyecto.md)
- [Módulo 5: Modelo Lógico, DER, Diccionario y Consultas SQL](documentacion/modulos/06_modulo_modelo_logico_sql.md)
- [Módulo 6: Motor de Importación Masiva Sofia Plus](documentacion/modulos/07_modulo_importador_masivo.md)
- [Guía de Despliegue en Dokploy](documentacion/modulos/08_guia_despliegue_dokploy.md)
- [Documento PDF Oficial de la Guía SENA](documentacion/pdf/guia_practica_ga220501096.pdf)
