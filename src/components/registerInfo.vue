<template>
  <div id="loginBox">
    <el-card class="box-card">
      <h1 id="login-title">个人资料</h1>
      <div style="height: 20px"></div>
      <el-form id="form" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="name">
          <el-input
            :prefix-icon="ElIconUserSolid"
            v-model="loginForm.name"
            placeholder="姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex">
          <el-input
            :prefix-icon="ElIconDataBoard"
            v-model="loginForm.sex"
            placeholder="性别"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            :prefix-icon="ElIconPhone"
            v-model="loginForm.phone"
            placeholder="联系方式"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="address">
          <el-input
            :prefix-icon="ElIconSCooperation"
            v-model="loginForm.address"
            placeholder="常住地地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="createDept">提交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  UserSolid as ElIconUserSolid,
  DataBoard as ElIconDataBoard,
  Phone as ElIconPhone,
  SCooperation as ElIconSCooperation,
} from '@element-plus/icons'
export default {
  data() {
    return {
      loginForm: {
        name: '',
        sex: '',
        address: '',
        phone: '',
      },
      ElIconUserSolid,
      ElIconDataBoard,
      ElIconPhone,
      ElIconSCooperation,
    }
  },
  name: 'Login',
  methods: {
    createDept() {
      const this_vue = this
      const sex = this.loginForm.sex
      this.$axios({
        method: 'put',
        url: '/user/userinfo',
        params: {
          name: this.loginForm.name,
          sex: [{ 女: 0, 男: 1 }][0].sex,
          phone: this.loginForm.phone,
          address: this.loginForm.address,
        },
      })
        .then(function (response) {
          var flag = false
          this_vue
            .$axios({
              method: 'get',
              url: '/user/entry',
            })
            .then((e) => {
              if (e.data.status === 1) {
                flag = true
                if (e.data.rights === 1) {
                  this_vue.$router.push('/normal')
                  this_vue.$message({
                    message: '提交成功！欢迎您，部门员工',
                    type: 'success',
                  })
                }
                if (e.data.rights >= 2) {
                  this_vue.$router.push('/admin')
                  this_vue.$message({
                    message: '提交成功！欢迎您，部门管理员',
                    type: 'success',
                  })
                }
              } else {
                if (response.flag) {
                  this_vue.$message({
                    message: '提交成功！您尚未加入企业，请先加入企业！',
                    type: 'success',
                  })
                  this_vue.$router.push({ path: '/offer' })
                } else {
                  this_vue.$message({
                    message: response.message,
                    type: 'warning',
                  })
                }
              }
            })
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    requestOffer() {
      this.$router.push({ path: '/offer' })
    },
  },
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
