<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>企业信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="box">
      <el-card class="box-card box-card2">
        <el-avatar :size="60" src="" id="headBox">
          <img src="" alt="" id="headImg1" @click="dialogVisible = true"/>
        </el-avatar>
        <el-form id="form" style="text-align: center;">
          <div class="text item">
            <el-descriptions title="企业信息" column="1">
              <el-descriptions-item label="企业名称">{{ name }}</el-descriptions-item>
              <el-descriptions-item label="联系方式">{{ phone }}</el-descriptions-item>
              <el-descriptions-item label="企业地址">{{ address }}</el-descriptions-item>
              <el-descriptions-item label="企业描述">{{ describe }}</el-descriptions-item>
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
      <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="38%">
        <el-form style="text-align: center;">
          <el-form-item label="企业名称" :label-width="formLabelWidth">
            <el-input v-model="name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-input v-model="phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="企业地址" :label-width="formLabelWidth">
            <el-input v-model="address" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="企业描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="describe" autocomplete="off"></el-input>
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
      fileList: [],
      files: '',
      dialogImageUrl: '',
      formLabelWidth: '80px',
      dialogVisible2: false,
      dialogVisible: false,
      dialogFormVisible: false,
      name: '',
      describe: '',
      address: '',
      phone: '',
      headImg: '',
      deptId: ''
    };
  },
  mounted: function () {
    this.getDeptInfo();
    this.getHeadImg();
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
      const data = new FormData();
      this.fileList.forEach(e => {
        data.append("file", e.raw);
      });
      const this_vue = this;
      this.$axios({
        method: 'put',
        url: '/department/img',
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
          this_vue.getHeadImg();
        } else {
          this_vue.$message({
            message: e.message,
            type: 'warning'
          })
        }
      })
      this.dialogVisible = false
    },
    getHeadImg() {
      this.$axios({
        method: 'get',
        url: '/department/img',
      }).then(function (response) {
        document.getElementById('headImg1').src = response.data;
        document.getElementById('deptImg').getElementsByTagName('img')[0].src = response.data;
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
    getDeptInfo() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/department'
      }).then(function (response) {
        if (response.flag) {
          this_vue.name = response.data.name;
          this_vue.address = response.data.address;
          this_vue.phone = response.data.phone;
          this_vue.headImg = response.data.headImg;
          this_vue.describe = response.data.describe;
          this_vue.deptId = response.data.deptId;
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    post() {
      const this_vue = this;
      this.$axios({
        method: 'put',
        url: '/department',
        params: {
          'name': this.name,
          'desc': this.describe,
          'phone': this.phone,
          'address': this.address,
        }
      }).then(function (response) {
        this_vue.dialogFormVisible = false;
        if (response.flag) {
          this_vue.getDeptInfo();
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
  top: 20%;
  left: 25%;
}
</style>