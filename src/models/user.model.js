import pool from "../config/database.js";
import bcrypt from "bcryptjs";

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

class User {
  // Buscar usuario por correo
  static async findByEmail(email) {
    const query = "SELECT * FROM usuarios WHERE correo = $1 AND estado = true";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Buscar usuario por cédula
  static async findByCedula(cedula) {
    const query = "SELECT * FROM usuarios WHERE cedula = $1 AND estado = true";
    const result = await pool.query(query, [cedula]);
    return result.rows[0];
  }

  // Crear nuevo usuario
  static async create(userData) {
    const { cedula, nombre, apellido, correo, telefono } = userData;

    const contrasena = generatePassword(); // Genera una contraseña

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuarios 
        (cedula, nombre, apellido, correo, telefono, contrasena)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING cedula, nombre, apellido, correo, telefono, es_administrador, fecha_creacion, estado, tiene_vehiculo
    `;

    const values = [cedula, nombre, apellido, correo, telefono, hashedPassword];

    const result = await pool.query(query, values);
    // Incluye la contraseña generada en la respuesta
    return {
      ...result.rows[0],
      generatedPassword: contrasena,
    };
  }

  // Actualizar usuario
  static async update(cedula, userData) {
    const { nombre, apellido, correo, telefono } = userData;

    const query = `
      UPDATE usuarios 
      SET nombre = $1, apellido = $2, correo = $3, telefono = $4
      WHERE cedula = $5 AND estado = true
      RETURNING cedula, nombre, apellido, correo, telefono, es_administrador, fecha_creacion, estado
    `;

    const values = [nombre, apellido, correo, telefono, cedula];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Cambiar contraseña
  static async updatePassword(cedula, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query =
      "UPDATE usuarios SET contrasena = $1, debe_cambiar_contrasena = FALSE WHERE cedula = $2 AND estado = true";
    await pool.query(query, [hashedPassword, cedula]);
  }

  // Obtener todos los usuarios activos
  static async findAll() {
    const query = `
      SELECT cedula, nombre, apellido, correo, telefono, es_administrador, fecha_creacion, estado
      FROM usuarios 
      WHERE estado = true 
      ORDER BY fecha_creacion DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Soft delete de usuario
  static async delete(cedula) {
    const query =
      "UPDATE usuarios SET estado = false WHERE cedula = $1 AND estado = true";
    const result = await pool.query(query, [cedula]);
    return result.rowCount > 0;
  }

  // Verificar contraseña
  static async verifyPassword(hashedPassword, plainPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateTieneVehiculo(cedula, tieneVehiculo) {
    const query =
      "UPDATE usuarios SET tiene_vehiculo = $1 WHERE cedula = $2 AND estado = true";
    await pool.query(query, [tieneVehiculo, cedula]);
  }
}

export default User;
