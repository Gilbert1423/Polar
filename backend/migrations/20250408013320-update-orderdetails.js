module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modificar price para que sea price_per_unit si aún no ha sido cambiado
    await queryInterface.renameColumn("OrderDetails", "price", "price_per_unit").catch(() => {});

    // Agregar createdAt y updatedAt si aún no existen
    await queryInterface.addColumn("OrderDetails", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    }).catch(() => {});

    await queryInterface.addColumn("OrderDetails", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    }).catch(() => {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("OrderDetails", "price_per_unit", "price").catch(() => {});
    await queryInterface.removeColumn("OrderDetails", "createdAt").catch(() => {});
    await queryInterface.removeColumn("OrderDetails", "updatedAt").catch(() => {});
  },
};