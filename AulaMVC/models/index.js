const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('produtos', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres', 
  logging: false, // Desativa logs do SQL no console
});

const db = {};

//disponibilizando a própria classe Sequelize dentro do objeto db
db.Sequelize = Sequelize; 

//instância da conexão Sequelize que foi configurada para se conectar ao banco de dados 
db.sequelize = sequelize;

// Importa os modelos
db.Product = require('./product')(sequelize, Sequelize);

module.exports = db;