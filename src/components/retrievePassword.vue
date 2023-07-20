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
      <div class="resetPassword">
        <!-- 标题部分 -->
        <!--   找回密码 -->
        <div id="title"></div>
        <!-- 返回键 -->

        <!-- 忘记密码主题框 -->
        <div class="container">
          <!-- 步骤条 -->
          <el-steps :active="active" :space="200" finish-status="success" align-center>
            <el-step title="输入邮箱" icon="el-icon-edit"></el-step>
            <el-step title="输入验证码" icon="el-icon-s-promotion"></el-step>
            <el-step title="设置新密码" icon="el-icon-key"></el-step>
          </el-steps>
          <!-- 页面一 验证用户名和邮箱 -->
          <div v-if="active === 0" class="common_div">
            <el-form :model="Form" class="user-container" label-position="left" label-width="60px" size="medium">
              <el-form-item style="float: right; width: 80%" label="邮箱">
                <el-input type="text" v-model="Form.email" autofocus ref="email" auto-complete="off"
                          placeholder="请输入邮箱" prefix-icon="el-icon-message" spellcheck="false">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 页面二 输入验证码 -->
          <div v-if="active === 1" class="common_div">
            <el-form :model="codeForm" class="user-container" label-position="left" label-width="60px" size="medium">
              <el-form-item style="float: right; width: 80%" label="验证码">
                <el-input type="text" v-model="codeForm.code" autofocus ref="code" auto-complete="off"
                          placeholder="请输入邮箱验证码" prefix-icon="el-icon-s-promotion" spellcheck="false">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 页面三 设置新密码 -->
          <div v-if="active === 2" class="common_div">
            <el-form :model="passwordForm" class="user-container" label-position="left" label-width="60px"
                     size="medium">
              <el-form-item style="float: right; width: 80%" label="新密码">
                <el-input type="password" v-model="passwordForm.password" autofocus ref="password"
                          auto-complete="off" placeholder="请输入新密码" prefix-icon="el-icon-key">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 下一步按钮 -->
          <div class="common_div">
            <el-button type="info" class="action_button" style="display: inline-block;" @click="back">上一步</el-button>
            <el-button type="primary" style="display: inline-block;margin-left: 365px;width: 20%;"
                       @click="next"
                       class="bx--btn bx--btn--primary">下一步
            </el-button>
          </div>

        </div>
        <router-view></router-view>
      </div>

    </el-container>
  </el-container>
</template>

<script>
import logo from '../../public/logo.svg'

export default {
  name: "retrievePassword",
  data() {
    return {
      logo: logo,
      active: 0,
      Form: {
        email: ''
      },
      codeForm: {
        code: '',
      },
      passwordForm: {
        password: '',
      },
      disabled: false,
    }
  },
  methods: {
    // 返回登录页面
    back() {
      if (this.active === 0) {
        this.$router.push('/login');
      } else {
        this.active--;
      }
    },
    // 邮箱验证
    isEmail() {
      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!regEmail.test(this.Form.email)) {
        this.$message({
          message: '邮箱格式不正确',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    beforePost() {
      if (this.Form.email === '') {
        this.$message({
          message: '邮箱未输入!',
          type: 'warning'
        });
        this.$refs.email.focus();
        return false;
      } else {
        //进行邮箱格式的检测
        return this.isEmail();
      }
    },
    next() {
      const this_vue = this;
      // 当面板为0时，先判断用户名和邮箱是否输入，进行相关的验证
      if (this.active === 0) {
        let isFinished = this.beforePost();
        if (isFinished) {
          //数据输入正确后，将按钮禁掉，并提示相关信息，然后数据发送到后台
          this.disabled = true;
          this.$notify.info({
            title: '提示',
            message: '正在发送验证码，请耐心等待，勿重复操作！',
            duration: 2000,
            offset: 100,
          });
          this.post();
        }
      }
      // 当面板为1时，则到了用户输入验证码的时候, 将验证码传入后台
      if (this.active === 1) {
        // 如果验证码未输入，提示用户
        if (this.codeForm.code === '') {
          this.$notify({
            title: '警告',
            message: '验证码未输入!',
            type: 'warning',
            duration: 2000,
            offset: 100,
          });
          this.$refs.code.focus();
        } else {
          this.active++;
        }

      }
      // 当面板为2时，则到了用户输入密码的时候, 将密码传入后台
      if (this_vue.active === 2) {
        //在发送密码之前，先校验一下是否输入了，不能让用户不小心输入了空密码
        if (this_vue.passwordForm.password === '') {
          // this_vue.$notify({
          //   title: '警告',
          //   message: '警告, 新密码未输入',
          //   type: 'warning',
          //   offset: 100,
          // });
          this_vue.$refs.password.focus();
        } else {
          this.$axios({
            method: 'post',
            url: '/password/back',
            params: {
              'email': this_vue.Form.email,
              'code': this_vue.codeForm.code,
              'password': this_vue.passwordForm.password
            },
          }).then(successResponse => {
            if (successResponse.flag) {
              this_vue.$notify({
                title: '操作成功',
                message: '密码已被修改！',
                type: 'success',
                duration: 2000,
                offset: 100,
              });
              let path = this_vue.$route.query.redirect;
              this_vue.$router.replace({path: path === '/' || path === undefined ? '/login' : path})
            } else {
              this_vue.$message.error(successResponse.message);
            }
          }).catch(failResponse => {
            console.log(failResponse)
          })
        }
      }
    },
    post() {
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/email/password',
        params: {
          'email': this.Form.email
        }
      }).then(successResponse => {
        this_vue.$notify.closeAll();
        this_vue.$notify({
          title: '成功',
          message: '已向' + this.Form.email + '发送验证码，请在5分钟之内修改密码，否则验证码失效',
          type: 'success',
          duration: 2000,
          offset: 100
        });
        this_vue.active++;
        this_vue.disabled = false;
        this_vue.username = successResponse.data.result;
      }).catch(failResponse => {
        console.log(failResponse)
      })
    },
  }
}

</script>

<style scoped>
.bx--btn--primary {
  border: 1px solid transparent;
  background-color: #4078e7;
  color: #fff;
}

#header {
  border-bottom: 2px solid #e7e4e4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px rgba(157, 150, 150, 0.1);
}

#logo {
  padding: 0 15px;
  color: #084f4f;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 4px;
}

.logo_box {
  background-color: white;
  padding: 5px 5px 0;
}

.logo {
  width: 32px;
  height: 30px;

}

.resetPassword {
  background: rgb(236, 236, 236) center;
  height: 698px;
  width: 100%;
  background-size: cover;
  position: absolute;

}

#title {
  font-size: 80px;
  color: #999;
  text-align: center;
  height: 170px;
  line-height: 170%;
}

.container {
  margin: 0 auto;
  width: 40%;
  padding: 25px 30px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  opacity: 1;
}

.common_div {
  margin-top: 5%;
}

.user-container {
  width: 80%;
//background: #fff;
}

.action_button {
  width: 20%;
  margin-top: 3%;
  text-align: center;
}

</style>

