<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>考勤时间管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区 -->
    <el-form :model="timeForm" label-position="right" label-width="140px">
      <!-- 日期 -->
      <el-form-item label="考勤起止日期">
        <el-date-picker
          v-model="timeForm.date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 上班时间 -->
      <el-form-item label="上班打卡时间">
        <el-time-select
          placeholder="起始时间"
          v-model="timeForm.startTime1"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
          }"
        >
        </el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="timeForm.endTime1"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime: timeForm.startTime1,
          }"
        >
        </el-time-select>
      </el-form-item>
      <!-- 下班时间 -->
      <el-form-item label="下班打卡时间">
        <el-time-select
          placeholder="起始时间"
          v-model="timeForm.startTime2"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
          }"
        >
        </el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="timeForm.endTime2"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime: timeForm.startTime2,
          }"
        >
        </el-time-select>
      </el-form-item>
    </el-form>
    <!-- 底部区 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small"> 重置 </el-button>
      <el-button type="primary" @click="submitForm" size="small">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //考勤时间表单
      timeForm: {
        date: '',
        startTime1: '',
        endTime1: '',
        startTime2: '',
        endTime2: '',
      },
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
      }
    },
    open() {
      this.$alert('设置成功', '考勤时间管理', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$message({
            type: 'info',
            message: `action: ${action}`,
          })
        },
      })
    },
    //提交考勤时间表单
    submitForm() {
      console.log('提交成功')
      this.open()
      this.setAttendance()
      this.handleClose()
    },
    setAttendance() {
      //管理员设置上下班时间
      this.$axios({
        method: 'put',
        url: '/check/set_attendance',
        params: {
          startTime: 'Mon Aug 22 08:30:00 CST 2022',
          backTime: 'Mon Aug 22 17:30:00 CST 2022',
        },
      })
        .then(function (response) {
          setToken(response.data.data)
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error)
        })
    },
  },
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
  margin-bottom: 40px;
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
