# =========================================================
# DOCKERFILE MULTI-STAGE PARA DOKPLOY (CON SOPORTE .ENV)
# Sistema de Gestión de Juicios Evaluativos SENA
# =========================================================

# Etapa 1: Compilación de la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

# Argumentos de entorno para Vite (Inyectables desde Dokploy)
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
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx ligero para producción
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar bundle estático generado
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80 estándar
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
