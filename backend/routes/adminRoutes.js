const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar el token
const authorizeRole = require('../middlewares/authorizeRole'); // Middleware para roles

// Ruta exclusiva para administradores y jefes
router.get('/dashboard', verifyToken, authorizeRole(['admin', 'boss']), (req, res) => {
  res.send('Bienvenido al panel de administración');
});

// Ruta exclusiva para jefes
router.get('/reports', verifyToken, authorizeRole(['boss']), (req, res) => {
  res.send('Bienvenido al área de reportes');
});

module.exports = router;
