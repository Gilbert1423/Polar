const express = require("express");
const router = express.Router();
const { Cart, Order, OrderDetail, Product } = require("../models"); // Asegúrate de importar tus modelos

// === RUTAS DEL CARRITO ===

// Obtener productos del carrito
router.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      include: [{ model: Product, as: "product" }], // Incluye detalles del producto
    });
    res.json(cartItems);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al obtener productos del carrito", error: error.message });
  }
});

router.put("/cart/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Producto no encontrado" });

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cantidad", error: error.message });
  }
});

// Agregar producto al carrito
router.post("/cart", async (req, res) => {
  try {
    console.log("Datos recibidos en POST /cart:", req.body); // Verifica los datos recibidos

    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Faltan datos para agregar al carrito" });
    }

    const existingItem = await Cart.findOne({ where: { userId, productId } });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json(existingItem);
    }

    const newItem = await Cart.create({ userId, productId, quantity });
    res.json(newItem);
  } catch (error) {
    console.error("Error en la ruta POST /cart:", error); // Ver el error completo
    res.status(500).json({ message: "Error al agregar producto al carrito", error: error.message });
  }
});

// 📌 Ruta para vaciar el carrito correctamente después de la compra
router.delete("/cart", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Faltan datos para vaciar el carrito" });
  }

  try {
    await Cart.destroy({ where: { userId } });
    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
  }
});




// Eliminar un producto específico del carrito
router.delete("/cart/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

    await cartItem.destroy();
    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto del carrito", error: error.message });
  }
});

// === RUTAS DE PEDIDOS ===

// Crear un pedido a partir del carrito
router.post("/orders", async (req, res) => {
  console.log("Datos recibidos en /orders:", req.body);

  const { userId, cartItems } = req.body;

  if (!userId || !cartItems || cartItems.length === 0) {
    console.error("Datos incompletos o inválidos:", req.body);
    return res.status(400).json({ message: "Datos incompletos en la solicitud de pedido" });
  }

  try {
    // Calcular el total del pedido
    const total = cartItems.reduce((sum, item) => {
      if (!item.productId || !item.price_per_unit || !item.quantity) {
        console.error("Elemento inválido en cartItems:", item);
        throw new Error("Datos inválidos en cartItems");
      }
      return sum + item.price_per_unit * item.quantity;
    }, 0);

    // Crear el pedido
    const newOrder = await Order.create({ userId, total });

    // Crear los detalles del pedido
    const orderDetails = cartItems.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      price: item.price_per_unit,
      quantity: item.quantity,
    }));
    await OrderDetail.bulkCreate(orderDetails);

    // Vaciar el carrito después de finalizar el pedido
    await Cart.destroy({ where: { userId } });

    res.status(201).json({ message: "Pedido creado exitosamente", newOrder });
  } catch (error) {
    console.error("Error al crear el pedido:", error.message);
    res.status(500).json({ message: "Error al crear el pedido", error: error.message });
  }
});
// Obtener pedidos de un usuario
router.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
      include: [{ model: OrderDetail, as: "details", include: "product" }], // Incluye detalles del pedido y productos
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
});

module.exports = router;