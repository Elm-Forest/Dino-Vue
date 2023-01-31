<!-- 垃圾箱 -->
<template>
  <div class="box">
    <div class="sBox" v-if="show">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>草稿箱</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input
            placeholder="请输入标题名称"
            v-model="searchtxt"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-divider content-position="left"><b>草稿箱</b></el-divider>
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
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="邮件标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="收件人">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="保存时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="change(scope.$index)">
              编辑
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
      <el-pagination
        small
        layout="prev, pager, next"
        :total="tableData.length"
        :page-size="5"
        @current-change="changepage"
      >
      </el-pagination>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="收件人" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            <el-input
              rows="4"
              v-model="form.description"
              autocomplete="off"
              type="textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">立即发送</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <!--  -->
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
          username: 'ccc',
          description:
            '手抓羊肉是西北地区的传统美味，手抓羊肉有近千年的历史，原来以手抓食用而闻名的。吃法有三种1热吃、2就是切片后上笼蒸热蘸三合油、3冷吃、切片后直接蘸精盐、煎吃，用平底锅煎热，边煎边吃。',
          date: 1660191002715,
        },
        {
          title: '靖远羊肉',
          username: 'ccc',
          description: '甘肃特色美食，肉质细腻、味道鲜美。',
          date: 1660174002715,
        },
        {
          title: '兰州牛肉面',
          username: 'ccc',
          description: '甘肃美食的名片，面条柔韧、滑利爽口。',
          date: 1660111002715,
        },
        {
          title: '洋芋搅团',
          username: 'ccc',
          description: '甘肃传统美食，味道香浓、口感丰富。',
          date: 1660131002715,
        },
        {
          title: '搓鱼子',
          username: 'ccc',
          description:
            '搓鱼子呢，其实和外地的那个剪刀面有异曲同工之妙，搓鱼子是我们这边儿本地人的叫法，是甘肃张掖特有的面食小吃。不过甘肃这些大多数地方都有，将面粉用盐水和成面团，擀成5厘厚的面片，切成四棱面条，左手拿面条子，右手在面板上将面条子分段搓成一寸长的、两头尖的状态，就叫搓鱼子。因为它的最后造型中间粗、两头尖，酷似小鱼而得到的名字。',
          date: 16601719002715,
        },
        {
          title: '藏包子',
          username: 'ccc',
          description:
            '甘南的藏包子是非常具有特色的面食，制作过程和方法都是非常精细，工艺是有自己的独到之处。甘南藏族人民大多都有一手捏制包子皮的高超手艺，可以捏出来大小均匀，薄厚相等，褶子数量一样的包子。藏包子因为体积比较小，一般放置在旺火上蒸制15分钟就可以熟了。用筷子把包子夹入盘内，将蒜泥、醋、酱油、辣子油、混起来的汁子，沾一下吃起来油而不腻，软嫩可口。',
          date: 1660174002715,
        },
        {
          title: '天水浆水面',
          username: 'ccc',
          description:
            '我感觉它跟酸菜面其实有微相似。喜欢吃螺蛳粉的一定会喜欢吃。浆水既可以做饮料，也可以在吃面条时做汤。再加上葱花、香菜调味。更是脍炙人口。所以，兰州、定西、天水、临夏等地的小伙伴们，都喜欢吃浆水面。浆水有清热解暑的功效。在炎热的夏天，喝上一碗浆水，或者吃上一碗浆水面，立即会感到清凉爽快，还能解除疲劳，恢复体力。',
          date: 1660101002715,
        },
        {
          title: '111',
          username: 'yjsz002',
          description: '111',
          date: 1660131002715,
        },
        {
          title: '111',
          username: 'admin',
          description: '12321345',
          date: 1660171002715,
        },
      ],
      tableData2: [],
      /* 表单内容 */
      form: {
        title: '',
        username: '' /* 收件人 */,
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
      this.form = this.tableData2[index]
      this.index = index /* 保存点击对象的索引 */
      this.dialogFormVisible = true
    },
    /* 确定按钮 */
    save() {
      var _this = this
      if (
        this.form.title == '' ||
        this.form.description == '' ||
        this.form.username == ''
      ) {
        _this.$message({
          type: 'warning',
          message: '请将内容填写完整',
          onClose: function () {},
        })
        return false
      } else {
        _this.$message({
          type: 'success',
          message: '保存草稿成功',
          duration: '1000',
          onClose: function () {
            _this.dialogFormVisible = false
          },
        })
        _this.tableData2[this.index] = this.form
      }
    },
    /* 立即发送 */
    submit() {
      var _this = this
      if (
        this.form.title == '' ||
        this.form.description == '' ||
        this.form.username == ''
      ) {
        _this.$message({
          type: 'warning',
          message: '请将内容填写完整',
          onClose: function () {},
        })
        return false
      } else {
        _this.$message({
          duration: '1000',
          message: '邮件发送成功',
          type: 'success',
          onClose: function () {
            /* 跳转到发件箱 */
            _this.$router.push('/normal/fjx')
          },
        })
      }
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
    // this.tableData2 = this.tableData;
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
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

//
.remind {
  width: 100%;
  height: 100%;
  display: flex;
}

.remind h1 {
  margin: 150px auto;
}
</style>
