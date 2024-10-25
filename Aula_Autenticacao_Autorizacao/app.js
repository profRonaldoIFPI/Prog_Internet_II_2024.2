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

app.use(flash());

// Middleware para mensagens flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Rotas (adicionaremos mais tarde)

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});