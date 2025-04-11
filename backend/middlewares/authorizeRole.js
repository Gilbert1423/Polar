const authorizeRole = (roles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // Extrae el rol desde `req.user` (agregado por el middleware verifyToken)
      if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta.' });
      }
      next();
    };
  };
  
module.exports = authorizeRole;
  