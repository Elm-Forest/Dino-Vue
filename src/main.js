import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '../src/assets/css/global.css'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import './utils/tokenUtils.js'
import './utils/request.js'
import axios from './utils/request'
Vue.prototype.$axios=axios
Vue.prototype.$path=Vue.prototype.$axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')