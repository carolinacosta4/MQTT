<template>
    <div class="client-wrapper">
        <div class="client-div-unsubscribed">
            <img src="@/assets/logo.png" class="logo" />
            <h2 class="title">Selecione um serviço</h2>
            <div class="all-routes">
                <div v-for="route in queueData" class="single-route">
                    <router-link :to="{ name: 'atendenteService', params: { service: route.code } }" class="link">
                        {{ route.name }}
                    </router-link>
                </div>
            </div>
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
    background-color: #f5f5f5;
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

.title {
    color: #307E69;
    text-align: center;
    margin-bottom: 5rem;
}

.all-routes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    align-content: center;
    text-align: center;
}

.single-route {
    width: 18rem;
    height: 2rem;
    padding: 1rem;
    margin: 1rem;
    background-color: #307E69;
    border: 0;
    border-radius: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.link {
    color: #E7E8E3;
    font-weight: bold;
    text-decoration: none;
    width: 20rem;
    margin: 1rem;
    background-color: #307E69;
    font-size: 18px;
}
</style>