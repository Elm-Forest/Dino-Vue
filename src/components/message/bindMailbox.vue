<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>邮箱账户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row type="flex" justify="center" style="margin-top: 10%">
      <el-col :span="12">
        <el-card>
          <el-form ref="form" :model="mailAccountForm" label-width="80px" style="margin-top: 5%">
            <el-form-item label="邮箱" style="width: 88%">
              <el-input v-model="mailAccountForm.email"></el-input>
            </el-form-item>

            <el-form-item label="授权码" style="width: 88%">
              <el-input v-model="mailAccountForm.password"></el-input>
            </el-form-item>

            <el-form-item label="验证码">
              <el-col :span="16" style="margin-right: 16px">
                <el-input v-model="mailAccountForm.code"></el-input>
              </el-col>
              <el-button @click="send">发送</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="bindEmail" style="margin-left: 32%">绑定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>

<script>
export default {
  data() {
    return {
      mailAccountForm: {
        email: '',
        password: '',
        code: ''
      },
    }
  },
  mounted() {
    this.$axios.get('/message/mail/account/check').then(response => {
      if (response.data != null) {
        this.$store.commit('SET_SHOW');
        this.mailAccountForm.email = response.data;
      }
    })
  },
  methods: {
    bindEmail() {
      let this_vue = this;
      this.$axios({
        method: 'post',
        url: '/message/mail/account',
        params: {
          'email': this.mailAccountForm.email,
          'password': this.mailAccountForm.password,
          'type': this.getType(this.mailAccountForm.email),
          'code': this.mailAccountForm.code
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$store.commit('SET_SHOW');
          this_vue.$message({
            message: '邮箱绑定成功！',
            type: 'success'
          });
        } else {
          alert(response.message)
          console.log(JSON.stringify(response.data));
        }
      }).catch(function (error) {
        this_vue.$message({
          message: '邮箱绑定成功！',
          type: 'error'
        });
        console.log(error);
      })
    },
    send() {
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/message/mail/send',
        params: {
          'email': this.mailAccountForm.email,
          'password': this.mailAccountForm.password,
          'url': this.getType(this.mailAccountForm.email)
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: '发送成功！',
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: '表单填写错误！',
            type: 'error'
          });
        }

        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        this_vue.$message({
          message: '发送失败！',
          type: 'error'
        });
        console.log(localStorage.getItem('token'))
        console.log(error);
      })
    },
    getType(email) {
      if (email == null || email === "") {
        return 0;
      }
      var str = email.substring(email.indexOf('@') + 1, email.length)
      if (str === 'qq.com') {
        return 1;
      } else if (str === '163.com') {
        return 2
      } else {
        return 0;
      }
    }
  }
}
</script>

<style scoped>

</style>
