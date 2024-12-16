import pool from "../config/database.js";

class HuellaDactilar {
  // Buscar huella por ID de usuario y vehículo
  static async findByUserAndVehicle(usuarioCedula, vehiculoId) {
    const query =
      "SELECT * FROM huellas_dactilares WHERE usuario_cedula = $1 AND vehiculo_id = $2 AND estado = true";
    const result = await pool.query(query, [usuarioCedula, vehiculoId]);
    return result.rows[0];
  }

  // Crear nueva huella dactilar
  static async create(huellaData) {
    const { usuario_cedula, vehiculo_id, datos_huella, nombre_huella } =
      huellaData;

    const query = `
      INSERT INTO huellas_dactilares (usuario_cedula, vehiculo_id, datos_huella, nombre_huella)
      VALUES ($1, $2, $3, $4)
      RETURNING id, usuario_cedula, vehiculo_id, datos_huella, nombre_huella, estado, fecha_registro
    `;

    const values = [usuario_cedula, vehiculo_id, datos_huella, nombre_huella];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener todas las huellas activas
  static async findAll() {
    const query =
      "SELECT * FROM huellas_dactilares WHERE estado = true ORDER BY fecha_registro DESC";
    const result = await pool.query(query);
    return result.rows;
  }

  // Soft delete de huella dactilar
  static async delete(id) {
    const query =
      "UPDATE huellas_dactilares SET estado = false WHERE id = $1 AND estado = true";
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
}

export default HuellaDactilar;
