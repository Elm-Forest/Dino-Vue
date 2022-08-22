<!-- 发送邮件 -->
<template>
  <div class=''>
    <el-divider content-position="left"><b>消息-邮件详情</b></el-divider>
    <el-form :model="form">
      <el-form-item
        label="标题"
        :label-width="formLabelWidth"
      >
        {{form.title}}
      </el-form-item>
      <el-form-item
        label="发件人"
        :label-width="formLabelWidth"
      >
        {{form.fjr}}
      </el-form-item>
      <el-form-item
        label="收件人"
        :label-width="formLabelWidth"
      >
        {{form.sjr}}
      </el-form-item>
      <el-form-item
        label="内容"
        :label-width="formLabelWidth"
      >
        {{form.description}}
      </el-form-item>
      <el-form-item
        label="发件时间"
        :label-width="formLabelWidth"
      >
        {{timestampToTime(form.date)}}
      </el-form-item>
    </el-form>
    <el-button @click="back()">返回</el-button>
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
        title: "邮件标题",
        fjr: "发件人",
        sjr: "收件人",
        description: "收件内容",
        date: 1660171002715,
      },
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    back() {
      this.$router.push("/admin/adminList");
    },
    //时间戳转时间
    timestampToTime(nS) {
      return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, " ");
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>