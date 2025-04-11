"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      // Cada pedido pertenece a un usuario
      Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });

      // Un pedido puede tener muchos detalles de productos
      Order.hasMany(models.OrderDetail, { foreignKey: "orderId", as: "orderDetails" });
    }
  }

  Order.init(
    {
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending", // Opciones: pending, processing, shipped, completed, cancelled
      },
      payment_method: { // Método de pago
        type: DataTypes.STRING,
        allowNull: true,
      },
      reference_number: { // Número de referencia del pago
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Order",
      timestamps: true, // Activa createdAt y updatedAt
    }
  );

  return Order;
};