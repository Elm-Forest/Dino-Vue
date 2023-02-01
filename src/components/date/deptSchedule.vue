<template>
  <el-row :gutter="30">
    <el-col :span="10">
      <div class="grid-content bg-purple">
        <el-calendar>
          <template v-slot:dateCell="{ data }">
            <p>
              {{ data.day.split('-').slice(1).join('-') }}
              <br />
              {{ dealMyDate(data.day) }}
            </p>
          </template>
        </el-calendar>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="grid-content">
        <div class="el-select">
          <el-input v-model="temp_schedule_title" placeholder="标题" />
        </div>
        <div class="el-select">
          <el-input v-model="temp_schedule_content" placeholder="内容" />
        </div>
        <div class="el-select">
          <el-input v-model="temp_dept_id" placeholder="部门ID" />
        </div>
        <el-date-picker
          v-model="temp_begin_time"
          style="width: 234px"
          type="date"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
        />
        <el-date-picker
          v-model="temp_end_time"
          style="width: 234px"
          type="date"
          placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />

        <el-button @click="selectSchedule()" type="primary" size="mini"
          ><i class="fa fa-search"></i>搜索</el-button
        >
        <el-button @click="getScheduleList()" type="warning" size="mini"
          ><i class="fa fa-refresh"></i>重置</el-button
        >
        <el-button @click="addSchedule()" type="success" size="mini"
          ><i class="fa fa-plus"></i>添加</el-button
        >
        <el-table ref="filterTable" :data="resData" style="width: 100%">
          <el-table-column
            prop="begin_time"
            label="开始时间"
            sortable
            width="180"
            column-key="date"
          >
          </el-table-column>
          <el-table-column label="结束时间" width="180">
            <template v-slot="scope">
              <el-icon><el-icon-time /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.end_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门id" width="180">
            <template v-slot="scope">
              <el-icon><el-icon-time /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.dept_id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日程" width="180">
            <template v-slot="scope">
              <el-popover trigger="hover" placement="top">
                <p>内容: {{ scope.row.schedule_content }}</p>
                <template v-slot:reference>
                  <div class="name-wrapper">
                    <el-tag size="medium">{{
                      scope.row.schedule_title
                    }}</el-tag>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button size="mini" @click="scheduleEdit(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="scheduleDelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="post" id="postContent" v-model="editVisible">
          <input
            class="title"
            v-model="temp_schedule_title"
            placeholder="请输入标题（1-50个字符）"
            v-if="editVisible"
          />
          <textarea
            class="content"
            v-model="temp_schedule_content"
            v-if="editVisible"
          ></textarea>
          <el-button
            size="mini"
            type="danger"
            v-if="editVisible"
            @click="editSave()"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="editVisible"
            @click="editCancel()"
            >取消</el-button
          >
        </div>
      </div></el-col
    >
  </el-row>
</template>

<script>
import { Time as ElIconTime } from '@element-plus/icons'
import axios from 'axios'
export default {
  components: {
    ElIconTime,
  },
  name: 'schedule',
  data() {
    return {
      resData: [
        {
          begin_time: '2019-12-20',
          end_time: '2019-12-25',
          schedule_title: '放假',
          dept_id: '111',
          schedule_content: 'first',
          id: '1',
        },
        {
          begin_time: '2022-12-20',
          end_time: '2022-12-25',
          schedule_title: '出差',
          dept_id: '111',
          schedule_content: 'second',
          id: '2',
        },
        {
          begin_time: '2021-12-20',
          end_time: '2021-12-25',
          schedule_title: '学习vue',
          dept_id: '111',
          schedule_content: '3',
          id: '3',
        },
        {
          begin_time: '2022-10-20',
          end_time: '2022-10-25',
          schedule_title: '放假',
          dept_id: '111',
          schedule_content: '4',
          id: '4',
        },
      ],
      temp_begin_time: '',
      temp_end_time: '',
      temp_schedule_title: '',
      temp_schedule_content: '',
      temp_dept_id: '',
      temp_id: '',
      editVisible: false,
    }
  },
  mounted() {},
  methods: {
    dealMyDate(v) {
      let len = this.resData.length
      let res = ''
      for (let i = 0; i < len; i++) {
        if (this.resData[i].begin_time <= v && this.resData[i].end_time >= v) {
          res = '已有安排'
        }
      }
      return res
    },
    getScheduleList() {
      return axios.get('/schedule/find_dept').then((res) => {
        console.log(res.data)
        this.resData = res.data
      })
    },
    selectSchedule() {
      this.$axios({
        method: 'get',
        url: '/schedule/find_dept',
        data: {
          schedule_title: this.temp_schedule_title,
          dept_id: this.temp_dept_id,
        },
      }).then((res) => {
        this.resData = res.data
      })
    },
    scheduleEdit(row) {
      this.editVisible = !this.editVisible
      this.temp_id = row
    },
    editSave() {
      this.$axios({
        method: 'put',
        url: '/schedule/update_dept',
        data: {
          schedule_title: this.temp_schedule_title,
          schedule_content: this.temp_schedule_content,
          id: this.temp_id,
        },
      }).then(function (response) {
        console.log(response)
      })
      this.editVisible = !this.editVisible
      this.getScheduleList()
    },
    editCancel() {
      this.editVisible = !this.editVisible
    },
    addSchedule() {
      // Send a POST request
      this.$axios({
        method: 'post',
        url: '/schedule/add_dept',
        data: {
          begin_time: this.temp_begin_time,
          end_time: this.temp_end_time,
          schedule_title: this.temp_schedule_title,
          dept_id: this.temp_dept_id,
          schedule_content: this.temp_schedule_content,
        },
      }).then(function (response) {
        console.log(response)
      })
      this.getScheduleList()
    },
    scheduleDelete(row) {
      // Send a POST request
      this.$axios({
        method: 'delete',
        url: '/schedule/del_dept',
        data: {
          id: row,
        },
      }).then(function (response) {
        console.log(response)
      })
      this.getScheduleList()
    },
  },
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
