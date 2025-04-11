'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Nuevos atributos
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#4299E1'
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '🛒'
    }
  }, {});

  Category.associate = function(models) {
    // Relación, por ejemplo, una categoría tiene muchos productos
    Category.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
  };

  return Category;
};