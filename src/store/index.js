import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 判断是否绑定邮箱
    bindMailbox: false,
  },
  getters: {},
  mutations: {
    SET_SHOW(state, item) {
      state.bindMailbox = true
    },
  },
  actions: {},
  modules: {},
})
