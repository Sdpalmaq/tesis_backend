import pool from "../config/database.js";

class ConfiguracionSistema {
  // Registrar una nueva placa ESP32
  static async create(id_esp32, descripcion = null) {
    const query = `
      INSERT INTO configuraciones_sistema (id_esp32, descripcion, asociado)
      VALUES ($1, $2, FALSE)
      RETURNING id_esp32, descripcion, asociado, created_at
    `;
    const values = [id_esp32, descripcion];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener información de una placa ESP32 por su ID
  static async findById(id_esp32) {
    const query = `
      SELECT id_esp32, descripcion, asociado, created_at
      FROM configuraciones_sistema
      WHERE id_esp32 = $1
    `;
    const result = await pool.query(query, [id_esp32]);
    return result.rows[0];
  }

  // Obtener todas las placas ESP32 registradas
  static async findAll() {
    const query = `
      SELECT id_esp32, descripcion, asociado, created_at
      FROM configuraciones_sistema
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Asociar una placa ESP32 con un vehículo
  static async associate(id_esp32, descripcion) {
    const query = `
      UPDATE configuraciones_sistema
      SET descripcion = $1, asociado = TRUE
      WHERE id_esp32 = $2
      RETURNING id_esp32, descripcion, asociado
    `;
    const result = await pool.query(query, [descripcion, id_esp32]);
    return result.rows[0];
  }

  // Eliminar una placa ESP32
  static async delete(id_esp32) {
    const query = `
      DELETE FROM configuraciones_sistema
      WHERE id_esp32 = $1
    `;
    const result = await pool.query(query, [id_esp32]);
    return result.rowCount > 0;
  }
}

export default ConfiguracionSistema;
