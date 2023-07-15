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
              </span>
            </template>
          </el-calendar>
        </div>
      </el-col>
      <el-col :span="23">
        <div v-if="scheduleListSelect && scheduleListSelect.length">
          <el-timeline v-for="item in scheduleListSelect">
            <el-timeline-item
                :timestamp="new Date(item.startTime).toLocaleDateString() + ' 至 ' + new Date(item.endTime).toLocaleDateString()"
                placement="top">
              <el-card>
                <div class="scheduleTitle">{{ item.scheduleTitle }}</div>
                <div class="scheduleContent">
                  <div>{{ item.scheduleContent }}</div>
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
  </div>
</template>
<script>

export default {
  name: 'schedule',
  components: {},
  data() {
    return {
      scheduleList: [],
      scheduleListSelect: [],
      day_select: null,
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

    getList() {
      let this_vue = this
      this.$axios({
        method: 'get',
        url: '/schedule/dept'
      }).then(function (response) {
        if (response.flag) {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            list.startTime = this_vue.dateFormatter(list.startTime)
            list.endTime = this_vue.dateFormatter(list.endTime)
          }
          this_vue.scheduleList = list
        }
      })
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
