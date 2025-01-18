import mqtt from "mqtt";

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
  console.log("Conexión exitosa al servidor MQTT");
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
export const subscribeToTopic = (topicPattern, callback) => {
  client.subscribe(topicPattern, { qos: 1 }, (error) => {
    if (error) {
      console.error(`Error al suscribirse al tópico ${topicPattern}:`, error);
    } else {
      console.log(`Suscrito al tópico ${topicPattern}`);
    }
  });

  client.on("message", (receivedTopic, message) => {
    const regex = /^sistema\/([^/]+)\/notificaciones$/; // Regex para extraer id_esp32
    const match = regex.exec(receivedTopic);

    if (match) {
      const id_esp32 = match[1]; // Extraer id_esp32 del tópico
      try {
        const parsedMessage = JSON.parse(message.toString()); // Parsear mensaje JSON
        console.log(`Mensaje recibido desde ${id_esp32}:`, parsedMessage);

        if (callback) callback(parsedMessage, id_esp32); // Pasar id_esp32 al callback
      } catch (error) {
        console.error(`Error al procesar mensaje de ${id_esp32}:`, error);
      }
    } else {
      console.warn(
        `El tópico ${receivedTopic} no coincide con el patrón esperado.`
      );
    }
  });
};

export default client;
