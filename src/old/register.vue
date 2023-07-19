<template>
  <div>
    <img id="register" src="../assets/images/background.png" alt="">
    <!-- 跳转登录区域 -->
    <div id="circle"></div>
    <div id="goto">
      <div>
        <h3>已有账号？</h3>
        <h5>立即登录账号，开始高效办公之旅</h5>
      </div>
      <el-button round id="myButton" @click="login">去登录</el-button>
    </div>
    <!-- 注册框区域 -->
    <div id="login">
      <el-card class="box-card">
        <h1 id="login-title">注册</h1>
        <el-form id="form" ref="registerFormRef" :model="registerForm" :rules="rules">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="registerForm.username" placeholder="请输入用户名"
                      name="username" clearable></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input prefix-icon="el-icon-message" v-model="registerForm.email" placeholder="请输入邮箱"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-col :span="14" style="margin-right: 12px">
              <el-input
                  prefix-icon="el-icon-edit" v-model="registerForm.code" placeholder="请输入验证码"
                  clearable></el-input>
            </el-col>
            <el-col :span="6">
              <el-button
                  type="primary"
                  @click="send"
                  :disabled="disable">
                {{ buttonName }}
              </el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="registerForm.password"
                show-password></el-input>
          </el-form-item>
          <el-button style="position:absolute;top: 300px;left: 137px;" type="primary" @click='register'>立即注册
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
    <div id="copyright">Copyright © 2023 DINO</div>
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
        code: '',
        password: ''
      },
      // 注册表单验证规则
      registerFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度应在 3 到 10 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请填写邮箱', trigger: 'blur'},
          {
            type: 'string',
            message: '邮箱格式不正确',
            trigger: 'blur',
            transform(value) {
              if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) {
                return true
              } else {
              }
            }
          },
          {min: 5, max: 31, type: 'string', message: '长度应在 5 到 31 个字符', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入邮箱验证码', trigger: 'blur'},
          {min: 6, max: 6, message: '长度应为 6 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度应在 6 到 15 个字符', trigger: 'blur'}
        ]
      },
      sendFormRules: {},
      rules: {
        email: [
          {required: true, message: '请填写邮箱', trigger: 'blur'},
          {
            type: 'string',
            message: '邮箱格式不正确',
            trigger: 'blur',
            transform(value) {
              if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) {
                return true
              } else {
              }
            }
          },
          {type: 'string', message: '长度应在 5 到 17 个字符', trigger: 'blur', min: 5, max: 31}
        ],
      },
      time: '',
      date: '',
      buttonName: "获取验证码",
      count: 60,
      disable: false,
    }
  },
  // 时间更新
  mounted() {
    this.sendFormRules = this.rules
    this.$nextTick(() => {
      setInterval(this.update_clock, 1000);
    })
  },
  methods: {
    block() {
      const timeout = setInterval(() => {
        if (this.count < 1) {
          this.disable = false;
          this.buttonName = "获取验证码";
          this.count = 60;
          clearInterval(timeout);
        } else {
          this.disable = true;
          this.buttonName = this.count-- + "s后重发";
        }
      }, 1000);
    },
    send() {
      this.rules = this.sendFormRules;
      let this_vue = this;
      this.$refs.registerFormRef.validate(valid => {
        if (valid) {
          console.log(valid)
          this.$axios({
            method: 'post',
            url: '/email/register',
            params: {
              'email': this.registerForm.email,
            }
          }).then(() => {
            this_vue.$message({
              message: "已发送验证码",
              type: 'success'
            })
          }).catch(function (error) {
            console.log(error);
          });
          this.block();
        }
      })
    },
    register() {
      let this_vue = this;
      this.rules = this.registerFormRules;
      this.$refs.registerFormRef.validate(valid => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/register',
            params: {
              'username': this.registerForm.username,
              'password': this.registerForm.password,
              'email': this.registerForm.email,
              'code': this.registerForm.code,
            }
          }).then(function (response) {
            if (response.flag) {
              this_vue.$router.push({path: '/login'})
              this_vue.$message({
                message: response.message,
                type: 'success'
              });
            } else {
              this_vue.$message({
                message: response.message,
                type: 'warning'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this_vue.$message({
            message: "表单填写不合法",
            type: 'warning'
          });
        }
      });
    },
    login() {
      this.$router.push({path: '/login'})
    },
    update_clock: function () {
      let d = new Date();
      let year = d.getFullYear();
      if (year < 10) {
        year = "0" + year;
      }
      let month = d.getMonth() + 1 + "";
      if (month < 10) {
        month = "0" + month;
      }
      let day = d.getDate() + "";
      if (day < 10) {
        day = "0" + day;
      }
      let hour = d.getHours() + "";
      if (hour < 10) {
        hour = "0" + hour;
      }
      let minute = d.getMinutes() + "";
      if (minute < 10) {
        minute = "0" + minute;
      }
      let second = d.getSeconds() + "";
      if (second < 10) {
        second = "0" + second;
      }
      this.time = hour + ":" + minute + ":" + second;
      this.date = year + "/" + month + "/" + day;
    }
  }
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
  right: 0;
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
  margin-bottom: 0;
  margin-top: 0;
}

.el-card {
  width: 373px;
  height: 350px;
  /* 设置为透明 */
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

.code .el-form-item__error {
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
  left: 45%;
}

</style>

