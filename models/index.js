// models/index.js
const { Sequelize, DataTypes } = require('sequelize');

// Usamos la URL pública (Railway) o variable fallback local
const connectionString =
  process.env.MYSQL_PUBLIC_URL || process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/railway';

const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  logging: false, // cambiar a true si quieres ver queries en consola
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = { sequelize, Product };
