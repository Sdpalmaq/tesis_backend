import pool from "../config/database.js";

class ConfiguracionSistema {
  
  static async registrarESP32(idEsp32, ipAddress, ssid) {
    const query = `
      INSERT INTO configuraciones_sistema (clave, valor, descripcion)
      VALUES ('id_esp32', $1, 'Identificador ESP32'),
             ('ip_address', $2, 'Dirección IP'),
             ('ssid', $3, 'Red Wi-Fi')
      ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor
      RETURNING *;
    `
    const result = await pool.query(query, [idEsp32, ipAddress, ssid]);
    return result.rows;
  }

  // Obtener configuración por clave
  static async findByKey(clave) {
    const query = "SELECT * FROM configuraciones_sistema WHERE clave = $1";
    const result = await pool.query(query, [clave]);
    return result.rows[0];
  }

  // Crear o actualizar configuración
  static async upsert(clave, valor, descripcion = null) {
    const query = `
      INSERT INTO configuraciones_sistema (clave, valor, descripcion)
      VALUES ($1, $2, $3)
      ON CONFLICT (clave) 
      DO UPDATE SET valor = EXCLUDED.valor, descripcion = EXCLUDED.descripcion
      RETURNING id, clave, valor, descripcion
    `;
    const result = await pool.query(query, [clave, valor, descripcion]);
    return result.rows[0];
  }

  // Obtener todas las configuraciones
  static async findAll() {
    const query = "SELECT * FROM configuraciones_sistema ORDER BY clave";
    const result = await pool.query(query);
    return result.rows;
  }
}

export default ConfiguracionSistema;
