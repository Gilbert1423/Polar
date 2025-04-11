module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Renombrar columna `price` a `price_per_unit`
    await queryInterface.renameColumn("OrderDetails", "price", "price_per_unit");

    // Agregar columnas `createdAt` y `updatedAt` para registrar la fecha de creación/modificación
    await queryInterface.addColumn("OrderDetails", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("OrderDetails", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir los cambios si es necesario
    await queryInterface.renameColumn("OrderDetails", "price_per_unit", "price");
    await queryInterface.removeColumn("OrderDetails", "createdAt");
    await queryInterface.removeColumn("OrderDetails", "updatedAt");
  },
};