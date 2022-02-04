import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index';
import ChatApp from '../views/ChatApp.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'ChatApp',
    component: ChatApp,
    beforeEnter: (to, from, next) => {
      if (to.name !== 'Login' && !store.state.user) next({ name: 'Login' });
      else next();
    },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
  {
    path: '/:id',
    name: 'ChatAppID',
    component: ChatApp,
    beforeEnter: (to, from, next) => {
      if (to.name !== 'Login' && !store.state.user) next({ name: 'Login' });
      else next();
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (to.name == 'Login' && !store.state.user) next();
      else next({ name: 'ChatApp' });
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
