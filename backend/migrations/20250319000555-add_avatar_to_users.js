"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "avatar", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "/images/default-avatar.png", // Valor predeterminado
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "avatar");
  },
};
