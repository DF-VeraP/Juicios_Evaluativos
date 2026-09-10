# Guía de Despliegue en Dokploy

Esta guía explica cómo desplegar la aplicación en [Dokploy](https://dokploy.com/) (plataforma open-source para despliegues de aplicaciones, bases de datos y Docker containers sobre cualquier VPS).

---

## 1. Preparación del Repositorio Git
Asegúrate de haber inicializado el repositorio y subido los cambios a GitHub / GitLab / Gitea:

```bash
git init
git add .
git commit -m "feat: Sistema de Juicios Evaluativos SENA - Arquitectura Modular"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

*(Nota: Los archivos Excel `.xls` y `.xlsx` se encuentran ignorados por `.gitignore` como se solicitó).*

---

## 2. Opción A: Despliegue en Dokploy vía Dockerfile (Recomendada)

1. En tu panel de **Dokploy**, crea o selecciona tu **Project** y haz clic en **Create Service** -> **Application**.
2. **Source Type:** Selecciona **Git** y conecta tu repositorio (GitHub/GitLab).
3. **Branch:** `main` (o la rama que uses).
4. **Build Type:** Selecciona **Dockerfile**.
5. **Dockerfile Path:** `./Dockerfile` (ya configurado en la raíz).
6. **Port Mapping / Container Port:** Configura el puerto interno en `80` (el que expone Nginx).
7. **Environment Variables (Pestaña 'Environment' en Dokploy):**
   Puedes configurar las variables de entorno para personalizar la aplicación:
   ```env
   VITE_APP_TITLE=SENA - Sistema de Juicios Evaluativos
   VITE_APP_SUBTITLE=Guía GA-220501096 • Modelo Relacional y Analítica
   VITE_APP_VERSION=1.0.0
   VITE_DEFAULT_REGIONAL=18 - REGIONAL CAQUETÁ
   VITE_DEFAULT_CENTRO=9516 - CENTRO TECNOLOGICO DE LA AMAZONIA
   ```
8. **Domain:** Agrega tu dominio o subdominio asignado (ej: `juicios.tudominio.com`). Dokploy generará automáticamente el certificado SSL Let's Encrypt con HTTPS.
9. Haz clic en **Deploy**. Dokploy inyectará las variables durante el build multi-stage y servirá los estáticos optimizados con Nginx.

---

## 3. Opción B: Despliegue en Dokploy vía Docker Compose

1. En Dokploy, haz clic en **Create Service** -> **Compose**.
2. Selecciona **Git** como fuente o pega directamente el contenido del archivo `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     sena-juicios-app:
       build:
         context: .
         dockerfile: Dockerfile
       container_name: sena-juicios-evaluativos
       restart: always
       ports:
         - "8000:80"
   ```
3. Configura el enrutamiento del proxy o accede directamente vía `http://IP_VPS:8000` (o vinculando un dominio con SSL en Dokploy apuntando al puerto `8000`).
4. Haz clic en **Deploy**.

---

## 4. Verificación Post-Despliegue
- El servidor Nginx incluye soporte nativo para Single Page Applications (`try_files $uri $uri/ /index.html;`), evitando errores 404 al recargar el navegador.
- Incluye compresión `gzip` y caché estática para assets (`.js`, `.css`, fuentes), permitiendo tiempos de carga menores a 1 segundo en producción.
