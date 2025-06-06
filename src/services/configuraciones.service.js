// services/configuraciones.service.js
import pool from "../config/database.js";

export async function crearConfiguracionSiNoExiste(data) {
  const { id_esp32, descripcion, asociado } = data;

  if (!id_esp32) return { error: "id_esp32 faltante" };

  const { rows } = await pool.query(
    "SELECT * FROM configuraciones_sistema WHERE id_esp32 = $1",
    [id_esp32]
  );

  if (rows.length === 0) {
    await pool.query(
      "INSERT INTO configuraciones_sistema (id_esp32, descripcion, asociado) VALUES ($1, $2, $3)",
      [id_esp32, descripcion || "", asociado ?? false]
    );
    return { creado: true };
  }

  return { creado: false };
}
