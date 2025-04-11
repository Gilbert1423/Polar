const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🧐 Token recibido en verifyToken:", authHeader); // ✅ Verificar si llega el token

  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. No se encontró token.' });
  }

  const token = authHeader.split(' ')[1];
  console.log("🔍 Token extraído:", token); // ✅ Verificar si el token se extrae correctamente

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decodificado:", decoded); // ✅ Verificar qué datos tiene el token

    req.user = decoded;

    if (!req.user.id) {
      return res.status(401).json({ error: 'Token inválido: Falta ID de usuario.' });
    }

    console.log("✅ Usuario autenticado en verifyToken:", req.user);
    next();
  } catch (err) {
    console.error("❌ Error verificando el token:", err.message);
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = verifyToken;