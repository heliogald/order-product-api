# Order Product API

API para gerenciamento de pedidos e produtos desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**. O projeto utiliza **Docker** para facilitar a configuração do ambiente de desenvolvimento.

## Tecnologias Utilizadas

- Node.js
- NestJS
- TypeORM
- PostgreSQL (via container Docker)
- Docker e Docker Compose
- JWT (autenticação)
- Swagger (documentação)
- Jest (testes unitários)
- ESLint + Prettier (padrões de código)

## Como rodar o projeto

### Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/order-product-api.git
cd order-product-api
```

2. Suba os containers com Docker Compose:

```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:3000` e o banco de dados PostgreSQL em `localhost:5432`.

### Documentação da API

Acesse a documentação interativa Swagger em:

```
http://localhost:3000/api
```

## Rodando os testes

Para rodar os testes automatizados com cobertura:

```bash
npm install
npm run test:cov
```

## Observações

- O projeto **não utiliza migrations**, pois o TypeORM está configurado para **sincronizar automaticamente** com o banco de dados ao subir os containers.
- As entidades são criadas automaticamente no banco de dados com base nas classes TypeORM.

---

> Teste técnico - Backend NestJS
> Autor: Hélio Galdino