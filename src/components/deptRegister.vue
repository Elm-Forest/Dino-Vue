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
            <el-form id="form" ref="loginFormRef" :model="loginForm" :rules="formRules">
              <el-form-item>
                <div class="heading-container">
                  <div class="bx--row">
                    <div class="bx--col">
                      <div class="heading">创建企业</div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="name">
                <el-input prefix-icon="el-icon-edit-outline" v-model="loginForm.name" placeholder="企业名称"
                          :style="width"
                          clearable></el-input>
              </el-form-item>
              <el-form-item prop="phone">
                <el-input prefix-icon="el-icon-phone" v-model="loginForm.phone" placeholder="联系方式" :style="width"
                          clearable></el-input>
              </el-form-item>
              <el-form-item prop="address">
                <el-autocomplete
                    prefix-icon="el-icon-position"
                    v-model="loginForm.address"
                    :fetch-suggestions="querySearchAsync"
                    :trigger-on-focus="false"
                    :remote="true"
                    @select="handleSelect"
                    :style="width"
                    placeholder="企业地址">
                  <template v-slot="{ item }">
                    <div class="addr-form">
                      <div class="name" style="line-height: 20px">{{ item.value }}</div>
                      <span class="addr" style="line-height: 10px">{{ item.address }}</span>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item prop="desc">
                <el-input prefix-icon="el-icon-data-board" v-model="loginForm.desc" placeholder="企业简述"
                          :style="width"
                          clearable></el-input>
              </el-form-item>
              <el-form-item style="text-align: center">
                <el-button type="primary" @click="createDept" style="width: 185px;" class="bx--btn bx--btn--primary">
                  创建企业
                </el-button>
                <el-button type="warning" @click="requestOffer" style="width: 185px" class="action_button">加入企业？
                </el-button>
              </el-form-item>
              <el-form-item>
                <div class="bx--row">
                  <div class="bx--col"><p class="help-link">
                    点击
                    <a @click="login">返回登录</a>
                  </p>
                  </div>
                </div>
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
      suggestions: [],
      loginForm: {
        name: '',
        phone: '',
        address: '',
        desc: ''
      }, formRules: {
        name: [
          {required: true, message: '请输入企业名称', trigger: 'blur'},
          {min: 1, max: 30, message: '长度应在 1 到 30 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入企业联系方式', trigger: 'blur'},
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
          {required: true, message: '请输入企业地址', trigger: 'blur'},
        ],
        desc: [
          {required: true, message: '请输入企业简述', trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    login() {
      this.$router.push({path: '/login'})
    },
    handleSelect(item) {
      console.log(item);
    },
    querySearchAsync(queryString, callback) {
      this.$axios.get('/open/location', {
        params: {
          'keywords': queryString
        }
      }).then(response => {
        this.suggestions = response.data.map(item => {
          return {
            value: item.title,
            address: item.address
          };
        });
        let suggestions = this.suggestions
        const results = queryString ? suggestions.filter(this.createFilter(queryString)) : suggestions;
        callback(results)
      })
    },
    createFilter(queryString) {
      return (place) => {
        return (place.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    createDept() {
      const this_vue = this;
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/department/create',
            params: {
              'name': this.loginForm.name,
              'phone': this.loginForm.phone,
              'address': this.loginForm.address,
              'desc': this.loginForm.desc
            }
          }).then(function (response) {
            if (response.flag === false) {
              this_vue.$message({
                message: response.message,
                type: 'warning'
              });
            } else {
              this_vue.$router.push('/login');
              this_vue.$message({
                message: '创建成功！您的权限发生变化，需要重新登陆！',
                type: 'success'
              });
              this_vue.localStorage.removeItem('token');
            }
          })
        }
      })

    },
    requestOffer() {
      this.$router.push({path: '/offer'})
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

  margin-top: 0;
  text-align: center;
}

.addr-form {
  line-height: 20px;
  padding-top: 7px;
  padding-bottom: 7px;
}

.addr {
  font-size: 12px;
  color: #b4b4b4;
}

.highlighted .addr {
  color: #ddd;
}
.help-link {
  font-size: 1px;
  font-weight: 400;
  line-height: 1.42857;
  letter-spacing: .16px;
}
a {
  color: #0f62fe;
  cursor: pointer;
}
</style>