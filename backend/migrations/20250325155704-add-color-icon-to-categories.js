'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregamos la columna 'color'
    await queryInterface.addColumn('Categories', 'color', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '#4299E1'  // Valor default, ajusta según necesites
    });
    // Agregamos la columna 'icon'
    await queryInterface.addColumn('Categories', 'icon', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '🛒'  // Valor default, ajusta según necesites
    });
  },

  down: async (queryInterface, Sequelize) => {
    // En caso de revertir la migración, se elimina las columnas 'color' e 'icon'
    await queryInterface.removeColumn('Categories', 'color');
    await queryInterface.removeColumn('Categories', 'icon');
  }
};