const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const api = axios.create({
  baseURL: process.env.API_URL,
});

// Configura o EJS como motor de visualização
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configura a sessão
app.use(
  session({
    secret: 'cliente_jwt_secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
  if (req.session.token) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Rota raiz
app.get('/', isAuthenticated, (req, res) => {
  res.render('welcome', { username: req.session.username });
});

// Rota de login
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await api.post('/login', { username, password });
    req.session.token = response.data.token;
    //o token vai ficar salvo na sessão (memoria RAM apenas)
    
    req.session.username = username;
    res.redirect('/');
  } catch (error) {
    res.render('login', { error: 'Credenciais inválidas' });
  }
});

// Rota de registro
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    await api.post('/register', { username, password });
    res.redirect('/login');
  } catch (error) {
    res.render('register', { error: 'Erro ao registrar usuário' });
  }
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Rota protegida de exemplo
app.get('/protected', isAuthenticated, async (req, res) => {
  try {
    const response = await api.get('/protected', {
      headers: { token: req.session.token },
    });
    res.render('protected', { data: response.data });
  } catch (error) {
    console.error('Erro ao acessar conteúdo protegido:', error);
    res.render('protected', { data: 'Erro ao acessar conteúdo protegido' });
  }
});

app.listen(port, () => {
  console.log(`Cliente rodando na porta ${port}`);
});