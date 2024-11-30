## Modelo de autenticação por senha

Abaixo um guia passo a passo para construir um sistema de autenticação com login e senha usando **Node.js**, **Express**, **Sequelize** e **PostgreSQL**. 

Este modelo foi criado na aula do dia 23/04/2024 com auxílio da ferramenta ***Cursor***. Oportunidade em que discutimos o uso das IAs generativas para programação.

---

### **Passo 1: Inicializar o Projeto**

**1.1.** Crie uma nova pasta para o seu projeto e acesse-a pelo terminal.

**1.2.** Inicialize o projeto com o npm:

```bash
npm init -y
```

Isso cria um arquivo `package.json` básico.

---

### **Passo 2: Instalar Dependências**

Vamos instalar as dependências necessárias para o projeto.

**2.1.** Instalar **Express**:

```bash
npm install express
```

- **Express** é um framework web rápido e minimalista para Node.js.
- **Documentação**: [Express.js](https://expressjs.com/pt-br/)

**2.2.** Instalar **Sequelize** e **PostgreSQL**:

```bash
npm install sequelize pg pg-hstore
```

- **Sequelize** é um ORM (Object-Relational Mapping) para Node.js que suporta vários bancos de dados SQL.
  - **Documentação**: [Sequelize](https://sequelize.org/)
- **pg** e **pg-hstore** são dependências para conectar o Sequelize ao PostgreSQL.
  - **pg**: Driver PostgreSQL para Node.js.
    - **Documentação**: [node-postgres](https://node-postgres.com/)
  - **pg-hstore**: Utilitário para serializar e desserializar dados JSON para o PostgreSQL.
    - **Documentação**: [pg-hstore](https://www.npmjs.com/package/pg-hstore)

**Nota**: Estou considerando que você já tem PostgreSQL instalado e configurado em sua máquina.

**2.3.** Instalar **EJS**:

```bash
npm install ejs
```

- **EJS** é um motor de templates (*template engine*) que nos permite gerar HTML com JavaScript simples.
- **Documentação**: [EJS](https://ejs.co/)

**2.4.** Instalar **express-session** e **connect-flash**:

```bash
npm install express-session connect-flash
```

- **express-session** é um middleware que permite gerenciar sessões de usuário.
  - **Documentação**: [express-session](https://www.npmjs.com/package/express-session)
- **connect-flash** é um middleware para exibir mensagens temporárias entre requisições (como erros e confirmações).
  - **Documentação**: [connect-flash](https://www.npmjs.com/package/connect-flash)

**2.5.** Instalar **bcryptjs**:

```bash
npm install bcryptjs
```

- **bcryptjs** é uma biblioteca para criptografar senhas, aumentando a segurança.
- **Documentação**: [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

### **Passo 3: Configurar o Banco de Dados com Sequelize**

**3.1.** Crie a pasta `config` e o arquivo `database.js`:

**3.2.** No arquivo `config/database.js`, configure a conexão com o banco de dados:

```javascript
// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'usr', 'pwd', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};
```

- Aqui, estamos conectando ao banco de dados `database` com o usuário `usr` e a senha `pwd`.
- **Documentação Sequelize para conexão**: [Sequelize - Conectando ao Banco de Dados](https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database)

**Nota**: Estou considerando que o banco de dados `database` exista no o PostgreSQL. 

---

### **Passo 4: Criar o Modelo User**

**4.1.** Crie a pasta `models` e o arquivo `User.js`:

**4.2.** Defina o modelo `User`:

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eAdmin: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
```

- **DataTypes**: Tipos de dados que podemos usar em nossos modelos Sequelize.
- **Definição do Modelo**: Especificamos os campos e suas propriedades.
- **Documentação**: [Modelos Sequelize](https://sequelize.org/master/manual/model-basics.html)

---

### **Passo 5: Configurar o Express e Middlewares**

**5.1.** Crie o arquivo `app.js` no diretório raiz do seu projeto:


**5.2.** Configure o servidor Express:

```javascript
// app.js
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// Conexão com o PostgreSQL via Sequelize
const { sequelize } = require('./config/database');

// Teste de conexão
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

// Configurações
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Configuração de Sessão
app.use(
  session({
    secret: 'segredo',
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware para mensagens flash
app.use(flash());

// Variáveis globais para mensagens
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Rotas (iremos adicionar em passos posteriores)

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

- **express.urlencoded**: Middleware para analisar dados de formulários enviados via POST.
  - **Documentação**: [Express - Middleware](https://expressjs.com/pt-br/api.html#express.urlencoded)
- **express-session**: Configuração de sessões para armazenar dados entre requisições.
- **connect-flash**: Para exibir mensagens temporárias ao usuário.

---

### **Passo 6: Criar as Views**

Vamos criar as páginas que serão exibidas ao usuário usando EJS.

**6.1.** Crie a pasta `views`:

**6.2.** Crie os arquivos de template:

- **register.ejs**: Formulário de registro.
- **login.ejs**: Formulário de login.
- **dashboard.ejs**: Página protegida que o usuário verá após o login.

**Exemplo de `views/register.ejs`:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Registro</title>
</head>
<body>
  <h1>Registrar</h1>
  <% if (error_msg) { %>
    <p style="color:red;"><%= error_msg %></p>
  <% } %>
  <% if (success_msg) { %>
    <p style="color:green;"><%= success_msg %></p>
  <% } %>
  <form action="/register" method="POST">
    <input type="text" name="nome" placeholder="Nome" required />
    <input type="email" name="email" placeholder="Email" required />
    <input type="password" name="senha" placeholder="Senha" required />
    <button type="submit">Registrar</button>
  </form>
  <p>Já tem uma conta? <a href="/login">Faça login</a></p>
</body>
</html>
```

**Faça o mesmo para `login.ejs` e `dashboard.ejs`, ajustando conforme necessário.**

- **Documentação EJS**: [EJS](https://ejs.co/#docs)

---

### **Passo 7: Implementar Rotas de Registro e Login**

**7.1.** No `app.js`, importe o modelo `User` e a biblioteca `bcryptjs`:

```javascript
const User = require('./models/User');
const bcrypt = require('bcryptjs');
```

**7.2.** Adicione as rotas de registro:

```javascript
// Rota de registro (GET)
app.get('/register', (req, res) => {
  res.render('register');
});

// Rota de registro (POST)
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  let errors = [];

  // Validações básicas
  if (!nome || !email || !senha) {
    errors.push({ msg: 'Por favor, preencha todos os campos' });
  }

  if (senha.length < 6) {
    errors.push({ msg: 'A senha deve ter pelo menos 6 caracteres' });
  }

  if (errors.length > 0) {
    res.render('register', { errors });
  } else {
    try {
      // Verifica se o usuário já existe
      const user = await User.findOne({ where: { email } });
      if (user) {
        errors.push({ msg: 'Email já está registrado' });
        res.render('register', { errors });
      } else {
        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        // Cria novo usuário
        await User.create({
          nome,
          email,
          senha: hash,
        });

        req.flash('success_msg', 'Você está registrado e pode fazer login');
        res.redirect('/login');
      }
    } catch (err) {
      console.error(err);
      res.render('register', { errors: [{ msg: 'Erro ao registrar usuário' }] });
    }
  }
});
```

- **bcryptjs**: Utilizado para criptografar a senha antes de armazená-la.
  - **Documentação**: [bcryptjs](https://www.npmjs.com/package/bcryptjs)

**7.3.** Adicione as rotas de login:

```javascript
// Rota de login (GET)
app.get('/login', (req, res) => {
  res.render('login');
});

// Rota de login (POST)
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  let errors = [];

  if (!email || !senha) {
    errors.push({ msg: 'Por favor, preencha todos os campos' });
    return res.render('login', { errors });
  }

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      errors.push({ msg: 'Email não registrado' });
      return res.render('login', { errors });
    }

    // Compara a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (isMatch) {
      // Inicia a sessão do usuário
      req.session.user = user;
      req.flash('success_msg', 'Você está logado');
      res.redirect('/dashboard');
    } else {
      errors.push({ msg: 'Senha incorreta' });
      res.render('login', { errors });
    }
  } catch (err) {
    console.error(err);
    res.render('login', { errors: [{ msg: 'Erro ao fazer login' }] });
  }
});
```

---

### **Passo 8: Proteger Rotas e Implementar Logout**

**8.1.** Crie um middleware de autenticação:

```javascript
function checkAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Por favor, faça login para ver este recurso');
  res.redirect('/login');
}
```

**8.2.** Crie a rota protegida `/dashboard`:

```javascript
// Rota de dashboard
app.get('/dashboard', checkAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});
```

**8.3.** Implementar o logout:

```javascript
// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  req.flash('success_msg', 'Você saiu da sua conta');
  res.redirect('/login');
});
```

---

### **Passo 9: Testar a Aplicação**

**9.1.** Execute o servidor:

```bash
node app.js
```

**9.2.** Acesse no navegador:

- **Registro**: [http://localhost:3000/register](http://localhost:3000/register)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

### **Passo 10: Melhorias e Recursos Adicionais**

**10.1.** **Validação de Dados**:

- Para validações mais robustas, considere usar o **express-validator**.
  - **Instalação**:

    ```bash
    npm install express-validator
    ```

  - **Documentação**: [express-validator](https://express-validator.github.io/docs/)

**10.2.** **Segurança Adicional**:

- **Helmet**: Ajuda a proteger a aplicação definindo vários cabeçalhos HTTP.

  ```bash
  npm install helmet
  ```

  - **Documentação**: [Helmet](https://helmetjs.github.io/)

**10.3.** **Uso de Passport.js**:

- Para uma autenticação mais escalável e com suporte a várias estratégias (como OAuth), considere usar o **Passport.js**.

  - **Instalação**:

    ```bash
    npm install passport passport-local
    ```

  - **Documentação**: [Passport.js](http://www.passportjs.org/)

---

## **Explicação das Dependências Utilizadas**

- **express**: Framework web para Node.js, facilita a criação de servidores HTTP.
  - [Express.js](https://expressjs.com/pt-br/)

- **sequelize**: ORM para trabalhar com bancos de dados relacionais.
  - [Sequelize](https://sequelize.org/)

- **pg** e **pg-hstore**: Módulos para conectar o Sequelize ao PostgreSQL.
  - [node-postgres](https://node-postgres.com/)
  - [pg-hstore](https://www.npmjs.com/package/pg-hstore)

- **ejs**: Motor de templates para gerar HTML de forma dinâmica.
  - [EJS](https://ejs.co/)

- **express-session**: Middleware para gerenciar sessões de usuário.
  - [express-session](https://www.npmjs.com/package/express-session)

- **connect-flash**: Middleware para exibir mensagens temporárias entre requisições.
  - [connect-flash](https://www.npmjs.com/package/connect-flash)

- **bcryptjs**: Biblioteca para criptografar senhas.
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

### **Recursos Adicionais**:

- **Node.js**:
  - [Documentação Oficial](https://nodejs.org/pt-br/docs/)
- **Express.js**:
  - [Guia do Express](https://expressjs.com/pt-br/guide/routing.html)
- **Sequelize**:
  - [Associações e Relacionamentos](https://sequelize.org/master/manual/assocs.html)
- **PostgreSQL**:
  - [Documentação Oficial](https://www.postgresql.org/docs/)

---
**Professor Ronaldo Borges** |
**IFPI - Campus Floriano**
---