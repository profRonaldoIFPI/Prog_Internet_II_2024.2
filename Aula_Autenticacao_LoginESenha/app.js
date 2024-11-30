const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const PORT = 3000;

// Conexão com o PostgreSQL via Sequelize
const { sequelize } = require('./config/database');

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'segredo',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

sequelize.sync({ force: false }).then(() => {
    console.log('Tabelas sincronizadas');
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
  });
  
