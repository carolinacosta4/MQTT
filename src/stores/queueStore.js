import { defineStore } from "pinia";
import mqttService from "@/services/mqttService";
import * as api from "../api/api";

const API_BASE_URL = "http://127.0.0.1:3000";

export const useQueueStore = defineStore("queueStore", {
  state: () => ({
    connected: false,
    sectors: {
      internacional: { clients: [], currentTicket: 0, status: "open" },
      secretaria: { clients: [], currentTicket: 0, status: "open" },
      direcao: { clients: [], currentTicket: 0, status: "open" },
      "centro-producao-recursos": {
        clients: [],
        currentTicket: 0,
        status: "open",
      },
      biblioteca: { clients: [], currentTicket: 0, status: "open" },
      "servicos-acao-social": { clients: [], currentTicket: 0, status: "open" },
    },
    selectedRoute: "",
    currentClientTicket: "",
    isSubscribed: false,
    queueService: [],
    totalUsers: 0,
    lastTicketCalled: 0,
    status: null,
    queueData: {}
  }),

  getters: {
    getData: (state) => state.queueData,
    getClients: (state) => state.queueService,
    getTotal: (state) => state.totalUsers,
    getLastTicketCalled: (state) => state.lastTicketCalled,
    getStatus: (state) => state.status,
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
      } catch (error) {
        console.error(error);
      }
    },

    async callNextTicket(route) {
      try {
        const response = await api.post(API_BASE_URL, `tickets/call`, {
          route: route,
        });
        this.sectors[route].currentTicket = response.nextTicket;
        const topic = `fila/${route}/senha_atual`;
        mqttService.publish(topic, response.nextTicket.toString());
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

    async fetchQueueData() {
      try {
        const response = await api.get(API_BASE_URL, `tickets`);
        this.queueData = response
        
        return response;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchQueueDataPerService(route) {
      try {
        const response = await api.get(API_BASE_URL, `tickets/${route}`);
        this.queueService = response.clients;
        this.lastTicketCalled = response.lastTicket;
        this.status = response.status;
        this.sectors[route].clients = response.clients;
        this.sectors[route].currentTicket = response.lastTicket;
        this.sectors[route].status = response.status;
        return response;
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

    async leaveQueue(route, ticketNumber) {
      try {
        const response = await api.post(
          API_BASE_URL,
          `tickets/leaveQueue/${route}`,
          {
            ticketNumber: ticketNumber,
          }
        );

        const topic = `fila/${route}/senha_atual`;
        mqttService.unsubscribe(topic);
        this.isSubscribed = false;
        this.selectedRoute = "";
        this.currentClientTicket = "";

        return response;
      } catch (error) {
        console.error(error);
      }
    },

    async finishService(route) {
      try {
        const response = await api.remove(
          API_BASE_URL,
          `tickets/finishService/${route}`
        );
        this.sectors[route].status = 'closed'
        return response;
      } catch (error) {
        console.error(`Erro ao finalizar o serviço para ${route}:`, error);
      }
    },

    async startService(route) {
      try {
        const response = await api.post(
          API_BASE_URL,
          `tickets/startService/${route}`
        );
        this.sectors[route].status = 'open'

        return response;
      } catch (error) {
        console.error(`Erro ao finalizar o serviço para ${route}:`, error);
      }
    },
  },
});
