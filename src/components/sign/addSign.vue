<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>补签申请</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区 -->
    <el-form
        :model="addSignForm"
        label-position="right"
        label-width="140px">
      <el-form-item
          label="补签起止日期">
        <el-date-picker
            v-model="addSignForm.addSign_date"
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
          label="补签天数">
        <el-input-number
            v-model="addSignForm.addSign_day"
            size="small"
            :min="1"
            class="inputForm">
        </el-input-number>
      </el-form-item>
      <el-form-item
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
    <!-- 底部区 -->
    <div
        slot="footer"
        class="dialog-footer">
      <el-button
          @click="handleClose"
          size="small">
        重置
      </el-button>
      <el-button
          type="primary"
          @click="submitForm"
          size="small">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //补签表单
      addSignForm: {
        addSign_date: [],
        timeoff_day: 1,
        decs: ''
      }
    }
  },
  methods: {
    //清空补签表单数据
    handleClose() {
      this.addSignForm = {
        addSign_date: [],
        timeoff_day: 1,
        decs: ''
      };
    },
    open() {
      this.$alert('提交成功', '补签申请', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          });
        }
      });
    },
    //提交补签表单
    submitForm() {
      console.log("提交成功");
      this.open();
      this.handleClose();
    }
  }
}
</script>

<style lang="css">
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

.dialog-footer {
  float: right;
}
</style>
