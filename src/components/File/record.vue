<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
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
                  <el-dropdown-item command="1">查询</el-dropdown-item>
                  <el-dropdown-item command="2">修改</el-dropdown-item>
                  <el-dropdown-item command="3">删除</el-dropdown-item>
                  <el-dropdown-item command="4">恢复</el-dropdown-item>
                  <el-dropdown-item command="5">彻底删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="修改者">
              <el-input v-model="form.modifyName" placeholder="请输入修改人姓名" size="small"></el-input>
            </el-form-item>
            <el-form-item label="文档名称">
              <el-input v-model="form.documentName" placeholder="请输入文档名称"  size="small"></el-input>
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                  v-model="form.operationTime"
                  type="daterange"
                  valueFormat="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData4" stripe style="width: 100%">
          <el-table-column type="index" align="center" label="#" width="50"></el-table-column>
          <el-table-column prop="name" align="center" label="文档名称" width="150"></el-table-column>
          <el-table-column prop="modifyName" align="center" label="修改者" width="150"></el-table-column>
          <el-table-column prop="operation" align="center" label="修改类型" width="150"
                           :formatter="formatStateOperator"></el-table-column>
          <el-table-column prop="extension" align="center" label="扩展名" width="150"></el-table-column>
          <el-table-column prop="type" align="center" label="类型" width="150"
                           :formatter="formatStateType"></el-table-column>
          <el-table-column prop="filePath" align="center" label="路径" min-width="150"></el-table-column>
          <el-table-column prop="size" align="center" label="大小" width="150"></el-table-column>
          <el-table-column prop="operationTime" align="center" label="操作时间" width="150"
                           :formatter="transform"></el-table-column>
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
export default {
  data() {
    return {
      tableData4: '',
      form: {
        current: "",
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
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    transform(row, column, operationTime) {
      return operationTime.substring(0, operationTime.indexOf('T'))
    },
    formatStateType(row, column, type) {
      if (type === '1') {
        return '文件';
      } else if (type === '2') {
        return '文件夹';
      }
    }, formatStateOperator(row, column, operation) {
      if (operation === 1) {
        return '添加';
      }
      if (operation === 2) {
        return '修改';
      }
      if (operation === 3) {
        return '删除';
      }
      if (operation === 4) {
        return '恢复';
      }
      if (operation === 5) {
        return '彻底删除';
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
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
      var this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/doc/log',
        params: {
          'current': this.form.current,
          'size': this.form.size,
          'name': this.form.modifyName,
          'documentName': this.form.documentName,
          'operation': this.form.operation,
          'beginTime': this.form.operationTime[0],
          'endTime': this.form.operationTime[1],
        }
      }).then(function (response) {
        this_vue.form.current_count = this_vue.form.size;
        this_vue.tableData4 = response.data.recordList;
        this_vue.form.total = response.data.count;
        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        console.log(localStorage.getItem('token'))
        console.log(error);
      });
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
