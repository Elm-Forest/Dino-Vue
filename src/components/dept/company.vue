<template>
  <div class="box">
    <!-- <img src="D:\vscode项目\auto-office\src\images\background3.png" alt=""> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>部门管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>公司招牌</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mainBox">
      <el-descriptions class="margin-top" :column="1">
        <el-descriptions-item label="企业名称"
          >OA自动化办公企业</el-descriptions-item
        >
        <el-descriptions-item label="企业联系电话"
          >8887777</el-descriptions-item
        >
        <el-descriptions-item label="企业地址" :span="2"
          >湖北省宜昌市西陵区</el-descriptions-item
        >
        <el-descriptions-item label="企业描述">
          OA办公系统即办公自动化系统，是将计算机、通信等现代技术运用到传统办公方式，
          进而形成的新型办公方式，可进行邮件通信、信息发布、文档管理等工作。
          使员工能快速便捷的共享信息，高效地协同工作，相比过去传统的办公方式，采集和处理信息更迅速、更全面。
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.mainBox {
  width: 70%;
  height: 100%;
  /* margin: 0 auto; */
  font-family: '微软雅黑 Light', serif;
}
.el-breadcrumb {
  margin-bottom: 30px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>
