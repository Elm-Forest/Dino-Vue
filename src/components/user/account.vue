<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="box">
      <el-card class="box-card box-card2">
        <div slot="header">账号信息</div>
        <el-form id="form" style="">
          <div class="text item">
            <el-form-item label="用户名">
              {{ username }}
            </el-form-item>
            <el-form-item label="注册时间">
              {{ regTime }}
            </el-form-item>
            <el-form-item label="上次登录">
              {{ lastTime }}
            </el-form-item>
            <el-form-item label="账号邮箱:">
              <el-input v-model="email" size="small" style="width: 220px;margin-right: 25px" disabled></el-input>
              <el-button size="small" type="primary" @click="emailFormVisible=true">修改</el-button>
            </el-form-item>
            <el-form-item label="账号密码:">
              <el-input v-model="defaultPwd" size="small" style="width: 220px;margin-right: 25px" disabled></el-input>
              <el-button size="small" type="primary" @click="dialogFormVisible=true">修改</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <div>
      <el-dialog title="修改邮箱" :visible.sync="emailFormVisible" width="30%">
        <el-form>
          <el-form-item label="新邮箱" :label-width="formLabelWidth">
            <el-input v-model="emailForm.email" autocomplete="off" style="width: 260px"
                      size="small"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth">
            <el-input v-model="emailForm.code" autocomplete="off" size="small"
                      style="width: 170px;margin-right: 35px"></el-input>
            <el-button size="small" @click="sendEmailCode">发送</el-button>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click="emailFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateEmail">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible" v-model="passwordForm" width="30%">
        <el-form>
          <el-form-item label="新密码" :label-width="formLabelWidth">
            <el-input v-model="passwordForm.newPassword" autocomplete="off" style="width: 260px"
                      size="small"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth">
            <el-input v-model="passwordForm.code" autocomplete="off" size="small"
                      style="width: 170px;margin-right: 35px"></el-input>
            <el-button size="small" @click="sendPwdCode">发送</el-button>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatePassword">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultPwd: '************',
      fileList: [],
      files: '',
      dialogImageUrl: '',
      formLabelWidth: '80px',
      dialogVisible2: false,
      dialogVisible: false,
      dialogFormVisible: false,
      emailFormVisible: false,
      regTime: '',
      lastTime: '',
      email: '',
      username: '',
      passwordForm: {
        newPassword: '',
        code: ''
      },
      emailForm: {
        email: '',
        code: ''
      }
    };
  },
  mounted: function () {
    this.getUser();
  },
  created() {
  },
  methods: {
    fileOnChange(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClose2(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    sendPwdCode() {
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/user/user/code',
      }).then(() => {
        this_vue.$message.success("发送成功")
      })
    },
    sendEmailCode() {
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/user/email/code',
        params: {
          email: this.emailForm.email
        }
      }).then(() => {
        this_vue.$message.success("发送成功")
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    getUser() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/user/user'
      }).then(function (response) {
        if (response.flag) {
          this_vue.username = response.data.username;
          this_vue.regTime = response.data.regTime.replace(/T|\.\d+\+\d{2}:\d{2}/g, ' ');
          this_vue.lastTime = response.data.lastTime.replace(/T|\.\d+\+\d{2}:\d{2}/g, ' ');
          this_vue.email = response.data.email;
        }
      })
      this.$axios({
        method: 'get',
        url: '/user/user'
      }).then(function (response) {
        this_vue.role = this_vue.roles[response.data.role - 1];
        this_vue.rights = this_vue.right[response.data.rights - 1];
      })
    },
    updatePassword() {
      const this_vue = this;
      this.$axios({
        method: 'put',
        url: '/user/user',
        params: {
          'newPassword': this.passwordForm.newPassword,
          'code': this.passwordForm.code,
        }
      }).then((response) => {
        this_vue.dialogFormVisible = false;
        if (response.flag) {
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
      })
    },
    updateEmail() {
      const this_vue = this;
      this.$axios({
        method: 'put',
        url: '/user/email',
        params: {
          'email': this.emailForm.email,
          'code': this.emailForm.code,
        }
      }).then((response) => {
        this_vue.emailFormVisible = false;
        if (response.flag) {
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
      })
    }
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card2 {
  width: 480px;
}

#box {
  position: absolute;
  top: 15%;
  left: 25%;
}
</style>