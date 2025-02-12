import pool from "../config/database.js";

class HuellasDactilares {
  // Crear una nueva huella
  static async create(huellaData) {
    const {
      id_esp32,
      id_huella,
      nombre_persona,
      dedo,
      usuario_cedula,
      vehiculo_id,
      imagen
    } = huellaData;

    const query = `
      INSERT INTO huellas_dactilares (id_esp32, id_huella, nombre_persona, dedo, usuario_cedula, vehiculo_id, imagen)
      VALUES ($1, $2, $3, $4, $5, $6,$7)
      RETURNING *;
    `;
    const values = [
      id_esp32,
      id_huella,
      nombre_persona,
      dedo,
      usuario_cedula,
      vehiculo_id,
      imagen,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Verificar si existe una huella en una placa
  static async findByIdEsp32AndHuella(id_esp32, id_huella) {
    const query = `
      SELECT * FROM huellas_dactilares
      WHERE id_esp32 = $1 AND id_huella = $2;
    `;
    const result = await pool.query(query, [id_esp32, id_huella]);
    return result.rows[0];
  }

  // Eliminar una huella
  static async deleteByIdEsp32AndHuella(id_esp32, id_huella) {
    const query = `
      DELETE FROM huellas_dactilares
      WHERE id_esp32 = $1 AND id_huella = $2;
    `;
    const result = await pool.query(query, [id_esp32, id_huella]);
    return result.rowCount > 0;
  }

  // Obtener huellas por vehiculo
  static async findByVehiculo(vehiculo_id) {
    const query = `
      SELECT id_huella, nombre_persona, dedo, fecha_registro, id_esp32
      FROM huellas_dactilares
      WHERE vehiculo_id = $1
    `;
    const result = await pool.query(query, [vehiculo_id]);
    return result.rows;
  }
}

export default HuellasDactilares;
