<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>考勤时间管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-button type="primary" size="small" class="add_button" @click="openAddDialog">添加考勤规则</el-button>
      <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          class="personalTable">
        <el-table-column
            prop="des"
            label="描述"
            align="center">
        </el-table-column>
        <el-table-column
            prop="start"
            label="起始时间"
            align="center">
        </el-table-column>
        <el-table-column
            prop="end"
            label="终止时间"
            align="center">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                  icon="el-icon-edit"
                  size="small"
                  @click="openEditDialog(scope.row)">
              </el-button>
              <template>
                <el-popconfirm
                    confirm-button-text='好的'
                    cancel-button-text='不用了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除考勤规则吗？"
                    @confirm="deleteCheck(scope.row)"
                >
                  <el-button slot="reference" icon="el-icon-delete" type="small"></el-button>
                </el-popconfirm>
              </template>

            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加话框 -->
      <el-dialog
          title="添加考勤规则"
          :visible.sync="addDialogVisible"
          width="50%"
          :before-close="addHandleClose">
        <el-time-picker
            is-range
            v-model="addRuleTime"
            format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
        </el-time-picker>
        <span slot="footer">
                <el-button @click="addHandleClose">取 消</el-button>
                <el-button type="primary" @click="addRule">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑话框 -->
      <el-dialog
          title="修改考勤规则"
          :visible.sync="editDialogVisible"
          width="50%"
          :before-close="editHandleClose">
        <el-row
            :gutter="10"
            class='statusEdit'>
          <el-col :span="4" :offset="3">
            <div>
              描述
            </div>
          </el-col>
          <el-col :span="16">
            <div class="">
              {{ editDes }}
            </div>
          </el-col>
        </el-row>

        <el-row
            :gutter="10"
            class='statusEdit'>
          <el-col :span="4" :offset="3">
            <div>
              考勤时间
            </div>
          </el-col>
          <el-col :span="16">
            <el-time-picker
                is-range
                v-model="editRuleTime"
                format="HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
            </el-time-picker>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="submitEditDialog">确 定</el-button>
            </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      loading: false,
      checkRuleData: [],
      tableData: [],
      editDialogVisible: false,
      addDialogVisible: false,

      //add
      addRuleTime: [],

      //edit
      editId: '',
      editDes: '',
      editRuleTime: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let this_vue = this
      this_vue.tableData = []
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/check/admin/rule',
      }).then(function (response) {
        if (response.flag) {
          this_vue.checkRuleData = response.data
          for (let i = 0; i < this_vue.checkRuleData.length; i++) {
            let startObj = new Date(this_vue.checkRuleData[i].startTime);
            let endObj = new Date(this_vue.checkRuleData[i].endTime);
            let start = startObj.getHours().toString().padStart(2, '0') + ':' + startObj.getMinutes().toString().padStart(2, '0') + ':' + startObj.getSeconds().toString().padStart(2, '0')
            let end = endObj.getHours().toString().padStart(2, '0') + ':' + endObj.getMinutes().toString().padStart(2, '0') + ':' + endObj.getSeconds().toString().padStart(2, '0')
            this_vue.tableData.push(
                {
                  "id": this_vue.checkRuleData[i].id,
                  "des": "第" + (i + 1) + "次打卡",
                  "start": start,
                  "end": end
                }
            )
          }
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.loading = false
      })
    },

    openAddDialog(item) {
      this.addRuleTime = [new Date(), new Date()]
      this.addDialogVisible = true;
    },
    addHandleClose() {
      this.addDialogVisible = false;
    },
    addRule() {
      let this_vue = this
      let start = this_vue.addRuleTime[0].getHours().toString().padStart(2, '0') + ':' + this_vue.addRuleTime[0].getMinutes().toString().padStart(2, '0') + ':' + this_vue.addRuleTime[0].getSeconds().toString().padStart(2, '0')
      let end = this_vue.addRuleTime[1].getHours().toString().padStart(2, '0') + ':' + this_vue.addRuleTime[1].getMinutes().toString().padStart(2, '0') + ':' + this_vue.addRuleTime[1].getSeconds().toString().padStart(2, '0')
      this.$axios({
        method: 'post',
        url: '/check/admin/rule',
        params: {
          'startTime': start,
          'endTime': end
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "添加成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init();
      })
      this_vue.addHandleClose();
    },

    openEditDialog(item) {
      this.editDialogVisible = true;
      this.editId = item.id;
      this.editDes = item.des;

      let currentDate = new Date().toISOString().slice(0, 10);

      let start = `${currentDate}T${item.start}`;
      let end = `${currentDate}T${item.end}`;

      this.editRuleTime = [new Date(start), new Date(end)]
      console.log(this.editRuleTime)
    },
    editHandleClose() {
      this.editDialogVisible = false;
      this.editId = "";
      this.editDes = "";
      this.editRuleTime = []
    },

    submitEditDialog() {
      let this_vue = this
      let start = this_vue.editRuleTime[0].getHours().toString().padStart(2, '0') + ':' + this_vue.editRuleTime[0].getMinutes().toString().padStart(2, '0') + ':' + this_vue.editRuleTime[0].getSeconds().toString().padStart(2, '0')
      let end = this_vue.editRuleTime[1].getHours().toString().padStart(2, '0') + ':' + this_vue.editRuleTime[1].getMinutes().toString().padStart(2, '0') + ':' + this_vue.editRuleTime[1].getSeconds().toString().padStart(2, '0')
      this.$axios({
        method: 'put',
        url: '/check/admin/rule',
        params: {
          'id': this_vue.editId,
          'startTime': start,
          'endTime': end
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "修改成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init();
      })
      this_vue.editHandleClose();
    },
    deleteCheck(item) {
      let this_vue = this
      this.$axios({
        method: 'delete',
        url: '/check/admin/rule',
        params: {
          'id': item.id,
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "删除成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init();
      })
    },
  }
}
</script>

<style lang="css">
.add_button {
  margin-bottom: 10px;
}

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
.statusEdit {
  padding-bottom: 20px;
}

</style>
