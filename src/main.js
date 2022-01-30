import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import './assets/styles/index.css'
import './assets/styles/icons.css'
createApp(App).use(router).use(store).mount('#app')