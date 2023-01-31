<template>
  <div>
    <img id="login-container" src="../images/background.png" alt="" />
    <!-- 跳转注册区域 -->
    <div id="circle"></div>
    <div id="goto">
      <div>
        <h3>加入我们</h3>
        <h5>加入我们，成为本站的一份子。</h5>
      </div>
      <el-button round id="myButton" @click="toRegister">去注册</el-button>
    </div>
    <!-- 登录框区域 -->
    <div id="loginBox">
      <el-card class="box-card">
        <h1 id="login-title">登录</h1>
        <el-form
          id="form"
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
        >
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              v-model:value="loginForm.password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-link id="forgetPWD" @click="retrievePWD">忘记密码</el-link>
          <el-button type="primary" @click="login">立即登录</el-button>
        </el-form>
      </el-card>
    </div>
    <!-- 时间区域 -->
    <div id="clock">
      <div id="time">{{ time }}</div>
      <div id="date">{{ date }}</div>
    </div>
    <!-- 版权区域 -->
    <div id="copyright">Copyright © 2023 AutoOffice</div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: '',
      },
      // 登录表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度应在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度应在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      time: '',
      date: '',
    }
  },
  // 时间更新
  mounted() {
    this.$nextTick(() => {
      setInterval(this.update_clock, 1000)
    })
  },
  methods: {
    // 登录预验证
    login() {
      this.$refs.loginFormRef.validate(() => {
        const this_vue = this
        this.$axios({
          method: 'post',
          url: '/login',
          params: {
            username: this.loginForm.username,
            password: this.loginForm.password,
          },
        })
          .then(function (response) {
            if (response.flag === false) {
              this_vue.$router.push('/login')
              this_vue.$message({
                message: response.message,
                type: 'warning',
              })
            } else {
              localStorage.setItem('token', response.data)
              this_vue
                .$axios({
                  method: 'get',
                  url: '/user/entry',
                })
                .then(function (response) {
                  this_vue
                    .$axios({
                      method: 'get',
                      url: '/user/userinfo',
                    })
                    .then(function (e) {
                      if (e.data.name === null || e.data.name === '') {
                        this_vue.$router.push('/registerInfo')
                        this_vue.$message({
                          message: '您尚未填写资料',
                          type: 'warning',
                        })
                      } else {
                        if (response.data.status === 1) {
                          if (response.data.rights === 1) {
                            this_vue.$router.push('/normal')
                            this_vue.$message({
                              message: '欢迎您，部门员工',
                              type: 'success',
                            })
                          }
                          if (response.data.rights >= 2) {
                            this_vue.$router.push('/admin')
                            this_vue.$message({
                              message: '欢迎您，部门管理员',
                              type: 'success',
                            })
                          }
                        } else if (response.data.status === 0) {
                          this_vue.$router.push('/dept')
                          this_vue.$message({
                            message: '您尚未加入企业',
                            type: 'warning',
                          })
                        } else if (response.data.status === 2) {
                          this_vue.$router.push('/dept')
                          this_vue.$message({
                            message: '您已离职',
                            type: 'warning',
                          })
                        }
                      }
                    })
                    .catch(function (error) {
                      console.log(localStorage.getItem('token'))
                      console.log(error)
                    })

                  console.log(JSON.stringify(response.data))
                })
                .catch(function (error) {
                  console.log(error)
                })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    },
    // 跳转注册
    toRegister() {
      this.$router.push({ path: '/Register' })
    },
    // 跳转忘记密码
    retrievePWD() {
      this.$router.push({ path: '/retrievePassword' })
    },
    // 时间设置
    update_clock: function () {
      let d = new Date()
      let year = d.getFullYear()
      if (year < 10) {
        year = '0' + year
      }
      let month = d.getMonth() + 1 + ''
      if (month < 10) {
        month = '0' + month
      }
      let day = d.getDate() + ''
      if (day < 10) {
        day = '0' + day
      }
      let hour = d.getHours() + ''
      if (hour < 10) {
        hour = '0' + hour
      }
      let minute = d.getMinutes() + ''
      if (minute < 10) {
        minute = '0' + minute
      }
      let second = d.getSeconds() + ''
      if (second < 10) {
        second = '0' + second
      }
      this.time = hour + ':' + minute + ':' + second
      this.date = year + '/' + month + '/' + day
    },
  },
}
</script>

<style scoped>
#login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
#circle {
  width: 600px;
  height: 600px;
  background: rgb(6, 169, 214);
  border-radius: 0 0 600px 0;
  position: absolute;
  left: 0;
}
#goto {
  color: aliceblue;
  position: absolute;
  top: 10%;
  left: 20%;
  text-align: center;
  line-height: 2.5;
}
#myButton {
  background-color: rgba(255, 255, 255, 0.4);
  width: 100px;
  color: aliceblue;
}
#loginBox {
  position: absolute;
  top: 40%;
  left: 55%;
}
#login-title {
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
}
.el-card {
  width: 373px;
  height: 260px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
}
#form {
  line-height: 60px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
}
#forgetPWD {
  float: left;
  color: black;
  position: absolute;
  left: 10%;
  top: 72%;
  height: 30px;
}
#clock {
  color: aliceblue;
  position: absolute;
  top: 77%;
  left: 5%;
  text-align: left;
}
#time {
  font-size: 80px;
}
#date {
  font-size: 35px;
}
#copyright {
  color: aliceblue;
  position: absolute;
  top: 95%;
  left: 35%;
}
</style>
