module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "cart",
      timestamps: false, // Evita problemas con `createdAt` y `updatedAt` si no están en la tabla
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Cart.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  };

  return Cart;
};