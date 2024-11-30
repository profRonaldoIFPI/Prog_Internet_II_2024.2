const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const sequelize = require('./models'); //index.js
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); 

// Sincroniza o modelo com o banco de dados
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
}).catch((error) => {
  console.error('Erro ao sincronizar o banco de dados:', error);
});

// Rota protegida
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Conteúdo protegido acessado com sucesso', user: req.user });
  })

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
  // Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password)
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});