<template>
  <div
      style='font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;'>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>管理文件</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1)">
      <div>
        <!-- 搜索区域 -->
        <div class="oa_search">
          <el-form :inline="true" :model="form" class="demo-form-inline" style="font-size: 5px">
            <el-form-item>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  每页展示<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="5">5</el-dropdown-item>
                  <el-dropdown-item command="10">10</el-dropdown-item>
                  <el-dropdown-item command="20">20</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="文档名称">
              <el-input v-model="form.name" placeholder="请输入文档名称" style="width: 150px" size="small"></el-input>
            </el-form-item>
            <el-form-item label="修改人">
              <el-input v-model="form.modifyName" placeholder="请输入修改人" style="width: 150px"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item label="上传时间">
              <el-date-picker
                  v-model="form.operationTime"
                  type="daterange"
                  range-separator="至"
                  valueFormat="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 250px"
                  size="small"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="selectCondition" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-upload2" @click="dialogVisible=true" size="small">上传</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-folder-add" @click="dialogVisible3=true" size="small">新建文件夹
              </el-button>
            </el-form-item>
            <div>
              <el-form-item>
                <el-button type="info" size="mini" icon="el-icon-back" :disabled="backButton" @click="back">上一级
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-input
                    size="mini"
                    placeholder="请输入内容"
                    v-model="path"
                    style="width: 200px">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-s-promotion" @click="go">GO
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <el-dialog

            :visible.sync="dialogVisible"
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
              multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="margin-bottom: 10px">只能上传单个文件，且不超过100mb</div>
          </el-upload>
          <el-button type="primary" @click="upload">上传</el-button>

        </el-dialog>
        <el-dialog
            title="新建文件夹"
            :visible.sync="dialogVisible3"
            width="35%"
            style="text-align: center">
          <el-form :inline="false" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="newFolderName" placeholder="请输入内容" label="文件夹名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible3 = false">取 消</el-button>
              <el-button type="primary" @click="createFolder">新建</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
            title="新建文件夹"
            :visible.sync="dialogVisible2"
            width="35%"
            style="text-align: center">
          <el-form :inline="false" class="demo-form-inline">
            <el-form-item>
              <el-form-item>
                <span>文件将移入回收站，30天后自动删除</span>
              </el-form-item>
              <el-form-item>
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="danger" @click="deleteDoc()">确认删除</el-button>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 列表区域 -->
        <el-table :data="tableData4" style="width: 100%" v-loading="loading">
          <el-table-column prop="type" align="center" label="类型" width="100">
            <template slot-scope="scope">
              <img alt="" style="width: 25px;height: 25px" :src="((ty)=>{
              if(ty===1){return file}
              else if (ty===2){return folder}
              else return file})
              (scope.row.type)">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文档名称" align="center"></el-table-column>
          <el-table-column prop="modifyTime" align="center" label="最近修改时间" width="150"
                           :formatter="transform"></el-table-column>
          <el-table-column prop="modifyName" align="center" label="最近修改者" width="150"></el-table-column>
          <el-table-column prop="size" align="center" label="大小" width="100"
                           :formatter="transformSize"></el-table-column>
          <el-table-column prop="role" align="center" label="部门">
            <template slot-scope="scope">
              <el-tag size="small">{{
                  dept_list[scope.row.role - 1]
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="320">
            <template slot-scope="scope">
              <!-- 查看按钮 -->
              <el-button type="success" :icon="((ty)=>{
                if(ty===2){return 'el-icon-search'}
                else if (ty===1){return 'el-icon-download'}
                else return 'el-icon-download'})(scope.row.type)" size="small"
                         @click="select(scope.row)">{{
                  ((ty) => {
                    if (ty === 2) {
                      return '查看'
                    } else if (ty === 1) {
                      return '下载'
                    } else return '查看'
                  })(scope.row.type)
                }}
              </el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="small"
                         @click="removeFile(scope.row)">删除
              </el-button>
              <!-- 重命名按钮 -->
              <el-button type="warning" size="small" @click="showModifyDialog(scope.row)"
                         :disabled="((ty)=>{return ty!==1})(scope.row.type)">重命名
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 重命名的对话框 -->
        <el-dialog
            title="重命名"
            :visible.sync="modifyDialogVisible"
            width="25%"
            style="text-align: center">
          <!-- 对话框主体区 -->
          <el-form ref="modifyFormRef" label-width="auto" :model="renameForm" :rules="renameFormValid">
            <el-form-item label="文件名" prop="name">
              <el-input v-model="renameForm.name"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区 -->
          <span slot="footer" class="dialog-footer"></span>
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
          :total="form.total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import file from '@/assets/images/doc/file.svg'
