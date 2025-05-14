# 📦 Order Product API

API RESTful desenvolvida com **NestJS** para gerenciamento de produtos e pedidos, incluindo autenticação JWT, CRUD de produtos, criação e listagem de pedidos, e controle de estoque.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** & **TypeScript**
- **NestJS** (estrutura modular e escalável)
- **TypeORM** (ORM para banco relacional)
- **PostgreSQL** (banco de dados relacional)
- **JWT** (autenticação segura)
- **Swagger** (documentação da API)
- **Jest** & **Supertest** (testes unitários e de integração)
- **Docker** (opcional, para ambiente isolado)
- **Prettier / ESLint** (padronização de código)

---

## 📁 Estrutura do Projeto

src/
│
├── auth/ → Módulo de autenticação (login/registro)
├── common/ → Middlewares e filtros de exceção
├── orders/ → Módulo de pedidos
├── products/ → Módulo de produtos
├── main.ts → Arquivo principal
└── app.module.ts → Módulo raiz


---

## 📥 Como Clonar o Projeto

```bash
git clone https://github.com/seu-usuario/order-product-api.git

cd order-product-api

⚙️ Como Rodar o Projeto

1. Instale as dependências

npm install
2. Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=order_product_db

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=3600s
⚠️ Certifique-se de que o PostgreSQL está rodando e com o banco criado.

3. Gire as migrations (se aplicável)

npm run typeorm migration:run

4. Inicie a aplicação

npm run start:dev
A API estará disponível em: http://localhost:3000

📄 Documentação da API

Acesse a documentação interativa Swagger em:

http://localhost:3000/api

🧪 Como Rodar os Testes

Execute os testes unitários com cobertura:

npm run test:cov

Ou apenas os testes sem cobertura:

npm run test

🔑 Rotas protegidas

Rotas de produtos e pedidos são protegidas por autenticação JWT. Para acessá-las:

Realizar login via/auth/login

Copie o token JWT retornado

Use esse token no header Authorization: Bearer <seu-token> nas demais rotas

🧰 Comandos úteis

Comando	Descrição

npm run start	Inicia em modo produção
npm run start:dev	Inicia em modo desenvolvimento (hot reload)
npm run test	Executa os testes
npm run test:cov	Executa os testes com relatório de cobertura
npm run lint	Verifique se há problemas de fiapos
npm run format	Formata o código com Prettier


📌 Autor

Feito por Hélio Galdino — heliogald@hotmail.com

📜 Licença

Este projeto está sob a licença MIT.