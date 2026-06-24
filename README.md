# Eteg Form - Teste Técnico John Doe

![Eteg Application](https://img.shields.io/badge/Status-Online-success)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

Solução ponta a ponta desenvolvida para o teste técnico de desenvolvedor sênior da Eteg, atendendo perfeitamente aos requisitos de produto definidos no caso de uso do "John Doe".

🌍 **Live Demo:** [https://eteg.mehfi.us](https://eteg.mehfi.us)

## 📌 O Desafio
O objetivo do projeto era construir um formulário de cadastro de clientes que coletasse nome, CPF, e-mail, observações e uma cor favorita baseada em um arco-íris (com flexibilidade para mudança futura). O cadastro deve ser único por cliente (sem duplicação de CPF/Email) e possuir feedback visual do resultado.

A arquitetura precisaria ser robusta, utilizando **TypeScript, React e Node.js**, armazenando os dados em um banco **PostgreSQL** hospedado em **Docker**, com o código estruturado em um único repositório (monorepo).

## 🚀 Arquitetura da Solução

O projeto foi construído utilizando uma abordagem de **Monorepo** gerenciado pelo `pnpm`, separando as responsabilidades de forma clara e escalável:

- **`/app`** (Frontend): Desenvolvido em **React + Vite**, utilizando `react-hook-form` e `zod` para validações na interface, estilizado com CSS Vanilla de alta qualidade com animações (`framer-motion`), provendo uma interface rápida e premium.
- **`/api`** (Backend): Desenvolvido em **Node.js + Fastify**, com integração ao banco de dados via **Prisma ORM**. Focado em alta performance e segurança.
- **`/packages/shared`** (Código Compartilhado): Contém os schemas de validação do **Zod** e tipagens, garantindo que o Frontend e o Backend validem e falem a exata mesma língua (End-to-End Type Safety).

### Banco de Dados (Cores Dinâmicas)
Para satisfazer a regra de negócio *"as cores do arco-íris podem mudar posteriormente"*, a lista de cores não está *hardcoded* no Frontend. O Prisma no Backend possui um modelo `Color` que é populado na inicialização do banco (`seed.ts`), e o Frontend busca ativamente essas opções via API (`GET /api/colors`).

## 🛠️ Deploy Contínuo & Infraestrutura (CI/CD)

Pensando em nível Sênior, o projeto não é apenas um código, mas um sistema vivo.
Possui um pipeline completo no **GitHub Actions** (`.github/workflows/pipeline.yml`) que:

1. **Validação:** Garante o build do projeto limpo.
2. **Build de Imagens:** Constrói as imagens Docker (`api` e `app`) usando Dockerfiles otimizados multi-stage.
3. **Registry:** Faz o push automático das imagens geradas para o **GitHub Container Registry (GHCR)**.
4. **Deploy Remoto (AWS):** Conecta-se via SSH a uma instância na nuvem e orquestra o `docker compose pull` e `up -d` com Zero Downtime.

## 🌟 Além do Básico (Extra Mile)

Embora o teste técnico tenha solicitado os requisitos fundamentais para o funcionamento da aplicação, este projeto foi construído pensando no cenário real de uma **Pessoa Desenvolvedora Sênior**, adicionando características arquiteturais avançadas não solicitadas inicialmente:

- **Hospedagem em Nuvem (AWS EC2 + Cloudflare):** O projeto não roda apenas no localhost. Ele está provisionado e acessível publicamente através de uma URL customizada (`eteg.mehfi.us`), com túnel seguro e certificado SSL gerenciado.
- **Integração e Entrega Contínuas (CI/CD):** Foi construída uma pipeline completa no **GitHub Actions** que faz o build otimizado multi-stage das imagens Docker, publica no GitHub Container Registry (GHCR) e dispara via SSH o deploy (pull/up) na máquina EC2 automaticamente após cada commit na branch `main`.
- **End-to-End Type Safety com Zod:** Utilização do Zod para garantir que tanto o frontend quanto o backend usem as mesmas regras estritas de validação. O uso de um pacote `shared` no monorepo previne dessincronização entre as pontas.
- **Performance e Segurança Avançada:** O uso de **Fastify** ao invés do Express tradicional para maior throughput, acoplado a validações rígidas de payloads para mitigar vulnerabilidades comuns (Injections/Bad Requests).
- **Design UI/UX Premium:** Ao invés de um formulário genérico, foi aplicado um design rico, moderno e responsivo, utilizando *Glassmorphism* e micro-interações fluídas (via `framer-motion`) para uma experiência de usuário superior, indo além de um "MVP seco".

## 💻 Como rodar o projeto localmente

### Requisitos:
- Docker e Docker Compose instalados.

### Passos:
1. Clone este repositório:
   ```bash
   git clone https://github.com/mehfius/eteg-form.git
   cd eteg-form
   ```

2. Suba o ambiente via Docker Compose:
   ```bash
   docker compose up -d
   ```
   *Este comando iniciará os 3 containers: o Banco PostgreSQL, o Backend e o Frontend.*

3. Acesse no navegador:
   - **Frontend:** http://localhost:80
   - **API (Backend):** http://localhost:3000

## 📂 Estrutura do Monorepo

```
eteg-form/
├── app/                  # Frontend em React + Vite
│   ├── src/              
│   ├── Dockerfile        # Dockerfile otimizado com Nginx
│   └── package.json
├── api/                  # Backend em Node.js + Fastify
│   ├── prisma/           # Schema e Seed do banco de dados
│   ├── src/              
│   ├── Dockerfile        
│   └── package.json
├── packages/             
│   └── shared/           # Schemas do Zod compartilhados
├── .github/workflows/    # Pipeline de CI/CD
├── docker-compose.yml    # Orquestração local (Build direto do fonte)
├── docker-compose.prod.yml # Orquestração de produção (Puxa do GHCR)
└── pnpm-workspace.yaml   # Configuração do Monorepo
```

---
Feito com ☕ e muito código.
