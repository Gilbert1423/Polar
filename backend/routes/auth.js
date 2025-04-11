const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const authorizeRole = require('../middlewares/authorizeRole');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { User } = require("../models");

// Ruta pública para registro de usuarios comunes
router.post('/register', register);
// Ruta pública para inicio de sesión
router.post('/login', login);

// Ruta protegida para registrar administradores (solo accesible para "boss")
router.post(
  '/register-admin',
  verifyToken,
  authorizeRole(['boss']),
  async (req, res) => {
    const { name, lastname, email, password, phone, shippingAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newAdmin = await User.create({
        name,
        lastname,
        email,
        password: hashedPassword,
        phone,
        shippingAddress,
        role: 'admin', // Se registra como administrador
      });
      res.status(201).json({ message: 'Administrador registrado con éxito', userId: newAdmin.id });
    } catch (error) {
      console.error('Error al registrar administrador:', error);
      res.status(500).json({ error: 'Error interno al registrar administrador.' });
    }
  }
);

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: "Correo no encontrado" });

  const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tuemail@gmail.com",
      pass: "jlqn ygpr upzu icqk",
    },
    tls: {
      rejectUnauthorized: false, // 🚀 Ignora errores de certificados autofirmados
    },
  });

  await transporter.sendMail({
    from: '"Soporte" <tuemail@gmail.com>',
    to: email,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en este enlace para restablecer tu contraseña: 
           <a href="http://localhost:3000/reset-password/${token}">Restablecer contraseña</a></p>`,
  });

  res.json({ message: "Correo enviado con instrucciones" });
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, "SECRET_KEY");
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Token inválido o expirado" });
  }
});

module.exports = router;
