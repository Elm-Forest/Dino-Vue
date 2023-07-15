<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>补签/请假</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin-bottom: 20px">
      <el-button
          type="primary"
          size="small"
          :disabled="isAdd"
          @click="changeAdd">
        补签申请
      </el-button>

      <el-button
          type="primary"
          size="small"
          :disable="!isAdd"
          @click="changeNoAdd">
        请假申请
      </el-button>
      <el-button
          type="primary"
          size="small"
          @click="openAbsent">
        查看缺勤日志
      </el-button>
      <el-button
          type="primary"
          size="small"
          :disable="!isAdd"
          @click="test">
        测试缺勤
      </el-button>
    </div>

    <!-- 主体区 -->
    <el-form
        v-if="isAdd"
        :model="addSignForm"
        ref="addSignFormRef"
        :rules="signRules"
        label-position="right"
        label-width="140px">
      <el-form-item
          prop="date"
          label="补签起止日期">
        <el-date-picker
            v-model="addSignForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item
          prop="decs"
          label="补签备注">
        <el-input
            type="textarea"
            :rows="5"
            v-model="addSignForm.decs"

            size="small"
            class="textareaDecs">
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 主体区 -->
    <el-form
        v-if="!isAdd"
        :model="addSignForm"
        ref="addSignFormRef"
        label-position="right"
        :rules="signRules"
        label-width="140px">
      <el-form-item
          prop="date"
          label="请假起止日期">
        <el-date-picker
            v-model="addSignForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item
          prop="decs"
          label="请假备注">
        <el-input
            type="textarea"
            :rows="5"
            v-model="addSignForm.decs"
            size="small"
            class="textareaDecs">
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <div
        slot="footer"
        class="dialog-footer">
      <el-button
          @click="handleClose"
          size="small">
        重置表单
      </el-button>
      <el-button
          type="primary"
          @click="submitForm"
          size="small">
        提交申请
      </el-button>
    </div>

    <!-- 编辑话框 -->
    <el-dialog
        title="状态更改"
        :visible.sync="absentVisible"
        width="50%"
        :before-close="editHandleClose">

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
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdd: true,
      absentVisible : false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      //表格数据
      tableData: [],
      checkData: [],


      //补签表单
      addSignForm: {
        date: [],
        decs: ''
      },

      signRules: {
        date: [
          {required: true, message: '请选择日期', trigger: 'blur'}
        ],
        decs: [
          {required: true, message: '申请描述不能为空', trigger: 'blur'}
        ]
      },

    }
  },
  methods: {
    //清空补签表单数据
    handleClose() {
      this.addSignForm = {
        date: [],
        decs: ''
      };
      this.$refs.addSignFormRef.resetFields();
    },
    //提交补签表单
    submitForm() {
      let this_vue = this
      let beginTime = null;
      let endTime = null;
      let type = this_vue.isAdd ? 0 : 1;
      if (this.addSignForm.date !== null || this.addSignForm.date.length !== 0) {
        beginTime = this_vue.addSignForm.date[0]
        endTime = this_vue.addSignForm.date[1]
      }

      if (type === 0 && new Date(endTime) > new Date()) {
        this_vue.$message({
          message: "补签日期不能设置在今日之后",
          type: 'warning'
        });
        this_vue.handleClose();
        return;
      }
      if (type === 1 && new Date(beginTime) < new Date()) {
        this_vue.$message({
          message: "请假日期不能设置在今日之前",
          type: 'warning'
        });
        this_vue.handleClose();
        return;
      }

      this.$refs.addSignFormRef.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'get',
            url: '/check/apply',
            params: {
              'applyStartTime': beginTime,
              'applyEndTime': endTime,
              'des': this_vue.addSignForm.decs,
              'type': type,
            }
          }).then(function (response) {
            if (response.flag) {
              this_vue.$message({
                message: "申请成功",
                type: 'success'
              });
            } else {
              this_vue.$message({
                message: response.message,
                type: 'warning'
              });
            }

          })
        } else {
          console.log(this_vue.addSignForm)
          this_vue.$message({
            message: "表单信息不能为空",
            type: 'warning'
          });
        }
        this_vue.handleClose();
      })

    },
    changeAdd() {
      this.isAdd = true
    },
    changeNoAdd() {
      this.isAdd = false
    },
    test() {
      this.$axios({
        method: 'get',
        url: '/check/test',
      }).then(function (response) {
      })
    },

    openAbsent() {
      this.absentVisible = true
      this.getAbsent();
    },
    editHandleClose() {
      this.absentVisible = false
    },
    handleSizeChange(item) {
      this.pageSize = item
      this.currentPage = 1
    },
    handleCurrentChange(item) {
      this.currentPage = item
    },

    getAbsent() {
      let this_vue = this
      this_vue.tableData = []
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/check/absent',
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

<style lang="css">


</style>
