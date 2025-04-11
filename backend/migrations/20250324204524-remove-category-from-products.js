'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'category');
  },

  down: async (queryInterface, Sequelize) => {
    // Si necesitas revertir, se vuelve a agregar la columna 'category'
    await queryInterface.addColumn('Products', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};