let mqttClient;

window.addEventListener("load", (event) => {
  connectToBroker();

  const subscribeBtn = document.querySelector("#subscribe");
  subscribeBtn.addEventListener("click", function () {
    subscribeToTopic();
  });

  const unsubscribeBtn = document.querySelector("#unsubscribe");
  unsubscribeBtn.addEventListener("click", function () {
    unsubscribeFromTopic();
  });
});

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);
  const host = "ws://mqtt.eclipseprojects.io:80/mqtt"; // Endereço do broker MQTT

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(host, options);

  mqttClient.on("error", (err) => {
    console.error("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected: " + clientId);
  });

  // Recebendo mensagens
  mqttClient.on("message", (topic, message, packet) => {
    console.log("Received Message: " + message.toString() + "\nOn topic: " + topic);
    const messageTextArea = document.querySelector("#message");
    messageTextArea.value += `${message}\r\n`;
  });
}

function subscribeToTopic() {
  const status = document.querySelector("#status");
  const topic = document.querySelector("#topic").value.trim();

  if (topic === "") {
    alert("Por favor, selecione um tópico antes de se inscrever.");
    return;
  }

  console.log(`Subscribing to Topic: ${topic}`);

  mqttClient.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error(`Failed to subscribe to ${topic}:`, err);
      status.style.color = "red";
      status.value = `ERROR: ${err.message}`;
    } else {
      status.style.color = "green";
      status.value = "SUBSCRIBED";
    }
  });
}

function unsubscribeFromTopic() {
  const status = document.querySelector("#status");
  const topic = document.querySelector("#topic").value.trim();

  if (topic === "") {
    alert("Por favor, selecione um tópico antes de cancelar a inscrição.");
    return;
  }

  console.log(`Unsubscribing from Topic: ${topic}`);

  mqttClient.unsubscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error(`Failed to unsubscribe from ${topic}:`, err);
      status.style.color = "red";
      status.value = `ERROR: ${err.message}`;
    } else {
      status.style.color = "red";
      status.value = "UNSUBSCRIBED";
    }
  });
}
