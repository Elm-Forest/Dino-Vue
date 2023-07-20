<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="box" v-loading="loading">
      <el-card class="box-card box-card2">
        <el-avatar :size="60" src="" id="headBox">
          <img src="" alt="" id="headImg1" @click="dialogVisible = true"/>
        </el-avatar>
        <el-form id="form" style="text-align: center;">
          <div class="text item">
            <el-descriptions title="个人资料" :column="1">
              <el-descriptions-item label="姓名">{{ infoForm.name }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ infoForm.phone }}</el-descriptions-item>
              <el-descriptions-item label="居住地">{{ infoForm.address }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ infoForm.sex }}</el-descriptions-item>
              <el-descriptions-item label="职务">
                <el-tag size="small">{{ role }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="权限等级">{{ rights }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <el-button type="primary" @click="dialogFormVisible = true">修改</el-button>
        </el-form>
      </el-card>
    </div>
    <div>
      <el-dialog
          title="上传头像"
          :visible.sync="dialogVisible"
          width="35%">
        <el-form style="text-align: center;">
          <el-form-item :label-width="formLabelWidth">
            <el-upload
                action="#"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-change="fileOnChange"
                :auto-upload="false"
                name="file">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible2">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <span slot="footer" class="dialog-footer"></span>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="upload">确 定</el-button>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="35%">
        <el-form ref="loginFormRef" :rules="loginFormRules" :model="infoForm">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="infoForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="infoForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="通讯地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="infoForm.address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" value-key="id" prop="sex">
            <el-select v-model="infoForm.sex" placeholder="性别">
              <el-option key=1 label="男" value=男></el-option>
              <el-option key=0 label="女" value=女></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="post">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {right_list, role_list} from '@/utils/const'

export default {
  data() {
    return {
      sex_dto: ['女', '男'],
      sex_vo: new Map([
        ["男", 1],
        ["女", 0]
      ]),
      loading: true,
      fileList: [],
      files: '',
      dialogImageUrl: '',
      formLabelWidth: '80px',
      dialogVisible2: false,
      dialogVisible: false,
      dialogFormVisible: false,
      name: '',
      sex: '',
      address: '',
      phone: '',
      headImg: '',
      role: 'CEO',
      rights: '',
      roles: role_list,
      right: right_list,
      infoForm: {
        name: '',
        sex: '',
        address: '',
        phone: '',
      },
      loginFormRules: {
        name: [
          {required: true, message: '请输入您的真实姓名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度应在 1 到 10 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请填写手机号', trigger: 'blur'},
          {
            type: 'string',
            message: '手机号格式不正确，请填写中国大陆支持的手机号',
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
    };
  },
  mounted: function () {
    this.getUserHeadImg();
    this.getUserInfo();
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
    upload() {
      const data = new FormData();
      this.fileList.forEach(e => {
        data.append("file", e.raw);
      });
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/user/img',
        headers: {
          'token': localStorage.getItem('token'),
          'Content-type': 'multipart/form-data;charset=utf-8'
        },
        data: data
      }).then(e => {
        if (e.flag) {
          this_vue.dialogImageUrl = e.data
          this_vue.$message({
            message: e.message,
            type: 'success'
          })
          this_vue.getUserHeadImg();
        } else {
          this_vue.$message({
            message: e.message,
            type: 'warning'
          })
        }
      })
      this.dialogVisible = false
    },
    getUserHeadImg() {
      this.$axios({
        method: 'get',
        url: '/user/img',
      }).then(function (response) {
        document.getElementById('headImg1').src = response.data;
        document.getElementById('headImg').getElementsByTagName('img')[0].src = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    getUserInfo() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/user/userinfo'
      }).then(function (response) {
        if (response.flag) {
          this_vue.infoForm.name = response.data.name;
          this_vue.infoForm.sex = this_vue.sex_dto[response.data.sex];
          this_vue.infoForm.address = response.data.address;
          this_vue.infoForm.phone = response.data.phone;
          this_vue.infoForm.headImg = response.data.headImg;
          this_vue.loading = false;
        }
      }).catch(function (error) {
        console.log(error);
      });
      this.$axios({
        method: 'get',
        url: '/user/user'
      }).then(function (response) {
        this_vue.role = this_vue.roles[response.data.role - 1];
        this_vue.rights = this_vue.right[response.data.rights - 1];
      })
    },
    post() {
      const this_vue = this;
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'put',
            url: '/user/userinfo',
            params: {
              'name': this.infoForm.name,
              'sex': this.sex_vo.get(this.infoForm.sex),
              'phone': this.infoForm.phone,
              'address': this.infoForm.address,
            }
          }).then(function (response) {
            this_vue.dialogFormVisible = false;
            if (response.flag) {
              this_vue.getUserInfo();
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