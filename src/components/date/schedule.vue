<template>
  <div>
    <el-row :gutter="30">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>日程管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的日程</el-breadcrumb-item>
      </el-breadcrumb>
      <el-col>
        <div>
          <el-calendar v-model="day_select">
            <template
                slot="dateCell"
                slot-scope="{date, data}">
              <span :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(1).join('-') }}
                <el-button style="margin-left: 10px" type="text" v-if="data.isSelected" @click="showAddDialog(date)">添加日程</el-button>
              </span>
            </template>
          </el-calendar>
        </div>
      </el-col>
      <el-col :span="23">
        <div v-if="scheduleListSelect && scheduleListSelect.length" v-loading="loading">
          <el-timeline v-for="item in scheduleListSelect">
            <el-timeline-item
                :timestamp="new Date(item.startTime).toLocaleDateString() + ' 至 ' + new Date(item.endTime).toLocaleDateString()"
                placement="top">
              <el-card>
                <div class="scheduleTitle">{{ item.scheduleTitle }}</div>
                <div class="scheduleContent">
                  <div>{{ item.scheduleContent }}</div>
                  <el-button type="text" class="button" style="float: right" @click="showEditDialog(item)">编辑
                  </el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <el-card style="margin-left: 16px" v-if="!scheduleListSelect || !scheduleListSelect.length">
          暂无安排
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
        title="修改日程"
        :visible.sync="editVisible">
      <el-form :model="editSchedule" :rules="editScheduleRule" ref="editRuleForm">
        <el-form-item label="标题" prop="scheduleTitle">
          <el-input v-model="editSchedule.scheduleTitle"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="scheduleContent">
          <el-input v-model="editSchedule.scheduleContent"></el-input>
        </el-form-item>

        <el-form-item label="起止时间" prop="date">
          <el-col :span="5">
            <el-date-picker type="date" placeholder="选择日期" v-model="editSchedule.startTime" value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col style="margin-left: 4%" :span="1">-</el-col>
          <el-col :span="5">
            <el-date-picker type="date" placeholder="选择日期" v-model="editSchedule.endTime" value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item style="margin-top: 2%;" class="clearfix">
          <div style="float: right">
            <el-button type="primary" @click="edit">确定修改</el-button>
            <el-button type="danger" @click="del">删除日程</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
        title="添加日程"
        :visible.sync="addVisible">
      <el-form :model="addSchedule" :rules="addScheduleRule" ref="addRuleForm">
        <el-form-item label="标题" prop="scheduleTitle">
          <el-input v-model="addSchedule.scheduleTitle"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="scheduleContent">
          <el-input v-model="addSchedule.scheduleContent"></el-input>
        </el-form-item>

        <el-form-item label="起止时间" prop="date">
          <el-col :span="5">
            <el-date-picker type="date" placeholder="选择日期" v-model="addSchedule.startTime" value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col style="margin-left: 4%" :span="1">-</el-col>
          <el-col :span="5">
            <el-date-picker type="date" placeholder="选择日期" v-model="addSchedule.endTime" value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item style="margin-top: 2%;" class="clearfix">
          <div style="float: right">
            <el-button type="primary" @click="add">添加</el-button>
            <el-button @click="closeAddDialog">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'schedule',
  components: {},
  data() {
    return {
      loading: false,
      editSchedule: {
        id: null,
        user_id: null,
        scheduleTitle: null,
        scheduleContent: null,
        startTime: null,
        endTime: null
      },
      addSchedule: {
        id: null,
        user_id: null,
        scheduleTitle: null,
        scheduleContent: null,
        startTime: null,
        endTime: null
      },
      scheduleList: [],
      scheduleListSelect: [],
      day_select: null,
      editVisible: false,
      addVisible: false,

      editScheduleRule: {
        scheduleTitle: [
          {required: true, message: '请输入标题', trigger: 'blur'},
        ],
        scheduleContent: [
          {required: true, message: '请输入内容', trigger: 'blur'},
        ]
      },
      addScheduleRule: {
        scheduleTitle: [
          {required: true, message: '请输入标题', trigger: 'blur'},
        ],
        scheduleContent: [
          {required: true, message: '请输入内容', trigger: 'blur'},
        ]
      }
    }
  },
  created() {
    this.init()
  },

  watch: {
    day_select: {
      handler(newVal) {
        if (newVal) {
          this.scheduleListSelect = this.getScheduleByDayStr(newVal)
        }
      }
    },
    scheduleList: {
      handler(newVal) {
        if (this.day_select == null) this.day_select = new Date()
        this.scheduleListSelect = this.getScheduleByDayStr(this.day_select)
      }
    }

  },

  methods: {
    init() {
      this.day_select = new Date()
      this.getList()
    },

    getScheduleByDayStr(date) {
      let list = []
      for (let i = 0; i < this.scheduleList.length; i++) {
        let begin = this.scheduleList[i].startTime
        let end = this.scheduleList[i].endTime
        if (this.middleDayStr(begin, end, date)) {
          list.push(this.scheduleList[i])
        }
      }
      return list
    },

    middleDayStr(begin, end, day) {
      begin = new Date(begin)
      end = new Date(end)
      day = new Date(day)

      return begin.getTime() <= day.getTime() && end.getTime() >= day.getTime()
    },

    showEditDialog(item) {
      this.editSchedule = Object.assign({}, item)
      this.editSchedule.startTime = this.dateFormatter(this.editSchedule.startTime)
      this.editSchedule.endTime = this.dateFormatter(this.editSchedule.endTime)
      this.editVisible = true
    },

    showAddDialog(date) {
      this.addVisible = true
      this.addSchedule.startTime = this.dateFormatter(date)
    },

    closeAddDialog() {
      this.addVisible = false
      this.addSchedule = {}
      this.$refs.addRuleForm.resetFields();
    },

    closeEditDialog() {
      this.editVisible = false
      this.editSchedule = {}
      this.$refs.editRuleForm.resetFields();
    },

    getList() {
      let this_vue = this
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/schedule/list'
      }).then(function (response) {
        if (response.flag) {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            list[i].startTime = this_vue.dateFormatter(list[i].startTime)
            list[i].endTime = this_vue.dateFormatter(list[i].endTime)
          }
          this_vue.scheduleList = list
          this_vue.loading = false
        }
      })
    },
    add() {
      let this_vue = this
      if (new Date(this_vue.addSchedule.endTime) < new Date()) {
        this_vue.$message({
          message: "终止日期不能小于今天哦",
          type: 'warning'
        });
        return;
      }
      this.$refs.addRuleForm.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/schedule',
            params: {
              'scheduleTitle': this.addSchedule.scheduleTitle,
              'scheduleContent': this.addSchedule.scheduleContent,
              'startTime': this.addSchedule.startTime,
              'endTime': this.addSchedule.endTime
            }
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
            this_vue.getList()
          })
          this.closeAddDialog()
        } else {
          this_vue.$message({
            message: "表单填写格式有误",
            type: 'warning'
          });
        }
      });

    },

    edit() {
      let this_vue = this
      this.$refs.editRuleForm.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'put',
            url: '/schedule',
            params: {
              'id': this.editSchedule.id,
              'scheduleTitle': this.editSchedule.scheduleTitle,
              'scheduleContent': this.editSchedule.scheduleContent,
              'startTime': this.editSchedule.startTime,
              'endTime': this.editSchedule.endTime
            }
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
            this_vue.getList()
          })
          this.editVisible = false
        } else {
          this_vue.$message({
            message: "表单填写格式有误",
            type: 'warning'
          });
        }
      })

    },

    del() {
      let this_vue = this
      this.$axios({
        method: 'delete',
        url: '/schedule',
        params: {
          'scheduleId': this.editSchedule.id,
        }
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
        this_vue.getList()
      })
      this.closeEditDialog()
    },

    dateFormatter(dates) {
      let date = new Date(dates);
      let strDate = date.getFullYear() + "-";
      let month = date.getMonth() + 1;
      let day = date.getDate();
      //格式化日期,月日时分秒保持两位
      strDate = strDate + (month > 8 ? month : "0" + month) + "-"
          + (day > 9 ? day : "0" + day)
      return strDate;
    }
  }

}

</script>

<style>
.is-selected {
  color: #1989FA;
}

.scheduleTitle {
  margin-bottom: 20px;
  font-size: 20px;
}

.scheduleContent {
  font-size: 13px;
  color: #999;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
</style>
