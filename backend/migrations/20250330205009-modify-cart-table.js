"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("cart", "newColumn1", {
      type: Sequelize.STRING, // Cambia al tipo de datos necesario
      allowNull: true,        // Cambia según tus necesidades
    });

    await queryInterface.addColumn("cart", "newColumn2", {
      type: Sequelize.INTEGER, // Cambia al tipo de datos necesario
      allowNull: false,        // Cambia según tus necesidades
      defaultValue: 0,         // Cambia según el valor predeterminado necesario
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("cart", "newColumn1");
    await queryInterface.removeColumn("cart", "newColumn2");
  },
};