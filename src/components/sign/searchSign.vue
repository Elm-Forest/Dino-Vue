<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>员工考勤记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="">
          <el-input
              placeholder="请输入姓名"
              clearable
              v-model="userName"
              size="small"
              @change="searchCheck">
          </el-input>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="">
          <el-date-picker
              v-model="userDateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="searchCheck"
              size="small"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>

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
          prop="date"
          label="打卡日期"
          sortable
          align="center">
      </el-table-column>

      <el-table-column
          prop="time"
          label="打卡时间"
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
            <el-button
                icon="el-icon-edit"
                size="small"
                @click="openEditDialog(scope.row)">
            </el-button>
            <template>
              <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除考勤记录吗？"
                  @confirm="deleteCheck(scope.row)"
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

    <!-- 编辑话框 -->
    <el-dialog
        title="状态更改"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="editHandleClose">
      <el-row
          :gutter="20"
          class='statusEdit'>
        <el-col :span="4" :offset="3">
          <div>
            打卡人
          </div>
        </el-col>
        <el-col :span="16">
          <div class="">
            {{ oldName }}
          </div>
        </el-col>
      </el-row>
      <el-row
          :gutter="20"
          class='statusEdit'>
        <el-col :span="4" :offset="3">
          <div>
            原始状态
          </div>
        </el-col>
        <el-col :span="16">
          <div class="">
            {{ oldStatus }}
          </div>
        </el-col>
      </el-row>
      <el-row
          :gutter="20"
          class='statusEdit'>
        <el-col :span="4" :offset="3">
          <div>
            打卡时间
          </div>
        </el-col>
        <el-col :span="16">
          <div class="">
            {{ oldTime }}
          </div>
        </el-col>
      </el-row>
      <el-row
          :gutter="20"
          class='statusEdit'>
        <el-col :span="4" :offset="3">
          <div class="editStatusDistance">
            更改状态
          </div>
        </el-col>
        <el-col :span="16">
          <el-select
              v-model="newStatus"
              placeholder="请选择"
              size="small"
              class="changeStatus">
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="submitEditDialog">确 定</el-button>
            </span>
    </el-dialog>
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
      checkData: [],

      //编辑对话框的展示与退出
      editDialogVisible: false,

      //编辑对话框
      oldId: '',
      oldStatus: '',
      oldTime: '',
      oldName: '',
      newStatus: '',
      statusOptions: [{
        value: '0',
        label: '缺勤'
      }, {
        value: '1',
        label: '签到'
      }, {
        value: '2',
        label: '签退'
      }, {
        value: '3',
        label: '请假'
      }],

      //用户名
      userName: '',
      //日期
      userDateRange: [],

      //日历选择器的快捷选项
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
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
    },
    init() {
      let this_vue = this
      this_vue.tableData = []
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/check/admin',
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
                  checkId: this_vue.checkData[i].checkId,
                  name: this_vue.checkData[i].name,
                  date: date,
                  time: time,
                  type: type
                }
            )
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
    openEditDialog(item) {
      this.editDialogVisible = true;
      this.oldTime = item.date + " " + item.time
      this.oldName = item.name
      this.newStatus = this.filterType(item);
      this.oldStatus = this.filterType(item);
      this.oldId = item.checkId

    },
    editHandleClose() {
      this.oldStatus = '';
      this.newStatus = '';
      this.oldTime = '';
      this.editDialogVisible = false;
    },
    submitEditDialog() {
      let this_vue = this
      this.$axios({
        method: 'post',
        url: '/check/admin/setType',
        params: {
          'id': this_vue.oldId,
          'type': this_vue.newStatus
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "修改成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init();
      })
      this_vue.editHandleClose();
    },
    deleteCheck(item) {
      let this_vue = this
      this.$axios({
        method: 'post',
        url: '/check/admin/deleteCheck',
        params: {
          'id': item.checkId,
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "删除成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init();
      })
    },

    searchCheck() {
      let flag = 1
      if (this.userDateRange === undefined || this.userDateRange === null || this.userDateRange.length === 0) {
        flag = 0
        if (this.userName === undefined || this.userName === null || this.userName === "") {
          console.log("条件为空")
          this.init();
          return;
        }
      }

      let this_vue = this
      this.tableData = []
      this.loading = true
      this.loading = true

      this.$axios({
        method: 'post',
        url: '/check/admin/getCheck',
        params: {
          'userName': this_vue.userName,
          'startTime': flag === 0 ? "" : this_vue.userDateRange[0],
          'endTime': flag === 0 ? "" : this_vue.userDateRange[1]
        }
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
                  checkId: this_vue.checkData[i].checkId,
                  name: this_vue.checkData[i].name,
                  date: date,
                  time: time,
                  type: type
                }
            )
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
