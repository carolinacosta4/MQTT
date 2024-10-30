<template>
  <div v-if="!queueStore.isSubscribed">
    <div class="client-div-unsubscribed">
      <img src="@/assets/logo.svg" class="logo" />
      <h2 class="title">Select a service</h2>
      <div class="all-routes">
        <div v-for="route in queueData">
          <button @click="selectRoute(route.name)" class="single-route" v-if="route.status == 'open'">
            {{ route.name }}
          </button>
          <button @click="selectRoute(route.name)" class="single-route disabled" disabled v-else>
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
  <div v-else class="client-div-subscribed">
    <p v-if="queueStore.isSubscribed" class="your-ticket-label">Your ticket</p>
    <p v-if="queueStore.isSubscribed" class="your-ticket">
      {{ formattedClientTicket }}
    </p>
    <p v-if="queueStore.isSubscribed" class="selected-route">
      {{ formattedRouteName }}
    </p>
    <p v-if="queueStore.isSubscribed" class="current-ticket-label">
      Current ticket
    </p>
    <p v-if="queueStore.isSubscribed" class="current-ticket">
      {{ formattedCurrentTicket }}
    </p>
    <p v-if="queueStore.isSubscribed" class="dotted">
      ---------------------------------
    </p>
    <button v-if="queueStore.isSubscribed" @click="leaveQueue()" class="exit-button">
      Exit Line
    </button>
    <p class="client-turn" v-if="formattedCurrentTicket == formattedClientTicket">
      IT'S YOUR TURN!!
    </p>
    <p v-if="queueStore.isSubscribed">
      <img src="@/assets/logo.svg" class="logo" />
    </p>
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

    queueData(){
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

<style>
:root {
  background-color: #307e69 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
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

.client-div-unsubscribed {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
}

.logo {
  width: 5rem;
  padding-bottom: 3rem;
  text-align: center;
}

.title {
  color: #e7e8e3;
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
  background-color: #e7e8e3;
  color: #307e69;
  border: 0;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.disabled {
  background-color: #cccccc;
  color: #8a8a8a;
  cursor: not-allowed;
  opacity: 0.6;
}

.client-div-subscribed {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  background-color: #ffffff;
  border-radius: 1rem;
  width: 35rem;
  /* height: 45rem; */
}

.your-ticket-label {
  padding-top: 3rem;
  color: #949983;
}

.your-ticket {
  font-size: 4rem;
  color: #20595f;
  margin: 0;
  font-weight: bolder;
}

.selected-route {
  color: #20595f;
  font-size: 1.3rem;
}

.current-ticket-label {
  color: #949983;
  margin-bottom: 0;
  font-size: 14px;
}

.current-ticket {
  font-size: 1.2rem;
  color: #20595f;
  margin-top: 0.5em;
  font-weight: bold;
}

.dotted {
  font-size: 2rem;
  color: #20595f;
}

.exit-button {
  color: #d20505;
  background-color: #e7e8e3;
  border: 0;
  width: 12rem;
  min-height: 3rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.client-turn {
  font-size: 1.2rem;
  color: #20595f;
}
</style>
