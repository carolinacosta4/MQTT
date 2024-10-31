<template>
  <div id="general">
    <div id="left">
      <img class="logo" src="../assets/logo.svg" alt="">
      <h2 class="green" v-if="queueStore.selectedRoute">Atendente - Gerenciamento de {{ queueStore.selectedRoute }}</h2>
      <div class="row space-between">
        <h2 class="green">Services</h2>
        <div class="row">
          <img class="icon" src="../assets/user.svg" alt="">
          <p class="text"> {{ total }}</p>
        </div>
      </div>



      <ul v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        <li v-for="client in queueStore.sectors[queueStore.selectedRoute].clients" :key="client">{{ client }}</li>
      </ul>
      <!-- tirar isso daqui -->

      <div id="servicesList">
        <div class="row space-between paddingLR"
          v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
          <p class="paddingLeft green">
            Internacional
          </p>
          <div class="row">
            <img class="icon" src="../assets/user.svg" alt="">
            <p> {{ queueStore.sectors.internacional.clients.length }}</p>
          </div>
        </div>

        <hr class="servicesList">


        <div class="row space-between paddingLR"
          v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
          <p class="paddingLeft green">
            Secretaria
          </p>
          <div class="row">
            <img class="icon" src="../assets/user.svg" alt="">
            <p> {{ queueStore.sectors.secretaria.clients.length }}</p>
          </div>
        </div>

        <hr class="servicesList">


        <div class="row space-between paddingLR"
          v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
          <p class="paddingLeft green">
            Direção
          </p>
          <div class="row">
            <img class="icon" src="../assets/user.svg" alt="">
            <p> {{ queueStore.sectors.direcao.clients.length }}</p>
          </div>
        </div>

        <hr class="servicesList">

        <div class="row space-between paddingLR"
          v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
          <p class="paddingLeft green">
            CPR
          </p>
          <div class="row">
            <img class="icon" src="../assets/user.svg" alt="">
            <!-- <p> {{ queueStore.sectors.centro-producao-recursos.clients.length }}</p> -->
            <p>0</p>
          </div>
        </div>

        <hr class="servicesList">

        <div class="row space-between paddingLR"
          v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
          <p class="paddingLeft green">
            Biblioteca
          </p>
          <div class="row">
            <img class="icon" src="../assets/user.svg" alt="">
            <p> {{ queueStore.sectors.biblioteca.clients.length }}</p>
          </div>
        </div>

        <hr class="servicesList">

        <div class="row space-between paddingLR"
          v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
          <p class="paddingLeft green">
            Serviços ação social
          </p>
          <div class="row">
            <img class="icon" src="../assets/user.svg" alt="">
            <!-- <p> {{ queueStore.sectors.servicos-acao-social.clients.length }}</p> -->
            <p>0</p>
          </div>
        </div>
      </div>

      <button id="finishServiceButton">Finish service</button>
    </div>

    <div id="right">
      <div id="ticketForm">
        <div id="upperPartTicket" class="centerPadding3">
          <p class="grey font-wheight-600 text">Current ticket</p>
          <p class="currentTicketNumber"
            v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
            {{ queueStore.sectors[queueStore.selectedRoute].currentTicket }}
          </p>
          <h2 class="green">{{ queueStore.selectedRoute }}</h2>
        </div>

        <div id="divider">
          <span class="dot"></span>
          <hr>
          <span class="dot"></span>
        </div>

        <div id="bottomPartTicket" class="centerPadding4">
          <div id="minorButtons">
            <button id="cancelButton" class="minorActionButton font-wheight-700">Cancel</button>
            <button class="minorActionButton font-wheight-700">Recall</button>
          </div>
          <button id="nextTicketButton" class="font-wheight-700" v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]"
            @click="queueStore.callNextTicket(queueStore.selectedRoute)"
            :disabled="!queueStore.sectors[queueStore.selectedRoute].clients.length">
            Next ticket
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { useQueueStore } from '@/stores/queueStore';

