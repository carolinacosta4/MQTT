import { defineStore } from "pinia";
import mqttService from "@/services/mqttService";
import * as api from "../api/api";

const API_BASE_URL = "http://127.0.0.1:3000";

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
    queueService: [],
    totalUsers: 0,
  }),

  getters: {
    getTotalTickets: (state) => state.totalTicketsIssued,
    getClients: (state) => state.queueService,
    getTotal: (state) => state.totalUsers,
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

    async subscribeClient(route) {
      this.selectedRoute = route;
      try {
        const response = await api.post(API_BASE_URL, `tickets/issue`, {
          route: route,
        });

        const clientTicket = response.ticketNumber;
        this.currentClientTicket = clientTicket;
        this.sectors[route].clients.push(clientTicket);

        const topic = `fila/${route}/senha_atual`;
        mqttService.subscribe(topic, (message) => {
          this.sectors[route].currentTicket = parseInt(message);
        });

        this.isSubscribed = true;
        this.totalTicketsIssued += 1;
      } catch (error) {
        console.error(error);
      }
    },

    async callNextTicket(route) {
      try {
        const response = await api.post(API_BASE_URL, `tickets/call`, {
          route: route,
        });

        const nextTicket = response.data.nextTicket;
        this.sectors[route].currentTicket = nextTicket;
        const topic = `fila/${route}/senha_atual`;
        mqttService.publish(topic, nextTicket.toString());
        this.sectors[route].clients.shift();
      } catch (error) {
        console.error(error);
      }
    },

    async fetchTotalUsers() {
      try {
        const response = await api.get(API_BASE_URL, `tickets`);
        for (const key in response) {
          this.totalUsers += response[key].clients.length;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async fetchQueueDataPerService(route) {
      try {
        const response = await api.get(API_BASE_URL, `tickets/${route}`);
        this.queueService = response.clients;
      } catch (error) {
        console.error(error);
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
