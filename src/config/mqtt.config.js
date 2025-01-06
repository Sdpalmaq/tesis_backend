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
