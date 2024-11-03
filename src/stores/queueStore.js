import { defineStore } from "pinia";
import mqttService from "@/services/mqttService";
import * as api from "../api/api";

const API_BASE_URL = "http://127.0.0.1:3000";

export const useQueueStore = defineStore("queueStore", {
  state: () => ({
    connected: false,
    sectors: {
      internacional: { currentTicket: 0 },
      secretaria: { currentTicket: 0 },
      direcao: { currentTicket: 0 },
      "centro-producao-recursos": { currentTicket: 0 },
      biblioteca: { currentTicket: 0 },
      "servicos-acao-social": { currentTicket: 0 },
    },
    currentClientTicket: "",
    queueService: [],
    lastTicketCalled: 0,
    queueData: {},
    status: null,
    serviceData: {}
  }),

  getters: {
    getData: (state) => state.queueData,
    getClients: (state) => state.queueService,
    getLastTicketCalled: (state) => state.lastTicketCalled,
    getStatus: (state) => state.status,
    getServiceData: (state) => state.serviceData
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
      try {
        const response = await api.post(API_BASE_URL, `tickets/issue`, {
          route: route,
        });

        const clientTicket = response.ticketNumber;
        this.currentClientTicket = clientTicket;
        const topic = `fila/${route}/senha_atual`;
        mqttService.subscribe(topic, (message) => {
          this.sectors[route].currentTicket = parseInt(message);
        });
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
      } catch (error) {
        console.error(error);
      }
    },

    async fetchQueueData() {
      try {
        const response = await api.get(API_BASE_URL, `tickets`);
        this.queueData = response;
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
        this.serviceData = response
        this.sectors[route].currentTicket = response.lastTicket;
        return response;
      } catch (error) {
        console.error(error);
      }
    },

    subscribeToClients(route) {
      const clientTopic = `fila/${route}/senha_cliente`;
      mqttService.subscribe(clientTopic, (message) => {
        this.sectors[route].clients.push(parseInt(message));
      });
    },

    async leaveQueue(route, ticketNumber) {
      try {
        const response = await api.remove(
          API_BASE_URL,
          `tickets/leaveQueue/${route}/${ticketNumber}`
        );

        const topic = `fila/${route}/senha_atual`;
        mqttService.unsubscribe(topic);
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
        return response;
      } catch (error) {
        console.error(`Erro ao finalizar o serviço para ${route}:`, error);
      }
    },
  },
});
