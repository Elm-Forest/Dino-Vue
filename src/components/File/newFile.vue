<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>文档管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>新建文档</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        max-height="1080"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        v-contextmenu:contextmenu
      >
        <!-- min-width100%能实现header拉长，name独大 -->
        <el-table-column prop="name" label="文件名" min-width="100%">
          <template v-slot:header>
            <el-icon class="hidden-xs-only"><el-icon-document /></el-icon>
            <span>文件名</span>
            <el-upload
              class="upload"
              action="/file/uploadFile"
              :data="data"
              multiple
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastModifyTime"
          label="修改时间"
          sortable
          width="180"
        >
          <template v-slot:header>
            <span>修改时间</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" sortable width="180">
          <template v-slot:header>
            <span>大小</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="180">
          <template v-slot="scope">
            <el-button type="text" :icon="ElIconDownload"></el-button>
            <el-button
              type="text"
              :icon="ElIconClose"
              @click="confirm"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  Document as ElIconDocument,
  Download as ElIconDownload,
  Close as ElIconClose,
} from '@element-plus/icons'
export default {
  data() {
    return {
      ElIconDownload,
      ElIconClose,
    }
  },
  components: {
    ElIconDocument,
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
