<template>
  <div class="app-container">
    <div class="box" v-if="show">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>收件箱</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider content-position="left"><b>收件箱</b></el-divider>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input placeholder="请输入标题名称" v-model="searchtxt" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <br>
      <el-table v-loading="listLoading" :data="list2" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label="序号" width="120">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="邮件标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="发件人">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="收件时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="order(scope.row.id)">
              查看详情
            </el-button>
            <el-button type="danger" size="mini" @click="deleted(scope.row.id, scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination small layout="prev, pager, next" :total="list.length" :page-size="5" @current-change="changepage">
      </el-pagination>
    </div>

    <!--  -->
    <div class="remind" v-if="!show">
      <h1>请绑定邮箱以查看详情</h1>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchtxt: "" /* 搜索的文本信息 */,
      list: null,
      list2: [],
      listLoading: false,

      // 
      show: true,

    };
  },
  created() {
    let _this = this;
    this.listLoading = false; /* 加载状态 */
    _this.list = [
      {
        title: "标题2",
        username: "123",
        email: "123",
        id: 1,
        date: 1660171002715,
      },
    ];
    // _this.list2 = _this.list;
    let result = this.list.filter((ele, i) => {
      return i < 5;
    });
    this.list2 = result;
  },
  mounted() {
    this.show = this.$store.state.bindMailbox
  },
  methods: {
    changepage(index) {
      console.log(index);
      let result = this.list.filter((ele, i) => {
        return i >= 5 * (index - 1) && i < 5 * index;
      });
      this.list2 = result;
    },
    /* 搜索功能 */
    search() {
      console.log(this.list);
      var result = this.list.filter((ele) => {
        return ele.title.indexOf(this.searchtxt) != -1;
      });
      this.list2 = result;
    },
    /* 查看详情 */
    order(index) {
      console.log(index);
      this.$router.push({ name: "sjxDetail", params: { id: index } });
    },
    /* 删除功能 */
    /* id为对象id,index为数组中的索引 */
    deleted(id, index) {
      let _this = this;
      this.listLoading = true;
      /* 删除接口 */
      _this.listLoading = false;
      _this.$message({
        duration: "1000",
        message: "删除成功，内容在垃圾箱内",
        type: "success",
        onClose: function () {
          _this.list2.splice(index, 1);
        },
      });
    },
    //时间戳转时间
    timestampToTime(nS) {
      return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, " ");
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


.remind {
  width: 100%;
  height: 100%;
  display: flex;


}

.remind h1 {
  margin: 150px auto;
}
</style>

