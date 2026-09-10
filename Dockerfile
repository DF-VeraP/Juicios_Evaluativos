# =========================================================
# DOCKERFILE MULTI-STAGE PARA DOKPLOY (CON SOPORTE .ENV)
# Sistema de Gestión de Juicios Evaluativos SENA
# =========================================================

# Etapa 1: Compilación de la aplicación (Node.js)
FROM node:20-alpine AS builder

WORKDIR /app

# Argumentos de entorno para Vite (Inyectables en build time desde Dokploy)
ARG VITE_APP_TITLE
ARG VITE_APP_SUBTITLE
ARG VITE_APP_VERSION
ARG VITE_DEFAULT_REGIONAL
ARG VITE_DEFAULT_CENTRO
ARG VITE_API_URL

ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_SUBTITLE=$VITE_APP_SUBTITLE
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_DEFAULT_REGIONAL=$VITE_DEFAULT_REGIONAL
ENV VITE_DEFAULT_CENTRO=$VITE_DEFAULT_CENTRO
ENV VITE_API_URL=$VITE_API_URL

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y compilar bundle
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx ligero para producción
FROM nginx:alpine

# Puerto configurable por variable de entorno (por defecto 80)
ENV PORT=80

# Usar el mecanismo de plantillas oficial de Nginx (docker-entrypoint envsubst)
# para que ${PORT} se reemplace automáticamente en tiempo de ejecución
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copiar bundle compilado
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
