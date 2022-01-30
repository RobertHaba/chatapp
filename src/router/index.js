import { createRouter, createWebHistory } from 'vue-router'
import ChatApp from '../views/ChatApp.vue'
import Login from '../views/Login.vue'
const routes = [{
        path: '/',
        name: 'ChatApp',
        component: ChatApp
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router