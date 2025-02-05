import jwt from "jsonwebtoken";
import pool  from "../config/database.js";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token; // ✅ Leer el token desde la cookie

        if (!token) {
            return res.status(401).json({ error: "Acceso denegado. No autenticado." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await pool.query("SELECT * FROM usuarios WHERE cedula = $1", [decoded.cedula]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado." });
        }

        req.user = userResult.rows[0]; // ✅ Asignar usuario a req.user
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};

