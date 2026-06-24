# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Instalar dependências da workspace
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY app/package.json ./app/

RUN npm install

# Copiar código
COPY packages/shared ./packages/shared
COPY app ./app

# Fazer o build do frontend
WORKDIR /app/app
RUN npm run build

# Stage 2: Produção com Nginx
FROM nginx:alpine

# Copiar os arquivos gerados no build para o Nginx
COPY --from=builder /app/app/dist /usr/share/nginx/html

# Configuração simples do Nginx para SPA e Proxy API
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://api:3000; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
