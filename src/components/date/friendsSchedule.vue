<template>
  <el-row :gutter="30">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>签到/签退</el-breadcrumb-item>
    </el-breadcrumb>
    <el-col :span="10">
      <div class="grid-content bg-purple">
        <el-calendar>
          <template slot="dateCell" slot-scope="{data}">
            <p>
              {{ data.day.split('-').slice(1).join('-') }}
              <br/>
              {{ dealMyDate(data.day) }}
            </p>
          </template>
        </el-calendar>
      </div>
    </el-col>
    <el-col :span="11">
      <div class="grid-content">
        <div class="el-select">
          <el-input v-model="temp_schedule_title" placeholder='标题'/>
        </div>
        <div class="el-select">
          <el-input v-model="temp_user_id" placeholder='提交人ID'/>
        </div>
        <el-date-picker v-model="temp_begin_time" style="width: 234px" type="date" placeholder='开始时间'
                        value-format="yyyy-MM-dd"/>
        <el-date-picker v-model="temp_end_time" style="width: 234px" type="date" placeholder='结束时间'
                        value-format="yyyy-MM-dd"/>

        <el-button @click="selectSchedule()" type='primary' size="mini"><i class='fa fa-search'></i>搜索</el-button>
        <el-button @click="getScheduleList()" type='warning' size="mini"><i class='fa fa-refresh'></i>重置</el-button>
        <el-table
            ref="filterTable"
            :data="resData"
            style="width: 100%">
          <el-table-column
              prop="begin_time"
              label="开始时间"
              sortable
              width="180"
              column-key="date"
          >
          </el-table-column>
          <el-table-column
              label="结束时间"
              width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.end_time }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="创建人id"
              width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.user_id }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="日程"
              width="180">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>内容: {{ scope.row.schedule_content }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.schedule_title }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import axios from "axios";

export default {
  name: 'friendsSchedule',
  components: {},
  data() {
    return {
      resData: [
        {
          "begin_time": "2019-12-20",
          "end_time": "2019-12-25",
          "schedule_title": "放假",
          "user_id": "111",
          "schedule_content": "dawdawdawdawdawdawdawd",
          "id": "1"
        },
        {
          "begin_time": "2022-12-20",
          "end_time": "2022-12-25",
          "schedule_title": "出差",
          "user_id": "111",
          "schedule_content": "wdawdwadwwwwwwdawd",
          "id": "2"
        },
        {
          "begin_time": "2021-12-20",
          "end_time": "2021-12-25",
          "schedule_title": "学习vue",
          "user_id": "111",
          "schedule_content": "dwadawdawdawdawd",
          "id": "3"
        },
        {
          "begin_time": "2022-10-20",
          "end_time": "2022-10-25",
          "schedule_title": "放假",
          "user_id": "111",
          "schedule_content": "awdawdawdawdawdawd",
          "id": "4"
        }
      ],
      temp_begin_time: "",
      temp_end_time: "",
      temp_schedule_title: "",
      temp_schedule_content: "",
      temp_user_id: "",
      temp_id: "",
      friendId: "1"
    }
  },
  mounted() {
  },
  methods: {
    dealMyDate(v) {
      let len = this.resData.length
      let res = ""
      for (let i = 0; i < len; i++) {
        if (this.resData[i].begin_time <= v && this.resData[i].end_time >= v) {
          res = "已有安排"
        }
      }
      return res
    },
    getScheduleList() {
      this.$axios({
        method: 'get',
        url: '/schedule/see_friends',
        data: {
          user_id: this.friendId,
        }
      }).then(res => {
        this.resData = res.data
      });
    },
    selectSchedule() {
      this.$axios({
        method: 'get',
        url: '/schedule/see_friends',
        data: {
          schedule_title: this.temp_schedule_title,
          friendId: this.friendId,
        }
      }).then(res => {
        this.resData = res.data
      });
    },
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>