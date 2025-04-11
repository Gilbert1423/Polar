'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    // Eliminamos el campo duplicado:
    // category: { type: DataTypes.STRING, allowNull: false },
    categoryId: { 
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    timestamps: true,
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: "categoryId", as: "category" });
    Product.hasMany(models.Cart, { foreignKey: "productId", as: "cartItems" }); // Nueva asociación
  };

  return Product;
};