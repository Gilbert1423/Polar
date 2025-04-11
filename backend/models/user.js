"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Si tienes un modelo Order, puedes definir la asociación aquí
      // User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
      User.associate = function(models) {
        // Habilita la asociación: un usuario tiene muchos pedidos.
        User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
      };
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "/images/default-avatar.png",
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user", // Roles: user, admin, boss
      },
      // Nuevos campos para la gestión de pedidos:
      totalOrders: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalSpent: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      // También puedes tener un campo para el estado del usuario (si lo deseas):
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active", // "active" o "inactive"
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};