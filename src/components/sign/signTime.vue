<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>考勤时间管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1)">
      设置上下班打卡时间
      <el-row style="margin-top: 10%" type="flex" justify="center">
        <div>


        </div>

      </el-row>

      <el-row>
        <!-- 日期 -->
        <el-form-item
            label="考勤起止日期">
          <el-date-picker
              v-model="timeForm.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small">
          </el-date-picker>
        </el-form-item>
      </el-row>

    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      //考勤时间表单
      timeForm: {
        startTime: '',
        backTime: ''
      },
      date: {
        beginTime: '',
        endTime: ''
      }
    }
  },
  methods: {
    //清空考勤时间表单数据
    handleClose() {
      this.timeForm = {
        date: '',
        startTime1: '',
        endTime1: '',
        startTime2: '',
        endTime2: '',
      };
    },
    open() {
      this.$alert('设置成功', '考勤时间管理', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          });
        }
      });
    },
    //提交考勤时间表单
    submitForm() {
      console.log("提交成功");
      this.open();
      this.setAttendance();
      this.handleClose();
    },
    setAttendance() {
      let this_vue = this
      //管理员设置上下班时间
      this.$axios({
        method: 'put',
        url: '/check/admin/attendance',
        params: {
          'startTime': '',
          'backTime': 'Mon Aug 22 17:30:00 CST 2022'
        },
      }).then(function (response) {
        setToken(response.data.data);
      }).catch(function (error) {
        console.log(localStorage.getItem('token'))
        console.log(error);
      });
    }
  }
}
</script>

<style lang="css">
.el-breadcrumb {
  margin-bottom: 30px;
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

.dialog-footer {
  float: left;
  padding-left: 43px;
}
</style>
