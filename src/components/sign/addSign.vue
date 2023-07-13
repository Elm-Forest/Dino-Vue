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

            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item
          prop="desc"
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

            size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item
          prop="desc"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdd: true,

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
    }
  }
}
</script>

<style lang="css">


</style>
