<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>邮箱账户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bagBox">
      <div class="mailBox">
        <div class="boxT">
          <div class="text">邮箱:</div>
          <input
            type="text"
            name=""
            id=""
            v-model="mailAccountForm.email"
            placeholder="请输入邮箱,目前仅支持qq邮箱和网易邮箱"
          />
        </div>
        <div class="boxT">
          <div class="text">授权码:</div>
          <input
            type="text"
            name=""
            id=""
            v-model="mailAccountForm.password"
            placeholder="请输入授权码"
          />
        </div>
        <div class="boxT">
          <div class="text">验证码:</div>
          <input
            type="text"
            name=""
            id=""
            v-model="mailAccountForm.code"
            placeholder="请输入验证码"
          />
          <div class="but" @click="send">发送</div>
        </div>
        <div class="boxT">
          <el-button type="primary" size="mini" @click="checkS">绑定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mailAccountForm: {
        email: '',
        password: '',
        code: '',
      },
    }
  },
  mounted() {
    this.$axios.get('/message/mail/account/check').then((response) => {
      if (response.data != null) {
        this.$store.commit('SET_SHOW')
        this.mailAccountForm.email = response.data
      }
    })
  },
  methods: {
    checkS() {
      var this_vue = this
      this.$axios({
        method: 'post',
        url: '/message/mail/account',
        params: {
          email: this.mailAccountForm.email,
          password: this.mailAccountForm.password,
          type: this.getType(this.mailAccountForm.email),
          code: this.mailAccountForm.code,
        },
      })
        .then(function (response) {
          if (response.flag) {
            this_vue.$store.commit('SET_SHOW')
            alert('邮箱绑定成功')
          } else {
            alert(response.message)
            console.log(JSON.stringify(response.data))
          }
        })
        .catch(function (error) {
          alert('切换邮箱失败')
          console.log(error)
        })
    },
    send() {
      const this_vue = this
      this.$axios({
        method: 'post',
        url: '/message/mail/send',
        params: {
          email: this.mailAccountForm.email,
          password: this.mailAccountForm.password,
          type: this.getType(this.mailAccountForm.email),
        },
      })
        .then(function (response) {
          this_vue.$message({
            message: '发送成功！',
            type: 'success',
          })
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          this_vue.$message({
            message: '发送失败！',
            type: 'error',
          })
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    getType(email) {
      if (email == null || email === '') {
        return 0
      }
      var str = email.substring(email.indexOf('@') + 1, email.length)
      if (str === 'qq.com') {
        return 1
      } else if (str === '163.com') {
        return 2
      } else {
        return 0
      }
    },
  },
}
</script>

<style scoped>
.bagBox {
  width: 100%;
  height: 100%;
  display: flex;
}
.mailBox {
  width: 480px;
  height: 260px;
  border-radius: 12px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.boxT {
  width: 80%;
  height: 40px;
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
}
.text {
  color: black;
  display: block;
}
.boxT input {
  display: block;
  width: 70%;
  height: 25px;
  font-size: 13px;
  border-radius: 10px;
  color: rgb(103, 98, 98);
  padding-left: 12px;
  border: 0.5px solid #666;
}
.but {
  position: absolute;
  right: -35px;
  width: 40px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background-color: rgb(204, 202, 202);
  font-size: 12px;
  color: white;
  border-radius: 12px;
}
.el-breadcrumb {
  margin-bottom: 180px;
}
</style>
