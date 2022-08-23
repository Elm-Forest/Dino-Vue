<template>
  <div id="loginBox">
    <el-card class="box-card">
      <h1 id="login-title">创建企业</h1>
      <div style="height: 20px;"></div>
      <el-form id="form" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.name" placeholder="企业名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-phone" v-model="loginForm.phone" placeholder="联系方式"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="address">
          <el-input prefix-icon="el-icon-s-cooperation" v-model="loginForm.address" placeholder="企业地址"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="desc">
          <el-input prefix-icon="el-icon-data-board" v-model="loginForm.desc" placeholder="描述"
                    clearable></el-input>
        </el-form-item>
        <el-button @click="requestOffer">加入企业？</el-button>
        <!--        <el-link id="forgetPWD" @click="retrievePWD">加入企业</el-link>-->
        <el-button type="primary" style="flex: left;" @click="createDept">创建企业</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        name: '',
        phone: '',
        address: '',
        desc: ''
      }
    }
  },
  methods: {
    createDept() {
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/department/create',
        params: {
          'name': this.loginForm.name,
          'phone': this.loginForm.phone,
          'address': this.loginForm.address,
          'desc': this.loginForm.desc
        }
      }).then(function (response) {
        if (response.flag === false) {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        } else {
          this_vue.$router.push('/login');
          this_vue.$message({
            message: '创建成功！您的权限发生变化，需要重新登陆！',
            type: 'success'
          });
          this_vue.localStorage.removeItem('token');
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    requestOffer() {
      this.$router.push({path: '/offer'})
    },
  }
}
</script>

<style scoped>


#loginBox {
  position: absolute;
  top: 25%;
  left: 37%;
}

#login-title {
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
}

#form {
  line-height: 60px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
}
</style>