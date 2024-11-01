<template>
  <div class="client-wrapper unsubscribed" v-if="!queueStore.isSubscribed">
    <div class="client-div-unsubscribed">
      <img src="@/assets/logo.png" class="logo" />
      <h2 class="title">Selecione um serviço</h2>
      <div class="all-routes">
        <div v-for="route in queueData">
          <button @click="selectRoute(route.code)" class="single-route" v-if="route.status == 'open'">
            {{ route.name }}
          </button>
          <button class="single-route disabled" disabled v-else>
            {{ route.name }}
          </button>
        </div>

        <!-- <div v-for="(route, key) in routes" :key="key">
          <button @click="selectRoute(route.key)"
            :class="['single-route', isServiceClosed(route.key) ? 'disabled' : '']"
            :disabled="isServiceClosed(route.key)">
            {{ route.name }}
          </button>
        </div> -->
      </div>
    </div>
  </div>
  <div v-else class="client-wrapper subscribed">
    <div class="client-div-subscribed">
      <p v-if="queueStore.isSubscribed" class="your-ticket-label grey font-wheight-600 text">Your ticket</p>
      <p v-if="queueStore.isSubscribed" class="your-ticket">
        {{ formattedClientTicket }}
      </p>
      <h2 v-if="queueStore.isSubscribed" class="selected-route">
        {{ formattedRouteName }}
      </h2>
      <p v-if="queueStore.isSubscribed" class="current-ticket-label">
        Current ticket
      </p>
      <p v-if="queueStore.isSubscribed" class="current-ticket">
        {{ formattedCurrentTicket }}
      </p>
      <div id="divider" v-if="queueStore.isSubscribed">
        <span class="dot"></span>
        <hr>
        <span class="dot"></span>
      </div>
      <button v-if="queueStore.isSubscribed" @click="leaveQueue()" class="exit-button">
        Exit Line
      </button>
      <p class="client-turn" v-if="formattedCurrentTicket == formattedClientTicket">
        IT'S YOUR TURN!!
      </p>
      <img src="@/assets/logo.png" class="logoSmall" v-if="queueStore.isSubscribed" />
    </div>
  </div>
</template>

<script>
import { useQueueStore } from "@/stores/queueStore";

export default {
  data() {
    return {
      queueStore: useQueueStore(),
      routes: [
        { key: "internacional", name: "Internacional", code: "A" },
        { key: "secretaria", name: "Secretaria", code: "B" },
        { key: "direcao", name: "Direção", code: "C" },
        { key: "centro-producao-recursos", name: "Centro de Produção e Recursos", code: "D" },
        { key: "biblioteca", name: "Biblioteca", code: "E" },
        { key: "servicos-acao-social", name: "Serviços de Ação Social", code: "F" },
      ],
    };
  },

  computed: {
    formattedClientTicket() {
      const selectedRoute = this.routes.find(
        (route) => route.key === this.queueStore.selectedRoute
      );
      const routeCode = selectedRoute ? selectedRoute.code : "";
      return `${routeCode}${this.queueStore.currentClientTicket
        .toString()
        .padStart(2, "0")}`;
    },

    formattedCurrentTicket() {
      const selectedRoute = this.routes.find(
        (route) => route.key === this.queueStore.selectedRoute
      );
      const routeCode = selectedRoute ? selectedRoute.code : "";
      const currentTicket = this.queueStore.sectors[this.queueStore.selectedRoute].currentTicket;
      return `${routeCode}${currentTicket.toString().padStart(2, "0")}`;
    },

    formattedRouteName() {
      return this.routes.find((route) => route.key === this.queueStore.selectedRoute).name
    },

    // lastTicket() {
    //   return this.queueStore.getLastTicketCalled
    //   // const selectedRoute = this.routes.find(
    //   //   (route) => route.key === this.queueStore.selectedRoute
    //   // );
    //   // const routeCode = selectedRoute ? selectedRoute.code : "";
    //   // return `${routeCode}${this.queueStore.getLastTicketCalled.toString().padStart(2, "0")}`;
    // },

    queueData() {
      return this.queueStore.getData
    }
  },

  methods: {
    selectRoute(routeKey) {
      this.queueStore.subscribeClient(routeKey);
      this.queueStore.selectedRoute = routeKey;
      this.queueStore.fetchQueueDataPerService(this.queueStore.selectedRoute);
    },

    leaveQueue() {
      this.queueStore.leaveQueue(this.queueStore.selectedRoute, this.queueStore.currentClientTicket)
    },

    // isServiceClosed(routeKey) {
    //   return this.queueData.
    //   return this.queueStore.sectors[routeKey]?.status !== 'open'
    // }
  },

  mounted() {
    if (!this.queueStore.connected) this.queueStore.connect();

    this.queueStore.fetchQueueData();

    this.routes.forEach((route) => {
      this.queueStore.fetchQueueDataPerService(route.key);
    });
  },

  beforeUnmount() {
    this.queueStore.disconnect();
  },

  watch: {
    queueData() {
      this.queueStore.fetchQueueData();
    },
  },
};
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

p {
  font-size: 18px;
}

.client-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unsubscribed {
  background-color: #f5f5f5;
}

.subscribed {
  background-color: #307e69;
}

.client-div-unsubscribed {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
}

.logo {
  max-width: 30%;
  max-height: 10%;
  text-align: center;
}

.logoSmall {
  max-width: 20%;
  max-height: 10%;
  padding: 2%;
}


.title {
  color: #307E69;
  text-align: center;
  margin-bottom: 5rem;
}

.all-routes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-content: center;
  text-align: center;
}

.single-route {
  width: 20rem;
  height: 4rem;
  padding: 1rem;
  margin: 1rem;
  background-color: #307E69;
  color: #E7E8E3;
  border: 0;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.disabled {
  background-color: #307E6960;
  color: #E7E8E3;
  cursor: not-allowed;
}

.client-div-subscribed {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 1.5em;
  /* width: 35rem; */
  /* height: 45rem; */
}

.your-ticket-label {
  padding-top: 3rem;
  color: #949983;
}

.your-ticket {
  color: #307e69;
  font-size: 80px;
  font-weight: 900;
  padding: 0;
  margin: 0;
}

.selected-route {
  color: #307e69;
  font-size: 1.3rem;
  text-align: center;
}

.current-ticket-label {
  color: #949983;
  margin-bottom: 0;
  margin-top: 2em;
}

.current-ticket {
  color: #949983;
  margin-top: 0.4em;
  font-size: 22px;
  font-weight: bolder;
}

.dotted {
  font-size: 2rem;
  color: #20595f;
}

.exit-button {
  color: #d20505;
  background-color: #e7e8e3;
  border: 0;
  width: 38%;
  min-height: 3rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  font-weight: 700;
  padding: 3%;
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

.font-wheight-600 {
  font-weight: 600;
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
  width: 30vw;
}

.client-turn {
  font-size: 1.2rem;
  color: #20595f;
}

button {

  font-size: 18px;

}
</style>
