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
                      <div class="heading">提交入职请求</div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="deptId">
                <el-autocomplete
                    prefix-icon="el-icon-suitcase"
                    v-model="state"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="在线搜索企业"
                    @select="handleSelect"
                    clearable
                    style="margin-top: 10px;width: 100%"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item style="text-align: center">
                <el-button type="primary" @click="requestOffer" style="width: 185px;" class="bx--btn bx--btn--primary">
                  提交请求
                </el-button>
                <el-button type="warning" @click="createDept" style="width: 185px" class="action_button">创建企业？
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
      restaurants: [],
      state: '',
      timeout: null,
      deptId: '',
      loginForm: {
        deptId: '',
      },
      formRules: {
        deptId: [
          {required: true, message: '请选择企业'},
        ],
      }
    }
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    login() {
      this.$router.push({path: '/login'})
    },
    requestOffer() {
      const this_vue = this;
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/user/userinfo/dept',
            params: {
              'deptId': this.loginForm.deptId
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
                message: '您已成功提交入职请求，请等待企业负责人审核，您的权限发生变化，已自动登出！在审核通过之前，您无法使用本系统',
                type: 'success'
              });
              this_vue.localStorage.removeItem('token');
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      })

    },
    // 跳转注册
    createDept() {
      this.$router.push({path: '/dept'})
    },
    loadAll() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/user/dept',
        params: {
          'name': this.state,
        }
      }).then(function (response) {
        this_vue.restaurants = JSON.parse(JSON.stringify(response.data).replace(/name/g, "value"));
      }).catch(function (error) {
        console.log(error);
      });
    },
    querySearchAsync(queryString, cb) {
      const restaurants = this.restaurants;
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.loginForm.deptId = item.id;
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
  margin-top: 5px;
  text-align: center;
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