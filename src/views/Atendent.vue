<template>
  <div id="general">
    <div id="left">
      <img class="logo" src="../assets/logo.svg" alt="">
      <h2 v-if="queueStore.selectedRoute">Atendente - Gerenciamento de {{ queueStore.selectedRoute }}</h2>
      <div class="row space-between">
        <h2>Services</h2>
        <div class="row">
          <img class="icon" src="../assets/user.svg" alt="">
          <p class="text"> {{ total }}</p>
        </div>
      </div>



      <ul v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        <li v-for="client in queueStore.sectors[queueStore.selectedRoute].clients" :key="client">{{ client }}</li>
      </ul>
      <!-- tirar isso daqui -->


      <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in {{ queueStore.selectedRoute }}: {{ queueStore.sectors[queueStore.selectedRoute].clients.length
        }} <!-- esse -->
      </p>



      <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in internacional: {{ queueStore.sectors.internacional.clients.length }}
      </p>
      <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in secretaria: {{ queueStore.sectors.secretaria.clients.length }}
      </p>
      <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in direcao: {{ queueStore.sectors.direcao.clients.length }}
      </p>
      <!-- <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in CPR: {{ queueStore.sectors.centro-producao-recursos.clients.length }}
      </p> -->
      <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in biblioteca: {{ queueStore.sectors.biblioteca.clients.length }}
      </p>
      <!-- <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
        Total Clients in servicos-acao-social: {{ queueStore.sectors.servicos-acao-social.clients.length }}
      </p> -->
    </div>

    <div id="right">
      <div id="ticketForm">
        <div id="upperPartTicket" class="centerPadding3">
          <p class="grey text">Current ticket</p>
          <p class="currentTicketNumber"
            v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
            {{ queueStore.sectors[queueStore.selectedRoute].currentTicket }}
          </p>
          <h3>{{ queueStore.selectedRoute }}</h3>
        </div>

        <div id="divider">
          <span class="dot"></span>
          <hr>
          <span class="dot"></span>
        </div>

        <div id="bottomPartTicket" class="centerPadding3">
          <button v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]"
            @click="queueStore.callNextTicket(queueStore.selectedRoute)"
            :disabled="!queueStore.sectors[queueStore.selectedRoute].clients.length">
            Chamar Próxima Senha
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
      queueStore: useQueueStore()
    }
  },

  mounted() {
    if (!this.queueStore.connected) this.queueStore.connect();
    const route = this.$route.params.service;

    if (route) {
      this.queueStore.subscribeToClients(route);
      this.queueStore.selectedRoute = route;
    }
  },

  beforeUnmount() {
    this.queueStore.disconnect();
  },

  computed: {
    total() {
      return this.queueStore.getTotalTickets;
    },
  },
}
</script>

<style scoped>
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

#general {
  display: flex;
  flex-direction: row;
  height: 100%
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
  justify-self: center;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
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
  font-weight: 600;
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
  padding: 8%;
}
</style>