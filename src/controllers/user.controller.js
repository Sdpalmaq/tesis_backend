import User from "../models/user.model.js";
import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/email.config.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Contenido del correo
    const emailContent = `
      Hola ${user.nombre},
      
      Tu cuenta ha sido creada exitosamente. Usa la siguiente contraseña para iniciar sesión:
      
      Contraseña: ${user.generatedPassword}
      
      Por favor, cambia esta contraseña después de tu primer inicio de sesión.
      
      Saludos,
      Equipo de Soporte.
    `;

    // Enviar correo
    await sendEmail(
      user.correo,
      "Credenciales de tu nueva cuenta",
      emailContent
    );

    res
      .status(201)
      .json({ message: "Usuario creado y correo enviado exitosamente", user });
  } catch (error) {
    if (error.constraint === "usuarios_correo_key") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    if (error.constraint === "usuarios_pkey") {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { cedula } = req.params;
    const updatedUser = await User.update(cedula, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(updatedUser);
  } catch (error) {
    if (error.constraint === "usuarios_correo_key") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    console.error("Update user error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { cedula } = req.params;
    const deleted = await User.delete(cedula);

    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updatePassword = async (req, res) => {
  console.log("Estpy eb uo");
  const { cedula } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    // Verifica si el usuario existe
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1",
      [cedula]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Encripta la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    // Actualiza la contraseña en la base de datos
    await pool.query(
      "UPDATE usuarios SET contrasena = $1, debe_cambiar_contrasena = FALSE WHERE cedula = $2",
      [hashedPassword, cedula]
    );

    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { correo } = req.body;

  try {
    const user = await User.findByEmail(correo);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar un token JWT con el correo
    const token = jwt.sign({ correo: user.correo }, JWT_SECRET, {
      expiresIn: "15m", // Token válido por 15 minutos
    });

    // Enviar correo con el enlace de recuperación
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const emailContent = `
      Hola ${user.nombre},
      
      Hemos recibido una solicitud para restablecer tu contraseña. Puedes hacerlo usando el siguiente enlace:

      ${resetLink}

      Este enlace es válido por 15 minutos. Si no solicitaste este cambio, puedes ignorar este mensaje.
      
      Saludos,
      Equipo de Soporte.
    `;

    await sendEmail(correo, "Restablece tu contraseña", emailContent);

    res.json({ message: "Correo de recuperación enviado con éxito" });
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Encripta la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    // Actualiza la contraseña en la base de datos
    await pool.query(
      "UPDATE usuarios SET contrasena = $1 WHERE correo = $2",
      [hashedPassword, decoded.correo]
    );

    res.json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "El token ha expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Token inválido" });
    }
    console.error("Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
