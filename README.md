# RU Fácil

Sistema digital para gerenciamento de fichas e controle de acesso ao Restaurante Universitário (RU).

O **RU Fácil** permite que estudantes comprem fichas digitais, acompanhem saldo de refeições e realizem a entrada no RU utilizando QR Codes dinâmicos, enquanto funcionários e administradores possuem ferramentas de validação, gerenciamento e relatórios.

---

# 📚 Sumário

* [Sobre o Projeto](#-sobre-o-projeto)
* [Objetivos](#-objetivos)
* [Principais Funcionalidades](#-principais-funcionalidades)
* [Arquitetura](#-arquitetura)
* [Estrutura do Monorepo](#-estrutura-do-monorepo)
* [Tecnologias](#-tecnologias)
* [Requisitos](#-requisitos)
* [Primeiros Passos](#-primeiros-passos)
* [Variáveis de Ambiente](#-variáveis-de-ambiente)
* [Banco de Dados](#-banco-de-dados)
* [Executando o Projeto](#-executando-o-projeto)
* [Executando os Testes](#-executando-os-testes)
* [Padrões do Projeto](#-padrões-do-projeto)
* [Arquitetura do Backend](#-arquitetura-do-backend)
* [Fluxos Principais](#-fluxos-principais)
* [Segurança](#-segurança)
* [TDD e Qualidade](#-tdd-e-qualidade)
* [CI/CD](#-cicd)
* [Roadmap](#-roadmap)
* [Contribuição](#-contribuição)
* [Licença](#-licença)

---

# 📖 Sobre o Projeto

O RU Fácil nasceu com o objetivo de modernizar o acesso ao Restaurante Universitário, eliminando fichas físicas e reduzindo filas.

Com o sistema:

* estudantes podem comprar fichas pelo celular;
* funcionários conseguem validar entradas rapidamente;
* administradores possuem controle centralizado de acessos e vendas;
* o RU ganha mais segurança e previsibilidade operacional.

A autenticação de entrada é realizada por meio de **QR Codes temporários e dinâmicos**, reduzindo fraudes e reutilização indevida.

---

# 🎯 Objetivos

* Digitalizar o sistema de fichas do RU.
* Reduzir filas na entrada.
* Melhorar a experiência dos estudantes.
* Facilitar o controle administrativo.
* Evitar fraudes e reutilização de fichas.
* Centralizar informações de acessos e pagamentos.
* Fornecer métricas e relatórios para gestão.

---

# ✨ Principais Funcionalidades

## 👨‍🎓 Estudantes

* Cadastro e autenticação.
* Consulta de saldo de fichas.
* Compra de fichas digitais.
* Geração de QR Code temporário.
* Histórico de compras.
* Histórico de acessos ao RU.

---

## 👨‍🍳 Funcionários

* Login autenticado.
* Validação de QR Codes.
* Liberação de entrada.
* Registro de acessos.
* Visualização rápida de status do aluno.

---

## 👨‍💼 Administradores

* Gerenciamento de usuários.
* Bloqueio/desbloqueio de estudantes.
* Gerenciamento de fichas.
* Confirmação de pagamentos.
* Controle de horários do RU.
* Relatórios de acessos e vendas.
* Logs de auditoria.

---

# 🏗 Arquitetura

O projeto utiliza arquitetura baseada em:

```txt
Frontend → Backend API → PostgreSQL
```

Além disso:

```txt
QR Code → API de Validação → Controle Transacional → Liberação de Entrada
```

O backend é organizado em módulos independentes seguindo princípios de:

* Separation of Concerns
* Clean Architecture
* SOLID
* Domain-driven organization

---

# 📦 Estrutura do Monorepo

```txt
ru-facil/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── docker/
│
├── .github/
│   └── workflows/
│
├── package.json
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# ⚙️ Tecnologias

## Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Zod
* Vitest
* Docker

---

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Query
* Axios

---

## DevOps

* Docker
* GitHub Actions
* ESLint
* Prettier

---

# 📋 Requisitos

Antes de começar, você precisará ter instalado:

* Node.js >= 20
* Docker
* Docker Compose
* Git

---

# 🚀 Primeiros Passos

## 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ru-facil.git
```

---

## 2. Entre no diretório

```bash
cd ru-facil
```

---

## 3. Instale as dependências

### Dependências da raiz

```bash
npm install
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

# 🔐 Variáveis de Ambiente

## Backend

Crie um arquivo:

```txt
backend/.env
```

Baseado em:

```txt
backend/.env.example
```

Exemplo:

```env
NODE_ENV=development

PORT=3333

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ru_facil_dev"

JWT_SECRET="super_secret_key"

QR_TOKEN_EXPIRES_IN_SECONDS=30

CORS_ORIGIN=http://localhost:3000
```

---

## Frontend

Crie:

```txt
frontend/.env.local
```

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

# 🗄 Banco de Dados

O projeto utiliza PostgreSQL via Docker.

---

## Subindo containers

Na raiz do projeto:

```bash
docker compose up -d
```

---

## Executando migrations

Entre na pasta backend:

```bash
cd backend
```

Execute:

```bash
npx prisma migrate dev
```

---

## Executando seeds

```bash
npx prisma db seed
```

---

# ▶️ Executando o Projeto

## Backend

```bash
cd backend
npm run dev
```

Servidor disponível em:

```txt
http://localhost:3333
```

---

## Frontend

```bash
cd frontend
npm run dev
```

Aplicação disponível em:

```txt
http://localhost:3000
```

---

# 🧪 Executando os Testes

## Backend

```bash
cd backend
```

---

## Rodar testes

```bash
npm run test
```

---

## Rodar testes em watch mode

```bash
npm run test:watch
```

---

## Gerar coverage

```bash
npm run test:coverage
```

---

# 📐 Padrões do Projeto

## Commits

Padrão baseado em Conventional Commits:

```txt
feat(auth): implement login endpoint
fix(qr): prevent expired token validation
test(access): add meal access tests
refactor(tickets): improve balance calculation
```

---

## Branches

```txt
main
develop
feature/*
fix/*
hotfix/*
```

---

## Organização de módulos

Cada módulo segue:

```txt
module/
├── controller
├── service
├── repository
├── schema
├── routes
├── tests
└── types
```

---

# 🧠 Arquitetura do Backend

O backend segue arquitetura em camadas:

```txt
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Database
```

---

## Responsabilidades

### Routes

Definem endpoints da API.

---

### Controllers

Recebem requisições HTTP e retornam respostas.

---

### Services

Contêm regras de negócio.

---

### Repositories

Realizam acesso ao banco de dados.

---

### Schemas

Validam dados usando Zod.

---

# 🔄 Fluxos Principais

## Fluxo de compra

```txt
Aluno cria compra
        ↓
Pagamento é confirmado
        ↓
Sistema gera fichas
        ↓
Saldo é atualizado
```

---

## Fluxo de entrada no RU

```txt
Aluno gera QR Code
        ↓
Funcionário escaneia
        ↓
API valida token
        ↓
Sistema verifica ficha
        ↓
Sistema verifica dupla entrada
        ↓
Ficha é descontada
        ↓
Entrada liberada
```

---

# 🔒 Segurança

O sistema implementa diversas medidas de segurança:

* JWT Authentication
* Hash de senha com bcrypt
* QR Codes temporários
* Tokens expiráveis
* Controle de permissões
* Rate limiting
* Helmet
* CORS configurado
* Logs de auditoria
* Operações transacionais
* Validação com Zod

---

## Prevenção de fraudes

O sistema impede:

* reutilização de QR Codes;
* dupla entrada no mesmo período;
* uso de fichas expiradas;
* acesso de usuários bloqueados;
* reutilização de tokens antigos.

---

# 🧪 TDD e Qualidade

O backend foi planejado utilizando:

```txt
TDD (Test-Driven Development)
```

Fluxo:

```txt
Red → Green → Refactor
```

---

## Tipos de teste

### Testes unitários

Validam regras de negócio isoladas.

---

### Testes de integração

Validam integração entre API e banco.

---

### Testes end-to-end

Validam fluxos completos do sistema.

---

## Cobertura

O objetivo é manter:

```txt
≥ 80% de cobertura
```

---

# 🔄 CI/CD

O projeto utiliza GitHub Actions para:

* lint;
* typecheck;
* testes automatizados;
* build da aplicação.

---

## Pipeline

```txt
Install Dependencies
        ↓
Lint
        ↓
Typecheck
        ↓
Tests
        ↓
Build
```

---

# 🛣 Roadmap

## MVP

* [ ] Cadastro e login
* [ ] Gerenciamento de estudantes
* [ ] Controle de fichas
* [ ] Geração de QR Code
* [ ] Validação de entrada
* [ ] Histórico de acessos

---

## Próximas funcionalidades

* [ ] Integração com Pix
* [ ] Dashboard administrativo
* [ ] Aplicativo mobile
* [ ] Notificações
* [ ] Integração com catracas
* [ ] Cardápio do RU
* [ ] Relatórios avançados
* [ ] Analytics de consumo

---

# 🤝 Contribuição

Contribuições são bem-vindas.

---

## Fluxo recomendado

1. Fork o projeto.
2. Crie uma branch:

```bash
git checkout -b feature/minha-feature
```

3. Commit suas alterações:

```bash
git commit -m "feat: minha nova feature"
```

4. Push da branch:

```bash
git push origin feature/minha-feature
```

5. Abra um Pull Request.

---

# 📄 Licença

Este projeto está sem licença no momento.

---

# 👨‍💻 Autor

Projeto desenvolvido por Henrique Sagawa.

---

# 💡 Considerações Finais

O RU Fácil busca modernizar a experiência universitária no acesso ao Restaurante Universitário através de uma solução segura, escalável e digital.

O foco principal do projeto está em:

* experiência do usuário;
* segurança;
* confiabilidade;
* escalabilidade;
* rastreabilidade;
* facilidade de manutenção.