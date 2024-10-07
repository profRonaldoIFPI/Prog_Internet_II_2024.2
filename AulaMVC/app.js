const express = require('express');
const app = express();
const path = require('path'); // garante funcionar em Linux e Windows
const db = require('./models'); //busca por módulos no arquio "index.js" (convensão do Node.js)
const productRoutes = require('./routes/productRoutes');

// Configurar o motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Para parsear o corpo das requisições POST
app.use(express.urlencoded({ extended: true }));

// Para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/products', productRoutes);

// Sincronizar o Sequelize com o banco de dados
db.sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });