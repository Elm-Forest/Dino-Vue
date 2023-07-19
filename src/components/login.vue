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

      <el-aside width="60%" class="back_side">
        <el-main class="back_logo_main">
          <div class="back_logo_box">
            <img :src="backlog" alt="图案" style="width: 100%; height: 100%; object-fit: contain;" class="back_logo">
          </div>
        </el-main>
      </el-aside>
      <el-aside width="40%">
        <el-main>
          <el-form class="login-container" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
            <el-form-item>
              <div class="heading-container">
                <div class="bx--row">
                  <div class="bx--col">
                    <div class="heading">登录 DINO</div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="username">
              <div class="bx--form-item bx--text-input-wrapper">
                <label for="username" class="bx--label">用户名 / 邮箱 </label>
                <input id="username" type="text" class="bx--text-input"
                       v-model="loginForm.username"
                       name="username" value="" placeholder="username / email"/>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="bx--form-item bx--text-input-wrapper password">
                <label for="password" class="bx--label">密码 </label>
                <input id="password" type="password" class="bx--text-input"
                       v-model="loginForm.password"
                       name="password" value="" placeholder="password"/>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="bx--row">
                <div class="bx--col">
                  <div class="button-container">
                    <el-button id="continue-button" tabindex="0"
                               class="submit-button bx--btn bx--btn--primary"
                               @click="login">登录
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
              <div class="bottom-link-container">
                <div class="register-text">
                  <label class="bx--label">没有帐户？ </label>
                  <div>
                    <a tabindex="0" class="bx--btn bx--btn--tertiary" @click="toRegister">
                      加入 DINO
                      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
                           fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"
                           class="bx--btn__icon">
                        <path d="M9.3 3.7L13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
                      </svg>
                    </a></div>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="bx--row">
                <div class="bx--col"><p class="help-link">
                  忘记密码？
                  <a @click="retrievePWD">找回密码</a>
                </p>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import logo from '../../public/logo.svg'
import background from '../assets/images/reg.svg'
import {ADMIN, NORMAL, SUPER} from "@/utils/const";


export default {
  name: 'Login',
  data() {
    return {
      logo: logo,
      backlog: background,
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度应在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度应在 6 到 15 个字符', trigger: 'blur'}
        ]
      },
      time: '',
      date: ''
    }
  },
  methods: {
    // 登录预验证
    login() {
      const this_vue = this;
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/login',
            params: {
              'username': this.loginForm.username,
              'password': this.loginForm.password,
            }
          }).then(function (response) {
            if (response.flag === false) {
              this_vue.$router.push('/login');
              this_vue.$message({
                message: response.message,
                type: 'warning'
              })
            } else {
              localStorage.setItem('token', response.data);
              this_vue.$axios({
                method: 'get',
                url: '/user/entry',
              }).then(function (response) {
                this_vue.$axios({
                  method: 'get',
                  url: '/user/userinfo',
                }).then(function (e) {
                  this_vue.$store.commit('SET_USER_ID', e.data.id)
                  if (e.data.name === null || e.data.name === '') {
                    this_vue.$router.push('/registerInfo');
                    this_vue.$message({
                      message: '您尚未填写资料',
                      type: 'warning'
                    })
                  } else {
                    if (response.data.status === 1) {
                      if (response.data.rights === 1) {
                        this_vue.$store.commit('SET_ROOT_PATH', NORMAL)
                        this_vue.$router.push('/normal');
                        this_vue.$message({
                          message: '欢迎您',
                          type: 'success'
                        });
                      }
                      if (response.data.rights === 2) {
                        this_vue.$store.commit('SET_ROOT_PATH', ADMIN)
                        this_vue.$router.push('/admin');
                        this_vue.$message({
                          message: '欢迎您，部门管理员',
                          type: 'success'
                        });
                      }
                      if (response.data.rights === 3) {
                        this_vue.$store.commit('SET_ROOT_PATH', SUPER)
                        this_vue.$router.push('/super');
                        this_vue.$message({
                          message: '欢迎您，企业负责人',
                          type: 'success'
                        });
                      }
                    } else if (response.data.status === 0) {
                      this_vue.$router.push('/dept');
                      this_vue.$message({
                        message: '您尚未加入企业',
                        type: 'warning'
                      })
                    } else if (response.data.status === 2) {
                      this_vue.$router.push('/dept');
                      this_vue.$message({
                        message: '您已离职',
                        type: 'warning'
                      })
                    }
                  }
                }).catch(function (error) {
                  console.log(error);
                });

                console.log(JSON.stringify(response.data));
              }).catch(function (error) {
                console.log(error);
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this_vue.$message({
            message: "表单填写不合法",
            type: 'warning'
          })
        }
      });
    },
    // 跳转注册
    toRegister() {
      this.$router.push({path: '/Register'})
    },
    // 跳转忘记密码
    retrievePWD() {
      this.$router.push({path: '/retrievePassword'})
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

.back_side {
  background-color: rgb(245, 242, 242);
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
  margin-top: 5px;
  margin-right: 70px;
  width: 100%;
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
  display: inline-block;
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

.bx--btn--tertiary {
  border: 1px solid #0f62fe;
  background-color: transparent;
  color: #0f62fe;
}

.login-form form .bx--btn {
  width: 100%;
  max-width: 100%;
}

button, input, select, textarea {
  /* border-radius: 0; */
  font-family: inherit;
}

.bx--btn--primary {
  border: 1px solid transparent;
  background-color: #0f62fe;
  color: #fff;
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

#continue-button {
//margin-top: 15px;
}

.bx--btn--tertiary:hover {
  background-color: #0353e9;
}

.register-text {
//padding-top: 30px; margin-bottom: 0.5rem; font-size: 1px; color: #525252; line-height: 1rem; vertical-align: initial;
}

.bx--btn .bx--btn__icon {
  position: absolute;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.password {
//padding-top: 20px;
}

.bx--btn--tertiary:hover {
  color: #fff;
}

.bottom-link-container {
  margin: 1rem 0;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.login-container .help-link {
  font-size: 1px;
  font-weight: 400;
  line-height: 1.42857;
  letter-spacing: .16px;

}
</style>
