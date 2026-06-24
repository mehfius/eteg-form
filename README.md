# Desafio Técnico: Eteg Form VIP

Este projeto foi construído para atender aos requisitos de avaliação técnica para a vaga de Desenvolvedor Sênior, focando em simplicidade, eficiência, segurança e arquitetura escalável, evitando *over-engineering* desnecessário.

## Visão Geral da Arquitetura

O projeto é estruturado em um **Monorepo**, garantindo *End-to-End Type Safety*. A validação de dados é escrita uma única vez (via `zod`) no pacote `shared` e consumida nativamente tanto pelo formulário React quanto pela API Node.js.

- **Frontend:** React + Vite + TypeScript. UI responsiva e moderna com estilização CSS pura (Glassmorphism e tipografia limpa). Uso intensivo de `react-hook-form` para validação em tempo real e `framer-motion` para transições de estado (ex: tela de sucesso). As chamadas de API são feitas de forma agnóstica via proxy `/api`, garantindo total portabilidade da imagem Docker.
- **Backend:** Fastify + TypeScript + Prisma ORM. Escolha feita pela alta performance do Fastify e sua capacidade de integrar provedores de tipos nativos (`fastify-type-provider-zod`). Isso significa que a validação de Schema (Zod) gera erros HTTP 400 automaticamente sem necessidade de *ifs* manuais. Inclui middlewares de segurança (`@fastify/helmet`) e Rate Limiting contra ataques de força bruta.
- **Banco de Dados:** PostgreSQL com esquema normalizado. A unicidade de CPF e Email é garantida por *constraints* a nível de banco, além de validações ativas de backend e frontend.
- **Segurança e Validação Avançada:** O Zod utiliza um `.refine` matemático avançado para validar os dígitos verificadores reais do CPF (não apenas uma simples máscara ou regex).
- **Documentação Automática:** O Swagger / OpenAPI é gerado dinamicamente a partir dos Schemas do Zod que validam a API, servido em `/docs`.

## Decisões Técnicas e Maturidade

- **Monorepo:** Facilita a manutenção do contrato de dados entre Client e Server, demonstrando fluência avançada no ecossistema TypeScript.
- **Infraestrutura Docker:** Separação de containers com Dockerfiles *Multi-stage*, gerando uma imagem de produção do Frontend muito enxuta (servida por Nginx) e uma imagem de Backend isolada.
- **Proxy Reverso:** O Nginx atua como servidor web do React e faz o *proxy_pass* inteligente para a API, eliminando problemas de CORS.
- **CI/CD & Code Quality:** Configurações base sólidas com `.eslintrc.js`, `.prettierrc` e um workflow no Github Actions `.github/workflows/ci.yml` para validação contínua.

## Como Rodar Localmente (Via Docker)

Este projeto foi desenhado para rodar com um único comando na máquina, sendo 100% portável.

1. Clone este repositório.
2. Na raiz do projeto, execute:
```bash
docker compose up --build -d
```
3. O Backend rodará as migrations e o *Seed* populando as cores do banco de dados automaticamente.
4. Acesse a aplicação Frontend em: **`http://localhost:8080`**
5. Acesse a documentação interativa Swagger (OpenAPI) em: **`http://localhost:3000/docs`**

## Estrutura do Projeto

- `/packages/shared`: Schemas de validação reais e tipos unificados.
- `/backend`: API REST (Fastify, Prisma).
- `/frontend`: Aplicação SPA (React, Vite).
- `/docker-compose.yml`: Orquestração de containers.
- `.github/workflows/`: Pipeline de CI base.
