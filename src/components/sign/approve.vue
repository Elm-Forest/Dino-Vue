<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>员工申请审批</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- list -->
    <el-table
        v-loading="loading"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        style="width: 100%"
        class="dataTable"
        :default-sort="{prop: 'time', order: 'descending'}"
    >
      <el-table-column
          prop="name"
          label="姓名"
          align="center">
      </el-table-column>

      <el-table-column
          prop="applyStartTime"
          label="起始日期"
          sortable
          align="center">
      </el-table-column>

      <el-table-column
          prop="applyEndTime"
          label="结束日期"
          sortable
          align="center">
      </el-table-column>

      <el-table-column
          prop="applyDes"
          label="申请描述"
          sortable
          align="center">
      </el-table-column>

      <el-table-column
          prop="type"
          label="类型"
          align="center"
          :formatter="filterType"
      >
        <template slot-scope="scope">
          <el-tag :type="filterTag(scope.row)" v-text="filterType(scope.row)"></el-tag>
        </template>
      </el-table-column>

      <el-table-column
          label="操作"
          align="center"
          fixed="right">
        <template slot-scope="scope">
          <el-button-group>

            <template>
              <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="同意该申请吗？"
                  @confirm="approveApply(scope.row)"
              >
                <el-button slot="reference" icon="el-icon-check" type="small"></el-button>
              </el-popconfirm>
            </template>

            <template>
              <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="拒绝该申请吗？"
                  @confirm="deleteApply(scope.row)"
              >
                <el-button slot="reference" icon="el-icon-delete" type="small"></el-button>
              </el-popconfirm>
            </template>

          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      //分页
      currentPage: 1,
      total: 1,
      pageSize: 10,

      //表格数据
      tableData: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    filterType(row) {
      if (row.type === 0) {
        return "补卡"
      }
      if (row.type === 1) {
        return "请假"
      }
    },
    filterTag(row) {
      if (row.type === 0) {
        return "warning"
      }
      if (row.type === 1) {
        return "success"
      }
    },
    init() {
      let this_vue = this
      this_vue.tableData = []
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/check/admin/apply',
      }).then(function (response) {
        if (response.flag) {
          this_vue.tableData = response.data
          for (let i = 0; i < this_vue.tableData.length; i++) {
            this_vue.tableData[i].applyStartTime = this_vue.tableData[i].applyStartTime.toString().substring(0, 10)
            this_vue.tableData[i].applyEndTime = this_vue.tableData[i].applyEndTime.toString().substring(0, 10)
          }
          this_vue.total = this_vue.tableData.length
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.loading = false
      })
    },
    handleSizeChange(item) {
      console.log(item)
      this.pageSize = item
      this.currentPage = 1
    },
    handleCurrentChange(item) {
      this.currentPage = item
    },

    approveApply(item){
      let this_vue = this
      this_vue.loading = true
      this.$axios({
        method: 'put',
        url: '/check/admin/apply/' + item.id,
      }).then(function (response) {
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
        this_vue.init()
        this_vue.loading = false
      })
    },
    deleteApply(item){
      let this_vue = this
      this_vue.loading = true
      this.$axios({
        method: 'delete',
        url: '/check/admin/apply/' + item.id,
      }).then(function (response) {
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
        this_vue.init()
        this_vue.loading = false
      })
    }
  }
}
</script>

<style scoped>
.dataTable {
  margin: 40px auto;
}

.red {
  color: red;
}

.blue {
  color: #409EFF;
}

.statusEdit {
  padding-bottom: 20px;
}

.changeStatus {
  width: 350px;
}

.editStatusDistance {
  padding-top: 7px;
}

.displayTable {
  margin-bottom: 40px;
}

/deep/ .el-dialog__footer {
  padding-bottom: 50px;
}
</style>
