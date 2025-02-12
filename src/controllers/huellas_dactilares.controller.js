import HuellasDactilares from "../models/huellas_dactilares.model.js";
import { publishMessage, subscribeToTopic } from "../config/mqtt.config.js";
import pool from "../config/database.js";

// Mapa temporal para almacenar fragmentos de imágenes
const imageBuffer = new Map();

export const registrarHuella = async (req, res) => {
  try {
    const {
      id_esp32,
      id_huella,
      nombre_persona,
      dedo,
      usuario_cedula,
      vehiculo_id,
    } = req.body;

    // Verificar si la huella ya existe en la base de datos
    const existingHuella = await HuellasDactilares.findByIdEsp32AndHuella(
      id_esp32,
      id_huella
    );
    if (existingHuella) {
      return res
        .status(400)
        .json({ error: "La huella ya está registrada en esta placa." });
    }

    // Publicar mensaje a la ESP32 para iniciar el registro
    const topic = `sistema/${id_esp32}/huella/registrar`;
    const message = JSON.stringify({ id_huella, nombre_persona, dedo });
    publishMessage(topic, message);
    console.log("📤 Mensaje publicado para registrar huella:", message);

    const responseTopic = `sistema/${id_esp32}/huella/respuesta`;
    const imageTopic = `sistema/${id_esp32}/huella/imagen`;

    let responded = false;

    // Establecer un tiempo de espera de 10 segundos
    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(504).json({ error: "No se recibió respuesta de la ESP32." });
      }
    }, 10000);

    // Escuchar la respuesta de la ESP32
    subscribeToTopic(responseTopic, async (receivedMessage) => {
      if (responded) return;
      responded = true;
      clearTimeout(timeout);

      const parsedMessage = JSON.parse(receivedMessage);

      if (
        parsedMessage.id_huella === id_huella &&
        parsedMessage.status === "success"
      ) {
        console.log("✅ Huella registrada en la ESP32. Esperando imagen...");

        // Reiniciar buffer de imagen para esta huella
        imageBuffer.set(id_huella, { fragments: [], timeout: null });

        // Manejar la recepción de fragmentos de imagen
        subscribeToTopic(imageTopic, async (imageMessage) => {
          const imageData = JSON.parse(imageMessage);

          if (imageData.id_huella !== id_huella) return; // Ignorar fragmentos de otras huellas

          // Almacenar fragmento en el buffer
          const bufferEntry = imageBuffer.get(id_huella);
          if (bufferEntry) {
            bufferEntry.fragments.push(imageData.fragmento);

            // Reiniciar el temporizador para el ensamblado final
            if (bufferEntry.timeout) clearTimeout(bufferEntry.timeout);

            bufferEntry.timeout = setTimeout(async () => {
              console.log(`📸 Ensamblando imagen de huella ID ${id_huella}...`);

              // Concatenar los fragmentos en una sola cadena Base64
              const fullImageBase64 = bufferEntry.fragments.join("");

              // Guardar la huella en la base de datos con la imagen completa
              const nuevaHuella = await HuellasDactilares.create({
                id_esp32,
                id_huella,
                nombre_persona,
                dedo,
                usuario_cedula,
                vehiculo_id,
                imagen: fullImageBase64, // Guardar imagen ensamblada en Base64
              });

              console.log("✅ Imagen ensamblada y guardada en la BD.");
              res.status(201).json({
                message:
                  "Huella registrada en la ESP32 y guardada en la base de datos con imagen.",
                data: nuevaHuella,
              });

              // Eliminar buffer de imagen para evitar consumo de memoria
              imageBuffer.delete(id_huella);
            }, 2000); // Esperar 2 segundos para asegurar que se reciban todos los fragmentos
          }
        });
      } else {
        res.status(500).json({
          error: "Error al registrar la huella en la ESP32.",
          details: parsedMessage,
        });
      }
    });
  } catch (error) {
    console.error("❌ Error al registrar huella:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error en el servidor." });
    }
  }
};
/*
export const registrarHuella = async (req, res) => {
  try {
    const {
      id_esp32,
      id_huella,
      nombre_persona,
      dedo,
      usuario_cedula,
      vehiculo_id,
    } = req.body;

    // Verificar si ya existe la huella para esta placa e ID
    const existingHuella = await HuellasDactilares.findByIdEsp32AndHuella(
      id_esp32,
      id_huella
    );

    if (existingHuella) {
      return res
        .status(400)
        .json({ error: "La huella ya está registrada en esta placa." });
    }

    // Tópico para registrar huella en la ESP32
    const topic = `sistema/${id_esp32}/huella/registrar`;
    const message = JSON.stringify({ id_huella, nombre_persona, dedo });
    const responseTopic = `sistema/${id_esp32}/huella/respuesta`;

    // Publicar mensaje al tópico MQTT
    publishMessage(topic, message);
    console.log("Mensaje publicado para registrar huella:", message);

    // Escuchar el tópico de respuesta por un tiempo limitado
    const timeout = setTimeout(() => {
      res.status(504).json({ error: "No se recibió respuesta de la ESP32." });
    }, 10000); // 10 segundos de espera

    subscribeToTopic(responseTopic, async (receivedMessage) => {
      clearTimeout(timeout); // Cancelar el temporizador si se recibe respuesta
      const parsedMessage = JSON.parse(receivedMessage);

      // Validar que la respuesta corresponde al ID de huella enviado
      if (
        parsedMessage.id_huella === id_huella &&
        parsedMessage.status === "success"
      ) {
        // Guardar la huella en la base de datos
        const nuevaHuella = await HuellasDactilares.create({
          id_esp32,
          id_huella,
          nombre_persona,
          dedo,
          usuario_cedula,
          vehiculo_id,
        });

        res.status(201).json({
          message:
            "Huella registrada en la ESP32 y guardada en la base de datos.",
          data: nuevaHuella,
        });
      } else {
        res.status(500).json({
          error: "Error al registrar huella en la ESP32.",
          details: parsedMessage,
        });
      }
    });
  } catch (error) {
    console.error("Error al registrar huella:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};
*/
export const eliminarHuella = async (req, res) => {
  try {
    const { id_esp32, id_huella } = req.params;

    // Eliminar huella de la base de datos
    const deleted = await HuellasDactilares.deleteByIdEsp32AndHuella(
      id_esp32,
      id_huella
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "No se encontró la huella en la base de datos." });
    }

    // Publicar al tópico MQTT para eliminar huella en la placa
    const topic = `sistema/${id_esp32}/huella/eliminar`;
    const message = JSON.stringify({ id_huella });
    publishMessage(topic, message);

    res.status(200).json({ message: "Huella eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar huella:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

// Obtener huellas dactilares de un vehículo
export const getHuellasByVehiculo = async (req, res) => {
  try {
    // Consulta para obtener las huellas del vehícu
    const { vehiculo_id } = req.params;
    console.log(req.params);
    const huellas = await HuellasDactilares.findByVehiculo(vehiculo_id);
    if (huellas.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron huellas para este vehículo." });
    }

    res.status(200).json(huellas);
  } catch (error) {
    console.error("Error al obtener huellas:", error);
    res
      .status(500)
      .json({ message: "Error al obtener las huellas del vehículo." });
  }
};
