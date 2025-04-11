"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("cart", "newColumn1");
    await queryInterface.removeColumn("cart", "newColumn2");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("cart", "newColumn1", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("cart", "newColumn2", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },
};