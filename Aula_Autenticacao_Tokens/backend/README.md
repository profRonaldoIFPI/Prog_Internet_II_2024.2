# Implementando JWT em um Servidor Node.js com PostgreSQL, Sequelize e dotenv

Este guia passo a passo orienta você na criação de uma aplicação Node.js que utiliza **JSON Web Tokens (JWT)** para autenticação, **PostgreSQL** como banco de dados, **Sequelize** como ORM e **dotenv** para gerenciamento seguro de credenciais. O servidor expõe uma API REST que permite o registro de usuários, login e acesso a conteúdos protegidos.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Passo 1: Configurando o Ambiente de Desenvolvimento](#passo-1-configurando-o-ambiente-de-desenvolvimento)
- [Passo 2: Configurando o dotenv](#passo-2-configurando-o-dotenv)
- [Passo 3: Configurando o Sequelize](#passo-3-configurando-o-sequelize)
- [Passo 4: Criando o Modelo de Usuário](#passo-4-criando-o-modelo-de-usuário)
- [Passo 5: Configurando o Servidor Express](#passo-5-configurando-o-servidor-express)
- [Passo 6: Sincronizando o Banco de Dados](#passo-6-sincronizando-o-banco-de-dados)
- [Passo 7: Implementando Registro de Usuário](#passo-7-implementando-registro-de-usuário)
- [Passo 8: Implementando Login de Usuário](#passo-8-implementando-login-de-usuário)
- [Passo 9: Criando Middleware de Autenticação JWT](#passo-9-criando-middleware-de-autenticação-jwt)
- [Passo 10: Criando Rota Protegida](#passo-10-criando-rota-protegida)
- [Passo 11: Testando a API](#passo-11-testando-a-api)
- [Considerações Finais](#considerações-finais)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Pré-requisitos

- **Node.js** instalado em sua máquina.
- **PostgreSQL** instalado e em execução.
- Conhecimento básico de **JavaScript** e **Node.js**.
- Uma ferramenta para testar a API, como **Postman** ou **cURL**.

---

## Passo 1: Configurando o Ambiente de Desenvolvimento

1. **Crie uma pasta para o projeto:**

   ```bash
   mkdir jwt-nodejs-app
   cd jwt-nodejs-app
   ```

2. **Inicie um novo projeto Node.js:**

   ```bash
   npm init -y
   ```

3. **Instale as dependências necessárias:**

   ```bash
   npm install express sequelize pg pg-hstore jsonwebtoken bcryptjs dotenv body-parser
   ```

   - **express**: Framework web para Node.js.
   - **sequelize**: ORM para interagir com o PostgreSQL.
   - **pg** e **pg-hstore**: Módulos para conexão com PostgreSQL.
   - **jsonwebtoken**: Biblioteca para criar e verificar tokens JWT.
   - **bcryptjs**: Biblioteca para hash de senhas.
   - **dotenv**: Gerenciamento de variáveis de ambiente.
   - **body-parser**: Middleware para analisar corpos de requisições.

---

## Passo 2: Configurando o dotenv

1. **Crie um arquivo `.env` na raiz do projeto:**

   ```bash
   touch .env
   ```

2. **Adicione as credenciais do banco de dados e outras configurações ao arquivo `.env`:**

   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   DB_PORT=5432
   JWT_SECRET=4f8d2e0a9c1b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e
   PORT=3000
   ```

   > **Nota:** Substitua `seu_usuario`, `sua_senha` e `nome_do_banco` pelas suas credenciais do PostgreSQL. O `JWT_SECRET` é uma chave secreta que você pode gerar usando o módulo `crypto` do Node.js.

---

## Passo 3: Configurando o Sequelize

1. **Crie uma pasta `models` e dentro dela um arquivo `index.js`:**

   ```bash
   mkdir models
   touch models/index.js
   ```

2. **Configure o Sequelize em `models/index.js`:**

   ```javascript
   // models/index.js

   const { Sequelize } = require('sequelize');
   require('dotenv').config();

   const sequelize = new Sequelize(
     process.env.DB_NAME,
     process.env.DB_USER,
     process.env.DB_PASSWORD,
     {
       host: process.env.DB_HOST,
       dialect: 'postgres',
       port: process.env.DB_PORT,
     }
   );

   module.exports = sequelize;
   ```

---

## Passo 4: Criando o Modelo de Usuário

1. **Dentro da pasta `models`, crie um arquivo `User.js`:**

   ```bash
   touch models/User.js
   ```

2. **Defina o modelo de usuário em `models/User.js`:**

   ```javascript
   // models/User.js

   const { DataTypes } = require('sequelize');
   const sequelize = require('./index');

   const User = sequelize.define('User', {
     username: {
       type: DataTypes.STRING,
       allowNull: false,
       unique: true,
     },
     password: {
       type: DataTypes.STRING,
       allowNull: false,
     },
   });

   module.exports = User;
   ```

---

## Passo 5: Configurando o Servidor Express

1. **Crie um arquivo `app.js` na raiz do projeto:**

   ```bash
   touch app.js
   ```

2. **Configure o servidor Express em `app.js`:**

   ```javascript
   // app.js

   const express = require('express');
   const bodyParser = require('body-parser');
   require('dotenv').config();

   const app = express();
   const port = process.env.PORT || 3000;

   app.use(bodyParser.json());

   app.listen(port, () => {
     console.log(`Servidor rodando na porta ${port}`);
   });
   ```

---

## Passo 6: Sincronizando o Banco de Dados

1. **Atualize `app.js` para sincronizar o Sequelize com o banco de dados:**

   ```javascript
   // app.js

   const express = require('express');
   const bodyParser = require('body-parser');
   require('dotenv').config();
   const sequelize = require('./models');
   const User = require('./models/User');

   const app = express();
   const port = process.env.PORT || 3000;

   app.use(bodyParser.json());

   // Sincroniza o modelo com o banco de dados
   sequelize.sync().then(() => {
     console.log('Banco de dados sincronizado');
   }).catch((error) => {
     console.error('Erro ao sincronizar o banco de dados:', error);
   });

   app.listen(port, () => {
     console.log(`Servidor rodando na porta ${port}`);
   });
   ```

---

## Passo 7: Implementando Registro de Usuário

1. **No `app.js`, adicione a rota para registro:**

   ```javascript
   // app.js

   const bcrypt = require('bcryptjs');
   const jwt = require('jsonwebtoken');
   // ... código anterior permanece

   // Rota de registro
   app.post('/register', async (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ message: 'Username e senha são obrigatórios' });
     }

     try {
       // Verifica se o usuário já existe
       const userExists = await User.findOne({ where: { username } });
       if (userExists) {
         return res.status(400).json({ message: 'Usuário já existe' });
       }

       // Hasheia a senha
       const hashedPassword = await bcrypt.hash(password, 10);

       // Cria o usuário
       const user = await User.create({
         username,
         password: hashedPassword,
       });

       res.status(201).json({ message: 'Usuário criado com sucesso' });
     } catch (error) {
       res.status(500).json({ message: 'Erro ao criar usuário', error });
     }
   });
   ```

---

## Passo 8: Implementando Login de Usuário

1. **Adicione a rota de login no `app.js`:**

   ```javascript
   // app.js

   // Rota de login
   app.post('/login', async (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).json({ message: 'Username e senha são obrigatórios' });
     }

     try {
       // Busca o usuário no banco de dados
       const user = await User.findOne({ where: { username } });
       if (!user) {
         return res.status(400).json({ message: 'Credenciais inválidas' });
       }

       // Verifica a senha
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if (!isPasswordValid) {
         return res.status(400).json({ message: 'Credenciais inválidas' });
       }

       // Gera o token JWT
       const token = jwt.sign(
         { userId: user.id, username: user.username },
         process.env.JWT_SECRET,
         { expiresIn: '1h' } // Token expira em 1 hora
       );

       res.json({ token });
     } catch (error) {
       res.status(500).json({ message: 'Erro ao fazer login', error });
     }
   });
   ```

---

## Passo 9: Criando Middleware de Autenticação JWT

1. **Crie uma pasta `middleware` e um arquivo `auth.js`:**

   ```bash
   mkdir middleware
   touch middleware/auth.js
   ```

2. **Implemente o middleware de autenticação em `middleware/auth.js`:**

   ```javascript
   // middleware/auth.js

   const jwt = require('jsonwebtoken');
   require('dotenv').config();

   module.exports = function (req, res, next) {
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];

     if (!token) {
       return res.status(401).json({ message: 'Token não fornecido' });
     }

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       res.status(401).json({ message: 'Token inválido' });
     }
   };
   ```

---

## Passo 10: Criando Rota Protegida

1. **No `app.js`, importe o middleware de autenticação e crie uma rota protegida:**

   ```javascript
   // app.js

   const authMiddleware = require('./middleware/auth');
   // ... código anterior permanece

   // Rota protegida
   app.get('/protected', authMiddleware, (req, res) => {
     res.json({ message: 'Conteúdo protegido acessado com sucesso', user: req.user });
   });
   ```

---

## Passo 11: Testando a API

1. **Inicie o servidor:**

   ```bash
   node app.js
   ```

2. **Teste as rotas usando uma ferramenta como o Postman ou cURL.**

   - **Registrar um novo usuário:**

     - **Método:** `POST`
     - **URL:** `http://localhost:3000/register`
     - **Body (JSON):**

       ```json
       {
         "username": "usuario_teste",
         "password": "senha_teste"
       }
       ```

   - **Fazer login:**

     - **Método:** `POST`
     - **URL:** `http://localhost:3000/login`
     - **Body (JSON):**

       ```json
       {
         "username": "usuario_teste",
         "password": "senha_teste"
       }
       ```

     - **Resposta esperada:**

       ```json
       {
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
       }
       ```

   - **Acessar conteúdo protegido:**

     - **Método:** `GET`
     - **URL:** `http://localhost:3000/protected`
     - **Headers:**

       ```
       Authorization: Bearer SEU_TOKEN_AQUI
       ```

     - **Resposta esperada:**

       ```json
       {
         "message": "Conteúdo protegido acessado com sucesso",
         "user": {
           "userId": 1,
           "username": "usuario_teste",
           "iat": 1636568320,
           "exp": 1636571920
         }
       }
       ```

---

## Considerações Finais

- **Segurança:**
  - Nunca exponha sua `JWT_SECRET` ou outras credenciais. Mantenha o arquivo `.env` fora do controle de versão, adicionando-o ao seu `.gitignore`.
  - Utilize HTTPS em produção para proteger a transmissão de tokens.

- **Melhorias Possíveis:**
  - Implementar **refresh tokens** para uma experiência de login mais suave.
  - Adicionar validações adicionais nos inputs do usuário.
  - Utilizar bibliotecas como `helmet` para adicionar camadas extras de segurança.

---

## Estrutura do Projeto

```
backend/
├── app.js
├── .env
├── models/
│   ├── index.js
│   └── User.js
├── middleware/
│   └── auth.js
├── package.json
└── package-lock.json
```
---