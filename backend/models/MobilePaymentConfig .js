"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MobilePaymentConfig extends Model {
  
  }

  MobilePaymentConfig.init(
    {
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_card: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "MobilePaymentConfig",
      tableName: "mobile_payment_configs", // 👈 Aseguramos que coincide con la BD
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return MobilePaymentConfig;
};