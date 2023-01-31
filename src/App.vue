<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import retrievePassword from './components/retrievePassword.vue'

export default {
  name: 'App',
  data: function () {},
  methods: {},
  components: {
    Login: Login,
    Register: Register,
    retrievePassword: retrievePassword,
  },
}
</script>
