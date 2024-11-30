const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('auth', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};