import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Splitbee from '@splitbee/web';

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// splitbee prd
Splitbee.init({
    token: import.meta.env.VITE_SPLITBEE_TOKEN,
    // disableCookie: false,
    // scriptUrl: "https://cdn.splitbee.io/sb.js",
});

app.config.globalProperties.$splitbee = Splitbee;

app.mount('#app')
