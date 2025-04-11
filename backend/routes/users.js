const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Asegúrate de que el modelo User está exportado en models/index.js

// GET: Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      // Opcional: Puedes especificar atributos para no enviar datos sensibles
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
});

// GET: Obtener un usuario por su ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
});

// POST: Crear un nuevo usuario (opcional, según tus necesidades)
router.post('/', async (req, res) => {
  try {
    // Asegúrate de validar los datos antes de crear el usuario y de no incluir la contraseña sin encriptar
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
});

// PUT: Actualizar un usuario por su ID (opcional)
router.put('/:id', async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user = await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
});

// DELETE: Eliminar un usuario por su ID (opcional)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
});

module.exports = router;