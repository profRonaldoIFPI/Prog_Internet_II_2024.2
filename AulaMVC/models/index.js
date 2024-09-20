const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('produtos', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desativa logs do SQL no console
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importa os modelos
db.Product = require('./product')(sequelize, Sequelize);

module.exports = db;