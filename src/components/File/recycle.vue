<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
            <el-breadcrumb-item>回收站</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div class="oa_main">
            <!--serach-->
            <div class="oa_search">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="文档名称">
                    <el-input v-model="form.name" placeholder="请输入文档名称" ></el-input>
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-date-picker
                    v-model="form.time"
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
                <el-table-column type="index" align="center" label="#" width="120"></el-table-column>
                <el-table-column prop="name" label="文档名称" align="center" min-width="220"></el-table-column>
                <el-table-column prop="time" align="center" label="上传时间" width="150"></el-table-column>
                <el-table-column prop="size" align="center" label="大小" width="200"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="200">
                    <template slot-scope="scope">
                        <!-- 查看按钮 -->
                        <el-button type="success" icon="el-icon-search" size="medium" @click="showFileDialog(scope.row.id)"></el-button>
                        <!-- 恢复按钮 -->
                        <el-button type="primary" icon="el-icon-check" size="medium" @click="recoverFile(scope.row.id)"></el-button>
                    </template>                    
                </el-table-column>
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
        time: "2022-8-21",
        size: "100kb",
      }),
      form: {
        name: "",
        time: [],
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
    // 根据文件id删除对应文件
    async recoverFile(id){
        // 弹框 询问是否恢复
        const confirmResult = await this.$confirm('此操作将恢复该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => {
            return err
        })
        // 如果用户确认删除，返回字符串 confirm
        // 如果用户取消删除，返回字符串 cancel
        // console.log(confirmResult)
        if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
        }
        // this.$http.delete('' + id)
    }
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
