const mqtt = require("mqtt");

let mqttClient;

// Change this to point to your MQTT broker or DNS name
const mqttHost = "mqtt.eclipseprojects.io";
const protocol = "mqtt";
const port = "1883";

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);

  // Change this to point to your MQTT broker
  const hostURL = `${protocol}://${mqttHost}:${port}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on("error", (err) => {
    console.error("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected: " + clientId);

    // Subscribe to a specific topic (you can change this to your desired topic)
    const topic = "your/topic"; // Change to your queue topic
    subscribeToTopic(topic);

    // Publish the clientId to the subscribed topic to request a queue number
    mqttClient.publish(topic, clientId);
  });

  // Received Message
  mqttClient.on("message", (topic, message) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
  });
}

function subscribeToTopic(topic) {
  console.log(`Subscribing to Topic: ${topic}`);

  mqttClient.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error(`Failed to subscribe to ${topic}:`, err);
    } else {
      console.log(`Successfully subscribed to ${topic}`);
    }
  });
}

connectToBroker();
