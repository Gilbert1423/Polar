// controllers/profileController.js
const { User } = require('../models');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "lastname",
        "email",
        "phone",
        "shippingAddress",
        "avatar",
        "createdAt",
        "role", // ✅ Agregar `role`
      ],
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const avatar = user.avatar && user.avatar.trim() !== ""
      ? user.avatar
      : "/images/default-avatar.png";

    res.json({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      avatar: avatar,
      memberSince: user.createdAt, // Puedes formatear `createdAt` si lo deseas
      role: user.role || "user", // ✅ Asegurar que `role` esté presente
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
const updateProfile = async (req, res) => {
  try {
    const updatedFields = {};
    const allowedFields = ["name", "lastname", "email", "phone", "shippingAddress"];

    // Procesar los campos enviados en req.body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    });

    // Procesar la imagen si se envió
    if (req.file) {
      updatedFields.avatar = `/uploads/${req.file.filename}`; // Ruta de la imagen subida
    }

    // Validar si hay datos para actualizar
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No se enviaron datos para actualizar." });
    }

    // Actualizar el usuario en la base de datos
    const [updatedRows] = await User.update(updatedFields, { where: { id: req.user.id } });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado o sin cambios." });
    }

    // Obtener el usuario actualizado
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "lastname", "email", "phone", "shippingAddress", "avatar", "role"],
    });

    res.json({ message: "Perfil actualizado correctamente", user: updatedUser.get() });
  } catch (error) {
    console.error("Error en updateProfile:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { getProfile, updateProfile };
