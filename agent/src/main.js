import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { ensureInitialized } from './services/persist'
import './styles/global.css'

ensureInitialized()

createApp(App).use(createPinia()).use(router).mount('#app')
