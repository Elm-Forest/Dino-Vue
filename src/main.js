import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../src/assets/css/global.css'
import store from './store'
import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import './plugins/element.js'
import './utils/tokenUtils.js'
import './utils/request.js'
import axios from './utils/request'
window.$vueApp.config.globalProperties.$axios = axios
window.$vueApp.config.globalProperties.$path =
  window.$vueApp.config.globalProperties.$axios
window.$vueApp.use(ElementUI)

window.$vueApp = Vue.createApp(App)
window.$vueApp.mount('#app')
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
window.$vueApp.use(store)
window.$vueApp.use(router)
