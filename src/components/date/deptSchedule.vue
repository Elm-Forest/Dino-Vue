<template>
  <div>
    <el-row :gutter="30">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>日程管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门日程</el-breadcrumb-item>
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
        <div v-if="scheduleListSelect && scheduleListSelect.length">
          <el-timeline v-for="item in scheduleListSelect">
            <el-timeline-item :timestamp="new Date(item.beginTime).toLocaleDateString() + ' 至 ' + new Date(item.endTime).toLocaleDateString()" placement="top">
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
      <el-form :model="editSchedule">
        <el-form-item label="标题">
          <el-input v-model="editSchedule.scheduleTitle"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input v-model="editSchedule.scheduleContent"></el-input>
        </el-form-item>

        <el-form-item label="起止时间">
          <el-col :span="5">
            <el-date-picker type="date" placeholder="选择日期" v-model="editSchedule.beginTime" value-format="yyyy-MM-dd"
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
      <el-form :model="addSchedule">
        <el-form-item label="标题">
          <el-input v-model="addSchedule.scheduleTitle"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input v-model="addSchedule.scheduleContent"></el-input>
        </el-form-item>

        <el-form-item label="起止时间">
          <el-col :span="5">
            <el-date-picker type="date" placeholder="选择日期" v-model="addSchedule.beginTime" value-format="yyyy-MM-dd"
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
      editSchedule: {
        id: null,
        user_id: null,
        scheduleTitle: null,
        scheduleContent: null,
        beginTime: null,
        endTime: null
      },
      addSchedule: {
        id: null,
        user_id: null,
        scheduleTitle: null,
        scheduleContent: null,
        beginTime: null,
        endTime: null
      },
      scheduleList: [],
      scheduleListSelect: [],
      day_select: null,
      editVisible: false,
      addVisible: false
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
        if(this.day_select == null) this.day_select = new Date()
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
        let begin = this.scheduleList[i].beginTime
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
      this.editSchedule.beginTime = this.dateFormatter(this.editSchedule.beginTime)
      this.editSchedule.endTime = this.dateFormatter(this.editSchedule.endTime)
      this.editVisible = true
    },

    showAddDialog(date) {
      this.addVisible = true
      this.addSchedule.beginTime = this.dateFormatter(date)
    },

    closeAddDialog() {
      this.addVisible = false
      this.addSchedule = {}
    },

    closeEditDialog() {
      this.editVisible = false
      this.editSchedule = {}
    },

    getList() {
      let this_vue = this
      this.$axios({
        method: 'get',
        url: '/schedule/dept'
      }).then(function (response) {
        if (response.flag) {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            list.beginTime = this_vue.dateFormatter(list.beginTime)
            list.endTime = this_vue.dateFormatter(list.endTime)
          }
          this_vue.scheduleList = list
        }
      })
    },
    add() {
      let this_vue = this
      this.$axios({
        method: 'post',
        url: '/schedule/dept',
        params: {
          'scheduleTitle': this.addSchedule.scheduleTitle,
          'scheduleContent': this.addSchedule.scheduleContent,
          'beginTime': this.addSchedule.beginTime,
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
    },

    edit() {
      let this_vue = this
      this.$axios({
        method: 'put',
        url: '/schedule/dept',
        params: {
          'scheduleDeptId': this.editSchedule.id,
          'scheduleTitle': this.editSchedule.scheduleTitle,
          'scheduleContent': this.editSchedule.scheduleContent,
          'beginTime': this.editSchedule.beginTime,
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
    },

    del() {
      let this_vue = this
      this.$axios({
        method: 'delete',
        url: '/schedule/dept',
        params: {
          'scheduleDeptId': this.editSchedule.id,
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
