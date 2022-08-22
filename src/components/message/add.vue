<!-- 发送邮件 -->
<template>
  <div class='box'>
    <div class="sBox" v-if="show">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>发送邮件</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider content-position="left"><b>发送邮件</b></el-divider>
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收件人" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input rows="4" v-model="form.description" autocomplete="off" type="textarea" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="back()">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button type="info" @click="submit">保存到草稿</el-button>
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
      formLabelWidth: "80px",
      form: {
        title: "",
        name: "",
        description: "",

      },
      // 
      show: true,

    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},

  //方法集合
  methods: {
    back() {
      this.$router.push("/normal/fjx");
    },
    /* 发送邮箱 */
    submit() {
      let _this = this;
      _this.$message({
        message: "发送成功",
        type: "success",
        duration: "1000",
        onClose: function () {
          _this.$router.push("/normal/fjx");
        },
      });
    },
    /* 保存邮箱 */
    save() {
      let _this = this;
      _this.$message({
        message: "保存成功",
        type: "success",
        duration: "1000",
        onClose: function () {
          _this.$router.push("/normal/cgx");
        },
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() { },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.show = this.$store.state.bindMailbox
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
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