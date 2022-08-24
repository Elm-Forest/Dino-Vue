<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="box">
      <el-card class="box-card box-card2">
        <el-avatar :size="60" src="" id="headBox">
          <img src="" alt="" id="headImg1" @click="dialogVisible = true"/>
        </el-avatar>
        <el-form id="form" style="text-align: center;">
          <div class="text item">
            <el-descriptions title="用户资料信息" column="1">
              <el-descriptions-item label="姓名">{{ name }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ phone }}</el-descriptions-item>
              <el-descriptions-item label="居住地">{{ address }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ sex }}</el-descriptions-item>
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
        <el-form :model="form" style="text-align: center;">
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
      <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="form" style="text-align: center;">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="居住地" :label-width="formLabelWidth">
            <el-input v-model="address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="sex" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="post">确 定</el-button>
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
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
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
      roles: ['客服', '财务', '技术', '采购', '运营', 'HR', 'CEO'],
      right: ['企业员工', '部门管理员', '企业负责人']
    };
  },
  mounted: function () {
    this.getUserInfo();
    this.getUserHeadImg();
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
      console.log('handlePictureCardPreview', file.url)
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
      var data = new FormData();
      this.fileList.forEach(e => {
        data.append("file", e.raw);
      });
      console.log('ok')
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
        this_vue.dialogImageUrl = e.data
        this_vue.getUserHeadImg();
        console.log(data)
      })
      this.dialogVisible = false
    },
    getUserHeadImg() {
      this.$axios({
        method: 'get',
        url: '/user/img',
      }).then(function (response) {
        document.getElementById('headImg1').src = response.data;
        document.getElementById('headImg').src = response.data;
        console.log(JSON.stringify(response.data));
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
          this_vue.name = response.data.name;
          this_vue.sex = ['女', '男'][response.data.sex];
          this_vue.address = response.data.address;
          this_vue.phone = response.data.phone;
          this_vue.headImg = response.data.headImg;
        }
        console.log(response)
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
      const this_sex = this.sex;
      this.$axios({
        method: 'put',
        url: '/user/userinfo',
        params: {
          'name': this.name,
          'sex': [{'女': 0, '男': 1}][0].this_sex,
          'phone': this.phone,
          'address': this.address,
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
        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>
<style>
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
  top: 25%;
  left: 37%;
}
</style>