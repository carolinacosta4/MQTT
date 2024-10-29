<template>
  <div>
    <h2 v-if="queueStore.selectedRoute">Atendente - Gerenciamento de {{ queueStore.selectedRoute }}</h2>
    <button v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]"
      @click="queueStore.callNextTicket(this.$route.params.service)" :disabled="!serviceQueue.length">
      Chamar Próxima Senha
    </button>
    <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      Senha atual chamada na {{ queueStore.selectedRoute }}:
      {{ queueStore.sectors[queueStore.selectedRoute].currentTicket }}
    </p>
    <ul v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      <li v-for="client in serviceQueue" :key="client">{{ client }}</li>
    </ul>
    <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      Total Clients in {{ queueStore.selectedRoute }}: {{ serviceQueue.length }}
    </p>
    <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      Total Clients in NextIn: {{ total }}
    </p>
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
      this.queueStore.fetchQueueDataPerService(route)
    }
  },

  beforeUnmount() {
    this.queueStore.disconnect();
  },

  created() {
    this.queueStore.fetchQueueDataPerService(this.$route.params.service);
    this.queueStore.fetchTotalUsers()
  },

  computed: {
    total() {
      return this.queueStore.getTotalTickets;
    },

    serviceQueue() {
      return this.queueStore.getClients
    },

    total(){
      return this.queueStore.getTotal
    }
  },

  watch: {
    serviceQueue() {
      this.queueStore.fetchQueueDataPerService(this.queueStore.selectedRoute);
    },
  },
}
</script>