export default {
  data() {
    return {
      queueStore: useQueueStore(),
    }
  },

  mounted() {
    if (!this.queueStore.connected) this.queueStore.connect();
    const route = this.$route.params.service;

    if (route) {
      this.queueStore.subscribeToClients(route);
      this.queueStore.selectedRoute = route;
      this.queueStore.fetchQueueDataPerService(route)
    }
  },

  beforeUnmount() {
    this.queueStore.disconnect();
  },

  created() {
    this.queueStore.fetchQueueDataPerService(this.$route.params.service);
    this.queueStore.fetchTotalUsers();
    this.queueStore.fetchQueueData();
  },

  computed: {
    serviceQueue() {
      return this.queueStore.getClients
    },

    total() {
      return this.queueStore.getTotal
    },

    lastTicket() {
      return this.queueStore.getLastTicketCalled
    },

    status() {
      return this.queueStore.status
    },

    queueData(){
      return this.queueStore.getData
    }
  },

  methods: {
    async finishService() {
      await this.queueStore.finishService(this.queueStore.selectedRoute);
    },

    async startService() {
      await this.queueStore.startService(this.queueStore.selectedRoute);
    }
  },

  watch: {
    serviceQueue() {
      this.queueStore.fetchQueueDataPerService(this.queueStore.selectedRoute);
    },

    queueData() {
      this.queueStore.fetchQueueData();
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: "Karla";
  /* font-style: normal; */
  /* font-weight: 400; */
  src: url(https://fonts.gstatic.com/s/karla/v31/qkB9XvYC6trAT55ZBi1ueQVIjQTD-JrIH2G7nytkHRyQ8p4wUjm6bnEr.woff2) format('woff2');
}

* {
	font-family: "Karla", sans-serif;
}

:root {
  background-color: #307e69 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

body,
html {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
p{
  font-size: 18px;
}

#general {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#left {
  width: 25%;
  background-color: #E7E8E3;
  padding: 2%;
}

#right {
  width: 75%;
  background-color: #307E69;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

img.logo {
  max-width: 50px;
  max-height: 50px;
  margin-left: 40%;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.space-between {
  display: flex;
  justify-content: space-between;
}

.icon {
  max-width: 20px;
  max-height: 20px;
  margin-right: 8px;
}

.text {
  font-size: 22px;
}

.grey {
  color: #949983;
}

.green {
  color: #307E69;
}

.font-wheight-600{
  font-weight: 600;
}

.font-wheight-700{
  font-weight: 700;
}

#ticketForm {
  background-color: #ffffff;
  border-radius: 1.5em;
  margin: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.currentTicketNumber {
  color: #307e69;
  font-size: 80px;
  font-weight: 900;
  padding: 0;
  margin: 0;
}

#divider {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-top: 2%;
  padding-bottom: 6%;
  margin-left: -24px;
  margin-right: -24px;
}

.dot {
  height: 25px;
  width: 25px;
  background-color: #307e69;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
}

hr {
  border: none;
  border-top: 6px dotted #307E69;
  width: 25vw;
}

.centerPadding3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 8%;
  width: 85%;
}

.centerPadding4 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-left: 8%;
  padding-right: 8%;
  padding-bottom: 8%;
  width: 85%;
}

#minorButtons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

#nextTicketButton {
  width: 100%;
  padding: 4%;
  border: none;
  border-radius: 10px;
  background-color: #307E69;
  color: white;
  margin-top: 5%;
  font-size: 18px;
}

#cancelButton {
  color: red;
}

#servicesList {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: white;
  border-radius: 10px;
  padding-top: 1%;
  padding-bottom: 1%;
}


hr.servicesList {
  border: none;
  border-top: 1px solid #E7E8E3;
  width: 100%;
}

.paddingLR {
  padding-left: 2em;
  padding-right: 2em;
}

#finishServiceButton {
  padding: 4%;
  width: 100%;
  border: none;
  border-radius: 100px;
  background-color: red;
  color: white;
  margin-top: 8%;
  font-weight: 700;
  font-size: 18px;
}

.minorActionButton {
  background-color: #E7E8E3;
  border-radius: 10px;
  border: none;
  color: #307E69;
  width: 48%;
  padding: 4%;
  font-size: 18px;
}
</style>