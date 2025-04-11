const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models'); // Importa el modelo
const upload = require('../middlewares/upload'); // Middleware para cargar imágenes
const { Op } = require("sequelize"); // ✅ Importar operadores de Sequelize

// ✅ Obtener productos con búsqueda opcional
router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || ""; // ✅ Obtiene la búsqueda del usuario
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { "$category.name$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {}; // ✅ Filtra por nombre o categoría si hay término de búsqueda

    const products = await Product.findAll({
      where: whereCondition,
      include: [{ model: Category, as: "category" }],
    });

    res.json(products);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
});

// ✅ Crear producto con carga de archivo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    const { name, categoryId, price, stock, description, featured } = req.body;
    const newProduct = await Product.create({
      name,
      categoryId,
      price,
      stock,
      description,
      featured: featured === "true" || featured === true,
      image: imagePath,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
});

// ✅ Actualizar producto con carga de imagen opcional
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    let updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }
    
    await product.update(updatedData);
    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
});

// ✅ Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await product.destroy();
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
});

module.exports = router;