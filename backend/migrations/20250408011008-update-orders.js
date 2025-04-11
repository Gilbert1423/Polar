module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ❌ Eliminar esta línea si la columna ya existe
    // await queryInterface.addColumn("orders", "status", {
    //   type: Sequelize.ENUM("Pendiente", "Pagado", "Cancelado"),
    //   defaultValue: "Pendiente",
    // });


  },

};