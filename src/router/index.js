import { createRouter, createWebHistory } from 'vue-router'
import ClientView from '../views/Client.vue'
import AtendentView from '../views/Atendent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/client',
      name: 'client',
      component: ClientView
    },
    {
      path: '/atendent/:service',
      name: 'atendent',
      component: AtendentView
    }
  ]
})

export default router
