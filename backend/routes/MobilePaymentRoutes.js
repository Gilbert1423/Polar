const express = require("express");
const router = express.Router();
const { MobilePaymentConfig, Order } = require("../models"); // ✅ Importar modelo de pedidos

// Obtener configuración de pago móvil
router.get("/", async (req, res) => {
  try {
    const config = await MobilePaymentConfig.findOne();
    if (!config) {
      return res.status(404).json({ error: "Configuración de Pago Móvil no encontrada." });
    }
    res.json(config);
  } catch (error) {
    console.error("Error en GET /api/payments/mobile:", error);
    res.status(500).json({ error: "Error interno al obtener la configuración de Pago Móvil." });
  }
});

// Actualizar configuración de pago móvil
router.put("/", async (req, res) => {
  try {
    const { bank_name, phone_number, id_card } = req.body;
    if (!bank_name || !phone_number || !id_card) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }
    const config = await MobilePaymentConfig.findOne();
    if (config) {
      await config.update({ bank_name, phone_number, id_card });
    } else {
      await MobilePaymentConfig.create({ bank_name, phone_number, id_card });
    }
    res.json({ message: "Configuración actualizada correctamente." });
  } catch (error) {
    console.error("Error en PUT /api/payments/mobile:", error);
    res.status(500).json({ error: "Error interno al actualizar la configuración de Pago Móvil." });
  }
});

// ✅ Nueva ruta para confirmar el pago
router.post("/confirm", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId en la solicitud." });
    }

    // Buscar el pedido pendiente del usuario
    const order = await Order.findOne({ where: { userId, status: "pending" } });

    if (!order) {
      return res.status(404).json({ error: "No se encontró un pedido pendiente para este usuario." });
    }

    // Marcar el pedido como pagado
    order.status = "paid";
    await order.save();

    res.json({ message: "Pago confirmado exitosamente." });
  } catch (error) {
    console.error("Error en POST /api/payments/confirm:", error);
    res.status(500).json({ error: "Error interno al confirmar el pago." });
  }
});

module.exports = router;