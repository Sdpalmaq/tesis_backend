import mqtt from "mqtt";
import pool  from "./database.js";
import { createConfiguracion } from "../controllers/configuraciones_sistema.controller.js"; // Importar controlador


// Configuración del cliente MQTT
const options = {
  host: "df6522c08e0b44129df99259929215a3.s1.eu.hivemq.cloud", // Cambiar por tu host MQTT
  port: 8883,
  protocol: "mqtts",
  username: "Sdpalmaq2", // Cambiar por tu usuario MQTT
  password: "St@0402003602", // Cambiar por tu contraseña MQTT
  reconnectPeriod: 5000, // Intentar reconexión cada 5 segundos
};

// Crear cliente MQTT
const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("✅ Conectado a MQTT");

  // Suscribirse a la configuración de ESP32
  client.subscribe("sistema/+/configuracion", (err) => {
    if (err) {
      console.error("❌ Error al suscribirse al tópico de configuración:", err);
    } else {
      console.log("✅ Suscrito a sistema/+/configuracion");
    }
  });
});

// Procesar mensajes recibidos en MQTT
client.on("message", async (topic, message) => {
  console.log(`📩 Mensaje recibido en ${topic}: ${message.toString()}`);

  try {
      const data = JSON.parse(message.toString());

      // Llamar a la función del controlador en lugar de hacer la consulta manualmente
      const req = { body: data };
      const res = {
          status: (code) => ({
              json: (response) => console.log(`📡 Respuesta del backend (${code}):`, response),
          }),
      };

      await createConfiguracion(req, res);

      // Enviar confirmación a la ESP32
      const responseTopic = `sistema/${data.id_esp32}/respuesta`;
      client.publish(responseTopic, JSON.stringify({ status: "success", id_esp32: data.id_esp32 }));

  } catch (error) {
      console.error("❌ Error procesando el mensaje de configuración de ESP32:", error);
  }
});

client.on("error", (error) => {
  console.error("Error en la conexión MQTT:", error);
});

client.on("reconnect", () => {
  console.log("Reconectando al servidor MQTT...");
});

client.on("close", () => {
  console.log("Conexión MQTT cerrada.");
});

// Publicar mensaje a un tópico
export const publishMessage = (topic, message) => {
  client.publish(topic, message, { qos: 1 }, (error) => {
    if (error) {
      console.error(`Error al publicar en el tópico ${topic}:`, error);
    } else {
      console.log(`Mensaje publicado en el tópico ${topic}:`, message);
    }
  });
};

export const sendNotification = (id_esp32, message) => {
  const topic = `sistema/${id_esp32}/notificaciones`;
  publishMessage(topic, JSON.stringify({ message }));
};

// Suscribirse a un tópico
export const subscribeToTopic = (topic, callback) => {
  client.subscribe(topic, { qos: 1 }, (error) => {
    if (error) {
      console.error(`Error al suscribirse al tópico ${topic}:`, error);
    } else {
      console.log(`Suscrito al tópico ${topic}`);
    }
  });

  client.on("message", (receivedTopic, message) => {
    if (receivedTopic === topic) {
      const parsedMessage = message.toString();
      console.log(`Mensaje recibido en el tópico ${topic}:`, parsedMessage);
      if (callback) callback(parsedMessage);
    }
  });
};

export default client;
