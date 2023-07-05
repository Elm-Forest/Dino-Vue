import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 判断是否绑定邮箱
        rights: 'super',
        bindMailbox: false,
        editForm: {
            title: "",
            contacts: {
                id: '',
                name: ''
            },
            description: "",
            file: ""
        },
        userId: '',
    },
    getters: {},
    mutations: {
        SET_SHOW(state, item) {
            state.bindMailbox = true;
        },
        SET_EDIT(state, item) {
            state.editForm = item
        },
        SET_ROOT_PATH(state, item) {
            state.rights = item
        },
        SET_USER_ID(state, item) {
            state.userId = item
        }
    },
    actions: {},
    modules: {}
})