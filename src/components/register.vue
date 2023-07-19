<template>
  <el-container class="home-container">
    <el-header id="header">
      <span id="logo" style="position: absolute;display: block;margin-left: 33px;">D</span>
      <div class="logo_box" style="margin-left: 63px;">
        <img class="logo" :src="logo" alt="Logo"/>
      </div>
      <span id="logo" style="position: absolute;display: block;margin-left: 86px;">NO</span>
    </el-header>
    <el-container>
      <el-aside width="35%">
        <el-main>
          <el-form class="login-container" ref="registerFormRef" :model="registerForm" :rules="rules">
            <el-form-item>
              <div class="heading-container">
                <div class="bx--row">
                  <div class="bx--col">
                    <div class="heading">创建免费 DINO 帐户</div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="username">
              <div class="bx--form-item bx--text-input-wrapper">
                <label for="username" class="bx--label">用户名</label>
                <input id="username" type="text" class="bx--text-input"
                       v-model="registerForm.username"
                       name="username" value="" placeholder="username"/>
              </div>
            </el-form-item>
            <el-form-item prop="email">
              <div class="bx--form-item bx--text-input-wrapper">
                <label for="email" class="bx--label">邮箱</label>
                <input id="email" type="text" class="bx--text-input"
                       v-model="registerForm.email"
                       name="email" value="" placeholder="email"/>
              </div>
            </el-form-item>
            <el-form-item prop="code">
              <div class="bx--form-item bx--text-input-wrapper">
                <label for="code" class="bx--label">验证码</label>
                <input id="code" type="text" class="bx--text-input"
                       v-model="registerForm.code"
                       name="code" value="" placeholder="code"/>
                <el-button
                    id="send-button"
                    class="send-button bx--btn--tertiary"
                    type="primary"
                    @click="send"
                    :disabled="disable">
                  {{ buttonName }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="bx--form-item bx--text-input-wrapper password">
                <label for="password" class="bx--label">密码 </label>
                <input id="password" type="password" class="bx--text-input"
                       v-model="registerForm.password"
                       name="password" value="" placeholder="password"/>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="bx--row">
                <div class="bx--col">
                  <div class="button-container">
                    <el-button id="continue-button" tabindex="0"
                               class="submit-button bx--btn bx--btn--primary"
                               @click="register">创建账户
                      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
                           fill="currentColor" aria-hidden="true" width="16" height="15" viewBox="0 0 16 16"
                           class="bx--btn__icon">
                        <path d="M9.3 3.7L13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
                      </svg>
                    </el-button>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="bx--row">
                <div class="bx--col"><p class="help-link">
                  已有DINO帐户？
                  <a @click="login">返回登录</a>
                </p>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-aside>
      <el-aside width="65%">
        <el-main class="back_logo_main">
          <div class="back_logo_box">
            <img :src="backlog" alt="图案" style="width: 100%; height: 100%; object-fit: contain;" class="back_logo">
          </div>
        </el-main>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import logo from '../../public/logo.svg'
import illustration from '../assets/images/illustration-final.svg'


export default {
  name: 'Register',
  data() {
    return {
      logo: logo,
      backlog: illustration,
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
    }
  }
}
</script>

<style scoped>

#header {
  border-bottom: 2px solid #e7e4e4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px rgba(157, 150, 150, 0.1);
}

* {
  box-sizing: border-box;
}


#logo {
  padding: 0 15px;
  color: #084f4f;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 4px;
}

* {
  box-sizing: border-box;
}

.logo_box {
  background-color: white;
  padding: 5px 5px 0;
}

.logo {
  width: 32px;
  height: 30px;

}

.back_logo_main {
  background-color: rgb(245, 242, 242);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back_logo_box {
  margin-top: -30px;
  margin-right: 70px;
  width: 85%;
  background-repeat: no-repeat;
  background-position-x: left;
  background-position-y: bottom;
}

.back_logo {

}

.bx--text-input {
  font-size: 1px;
  font-weight: 400;
  line-height: 1.28572;
  letter-spacing: .16px;
  outline: 2px solid transparent;
  outline-offset: -2px;
  width: 100%;
  height: 2.5rem;
  padding: 0 10px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  background-color: #f4f4f4;
  color: #161616;
  transition: background-color 70ms cubic-bezier(.2, 0, .38, .9), outline 70ms cubic-bezier(.2, 0, .38, .9);
}

#code {
  display: inline-block;
  max-width: 280px;
  margin-right: 12px
}

.bx--text-input:active, .bx--text-input:focus {
  outline: 2px solid #0f62fe;
  outline-offset: -2px;
}

.heading-container {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.heading-container .heading {
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0;
  color: #161616;
}

.bx--label {
  display: block;

  margin-bottom: 0.5rem;
  font-size: 1px;
  color: #525252;
  line-height: 1rem;
  vertical-align: initial;
}

.login-container {
  height: 100%;
  padding-top: 1.5rem;
  max-width: 500px;
  min-height: 610px;
  padding-right: 2rem;
  padding-left: 3rem;
}

a {
  color: #0f62fe;
  cursor: pointer;
}

.bx--btn--primary:hover {
  color: #fff;
}

.bx--btn--primary:hover {
  background-color: #0353e9;
}

.login-form form .bx--btn {
  width: 100%;
  max-width: 100%;
}

button, input, select, textarea {
  /* border-radius: 0; */
  font-family: inherit;
}


.bx--btn {
  width: 100%;
  max-width: 100%;
}

.bx--btn {
  font-size: .875rem;
  font-weight: 400;
  line-height: 1.28572;
  letter-spacing: .16px;
  position: relative;
  display: inline-flex;
  min-height: 3rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: calc(0.875rem - 3px) 63px calc(0.875rem - 3px) 15px;
  border-radius: 0;
  cursor: pointer;
  outline: none;
  text-align: left;
  text-decoration: none;
  transition: background 70ms cubic-bezier(0, 0, .38, .9), box-shadow 70ms cubic-bezier(0, 0, .38, .9), border-color 70ms cubic-bezier(0, 0, .38, .9), outline 70ms cubic-bezier(0, 0, .38, .9);
  vertical-align: top;
}

#send-button {
  text-align: center;
  align-items: center;

  width: 100%;
  max-width: 30%;

  font-size: .875rem;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: .16px;
  position: relative;
  display: inline-block;
  min-height: 2rem;
  flex-shrink: 0;
  justify-content: space-between;

  border-radius: 0;
  cursor: pointer;
  outline: none;




  transition: background 70ms cubic-bezier(0, 0, .38, .9), box-shadow 70ms cubic-bezier(0, 0, .38, .9), border-color 70ms cubic-bezier(0, 0, .38, .9), outline 70ms cubic-bezier(0, 0, .38, .9);
  vertical-align: top;
}

.bx--btn--primary {
  border: 1px solid transparent;
  background-color: #0f62fe;
  color: #fff;
}

.bx--btn--tertiary {
  text-align: center;
  align-content: center;
  border: 1px solid #0f62fe;
  background-color: transparent;
  color: #0f62fe;
}

.bx--btn .bx--btn__icon {
  position: absolute;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.login-container .help-link {
  font-size: 1px;
  font-weight: 400;
  line-height: 1.42857;
  letter-spacing: .16px;

}
</style>
