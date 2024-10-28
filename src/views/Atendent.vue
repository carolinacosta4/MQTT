<template>
  <div>
    <h2 v-if="queueStore.selectedRoute">Atendente - Gerenciamento de {{ queueStore.selectedRoute }}</h2>
    <button 
      v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]"
      @click="queueStore.callNextTicket(queueStore.selectedRoute)" 
      :disabled="!queueStore.sectors[queueStore.selectedRoute].clients.length"
    >
      Chamar Próxima Senha
    </button>
    <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      Senha atual chamada na {{ queueStore.selectedRoute }}: 
      {{ queueStore.sectors[queueStore.selectedRoute].currentTicket }}
    </p>
    <ul v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      <li v-for="client in queueStore.sectors[queueStore.selectedRoute].clients" :key="client">{{ client }}</li>
    </ul>
    <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      Total Clients in {{ queueStore.selectedRoute }}: {{ queueStore.sectors[queueStore.selectedRoute].clients.length }}
    </p>
    <p v-if="queueStore.selectedRoute && queueStore.sectors[queueStore.selectedRoute]">
      Total Clients in secretaria: {{ queueStore.sectors.secretaria.clients.length }}
    </p>
    <p>{{ total }}</p>
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
