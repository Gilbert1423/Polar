// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken'); // Asegúrate de que el path es relativo y correcto
const upload = require('../middlewares/upload'); // Middleware para manejar la subida de archivos

// Ruta para obtener el perfil
router.get('/', verifyToken, getProfile);

// Ruta para actualizar el perfil
router.put('/', verifyToken, upload.single('avatar'), updateProfile);

module.exports = router;
