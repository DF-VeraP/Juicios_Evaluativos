# =========================================================
# DOCKERFILE MULTI-STAGE PARA DOKPLOY
# Sistema de Gestión de Juicios Evaluativos SENA
# =========================================================

# Etapa 1: Compilación de la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

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
