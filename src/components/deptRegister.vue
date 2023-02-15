<template>
  <div id="loginBox">
    <el-card class="box-card">
      <h1 id="login-title">创建企业</h1>
      <div style="height: 40px;"></div>
      <el-form id="form" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.name" placeholder="企业名称" :style="width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-phone" v-model="loginForm.phone" placeholder="联系方式" :style="width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
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
          <el-input prefix-icon="el-icon-data-board" v-model="loginForm.desc" placeholder="企业简述" :style="width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item style='text-align: center'>
          <el-button @click="requestOffer">加入企业？</el-button>
          <el-button type="primary" @click="createDept">创建企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      width: 'width: 300px',
      suggestions: [],
      loginForm: {
        name: '',
        phone: '',
        address: '',
        desc: ''
      }
    }
  },
  methods: {
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
    },
    requestOffer() {
      this.$router.push({path: '/offer'})
    }
  }
}
</script>
<style scoped>
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

#loginBox {
  position: absolute;
  top: 15%;
  left: 35%;
}

#login-title {
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
}

#form {
  line-height: 60px;
  padding-left: 50px;
  padding-right: 50px;
}
</style>