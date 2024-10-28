import mqtt from "mqtt";

class MqttService {
  constructor() {
    this.client = null;
  }

  connect() {
    // const brokerUrl = 'wss://test.mosquitto.org:8081';
    const brokerUrl = "ws://broker.hivemq.com:8000/mqtt";
    this.client = mqtt.connect(brokerUrl);

    this.client.on("connect", () => {
      console.log("Conectado ao broker Eclipse Mosquitto");
    });

    this.client.on("error", (error) => {
      console.error("Erro de conexão:", error);
    });

    this.client.on("message", (topic, message) => {
      console.log(
        `Mensagem recebida: ${message.toString()} no tópico: ${topic}`
      );
    });
  }

  subscribe(topic, callback) {
    if (this.client) {
      this.client.subscribe(topic, (error) => {
        if (!error) {
          console.log(`Inscrito no tópico: ${topic}`);
        }
      });
      this.client.on("message", (msgTopic, message) => {
        if (msgTopic === topic) {
          callback(message.toString());
        }
      });
    }
  }

  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message);
      console.log(`Mensagem enviada: ${message} para o tópico: ${topic}`);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      console.log("Desconectado do broker MQTT");
    }
  }
}

export default new MqttService();
