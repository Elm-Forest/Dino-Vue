<!-- 用于编写当前组件的结构代码 -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!-- 用于编写当前组件的业务代码 -->
<script>
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import retrievePassword from './components/retrievePassword.vue'

export default {
  name: 'App',
  data: function () {
  },
  methods: {},
  components: {
    Login: Login,
    Register: Register,
    retrievePassword: retrievePassword
  }
}
</script>

<!-- 用于编写当前组件的样式代码 -->
<style scoped>

</style>
