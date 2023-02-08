<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>回收站</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="oa_main">
        <!--search-->
        <div class="oa_search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="文档名称">
              <el-input v-model="form.name" placeholder="请输入文档名称" size="small"></el-input>
            </el-form-item>
            <el-form-item label="上传时间">
              <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="small">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog
            title="警告！"
            :visible.sync="dialogVisible"
            width="35%"
            style="text-align: center">
          <el-form :inline="false" class="demo-form-inline">
            <el-form-item>
              <el-form-item>
                <span>该文件将被彻底删除，无法恢复</span>
              </el-form-item>
              <el-form-item>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="deleteSubmit()">确认删除</el-button>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--list-->
        <el-table :data="tableData4" stripe style="width: 100%">
          <el-table-column prop="type" align="center" label="类型" width="150"
                           :formatter="formatStateType">
            <template slot-scope="scope">
              <img alt="" style="width: 25px;height: 25px" :src="((ty)=>{
              if(ty==='1'||ty===1){return file}
              else if (ty===2||ty==='2'){return folder}
              else return file})
              (scope.row.type)">
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="文件名称" min-width="150"></el-table-column>
          <el-table-column prop="dname" align="center" label="删除者" width="100"></el-table-column>
          <el-table-column prop="deleteTime" align="center" label="删除时间" width="150"
                           :formatter="transform"></el-table-column>
          <el-table-column prop="size" align="center" label="大小" width="100"
                           :formatter="transformSize"></el-table-column>
          <el-table-column prop="filePath" align="center" label="路径" min-width="100"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="300">
            <template slot-scope="scope">
              <!-- 查看按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="small"
                         @click="delDoc(scope.row)">删除
              </el-button>
              <!-- 恢复按钮 -->
              <el-button type="success" icon="el-icon-check" size="small"
                         @click="recoverFile(scope.row.id)">恢复
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
import file from '@/assets/images/doc/file.svg'
import folder from '@/assets/images/doc/folder.svg'

export default {
  data() {
    return {
      file,
      folder,
      tableData4: '',
      dialogVisible: false,
      delForm: {
        docId: 0,
        type: 0
      },
      form: {
        current: 1,
        size: 5,
      },
    };
  },
  mounted() {
    this.selectCondition();
  },
  methods: {
    deleteSubmit() {
      const this_vue = this;
      if (this.delForm.type === 1) {
        this.$axios({
          method: 'DELETE',
          url: '/doc/rec',
          params: {
            docId: this.delForm.docId
          }
        }).then(e => {
          if (e) {
            this_vue.$message.success(e.message)
          } else {
            this_vue.$message.error(e.message)
          }
          this.selectCondition()
          this.dialogVisible = false;
        })
      } else if (this.delForm.type === 2) {
        this.$axios({
          method: 'DELETE',
          url: '/doc/rec/folder',
          params: {
            docId: this.delForm.docId
          }
        }).then(e => {
          if (e) {
            this_vue.$message.success(e.message)
          } else {
            this_vue.$message.error(e.message)
          }
          this.selectCondition()
          this.dialogVisible = false;
        })
      }
    },
    delDoc(row) {
      this.dialogVisible = true;
      this.delForm.docId = row.id;
      this.delForm.type = row.type;
    },
    transform(row, column, operationTime) {
      return operationTime.substring(0, operationTime.indexOf('T'))
    },
    transformSize(row, column, size) {
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
    },
    formatStateType(type) {
      if (type === '1') {
        return '文件';
      } else if (type === '2') {
        return '文件夹';
      }
    },
    selectCondition() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/doc/rec',
      }).then(res => {
        this_vue.tableData4 = res.data;
        this_vue.form.current_count = this_vue.form.size;
        this_vue.form.total = res.data.count;
      })
    },
    // handleGoUrl(url) {
    //   this.$router.push({ path: url });
    // },
    // onSubmit() {
    //   console.log(this.form);
    // },
    // 根据文件id删除对应文件
    open() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async recoverFile(id) {
      const confirmResult = await this.$confirm('此操作将恢复该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        confirmButtonClass: 'danger-button'
      }).catch(err => {
        return err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消恢复文件')
      }
      if (confirmResult === 'confirm') {
        this.$axios({
          url: '/doc/rec',
          method: 'post',
          params: {
            docId: id
          }
        }).then(res => {
          console.log('res:', res)
          return this.$message.success('已成功恢复文件')
        })

      }
    }
  },
};
</script>
<style scoped>
</style>
<style lang="scss" scoped>
.box-card {
  margin: 20px;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

