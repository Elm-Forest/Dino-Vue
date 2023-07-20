<template>
  <div id="loginBox">
    <el-header id="header">
      <span id="logo" style="position: absolute;display: block;margin-left: 33px;">D</span>
      <div class="logo_box" style="margin-left: 63px;">
        <img class="logo" :src="logo" alt="Logo"/>
      </div>
      <span id="logo" style="position: absolute;display: block;margin-left: 86px;">NO</span>
    </el-header>
    <el-container>
      <div class="container-box">
        <div class="container">
          <div class="box-card" style="width: 400px">
            <el-form id="form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
              <el-form-item>
                <div class="heading-container">
                  <div class="bx--row">
                    <div class="bx--col">
                      <div class="heading">填写个人信息</div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="name">
                <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.name" placeholder="真实姓名"
                          :style="width"
                          clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-form-item prop="sex">
                  <el-select v-model="loginForm.sex" placeholder="请选择性别" :style="width">
                    <el-option label="男" value=男></el-option>
                    <el-option label="女" value=女></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>
              <el-form-item prop="phone">
                <el-input prefix-icon="el-icon-phone" v-model="loginForm.phone" placeholder="联系方式" :style="width"
                          clearable></el-input>
              </el-form-item>
              <el-form-item prop="address">
                <el-input prefix-icon="el-icon-s-cooperation" v-model="loginForm.address" placeholder="通讯地址"
                          :style="width"
                          clearable></el-input>
              </el-form-item>
              <el-form-item style="text-align: center">
                <el-button  type="primary" @click="updateUserinfo" style="width: 225px;"  class="bx--btn bx--btn--primary">提交</el-button>
                <el-button   type="info" @click="login" style="width: 145px"  class="action_button">返回登录</el-button>

              </el-form-item>
            </el-form>
          </div>
        </div>

      </div>
    </el-container>
  </div>
</template>

<script>
import logo from '../../public/logo.svg'

export default {
  name: 'regInfo',
  data() {
    return {
      logo: logo,
      width: 'width: 100%',
      loginFormRules: {
        name: [
          {required: true, message: '请输入您的真实姓名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度应在 1 到 10 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请填写手机号', trigger: 'blur'},
          {
            type: 'string',
            message: '手机号码格式不正确，请填写中国大陆支持的手机号码',
            trigger: 'blur',
            transform(value) {
              if (!/^1[3-9]\d{9}$/.test(value)) {
                return true
              } else {
              }
            }
          },
          {min: 11, max: 111, type: 'string', message: '手机号格式不正确，请填写中国大陆支持的手机号', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入您的通讯地址', trigger: 'blur'},
        ],
        sex: [
          {required: true, message: '请选择您的性别', trigger: 'blur'},
        ],
      },
      sex_vo: new Map([
        ["男", 1],
        ["女", 0]
      ]),
      loginForm: {
        name: '',
        sex: '',
        address: '',
        phone: '',
      }
    }
  },
  methods: {
    login() {
      this.$router.push({path: '/login'})
    },
    updateUserinfo() {
      const this_vue = this;
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'put',
            url: '/user/userinfo',
            params: {
              'name': this.loginForm.name,
              'sex': this.sex_vo.get(this.loginForm.sex),
              'phone': this.loginForm.phone,
              'address': this.loginForm.address,
            }
          }).then(function (response) {
            let flag = false;
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
          }).catch(function (error) {
            console.log(localStorage.getItem('token'))
            console.log(error);
          })
        }
      });
    },
    requestOffer() {
      this.$router.push({path: '/offer'})
    },
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

.container-box {
  background: rgb(236, 236, 236) center;
  height: 698px;
  width: 100%;
  background-size: cover;
  position: absolute;
}

.container {
  margin: 0 auto;
  width: 30%;
  padding: 100px 30px;
}

.box-card {
  padding: 30px 30px 15px 30px;
  background: rgb(255, 255, 255);
  box-shadow: 2px 2px 2px 2px rgba(157, 150, 150, 0.1);
}

#form {
  line-height: 60px;
  padding-left: 10px;
  padding-right: 10px;
}

.heading-container {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.heading-container .heading {
  font-size: 28px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0;
  color: #161616;
}
.bx--btn--primary {
  border: 1px solid transparent;
  background-color: #4078e7;
  color: #fff;
}
.action_button {
  margin-top: 5px;
  text-align: center;
}
</style>