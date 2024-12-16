import pool from "../config/database.js";

class RegistroAcceso {
  // Crear nuevo registro de acceso
  static async create(registroData) {
    const { usuario_cedula, vehiculo_id, tipo_acceso } = registroData;

    const query = `
      INSERT INTO registros_acceso (usuario_cedula, vehiculo_id, tipo_acceso, fecha_hora)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, usuario_cedula, vehiculo_id, tipo_acceso, fecha_hora
    `;

    const values = [usuario_cedula, vehiculo_id, tipo_acceso];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener todos los registros de acceso
  static async findAll() {
    const query = "SELECT * FROM registros_acceso ORDER BY fecha_hora DESC";
    const result = await pool.query(query);
    return result.rows;
  }

  // Obtener registros de acceso por ID de vehículo
  static async findByVehicleId(vehiculo_id) {
    const query = "SELECT * FROM registros_acceso WHERE vehiculo_id = $1 ORDER BY fecha_hora DESC";
    const result = await pool.query(query, [vehiculo_id]);
    return result.rows;
  }
}

export default RegistroAcceso;
