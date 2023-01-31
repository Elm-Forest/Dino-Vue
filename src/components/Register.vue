<template>
  <div>
    <img id="register" src="../images/background.png" alt="" />
    <!-- 跳转登录区域 -->
    <div id="circle"></div>
    <div id="goto">
      <div>
        <h3>已有账号？</h3>
        <h5>立即登录已有账号，享受独家权益。</h5>
      </div>
      <el-button round id="myButton" @click="gotolo">去登录</el-button>
    </div>
    <!-- 注册框区域 -->
    <div id="login">
      <el-card class="box-card">
        <h1 id="login-title">注册</h1>
        <el-form
          id="form"
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerFormRules"
        >
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model:value="registerForm.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              prefix-icon="el-icon-message"
              v-model:value="registerForm.email"
              placeholder="请输入邮箱"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="yzcode"
            style="
              display: flex;
              justify-content: space-between;
              flex-direction: row;
            "
          >
            <el-input
              style="width: 190px"
              prefix-icon="el-icon-edit"
              v-model:value="registerForm.yzcode"
              placeholder="请输入验证码"
              clearable
            ></el-input>
            <el-button @click="send">发送验证码</el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              v-model:value="registerForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-button
            style="position: absolute; top: 300px; left: 137px"
            type="primary"
            @click="register"
            >立即注册
          </el-button>
        </el-form>
      </el-card>
    </div>
    <!-- 时间区域 -->
    <div id="clock">
      <div id="time">{{ time }}</div>
      <div id="date">{{ date }}</div>
    </div>
    <!-- 版权区域 -->
    <div id="copyright">
      copyright © 张晋铭 赵佳琪 李嘉超 李子涵 张良怡 李张弛
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      // 注册表单的数据绑定对象
      registerForm: {
        username: '',
        email: '',
        yzcode: '',
        password: '',
      },
      // 注册表单验证规则
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度应在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          {
            type: 'string',
            message: '邮箱格式不正确',
            trigger: 'blur',
            transform(value) {
              if (
                !/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
                  value
                )
              ) {
                return true
              } else {
              }
            },
          },
          {
            type: 'string',
            message: '长度应在 12 到 17 个字符',
            trigger: 'blur',
            ming: 12,
            max: 17,
          },
        ],
        yzcode: [
          { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度应为 6 个字符', trigger: 'blur' },
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
    send() {
      this.$axios({
        method: 'post',
        url: '/email/register',
        params: {
          email: this.registerForm.email,
        },
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    register() {
      var this_vue = this
      this.$axios({
        method: 'post',
        url: '/register',
        params: {
          username: this.registerForm.username,
          password: this.registerForm.password,
          email: this.registerForm.email,
          code: this.registerForm.yzcode,
        },
      })
        .then(function (response) {
          if (response.flag) {
            this_vue.$router.push({ path: '/login' })
            this_vue.$message({
              message: response.message,
              type: 'success',
            })
          } else {
            this_vue.$message({
              message: response.message,
              type: 'warning',
            })
          }
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    // 跳转到登录页面
    gotolo() {
      this.$router.push({ path: '/login' })
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
#register {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
#circle {
  width: 600px;
  height: 600px;
  background: rgb(230, 162, 173);
  border-radius: 0 0 0 600px;
  position: absolute;
  right: 0%;
}
#goto {
  color: aliceblue;
  position: absolute;
  top: 10%;
  right: 20%;
  text-align: center;
  line-height: 2.5;
}
#myButton {
  background-color: rgba(255, 255, 255, 0.4);
  width: 100px;
  color: aliceblue;
}
#login {
  position: absolute;
  top: 32%;
  right: 55%;
}
#login-title {
  text-align: center;
  margin-bottom: 0px;
  margin-top: 0px;
}
.el-card {
  width: 373px;
  height: 350px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 15px;
}
#form {
  line-height: 60px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
}
#sendBtn {
  position: absolute;
  left: 0;
}
.myYzcode .el-form-item__error {
  position: absolute;
  left: 20px;
}
#clock {
  color: aliceblue;
  position: absolute;
  top: 77%;
  right: 5%;
  text-align: right;
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
