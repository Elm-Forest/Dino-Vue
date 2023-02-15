<template>
  <div id="loginBox">
    <el-card class="box-card" style="width: 400px">
      <h1 id="login-title">个人信息</h1>
      <div style="height: 30px;"></div>
      <el-form id="form" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.name" placeholder="真实姓名" :style="width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item prop="sex">
            <el-select v-model="loginForm.sex" placeholder="请选择性别" :style="width">
              <el-option key=1 label="男" value=1></el-option>
              <el-option key=0 label="女" value=0></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-phone" v-model="loginForm.phone" placeholder="联系方式" :style="width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="address">
          <el-input prefix-icon="el-icon-s-cooperation" v-model="loginForm.address" placeholder="居住地址"
                    :style="width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="createDept" style="width: 100px">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      width: 'width: 250px',
      loginForm: {
        name: '',
        sex: '',
        address: '',
        phone: '',
      }
    }
  },
  methods: {
    createDept() {
      const this_vue = this;
      const sex = this.loginForm.sex;
      this.$axios({
        method: 'put',
        url: '/user/userinfo',
        params: {
          'name': this.loginForm.name,
          'sex': sex,
          'phone': this.loginForm.phone,
          'address': this.loginForm.address,
        }
      }).then(function (response) {
        var flag = false;
        this_vue.$axios({
          method: 'get',
          url: '/user/entry',
        }).then(e => {
          if (e.data.status === 1) {
            flag = true;
            if (e.data.rights === 1) {
              this_vue.$router.push('/normal');
              this_vue.$message({
                message: '提交成功！欢迎您，部门员工',
                type: 'success'
              });
            }
            if (e.data.rights >= 2) {
              this_vue.$router.push('/admin');
              this_vue.$message({
                message: '提交成功！欢迎您，部门管理员',
                type: 'success'
              });
            }
          } else {
            if (response.flag) {
              this_vue.$message({
                message: "提交成功！您尚未加入企业，请先加入企业！",
                type: 'success'
              });
              this_vue.$router.push({path: '/offer'})
            } else {
              this_vue.$message({
                message: response.message,
                type: 'warning'
              });
            }
          }
        });
        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        console.log(localStorage.getItem('token'))
        console.log(error);
      })
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
  top: 20%;
  left: 37%;
}

#login-title {
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
}

#form {
  line-height: 60px;
  padding-left: 55px;
  padding-right: 55px;
}
</style>