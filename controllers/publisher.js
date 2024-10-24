const mqttService = require("../service/mqttService");

// Change this to point to your MQTT broker
const MQTT_HOST_NAME = "mqtt://mqtt.eclipseprojects.io:1883";

var mqttClient = new mqttService(MQTT_HOST_NAME);
mqttClient.connect();


//Página Padrão Publisher ------------------------

exports.getPublisherPage = async function (req, res) {
  try {
    res.render("pages/publisher");
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.publishMQTTMessage = async function (req, res) {
  try {
    const topic = req.body.topic;
    const message = req.body.message;

    console.log(`Request Topic :: ${topic}`);
    console.log(`Request Message :: ${message}`);

    mqttClient.publish(topic, message, {});
    res
      .status(200)
      .json({ status: "200", message: "Sucessfully published MQTT Message" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
//-------------------------------

//Página Internacional-----------------------------

exports.getInternationalPublisherPage = (req, res) => {
  try {
    // Renderiza a mesma página de publisher, mas com o tópico fixo 'internacional'
    res.render("pages/publisher", { topic: "internacional" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.publishInternationalMessage = (req, res) => {
  const message = req.body.message;
  // O tópico será sempre 'internacional' aqui
  publishMessage("internacional", message);
  res.redirect("/publisher/internacional");  // Redireciona de volta à página internacional
};
//------------------------------------------------

// Página Secretaria ------------------------

exports.getSecretariaPublisherPage = (req, res) => {
  try {
    // Renderiza a mesma página de publisher, mas com o tópico fixo 'secretaria'
    res.render("pages/publisher", { topic: "secretaria" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.publishSecretariaMessage = (req, res) => {
  const message = req.body.message;
  // O tópico será sempre 'secretaria' aqui
  publishMessage("secretaria", message);
  res.redirect("/publisher/secretaria");  // Redireciona de volta à página secretaria
};
//---------------------------


//Página Direção ---------------------------
exports.getDirecaoPublisherPage = (req, res) => {
  try {
    // Renderiza a mesma página de publisher, mas com o tópico fixo 'direcao'
    res.render("pages/publisher", { topic: "direcao" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};


exports.publishDirecaoMessage = (req, res) => {
  const message = req.body.message;
  // O tópico será sempre 'direcao' aqui
  publishMessage("direcao", message);
  res.redirect("/publisher/direcao");  // Redireciona de volta à página direcao
};
//---------------------------------



//Página CPR ---------------------------
exports.getCprPublisherPage = (req, res) => {
  try {
    // Renderiza a mesma página de publisher, mas com o tópico fixo 'cpr'
    res.render("pages/publisher", { topic: "cpr" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};


exports.publishCprMessage = (req, res) => {
  const message = req.body.message;
  // O tópico será sempre 'cpr' aqui
  publishMessage("cpr", message);
  res.redirect("/publisher/cpr");  // Redireciona de volta à página cpr
};
//---------------------------------



//Página Biblioteca ---------------------------
exports.getBibliotecaPublisherPage = (req, res) => {
  try {
    // Renderiza a mesma página de publisher, mas com o tópico fixo 'biblioteca'
    res.render("pages/publisher", { topic: "biblioteca" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};


exports.publishBibliotecaMessage = (req, res) => {
  const message = req.body.message;
  // O tópico será sempre 'biblioteca' aqui
  publishMessage("biblioteca", message);
  res.redirect("/publisher/biblioteca");  // Redireciona de volta à página biblioteca
};
//---------------------------------
