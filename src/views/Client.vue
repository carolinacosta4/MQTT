<template>
    <div>
        <h2>Select a service</h2>
        <div v-if="!queueStore.isSubscribed">
            <h3>Selecione uma Rota:</h3>
            <div v-for="(route, key) in routes" :key="key">
                <button @click="selectRoute(route.key)">{{ route.name }}</button>
            </div>
        </div>
        <div v-else>
            <p v-if="queueStore.isSubscribed">Your ticket: {{ formattedClientTicket }}</p>
            <p v-if="queueStore.isSubscribed">Current ticket {{ queueStore.selectedRoute }}: {{ formattedCurrentTicket }}</p>
            <p v-if="formattedClientTicket == formattedCurrentTicket && queueStore.currentClientTicket != 0">
                IT'S YOUR TURN!!
            </p>
        </div>
    </div>
</template>

<script>
import { useQueueStore } from '@/stores/queueStore';

export default {
    data() {
        return {
            queueStore: useQueueStore(),
            routes: [
                { key: 'internacional', name: 'Internacional', code: 'A' },
                { key: 'secretaria', name: 'Secretaria', code: 'B' },
                { key: 'direcao', name: 'Direção', code: 'C' },
                { key: 'centro-producao-recursos', name: 'Centro de Produção e Recursos', code: 'D' },
                { key: 'biblioteca', name: 'Biblioteca', code: 'E' },
                { key: 'servicos-acao-social', name: 'Serviços de Ação Social', code: 'F' },
            ],
        }
    },

    computed: {
        formattedClientTicket() {
            const selectedRoute = this.routes.find(route => route.key === this.queueStore.selectedRoute);
            const routeCode = selectedRoute ? selectedRoute.code : '';
            return `${routeCode}${this.queueStore.currentClientTicket.toString().padStart(2, '0')}`;
        },

        formattedCurrentTicket() {
            const selectedRoute = this.routes.find(route => route.key === this.queueStore.selectedRoute);
            const routeCode = selectedRoute ? selectedRoute.code : '';
            return `${routeCode}${this.queueStore.sectors[this.queueStore.selectedRoute].currentTicket.toString().padStart(2, '0')}`;
        }
    },

    methods: {
        selectRoute(routeKey) {
            this.queueStore.subscribeClient(routeKey);
            this.queueStore.selectedRoute = routeKey;
        }
    },

    mounted() {
        if (!this.queueStore.connected) this.queueStore.connect();
    },

    beforeUnmount() {
        this.queueStore.disconnect();
    }
}
</script>
