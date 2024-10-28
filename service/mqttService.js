const mqtt = require("mqtt");

class MQTTService {
  constructor(host, messageCallback) {
    this.mqttClient = null;
    this.host = host;
    this.messageCallback = messageCallback;

    // Queue management for each topic and user
    this.topicQueues = {};
  }

  connect() {
    this.mqttClient = mqtt.connect(this.host);

    // MQTT Callback for 'error' event
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // MQTT Callback for 'connect' event
    this.mqttClient.on("connect", () => {
      console.log(`MQTT client connected`);
    });

    // Call the message callback function when a message arrives
    this.mqttClient.on("message", (topic, message) => {
      console.log(message.toString());
      if (this.messageCallback) this.messageCallback(topic, message);
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT client disconnected`);
    });
  }

  // Publish MQTT Message
  publish(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }

  // Subscribe to MQTT Topic with Queue System
  subscribeWithQueue(topic, userId, options) {
    // Initialize topic queue if it doesn't exist
    if (!this.topicQueues[topic]) {
      this.topicQueues[topic] = {};
    }

    // Initialize user queue number if it doesn't exist
    if (!this.topicQueues[topic][userId]) {
      this.topicQueues[topic][userId] = 0;
    }

    // Increment the user's queue number for the specific topic
    this.topicQueues[topic][userId] += 1;
    const queueNumber = this.topicQueues[topic][userId];

    this.mqttClient.subscribe(topic, options, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${topic}:`, err);
        return;
      }

      console.log(
        `User ${userId} subscribed to ${topic}, Queue number: ${queueNumber}`
      );

      // Send the queue number as the message to the topic
      this.publish(
        topic,
        `Your number in the queue is: ${queueNumber} (User ID: ${userId})`
      );
    });
  }

  // Subscribe to MQTT Message (without queue)
  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}

module.exports = MQTTService;
