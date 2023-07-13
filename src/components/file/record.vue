<template>
  <div
      style='font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;'>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>文档日志</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="oa_main">
        <div class="oa_search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
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
            <el-form-item>
              <el-dropdown @command="handleCommand2">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">任意</el-dropdown-item>
                  <el-dropdown-item command="1">上传</el-dropdown-item>
                  <el-dropdown-item command="6">下载</el-dropdown-item>
                  <el-dropdown-item command="2">修改</el-dropdown-item>
                  <el-dropdown-item command="3">删除</el-dropdown-item>
                  <el-dropdown-item command="4">恢复</el-dropdown-item>
                  <el-dropdown-item command="5">彻底删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="修改者">
              <el-input v-model="form.modifyName" placeholder="请输入修改人姓名" size="small" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item label="文档名称">
              <el-input v-model="form.documentName" placeholder="请输入文档名称" size="small" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                  v-model="form.operationTime"
                  type="daterange"
                  valueFormat="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 250px"
                  size="small">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search" size="small">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData4" stripe style="width: 100%">
          <el-table-column prop="operationTime" align="center" label="操作时间" width="150"
                           :formatter="transform"></el-table-column>
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
          <el-table-column prop="name" align="center" label="文件名称" width="250"></el-table-column>
          <el-table-column prop="filePath" align="center" label="路径" min-width="150"></el-table-column>
          <el-table-column prop="modifyName" align="center" label="修改者" width="150"></el-table-column>
          <el-table-column prop="operation" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-tag :type="operationColors[scope.row.operation]">{{
                  operationConst[scope.row.operation]
                }}
              </el-tag>
            </template>

          </el-table-column>
        </el-table>
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

export default {
  data() {
    return {
      folder,
      file,
      tableData4: [],
      form: {
        current: 1,
        size: 5,
        name: "",
        modifyName: '',
        documentName: "",
        operation: 0,
        beginTime: '',
        endTime: '',
        operationTime: '',
        total: 50,
        current_count: 0
      },
      operationConst: {
        '1': '上传',
        '2': '修改',
        '3': '删除',
        '4': '恢复',
        '5': '彻底删除',
        '6': '下载'
      },
      operationColors: {
        '1': 'primary',
        '2': 'warning',
        '3': 'danger',
        '4': 'success',
        '5': 'danger',
        '6': 'primary'
      }
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    transform(row, column, operationTime) {
      return operationTime.substring(0, operationTime.indexOf('T'))
    },
    formatStateType(type) {
      if (type === '1') {
        return '文件';
      } else if (type === '2') {
        return '文件夹';
      }
    },
    handleSizeChange(val) {
      this.form.current_count = val;
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.getList();
    },
    handleCommand(command) {
      this.form.size = parseInt(command)
    },
    handleCommand2(command) {
      this.form.operation = parseInt(command);
    },

    search() {
      this.form.current = 1;
      this.getList();
    },
    getList() {
      const this_vue = this;
      let beginTime = null;
      let endTime = null;
      if (this.form.operationTime !== null) {
        beginTime = this.form.operationTime[0]
        endTime = this.form.operationTime[1]
      }
      this.$axios({
        method: 'GET',
        url: '/doc/log',
        params: {
          'current': this.form.current,
          'size': this.form.size,
          'name': this.form.modifyName,
          'documentName': this.form.documentName,
          'operation': this.form.operation,
          'beginTime': beginTime,
          'endTime': endTime,
        }
      }).then(function (response) {
        this_vue.form.current_count = this_vue.form.size;
        this_vue.tableData4 = response.data.recordList;
        this_vue.form.total = response.data.count;
      })
    },
    getType(num) {
      return num === 1 ? '文件' : '文件夹';
    }
  },
};
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
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
