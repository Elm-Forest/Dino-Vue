<template>
  <div class="app-container">
    <div class="box" v-if="show">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>垃圾箱</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider content-position="left"><b>垃圾箱</b></el-divider>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input placeholder="请输入标题名称" v-model="searchtxt" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div>
        <el-dialog
            title="邮件详情"
            :visible.sync="dialogVisible"
            width="50%">
          <el-form>
            <el-form-item :label-width="formLabelWidth" label="主题：">
              <h3 style="display: inline">{{ dialogForm.emailTitle }}</h3>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="正文：">
              <div v-html="dialogForm.emailContent"></div>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <div>
        <el-table v-loading="listLoading" :data="list2" element-loading-text="Loading" border
                  fit highlight-current-row>
          <template slot="empty">
            <el-empty :image-size="100" :description="emptyDesc"></el-empty>
          </template>
          <el-table-column label="邮件标题" align="center">
            <template slot-scope="scope">
              {{ scope.row.emailTitle }}
            </template>
          </el-table-column>
          <el-table-column label="发件人" align="center">
            <template slot-scope="scope">
              {{ scope.row.sendName }}
            </template>
          </el-table-column>
          <el-table-column label="收件人" align="center">
            <template slot-scope="scope">
              {{ scope.row.acceptUserName }}
            </template>
          </el-table-column>
          <el-table-column label="发件时间" align="center">
            <template slot-scope="scope">
              {{ timestampToTime(scope.row.sendTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="order(scope.row.id)">
                查看详情
              </el-button>
              <el-button type="success" size="mini" @click="recover(scope.row.id, scope.$index)">
                恢复
              </el-button>
              <el-button type="danger" size="mini" @click="deleted(scope.row.id, scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo.count"
            :current-page="queryInfo.current"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.size"
            @current-change="changepage"
            @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
    <div class="remind" v-if="!show">
      <h1>请绑定邮箱以查看详情</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        current: 1,
        size: 5,
        count: 1
      },
      formLabelWidth: '80px',
      emptyDesc: "加载中...",
      searchtxt: "",
      list: null,
      list2: [],
      contentList: [],
      listLoading: false,
      dialogVisible: false,
      show: true,
      dialogForm: {}
    };
  },
  created() {
    this.listLoading = true;
  },
  mounted() {
    const this_vue = this;
    this.show = this.$store.state.bindMailbox
    this.$axios.get('/message/mail/account/check').then(response => {
      if (response.data != null) {
        this_vue.$store.commit('SET_SHOW');
        this_vue.show = this_vue.$store.state.bindMailbox
        this_vue.selectEmails()
      }
    })
  },
  methods: {
    handleSizeChange(size) {
      this.queryInfo.size = size
      this.selectEmails()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    selectEmails() {
      const _this = this
      this.$axios({
        url: '/message/mail/garbage',
        method: 'get',
        params: {
          'current': this.queryInfo.current,
          'size': this.queryInfo.size
        }
      }).then(res => {
        if (res.data.count === 0 || res.data.count === '') {
          _this.emptyDesc = "空空如也"
        }
        _this.contentList = res.data.recordList
        _this.queryInfo.count = res.data.count
        _this.list2 = this.contentList.filter((ele, i) => {
          return i < 5;
        });
        _this.listLoading = false;
      })
    },
    changepage(index) {
      this.queryInfo.current = index
      this.selectEmails()
      this.list2 = this.contentList.filter((ele, i) => {
        return i >= 5 * (index - 1) && i < 5 * index;
      });
    },
    /* 搜索功能 */
    search() {

      this.list2 = this.contentList.filter((ele) => {
        return ele.emailTitle.indexOf(this.searchtxt) !== -1;
      });
    },
    /* 查看详情 */
    order(id) {
      const _this = this;
      this.$axios({
        method: 'get',
        url: '/message/mail',
        params: {
          'id': id
        }
      }).then(res => {
        _this.dialogForm = res.data
        _this.dialogVisible = true
      })
    },
    recover(id, index) {
      let _this = this;
      this.$axios({
        url: '/message/mail/garbage/rec',
        method: 'post',
        params: {
          'id': id
        }
      }).then(() => {
        _this.$message({
          duration: "1000",
          message: "恢复成功",
          type: "success",
          onClose: function () {
            _this.list2.splice(index, 1);
          },
        });
      })
    },
    deleted(id, index) {
      let _this = this;
      this.$axios({
        url: '/message/mail/garbage',
        method: 'delete',
        params: {
          'id': id
        }
      }).then(res => {
        _this.$message({
          duration: "1000",
          message: "删除成功",
          type: "success",
          onClose: function () {
            _this.list2.splice(index, 1);
          },
        });
      })
    },
    timestampToTime(time) {
      if (time !== null && time !== '') {
        time = time.replace(/T|\.\d+\+\d{2}:\d{2}/g, ' ')
      }
      return time;
    },
  },
};
</script>
<style lang='scss' scoped>
.title {
  background: #f4f4f4;
  font-size: 24px;
  line-height: 120px;
  height: 120px;
  text-align: center;
  font-weight: bold;
  color: #333;
}


//
.remind {
  width: 100%;
  height: 100%;
  display: flex;
}

.remind h1 {
  margin: 150px auto;

}

.el-pagination {
  margin-top: 15px;
}
</style>

