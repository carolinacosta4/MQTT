import { defineStore } from "pinia";
import mqttService from "@/services/mqttService";

export const useQueueStore = defineStore("queueStore", {
  state: () => ({
    connected: false,
    sectors: {
      internacional: { clients: [], currentTicket: 0 },
      secretaria: { clients: [], currentTicket: 0 },
      direcao: { clients: [], currentTicket: 0 },
      "centro-producao-recursos": { clients: [], currentTicket: 0 },
      biblioteca: { clients: [], currentTicket: 0 },
      "servicos-acao-social": { clients: [], currentTicket: 0 },
    },
    selectedRoute: "",
    currentClientTicket: "",
    isSubscribed: false,
    totalTicketsIssued: 0,
  }),

  getters: {
    getTotalTickets: (state) => state.totalTicketsIssued,
  },

  actions: {
    connect() {
      // mqttService.connect('wss://test.mosquitto.org:8081');
      mqttService.connect("ws://broker.hivemq.com:8000/mqtt");
      this.connected = true;
    },

    disconnect() {
      mqttService.disconnect();
      this.connected = false;
    },

    subscribeClient(route) {
      this.selectedRoute = route;
      const clientTopic = `fila/${route}/senha_cliente`;

      const clientTicket = this.sectors[route].clients.length + 1;
      this.currentClientTicket = clientTicket;
      mqttService.publish(clientTopic, clientTicket.toString());

      const topic = `fila/${route}/senha_atual`;
      mqttService.subscribe(topic, (message) => {
        this.sectors[route].currentTicket = parseInt(message);
      });

      this.isSubscribed = true;
      this.totalTicketsIssued += 1;
    },

    callNextTicket(route) {
      if (this.sectors[route].clients.length > 0) {
        this.sectors[route].currentTicket = this.sectors[route].clients[0];
        const topic = `fila/${route}/senha_atual`;
        mqttService.publish(
          topic,
          this.sectors[route].currentTicket.toString()
        );
        this.sectors[route].clients.shift();
      }
    },

    subscribeToClients(route) {
      this.selectedRoute = route;
      const clientTopic = `fila/${route}/senha_cliente`;
      mqttService.subscribe(clientTopic, (message) => {
        this.sectors[route].clients.push(parseInt(message));
      });
    },
  },
});
