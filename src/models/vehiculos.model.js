import pool from "../config/database.js";

class Vehiculo {
  // Buscar vehículo por placa
  static async findByPlaca(placa) {
    const query = "SELECT * FROM vehiculos WHERE placa = $1 AND estado = true";
    const result = await pool.query(query, [placa]);
    return result.rows[0];
  }

  // Crear nuevo vehículo
  static async create(vehiculoData) {
    const { placa, marca, modelo, anio, propietario_cedula } = vehiculoData;

    const query = `
      INSERT INTO vehiculos (placa, marca, modelo, anio, propietario_cedula, validado)
      VALUES ($1, $2, $3, $4, $5, false) -- Por defecto, no validado
      RETURNING id, placa, marca, modelo, anio, propietario_cedula, validado, estado, fecha_registro
    `;

    const values = [placa, marca, modelo, anio, propietario_cedula];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Actualizar vehículo
  static async update(id, vehiculoData) {
    const { placa, marca, modelo, anio, propietario_cedula } = vehiculoData;

    const query = `
      UPDATE vehiculos 
      SET placa = $1, marca = $2, modelo = $3, anio = $4, propietario_cedula = $5
      WHERE id = $6 AND estado = true
      RETURNING id, placa, marca, modelo, anio, propietario_cedula, estado, fecha_registro
    `;

    const values = [placa, marca, modelo, anio, propietario_cedula, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener todos los vehículos activos
  static async findAll() {
    const query = `
      SELECT * FROM vehiculos 
      WHERE estado = true 
      ORDER BY fecha_registro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Soft delete de vehículo
  static async delete(id) {
    const query =
      "UPDATE vehiculos SET estado = false WHERE id = $1 AND estado = true";
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // Validar o rechazar un vehículo
  static async validate(id, validado, comentarios_admin) {
    const query = `
      UPDATE vehiculos
      SET validado = $1, comentarios_admin = $2
      WHERE id = $3
      RETURNING id, placa, marca, modelo, anio, propietario_cedula, validado, comentarios_admin
    `;
    const values = [validado, comentarios_admin, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener vehículos pendientes de validación
  static async findPendingValidation() {
    const query = `
        SELECT * FROM vehiculos
        WHERE validado = false AND estado = true
      `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByPropietario(propietarioCedula) {
    const query = "SELECT * FROM vehiculos WHERE propietario_cedula = $1";
    const result = await pool.query(query, [propietarioCedula]);
    return result.rows;
  }
}

export default Vehiculo;
