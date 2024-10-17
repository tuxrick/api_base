const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Role = sequelize.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true, 
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},{
  timestamps: false
});

module.exports = Role;
