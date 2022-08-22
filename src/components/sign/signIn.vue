<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>签到/签退</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 顶部按钮区域 -->
    <div class="">
      <div class="myButton">
        <el-button
            type="success"
            size="medium"
            @click="handleSignIn">
          签到
        </el-button>
        <el-button
            type="danger"
            size="medium"
            @click="handleSignOut">
          签退
        </el-button>
      </div>
      <div class="submitButton">
        <el-button
            type="primary"
            size="small"
            @click="handleTimeoff">
          请假申请
        </el-button>
      </div>
    </div>
    <!-- list -->
    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        class="personalTable">
      <el-table-column
          prop="attendance_date"
          label="日期"
          align="center">
      </el-table-column>
      <el-table-column
          label="打卡记录"
          align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_start_time }}</span>
          <span>--</span>
          <span>{{ scope.row.updated_end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="工作时长"
          align="center">
        <template slot-scope="scope">
          {{ (scope.row.updated_duration / 3600).toFixed(1) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="24">
    </el-pagination>
    <!-- 请假申请对话框 -->
    <el-dialog
        title="出差请假申请单"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose">
      <!-- 主体区 -->
      <el-form
          :model="timeoffForm"
          label-position="right"
          label-width="140px">
        <el-form-item
            label="出差起止日期">
          <el-date-picker
              v-model="timeoffForm.timeoff_date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small">
          </el-date-picker>
        </el-form-item>
        <el-form-item
            label="出差天数">
          <el-input-number
              v-model="timeoffForm.timeoff_day"
              size="small"
              :min="1"
              class="inputForm">
          </el-input-number>
        </el-form-item>
        <el-form-item
            label="出差备注">
          <el-input
              type="textarea"
              :rows="5"
              v-model="timeoffForm.decs"
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
          取 消
        </el-button>
        <el-button
            type="primary"
            @click="submitForm"
            size="small">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 签到按钮对话框 -->
    <el-dialog
        title="签到"
        :visible.sync="dialogFormVisible2"
        :before-close="handleClose2">
      <!-- 主体区 -->
      <el-form
          :model="signInForm"
          label-position="right"
          label-width="100px">
        <el-form-item
            label="签到备注">
          <el-input
              type="textarea"
              :rows="5"
              v-model="signInForm.message"
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
            @click="handleClose2"
            size="small">
          取 消
        </el-button>
        <el-button
            type="primary"
            @click="submitForm2"
            size="small">
          提 交
        </el-button>
      </div>
    </el-dialog>
    <!-- 签退按钮对话框 -->
    <el-dialog
        title="签退"
        :visible.sync="dialogFormVisible3"
        :before-close="handleClose3">
      <!-- 主体区 -->
      <el-form
          :model="signOutForm"
          label-position="right"
          label-width="100px">
        <el-form-item
            label="签退备注">
          <el-input
              type="textarea"
              :rows="5"
              v-model="signOutForm.message"
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
            @click="handleClose3"
            size="small">
          取 消
        </el-button>
        <el-button
            type="primary"
            @click="submitForm3"
            size="small">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //当前页
      currentPage: 1,
      //请假单对话框的显示
      dialogFormVisible: false,
      //签到备注对话框的显示
      dialogFormVisible2: false,
      //签退备注对话框的显示
      dialogFormVisible3: false,
      //请假单
      timeoffForm: {
        timeoff_date: [],
        timeoff_day: 1,
        timeoff_type: '',
        except_exchange_date: [],
        decs: ''
      },
      //签到备注
      signInForm: {
        message: ''
      },
      //签退备注
      signOutForm: {
        message: ''
      },
      //表格数据
      tableData: [{
        "attendance_date": "2022-08-30",
        "create_time": 1527753859,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-30",
        "is_changed": false,
        "original_duration": 43014,
        "status": "normal",
        "update_time": 1527753859,
        "updated_duration": 43014,
        "updated_end_time": "22:57",
        "updated_start_time": "10:00",
        "workday": 1
      }, {
        "attendance_date": "2022-08-29",
        "create_time": 1527667627,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-29",
        "is_changed": false,
        "original_duration": 36614,
        "status": "normal",
        "update_time": 1527667627,
        "updated_duration": 36614,
        "updated_end_time": "21:07",
        "updated_start_time": "09:57",
        "workday": 1
      }, {
        "attendance_date": "2022-08-28",
        "create_time": 1527647622,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-28",
        "is_changed": false,
        "original_duration": 36210,
        "status": "normal",
        "update_time": 1527647622,
        "updated_duration": 36210,
        "updated_end_time": "21:01",
        "updated_start_time": "09:57",
        "workday": 1
      }, {
        "attendance_date": "2022-08-27",
        "create_time": 1527647620,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-26",
        "is_changed": false,
        "original_duration": 34758,
        "status": "normal",
        "update_time": 1527647620,
        "updated_duration": 34758,
        "updated_end_time": "20:56",
        "updated_start_time": "10:16",
        "workday": 1
      }, {
        "attendance_date": "2022-08-26",
        "create_time": 1527647616,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-25",
        "is_changed": false,
        "original_duration": 35747,
        "status": "normal",
        "update_time": 1527647616,
        "updated_duration": 35747,
        "updated_end_time": "20:55",
        "updated_start_time": "09:59",
        "workday": 1
      }, {
        "attendance_date": "2022-08-25",
        "create_time": 1527647613,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-24",
        "is_changed": false, "original_duration": 35336,
        "status": "normal",
        "update_time": 1527647613,
        "updated_duration": 35336,
        "updated_end_time": "20:33",
        "updated_start_time": "09:44",
        "workday": 1
      }, {
        "attendance_date": "2022-08-24",
        "create_time": 1527647609,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-23",
        "is_changed": false,
        "original_duration": 40052,
        "status": "normal",
        "update_time": 1527647609,
        "updated_duration": 40052,
        "updated_end_time": "21:46",
        "updated_start_time": "09:38",
        "workday": 1
      }, {
        "attendance_date": "2022-08-23",
        "create_time": 1527647608,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-22",
        "is_changed": false,
        "original_duration": 36491,
        "status": "normal",
        "update_time": 1527647608,
        "updated_duration": 36491,
        "updated_end_time": "21:11",
        "updated_start_time": "10:03",
        "workday": 1
      }, {
        "attendance_date": "2022-08-22",
        "create_time": 1527647604,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-21",
        "is_changed": false,
        "original_duration": 35872,
        "status": "normal",
        "update_time": 1527647604,
        "updated_duration": 35872,
        "updated_end_time": "21:09",
        "updated_start_time": "10:12",
        "workday": 1
      }, {
        "attendance_date": "2022-08-21",
        "create_time": 1527647604,
        "email": "xiaohui.liang@ihandysoft.com",
        "id": "xiaohui.liang@ihandysoft.com2018-05-20",
        "is_changed": false,
        "original_duration": 0,
        "status": "normal",
        "update_time": 1527647604,
        "updated_duration": 0,
        "updated_end_time": "19:49",
        "updated_start_time": "19:49",
        "workday": 0
      }]
    }
  },
  methods: {
    //打开请假申请表
    handleTimeoff() {
      this.dialogFormVisible = true;
    },
    //打开签到备注
    handleSignIn() {
      this.dialogFormVisible2 = true;
    },
    //打开签退备注
    handleSignOut() {
      this.dialogFormVisible3 = true;
    },
    //每页的个数发生变化
    handleSizeChange(item) {
      console.log(item);
    },
    //跳转到某页
    handleCurrentChange(item) {
      console.log(item);
    },
    //清空请假单数据
    handleClose() {
      this.timeoffForm = {
        timeoff_date: [],
        timeoff_day: 1,
        timeoff_type: '',
        except_exchange_date: [],
        decs: ''
      };
      this.dialogFormVisible = false;
    },
    //清空签到备注数据
    handleClose2() {
      this.signInForm = {
        message: ''
      };
      this.dialogFormVisible2 = false;
    },
    //清空签退备注数据
    handleClose3() {
      this.signOutForm = {
        message: ''
      };
      this.dialogFormVisible3 = false;
    },
    //提交请假单表单
    submitForm() {
      console.log("提交成功");
      this.handleClose();
      this.setHoilDay();
    },
    //提交签到表单
    submitForm2() {
      console.log("提交成功");
      this.handleClose2();
      this.signIn();
    },
    //提交签退表单
    submitForm3() {
      console.log("提交成功");
      this.handleClose3();
      this.signOut();
    },
    signIn() {
      //用户签到
      this.$axios({
        method: 'post',
        url: '/check/sign_in',
      }).then(function (response) {
        setToken(response.data.data);
        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        console.log(localStorage.getItem('token'))
        console.log(error);
      });
    },
    signOut() {
      //用户签退
      this.$axios({
        method: 'post',
        url: '/check/sign_out',
      }).then(function (response) {
        setToken(response.data.data);
        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        console.log(localStorage.getItem('token'))
        console.log(error);
      });
    },
    setHoilDay() {
      //管理员设置用户假期时间
      this.$axios({
        method: 'put',
        url: '/check/set_hoilday',
        params: {
          'beginTime': 'Mon Aug 22 08:30:00 CST 2022',
          'endTime': 'Mon Aug 22 17:30:00 CST 2022'
        },
      }).then(function (response) {
        setToken(response.data.data);
        console.log(JSON.stringify(response.data));
      }).catch(function (error) {
        console.log(localStorage.getItem('token'))
        console.log(error);
      });
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.myButton {
  float: left;
}

.submitButton {
  float: right;
}

.personalTable {
  margin-bottom: 40px
}

.textareaDecs {
  width: 350px;
}

.inputForm {
  width: 220px;
}

/deep/ .el-dialog__footer {
  padding-bottom: 40px;
}
</style>
