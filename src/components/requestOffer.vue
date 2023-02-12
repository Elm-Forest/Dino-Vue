<template>
  <div id="loginBox">
    <el-card class="box-card">
      <h1 id="login-title">入职申请</h1>
      <div style="height: 20px;"></div>
      <el-form id="form" ref="loginFormRef" :model="loginForm">
        <el-autocomplete
            prefix-icon="el-icon-user-solid"
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="企业名称"
            @select="handleSelect"
            clearable
        ></el-autocomplete>
        <el-button @click="createDept">创建企业?</el-button>
        <el-button type="primary" style="flex: left;" @click="requestOffer">投递</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Login',
  data() {
    return {
      restaurants: [],
      state: '',
      timeout: null,
      deptId: '',
      loginForm: {
        deptId: '',
        name: '',
        phone: '',
        address: '',
        desc: ''
      }
    }
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    // 登录预验证
    requestOffer() {
      const this_vue = this;
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
#login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

#forgetPWD {
  float: left;
  color: black;
  position: absolute;
  left: 18%;
  top: 84%;
  height: 30px;
}

#myButton {
  background-color: rgba(255, 255, 255, 0.4);
  width: 100px;
  color: aliceblue;
}

#loginBox {
  position: absolute;
  top: 25%;
  left: 37%;
}

#login-title {
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
}

.el-card {
  width: 373px;
  height: 45%;
  /* 设置为透明 */
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
}

#form {
  line-height: 60px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
}
</style>