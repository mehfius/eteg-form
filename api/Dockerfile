# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl

# Instalar dependências da workspace
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY api/package.json ./api/

RUN npm install

# Copiar código fonte
COPY packages/shared ./packages/shared
COPY api ./api

WORKDIR /app/api
RUN npx prisma generate

# Stage 2: Produção
FROM node:20-slim

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl

# Copiar dependências de produção e build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/api/package.json ./api/
# Copiar código fonte completo para o Stage 2 para rodar com tsx
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/api/prisma ./api/prisma
COPY --from=builder /app/api/src ./api/src

WORKDIR /app/api
EXPOSE 3000

# Script para rodar migrations e iniciar o app com tsx
CMD ["sh", "-c", "npx prisma db push && npm run db:seed || true && npx tsx src/index.ts"]
