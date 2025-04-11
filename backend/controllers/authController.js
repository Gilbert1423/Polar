const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  const { name, lastname, email, password, phone, shippingAddress, role } = req.body;

  try {
    // ✅ Validar que todos los campos sean obligatorios
    if (!name || !lastname || !email || !password || !phone || !shippingAddress) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // ✅ Validar que el email sea correcto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "El email no tiene un formato válido" });
    }

    // ✅ Validar que la contraseña tenga un mínimo de caracteres
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // ✅ Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone,
      shippingAddress,
      role: role || "user",
    });

    return res.status(201).json({ message: "Usuario registrado con éxito", userId: newUser.id });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // ✅ Verificar que el email y la contraseña no estén vacíos
    if (!email || !password) {
      return res.status(400).json({ error: "El email y la contraseña son obligatorios" });
    }

    // ✅ Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "El email no tiene un formato válido" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "El email no está registrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id, role: user.role.trim() }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shippingAddress: user.shippingAddress,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { register, login };
