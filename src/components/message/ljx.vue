<template>
  <div class="box">
    <div class="sBox" v-if="show">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>垃圾箱</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider content-position="left"><b>垃圾箱</b></el-divider>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input
            placeholder="请输入标题名称"
            v-model:value="searchtxt"
            class="input-with-select"
          >
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="search"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <br />
      <!-- <el-button
        type="text"
        @click="dialogFormVisible = true"
      >新建邮件</el-button> -->
      <el-table
        v-loading="listLoading"
        :data="tableData2"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="120">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="邮件标题">
          <template v-slot="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="发件人">
          <template v-slot="scope">
            {{ scope.row.fjr }}
          </template>
        </el-table-column>
        <el-table-column label="保存时间">
          <template v-slot="scope">
            {{ timestampToTime(scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="change(scope.$index)">
              查看详情
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleted(scope.row.id, scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="查看详情" v-model:visible="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="标题" :label-width="formLabelWidth">
            {{ form.title }}
          </el-form-item>
          <el-form-item label="发件人" :label-width="formLabelWidth">
            {{ form.fjr }}
          </el-form-item>
          <el-form-item label="时间" :label-width="formLabelWidth">
            {{ timestampToTime(form.date) }}
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            {{ form.description }}
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false"
              >确定</el-button
            >
          </div>
        </template>
      </el-dialog>
      <el-pagination
        small
        layout="prev, pager, next"
        :total="tableData.length"
        :page-size="5"
        @current-change="changepage"
      >
      </el-pagination>
    </div>

    <div class="remind" v-if="!show">
      <h1>请绑定邮箱以查看详情</h1>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      //
      show: true,

      searchtxt: '' /* 搜索的文本信息 */,
      dialogFormVisible: false,
      index: 0 /* 当前点击对象的索引 */,
      formLabelWidth: '120px',
      listLoading: false /*  */,
      tableData: [
        {
          title: '手抓羊肉',
          fjr: '111' /* 发件人 */,
          description:
            '手抓羊肉是西北地区的传统美味，手抓羊肉有近千年的历史，原来以手抓食用而闻名的。吃法有三种1热吃、2就是切片后上笼蒸热蘸三合油、3冷吃、切片后直接蘸精盐、煎吃，用平底锅煎热，边煎边吃。',
          date: 1660191002715,
        },
        {
          title: '靖远羊肉',
          fjr: '1111' /* 发件人 */,
          description: '甘肃特色美食，肉质细腻、味道鲜美。',
          date: 1660174002715,
          type: '发件箱',
        },
        {
          title: '兰州牛肉面',
          fjr: '121' /* 发件人 */,
          description: '甘肃美食的名片，面条柔韧、滑利爽口。',
          date: 1660111002715,
          type: '发件箱',
        },
        {
          title: '洋芋搅团',
          fjr: '114' /* 发件人 */,
          description: '甘肃传统美食，味道香浓、口感丰富。',
          date: 1660131002715,
          type: '发件箱',
        },
      ],
      tableData2: [],
      /* 表单内容 */
      form: {
        title: '',
        fjr: '' /* 发件人 */,
        description: '',
        date: new Date().getTime(),
      },
    }
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    changepage(index) {
      console.log(index)
      let result = this.tableData.filter((ele, i) => {
        return i >= 5 * (index - 1) && i < 5 * index
      })
      this.tableData2 = result
    },
    /* 搜索功能 */
    search() {
      console.log(this.list)
      var result = this.tableData.filter((ele) => {
        return ele.title.indexOf(this.searchtxt) != -1
      })
      this.tableData2 = result
    },
    /* 编辑修改 */
    change(index) {
      this.form = this.tableData[index]
      this.index = index /* 保存点击对象的索引 */
      this.dialogFormVisible = true
    },
    //时间戳转时间
    timestampToTime(nS) {
      return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ')
    } /* 删除功能 */,
    /* id为对象id,index为数组中的索引 */
    deleted(id, index) {
      let _this = this
      this.listLoading = true
      /* 删除接口 */
      _this.listLoading = false
      _this.$message({
        duration: '1000',
        message: '删除成功',
        type: 'success',
        onClose: function () {
          _this.tableData2.splice(index, 1)
        },
      })
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$axios.get('/message/mail/account/check').then((response) => {
      if (response.data != null) {
        this.$store.commit('SET_SHOW')
      }
    })
    this.tableData2 = this.tableData.filter((ele, i) => {
      return i < 5
    })

    //
    this.show = this.$store.state.bindMailbox
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeUnmount() {}, //生命周期 - 销毁之前
  unmounted() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style lang="less" scoped>
/*//@import url(); 引入公共css类*/

.remind{width:100%;height:100%;display:flex}.remind h1{margin:150px auto}
</style>
