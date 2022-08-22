<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
            <el-breadcrumb-item>文档日志</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div class="oa_main">
            <!--serach-->
            <div class="oa_search">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="文档名称">
                    <el-input v-model="form.name" placeholder="请输入文档名称" ></el-input>
                </el-form-item>
                <el-form-item label="操作时间">
                    <el-date-picker
                    v-model="form.operationTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                </el-form-item>
                </el-form>
            </div>
            <!--list-->
            <el-table :data="tableData4" stripe style="width: 100%">
                <el-table-column type="index" align="center" label="#" width="50"></el-table-column>
                <el-table-column prop="name" align="center" label="文档名称" width="150"></el-table-column>
                <el-table-column prop="modifyName" align="center" label="文档重命名" width="150"></el-table-column>
                <el-table-column prop="extension" align="center" label="扩展名" width="150"></el-table-column>
                <el-table-column prop="type" align="center" label="类型" width="150"></el-table-column>
                <el-table-column prop="filePath" align="center" label="路径" min-width="150"></el-table-column>
                <el-table-column prop="size" align="center" label="大小" width="150"></el-table-column>
                <el-table-column prop="operationTime" align="center" label="操作时间" width="150"></el-table-column>
            </el-table>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      tableData4: new Array(13).fill({
        name: "文件1",
        modifyName: "文件2",
        extension: "txt",
        type: "文件夹",
        filePath: "D:/aaa",
        size: "100kb",
        operationTime: "2022-8-21",
      }),
      form: {
        name: "",
        operationTime: [],
      },
    };
  },
  methods: {
    // handleGoUrl(url) {
    //   this.$router.push({ path: url });
    // },
    // onSubmit() {
    //   console.log(this.form);
    // },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
    margin: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    .el-icon-search {
        color: blue;
    }
}
</style>
