<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>考勤记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- list -->
    <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        v-loading="loading"
        class="personalTable">
      <el-table-column
          prop="date"
          label="日期"
          align="center">
      </el-table-column>
      <el-table-column
          prop="time"
          label="时间"
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
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
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
      //分页数据
      currentPage: 1,
      total: 1,
      pageSize: 10,
      loading: false,
      //表格数据
      tableData: [],
      checkData: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let this_vue = this
      this_vue.tableData = []
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/check',
      }).then(function (response) {
        if (response.flag) {
          this_vue.checkData = response.data
          for (let i = 0; i < this_vue.checkData.length; i++) {
            let checkDataNow = this_vue.checkData[i].time
            let type = this_vue.checkData[i].type
            let dateObject = new Date(checkDataNow);
            let date = dateObject.getFullYear() + "-" + (dateObject.getMonth() + 1).toString().padStart(2, '0') + "-" + dateObject.getDate().toString().padStart(2, '0')
            let time = dateObject.getHours().toString().padStart(2, '0') + ':' + dateObject.getMinutes().toString().padStart(2, '0') + ':' + dateObject.getSeconds().toString().padStart(2, '0')
            this_vue.tableData.push(
                {
                  date: date,
                  time: time,
                  type: type
                }
            )
          }
          this_vue.total = this_vue.checkData.length
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.loading = false
      })
    },


    //每页的个数发生变化
    handleSizeChange(item) {
      console.log(item)
      this.pageSize = item
      this.currentPage = 1
    },
    //跳转到某页
    handleCurrentChange(item) {
      this.currentPage = item
    },


    filterType(row) {
      if (row.type === 0) {
        return "缺勤"
      }
      if (row.type === 1) {
        return "签到"
      }
      if (row.type === 2) {
        return "签退"
      }
      if (row.type === 3) {
        return "请假"
      }
      return "错误"
    },
    filterTag(row) {
      if (row.type === 0) {
        return "danger"
      }
      if (row.type === 1) {
        return "success"
      }
      if (row.type === 2) {
        return "primary"
      }
      if (row.type === 3) {
        return "info"
      }
    }
  }
}
</script>

<style scoped>

</style>
