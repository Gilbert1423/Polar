const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken"); // ✅ Middleware para verificar el token
const { Order, User, OrderDetail, Product } = require("../models");

// GET: Obtener todos los pedidos con detalles de productos
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastname", "email", "phone", "shippingAddress"],
        },
        {
          model: OrderDetail,
          as: "orderDetails",
          include: [{ model: Product, as: "product", attributes: ["name", "price"] }],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
});

// POST: Crear pedido con validaciones
router.post("/", async (req, res) => {
  try {
    const { userId, total, payment_method, reference_number, orderDetails } = req.body;

    if (!userId || !total || !Array.isArray(orderDetails) || orderDetails.length === 0) {
      return res.status(400).json({ message: "Datos inválidos para el pedido" });
    }

    const order = await Order.create({ userId, total, payment_method, reference_number });

    // Crear detalles de pedido
    const details = orderDetails.map((detail) => ({
      orderId: order.id,
      productId: detail.productId,
      price_per_unit: detail.price_per_unit,
      quantity: detail.quantity,
    }));
    await OrderDetail.bulkCreate(details);

    // Actualizar datos de usuario
    await User.increment({ totalOrders: 1, totalSpent: total }, { where: { id: userId } });

    res.status(201).json({ order, orderDetails: details });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el pedido", error: error.message });
  }
});

// PUT: Actualizar estado del pedido
router.put("/:id", async (req, res) => {
  try {
    const { status, payment_method, reference_number } = req.body;
    let order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    order = await order.update({ status, payment_method, reference_number });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pedido", error: error.message });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado." });
    }

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user", // ✅ Asegurar que coincide con la relación en `Order.js`
          attributes: ["id", "name", "lastname", "email", "phone", "shippingAddress"],
        },
        {
          model: OrderDetail,
          as: "orderDetails",
          include: [{ model: Product, as: "product", attributes: ["name", "price"] }],
        },
      ],
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No tienes pedidos registrados." });
    }

    console.log("🧐 Pedidos obtenidos en el backend:", JSON.stringify(orders, null, 2)); // ✅ Verificar si `user` aparece en la terminal

    res.json({ orders });
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

module.exports = router;