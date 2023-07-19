import Vue from 'vue'
import {createPinia, PiniaVuePlugin} from 'pinia'
import App from './App.vue'
import ElementUI from 'element-ui'

import store from './store'
import axios from './utils/request'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/css/global.css'
import './plugins/element.js'
import './utils/tokenUtils.js'
import './utils/request.js'

import websocket from "@/utils/websocket";

Vue.prototype.$axios = axios
Vue.prototype.$websocket = websocket
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(PiniaVuePlugin)

const pinia = createPinia()
new Vue({
    router, store, render: h => h(App), pinia
}).$mount('#app')