import folder from '@/assets/images/doc/folder.svg'
import {dept_list} from "@/utils/const";

export default {
  data() {
    return {
      dept_list,
      folder,
      file,
      fileType: [
        {
          id: 1,
          value: folder
        },
        {
          id: 2,
          value: file
        }
      ],
      loading: true,
      current: 1,
      size: 10,
      total: 50,
      current_count: 0,
      operationTime: '',
      path: '/home/',
      backStack: [],
      home: '/home/',
      backPath: '/home/',
      backButton: false,
      fileList: [],
      docId: 0,
      dialogVisible3: false,
      dialogVisible: false,
      dialogVisible2: false,
      tableData4: [],
      newFolderName: '',
      type: '1',
      renameForm: {
        name: ''
      },
      renameFormValid: {
        name: [
          {required: true, message: '请输入文件名称'},
        ],
      },
      name: '',
      form: {
        current: 1,
        size: 5,
        name: "",
        modifyName: '',
        documentName: "",
        operation: 0,
        beginTime: '',
        endTime: '',
        operationTime: [],
        total: 50,
        current_count: 0
      },
      // 控制重命名对话框的显示与隐藏
      modifyDialogVisible: false,
      // 查询到的文件对象
      modifyForm: {},
    };
  },
  created() {
    this.selectCondition();
  },
  methods: {
    go() {
      this.selectCondition()
    },
    back() {
      if (this.backStack.length === 0) {
        this.path = this.home
        this.selectCondition();
      } else {
        this.path = this.backStack.pop();
        this.selectCondition();
      }
    },
    handleCommand(command) {
      this.form.size = parseInt(command)
    },
    handleSizeChange(val) {
      this.form.current_count = val;
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.selectCondition();
    },
    selectCondition() {
      const this_vue = this;
      let beginTime = null;
      let endTime = null;
      if (this.form.operationTime !== null) {
        beginTime = this.form.operationTime[0]
        endTime = this.form.operationTime[1]
      }
      this.$axios({
        method: 'GET',
        url: '/doc/list',
        params: {
          'current': this.form.current,
          'size': this.form.size,
          'path': this.path,
          'uName': this.form.modifyName,
          'dName': this.form.name,
          'beginTime': beginTime,
          'endTime': endTime,
        }
      }).then(function (response) {
        this_vue.form.current_count = this_vue.form.size;
        this_vue.tableData4 = response.data.recordList;
        this_vue.form.total = response.data.count;
        for (const i in this_vue.tableData4) {
          if (this_vue.tableData4[i].type === 2) {
            this_vue.tableData4[i].size = "计算中"
            this_vue.$axios({
              method: 'get',
              url: '/doc/folder/size',
              params: {
                docId: this_vue.tableData4[i].id
              }
            }).then(res => {
              let ext = 'b'
              let size = res.data;
              if (size >= 1024) {
                size = (size / 1024).toFixed(2)
                ext = 'Kb'
              }
              if (size >= 1024) {
                size = (size / 1024).toFixed(2)
                ext = 'Mb'
              }
              this_vue.tableData4[i].size = size + ext;
            })
          }
        }
        if (this_vue.loading) {
          this_vue.loading = false;
        }
      })
      this.backButton = this.path === '/home/';
    },
    deleteDoc() {
      const this_vue = this
      this.$axios({
        method: 'DELETE',
        url: '/doc',
        params: {
          'docId': this.docId,
        },
        headers: {
          'token': localStorage.getItem('token')
        }
      }).then(e => {
        if (e.flag) {
          this_vue.$message({
            message: '删除成功',
            type: 'success'
          })
          this_vue.selectCondition();
        } else {
          this_vue.$message({
            message: '删除成功',
            type: 'warning'
          })
        }
        this_vue.dialogVisible2 = false;
      })
    },
    transformSize(row, column, size) {
      if (row.type === 1) {
        let ext = 'b'
        if (size >= 1024) {
          size = (size / 1024).toFixed(2)
          ext = 'Kb'
        }
        if (size >= 1024) {
          size = (size / 1024).toFixed(2)
          ext = 'Mb'
        }
        return size + ext
      } else {
        return size;
      }
    },
    transform(row, column, operationTime) {
      return operationTime.substring(0, operationTime.indexOf('T'))
    },
    upload() {
      const data = new FormData();
      this.fileList.forEach(e => {
        data.append("file", e.raw);
      });
      data.append('filePath', this.path)
      const this_vue = this;
      this.$message({
        message: '正在上传，请耐心等待',
        duration: 60 * 1000 * 10,
        type: 'info'
      })
      this.$axios({
        method: 'post',
        url: '/doc',
        timeout: 60 * 1000 * 10,
        headers: {
          'token': localStorage.getItem('token'),
          'Content-type': 'multipart/form-data;charset=utf-8'
        },
        data: data
      }).then(e => {
        this_vue.$message.closeAll();
        this_vue.dialogImageUrl = e.data;
        if (e.flag) {
          this_vue.$message({
            message: '上传成功',
            type: 'success'
          })
          this_vue.selectCondition();
        } else {
          this_vue.$message({
            message: '上传失败',
            type: 'error'
          })
        }
      }).catch(() => {
        this_vue.$message.closeAll();
      })
      this.dialogVisible = false
    },
    createFolder() {
      const this_vue = this;
      this.$axios({
        method: 'post',
        url: '/doc/folder',
        params: {
          'filePath': this.path,
          'name': this.newFolderName
        },
        headers: {
          'token': localStorage.getItem('token')
        }
      }).then(function (e) {
        if (e.flag) {
          this_vue.$message({
            message: '创建成功',
            type: 'success'
          })
          this_vue.selectCondition();
        }
        this_vue.dialogVisible3 = false;
      }).catch(function (error) {
        console.log(error);
      });
    },
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
    select(row) {
      const this_vue = this;
      if (row.type === 2) {
        this.backStack.push(this.path)
        this.path = this.path + row.name + '/'
        this.selectCondition();
      } else if (row.type === 1) {
        this_vue.$axios({
          method: 'get',
          url: '/doc/download',
          params: {
            docId: row.id
          }
        }).then(res => {
          if (res.flag) {
            window.location.href = res.data
          } else {
            this_vue.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }
    },
    showModifyDialog(row) {
      this.modifyDialogVisible = true
      this.type = row.type
      this.docId = row.id;
    },
    reName() {
      const this_vue = this;
      this.$refs.modifyFormRef.validate((valid) => {
        if (valid) {
          console.log()
        }
      })
      this.$axios({
        method: 'put',
        url: '/doc/name',
        params: {
          'rename': this.renameForm.name,
          'type': this.type,
          'docId': this.docId
        }
      }).then(e => {
        if (e.flag) {
          this_vue.$message({
            message: '重命名成功',
            type: 'success'
          })
          this_vue.selectCondition();
        } else {
          this_vue.$message({
            message: '重命名失败',
            type: 'warning'
          })
        }
        this_vue.modifyDialogVisible = false
      }).catch(function (error) {
        console.log(error);
      });
    },
    // 根据文件id删除对应文件
    removeFile(row) {
      this.docId = row.id;
      this.dialogVisible2 = true;
    }
  },
};
</script>
