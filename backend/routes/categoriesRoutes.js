const express = require('express');
const router = express.Router();
const { Category, Product } = require('../models'); // Importa ambos modelos

// Obtener todas las categorías, incluyendo sus productos asociados
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product, as: 'products' }]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
});

// Obtener productos de una categoría específica

// Obtener productos de una categoría específica
router.get('/:nombre/products', async (req, res) => {
  try {
    // Busca la categoría por su nombre
    const category = await Category.findOne({
      where: { name: req.params.nombre },
      include: [{ model: Product, as: 'products' }], // Incluye los productos asociados
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(category.products); // Devuelve los productos de la categoría
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos de la categoría', error: error.message });
  }
});
// Crear categoría
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría', error });
  }
});

// Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría', error });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    // Buscar la categoría incluyendo sus productos asociados
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'products' }],
    });
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    // Si tiene productos asociados, no se elimina
    if (category.products && category.products.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar la categoría. Tiene productos asociados.' 
      });
    }
    await category.destroy();
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
});

module.exports = router;