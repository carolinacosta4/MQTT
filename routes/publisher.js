const express = require("express");
const router = express.Router();

var publisherController = require("../controllers/publisher");

// Publisher Home Route.
router.get("/", publisherController.getPublisherPage);

//Publish message
router.post("/", publisherController.publishMQTTMessage);

// I N T E R N A C I O N A I S

//-----------------------------------------

// Rota nova para Publishers Internacionais
router.get("/internacional", publisherController.getInternationalPublisherPage);

// Publica sempre com o tópico 'internacional'
router.post("/internacional", publisherController.publishInternationalMessage);



//-------------------------------------------

    // S E C R E T A R I A 

//----------------------------------------------

// Rota nova para Publishers Secretaria
router.get("/secretaria", publisherController.getSecretariaPublisherPage);

// Publica sempre com o tópico 'Secretaria'
router.post("/secretaria", publisherController.publishSecretariaMessage);



//--------------------------------------------

    // D I R E Ç Ã O

//---------------------------------------------

// Rota nova para Publishers "Direção"
router.get("/direcao", publisherController.getDirecaoPublisherPage);

// Publica sempre com o tópico 'Direção'
router.post("/direcao", publisherController.publishDirecaoMessage);



//--------------------------------------------

    // C P R

//--------------------------------------------

// Rota nova para Publishers "cpr"
router.get("/cpr", publisherController.getCprPublisherPage);

// Publica sempre com o tópico 'cpr'
router.post("/cpr", publisherController.publishCprMessage);



//--------------------------------------------

    // B I B L I O T E C A

//--------------------------------------------

// Rota nova para Publishers "biblioteca"
router.get("/biblioteca", publisherController.getBibliotecaPublisherPage);

// Publica sempre com o tópico 'biblioteca'
router.post("/biblioteca", publisherController.publishBibliotecaMessage);

//--------------------------------------------



module.exports = router;

