const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true, 
    allowNull: false,
    autoIncrement: true
  },
  id_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2//default user
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
    defaultValue: ""
  },  
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
},{
  timestamps: false
});

module.exports = User;
