'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Agrega la columna permitiendo nulos inicialmente
    await queryInterface.addColumn('Products', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories', // Asegúrate de que el nombre de la tabla sea correcto (muy sensible a mayúsculas/minúsculas)
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // 2. Actualiza los registros existentes:
    // Antes de actualizar, asegúrate de tener una categoría predeterminada en Categories.
    // Por ejemplo, si has insertado una categoría "No clasificado" cuyo id es 1,
    // actualiza los productos asignando ese id.
    await queryInterface.sequelize.query(
      "UPDATE `Products` SET `categoryId` = 1 WHERE `categoryId` IS NULL"
    );

    // 3. Cambia la columna para que no acepte valores nulos
    await queryInterface.changeColumn('Products', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'categoryId');
  }
};