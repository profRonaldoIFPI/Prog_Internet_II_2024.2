module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      // Definição dos atributos
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    }, {
      tableName: 'products', // Nome da tabela no banco de dados
      timestamps: true, // Adiciona campos createdAt e updatedAt
    });
  
    return Product;
  };  