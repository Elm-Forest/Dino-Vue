<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>查询文档</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="oa_main">
        <!-- 搜索区域 -->
        <div class="oa_search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  每页展示<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template v-slot:dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="5">5</el-dropdown-item>
                    <el-dropdown-item command="10">10</el-dropdown-item>
                    <el-dropdown-item command="20">20</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="文档名称">
              <el-input
                v-model:value="form.name"
                placeholder="请输入文档名称"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="修改人">
              <el-input
                v-model:value="form.modifyName"
                placeholder="请输入修改人"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="上传时间">
              <el-date-picker
                v-model:value="form.operationTime"
                type="daterange"
                range-separator="至"
                valueFormat="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 250px"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="selectCondition"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dialogVisible = true"
                >点击上传</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dialogVisible3 = true"
                >新建文件夹</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-dialog
          title="上传文件"
          v-model:visible="dialogVisible"
          width="35%"
          style="text-align: center"
        >
          <el-upload
            class="upload-demo"
            drag
            :on-remove="handleRemove"
            :on-change="fileOnChange"
            action="#"
            :auto-upload="false"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template v-slot:tip>
              <div class="el-upload__tip">只能单个上传文件，且不超过100mb</div>
            </template>
          </el-upload>
          <el-button type="primary" @click="upload">上传</el-button>
        </el-dialog>
        <el-dialog
          title="新建文件夹"
          v-model:visible="dialogVisible3"
          width="35%"
          style="text-align: center"
        >
          <el-form :inline="false" class="demo-form-inline">
            <el-form-item>
              <el-input
                v-model:value="newFolderName"
                placeholder="请输入内容"
                label="文件夹名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible3 = false">取 消</el-button>
              <el-button type="primary" @click="createFolder">新建</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          title="新建文件夹"
          v-model:visible="dialogVisible2"
          width="35%"
          style="text-align: center"
        >
          <el-form :inline="false" class="demo-form-inline">
            <el-form-item>
              <el-form-item>
                <span>文件将移入回收站，30天后到期</span>
              </el-form-item>
              <el-form-item>
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="danger" @click="deleteDoc()"
                  >确认删除</el-button
                >
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 列表区域 -->
        <el-table
          :data="tableData4"
          stripe
          style="width: 100%"
          :cell-class-name="addClass"
        >
          <el-table-column prop="type" align="center" label="类型" width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="文档名称"
            align="center"
            min-width="220"
          ></el-table-column>
          <el-table-column
            prop="modifyTime"
            align="center"
            label="最近修改时间"
            width="150"
            :formatter="transform"
          ></el-table-column>
          <el-table-column
            prop="modifyName"
            align="center"
            label="最近修改者"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="size"
            align="center"
            label="大小"
            width="200"
            :formatter="transformSize"
          ></el-table-column>
          <el-table-column
            prop="id"
            align="center"
            label="id"
            width="120"
            v-if="false"
          ></el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="300"
          >
            <template v-slot="scope">
              <!-- 查看按钮 -->
              <el-button
                type="success"
                icon="el-icon-search"
                size="medium"
                @click="showFileDialog(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="medium"
                @click="removeFile(scope.row)"
              ></el-button>
              <!-- 重命名按钮 -->
              <el-button
                type="warning"
                size="medium"
                @click="showModifyDialog(scope.row)"
                >重命名</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 重命名的对话框 -->
        <el-dialog
          title="重命名"
          v-model:visible="modifyDialogVisible"
          width="50%"
        >
          <!-- 对话框主体区 -->
          <el-form ref="modifyFormRef" label-width="auto">
            <el-form-item label="文件名" prop="modifyName">
              <el-input v-model:value="rename"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区 -->
          <template v-slot:footer>
            <span class="dialog-footer"></span>
          </template>
          <el-button @click="modifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="reName">确 定</el-button>
        </el-dialog>
      </div>
      <el-pagination
        background
        :page-size="form.size"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="form.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: '',
      size: 10,
      total: 50,
      current_count: 0,
      operationTime: '',
      path: '/home/',
      fileList: [],
      docId: 0,
      dialogVisible3: false,
      dialogVisible: false,
      dialogVisible2: false,
      tableData4: [],
      newFolderName: '',
      type: '',
      rename: '',
      name: '',
      form: {
        current: '',
        size: 5,
        name: '',
        modifyName: '',
        documentName: '',
        operation: 0,
        beginTime: '',
        endTime: '',
        operationTime: ['2020-01-01 00:00:00', '2023-01-01 00:00:00'],
        total: 50,
        current_count: 0,
      },
      // 控制重命名对话框的显示与隐藏
      modifyDialogVisible: false,
      // 查询到的文件对象
      modifyForm: {},
    }
  },
  created() {
    this.getFileList()
  },
  methods: {
    handleCommand(command) {
      this.form.size = parseInt(command)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.form.current_count = val
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.selectCondition()
    },
    selectCondition() {
      var this_vue = this
      this.$axios({
        method: 'GET',
        url: '/doc/list',
        params: {
          current: this.form.current,
          size: this.form.size,
          uName: this.form.modifyName,
          dName: this.form.name,
          beginTime: this.form.operationTime[0],
          endTime: this.form.operationTime[1],
        },
      })
        .then(function (response) {
          this_vue.form.current_count = this_vue.form.size
          this_vue.tableData4 = response.data.recordList
          this_vue.form.total = response.data.count
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    deleteDoc() {
      const this_vue = this
      this.$axios({
        method: 'DELETE',
        url: '/doc',
        params: {
          docId: this.docId,
        },
        headers: {
          token: localStorage.getItem('token'),
        },
      })
        .then((e) => {
          if (e.flag) {
            this_vue.$message({
              message: '删除成功',
              type: 'success',
            })
            this_vue.getFileList()
          } else {
            this_vue.$message({
              message: '删除成功',
              type: 'warning',
            })
          }
          this_vue.dialogVisible2 = false
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    transformSize(row, column, size) {
      return parseInt(size / 1024) + 'kb'
    },
    addClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.type === 1) {
          console.log('test', row.type)
        }
      }
    },
    transform(row, column, operationTime) {
      return operationTime.substring(0, operationTime.indexOf('T'))
    },
    upload() {
      var data = new FormData()
      this.fileList.forEach((e) => {
        data.append('file', e.raw)
      })
      data.append('filePath', this.path)
      const this_vue = this
      this.$axios({
        method: 'post',
        url: '/doc',
        headers: {
          token: localStorage.getItem('token'),
          'Content-type': 'multipart/form-data;charset=utf-8',
        },
        data: data,
      }).then((e) => {
        this_vue.dialogImageUrl = e.data
        if (e.flag) {
          this_vue.$message({
            message: '上传成功',
            type: 'success',
          })
          this_vue.getFileList()
        } else {
          this_vue.$message({
            message: '上传失败',
            type: 'error',
          })
        }
      })
      this.dialogVisible = false
    },
    createFolder() {
      const this_vue = this
      this.$axios({
        method: 'post',
        url: '/doc/folder',
        params: {
          filePath: this.path,
          name: this.newFolderName,
        },
        headers: {
          token: localStorage.getItem('token'),
        },
      })
        .then(function (e) {
          if (e.flag) {
            this_vue.$message({
              message: '创建成功',
              type: 'success',
            })
            this_vue.getFileList()
          }
          this_vue.dialogVisible3 = false
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
    fileOnChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      console.log('handlePictureCardPreview', file.url)
      this.dialogVisible = true
    },
    getFileList() {
      const this_vue = this
      this.$axios({
        method: 'get',
        url: '/doc',
        params: {
          filePath: this.path,
        },
      })
        .then(function (response) {
          this_vue.tableData4 = response.data
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    showModifyDialog(row) {
      this.modifyDialogVisible = true
      this.type = row.type
      this.docId = row.id
    },
    reName() {
      const this_vue = this
      this.$axios({
        method: 'put',
        url: '/doc/name',
        params: {
          rename: this.rename,
          type: this.type,
          docId: this.docId,
        },
      })
        .then((e) => {
          if (e.flag) {
            this_vue.$message({
              message: '重命名成功',
              type: 'success',
            })
            this_vue.getFileList()
          } else {
            this_vue.$message({
              message: '重命名失败',
              type: 'warning',
            })
          }
          this_vue.modifyDialogVisible = false
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 根据文件id删除对应文件
    removeFile(row) {
      this.docId = row.id
      console.log(this.docId)
      this.dialogVisible2 = true
    },
  },
}
</script>

<style lang="scss" scoped>
.box-card {
  margin: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  .el-icon-search {
    color: blue;
  }
}
</style>
