const sequelize = require('../../config/database');
const User = require('./user');
const Role = require('./role');

User.belongsTo(Role, { foreignKey: 'id_role', as: 'role' });
Role.hasMany(User, { foreignKey: 'id_role' });

module.exports = {
  sequelize,
  User,
  Role
};