export const isAdmin = (req, res, next) => {
  if (!req.user) {
      return res.status(401).json({ error: "No autenticado. Inicie sesión primero." });
  }

  if (typeof req.user.es_administrador === "undefined") {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
  }

  if (!req.user.es_administrador) {
      return res.status(403).json({ error: "Acceso denegado. No tienes permisos de administrador." });
  }

  next();
};