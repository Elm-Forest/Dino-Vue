import * as Vue from 'vue'
import * as Vuex from 'vuex'

export default Vuex.createStore({
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
