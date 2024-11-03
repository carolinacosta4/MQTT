import { createRouter, createWebHistory } from 'vue-router'
import ClienteView from '../views/Client.vue'
import AtendenteView from '../views/Atendent.vue'
import AtendenteChooseView from '../views/AtendenteChooseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cliente',
      name: 'cliente',
      component: ClienteView
    },
    {
      path: '/atendente/:service',
      name: 'atendenteService',
      component: AtendenteView
    },
    {
      path: '/atendente',
      name: 'atendente',
      component: AtendenteChooseView
    }
  ]
})

export default router
