<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
            <el-breadcrumb-item>查询文档</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div class="oa_main">
            <!-- 搜索区域 -->
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
            <!-- 列表区域 -->
            <el-table :data="tableData4" stripe style="width: 100%">
                <el-table-column type="index" align="center" label="类型" width="120">
                    <el-button icon="el-icon-folder"></el-button>
                </el-table-column>
                <el-table-column prop="name" label="文档名称" align="center" min-width="220"></el-table-column>
                <el-table-column prop="time" align="center" label="上传时间" width="150"></el-table-column>
                <el-table-column prop="size" align="center" label="大小" width="200"></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <!-- 查看按钮 -->
                        <el-button type="success" icon="el-icon-search" size="medium" @click="showFileDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="medium" @click="removeFile(scope.row.id)"></el-button>
                        <!-- 重命名按钮 -->
                        <el-button type="warning" size="medium" @click="showModifyDialog(scope.row.id)">重命名</el-button>
                    </template>                    
                </el-table-column>
            </el-table>
            <!-- 重命名的对话框 -->
            <el-dialog
            title="重命名"
            :visible.sync="modifyDialogVisible"
            width="50%">
                <!-- 对话框主体区 -->
                <el-form :model="modifyForm" ref="modifyFormRef" label-width="auto">
                    <el-form-item label="文件名" prop="modifyName">
                        <el-input v-model="modifyForm.username"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="modifyDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyUserInfo">确 定</el-button>
                </span>
            </el-dialog>
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
      // 控制重命名对话框的显示与隐藏
      modifyDialogVisible: false,
      // 查询到的文件对象
        modifyForm: {
            
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
    // 展示重命名的对话框
    showModifyDialog(id){
        this.modifyDialogVisible = true
    },
    // 重命名文档并提交
    modifyUserInfo(){
        this.$refs.modifyFormRef.validate(valid => {
            if(!valid) return
            // 发起修改用户信息的数据请求
            // this.$http.post('' + this.editForm.username,{
            //     v_email:this.editForm.v_email,
            //     phonenum:this.editForm.phonenum
            // })
        })
    },
    // 根据文件id删除对应文件
    async removeFile(id){
        // 弹框 询问是否删除
        const confirmResult = await this.$confirm('此操作会将文件转入回收站, 是否继续?', '提示', {
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
