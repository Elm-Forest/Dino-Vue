<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>成员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="查询姓名" v-model="queryInfo.name" clearable>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.rights" placeholder="查询权限">
            <el-option
                v-for="item in optionRights"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.role" placeholder="查询职务">
            <el-option
                v-for="item in optionRoles"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.status" placeholder="查询任职情况">
            <el-option
                v-for="item in optionStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" @click="reset">重置条件</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-col>


      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="姓名" align="center" prop="name"></el-table-column>
        <el-table-column label="角色" align="center" prop="role" :formatter="formatterRole"></el-table-column>
        <el-table-column label="权限" align="center" prop="rights" :formatter="formatterRights"></el-table-column>
        <el-table-column label="就职情况" align="center" prop="status" :formatter="formatterStatus"></el-table-column>
        <el-table-column label="操作" align="center" width="225">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showEditDialog(scope.row)"></el-button>
            <!-- 名片按钮 -->
            <el-button type="success" size="medium" @click="showUserDialog(scope.row)">名片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <!-- 修改用户的对话框 -->
      <el-dialog
          title="修改用户档案"
          :visible.sync="editDialogVisible"
          width="25%" @close="editDialogClosed">
        <!-- 对话框主体区 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="auto">
          <el-form-item label="角色" prop="role">
            <template>
              <el-select v-model="editForm.role" placeholder="请选择角色">
                <el-option
                    v-for="item in optionRoles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="权限" prop="rights">
            <template>
              <el-select v-model="editForm.rights" placeholder="请选择权限">
                <el-option
                    v-for="item in optionRights"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="就职情况" prop="status">
            <template>
              <el-select v-model="editForm.status" placeholder="请选择就职情况">
                <el-option
                    v-for="item in optionStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
                    <span slot="footer" class="dialog-footer" style="text-align: center;align-items: center">

                </span>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->

      </el-dialog>

      <!-- 查看名片的对话框 -->
      <el-dialog
          title="名片"
          :visible.sync="showDialogVisible"
          width="30%" @close="showDialogClosed">
        <el-descriptions column="1">
          <el-descriptions-item label="用户名">{{ showForm.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ ['女', '男'][showForm.sex] }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ showForm.address }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ showForm.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ showForm.email }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号规则
    let checkPhone = (rule, value, cb) => {
      const phoneValid = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (phoneValid.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 角色选项
      loading: true,
      optionRoles: [{
        value: 1,
        label: '客服'
      }, {
        value: 2,
        label: '财务'
      }, {
        value: 3,
        label: '技术工程师'
      }, {
        value: 4,
        label: '库管'
      }, {
        value: 5,
        label: '运营监督'
      }, {
        value: 6,
        label: 'HR'
      }, {
        value: 7,
        label: 'CEO执行总裁'
      }],
      // 权限选项
      optionRights: [{
        value: 1,
        label: '普通成员'
      }, {
        value: 2,
        label: '部门管理员'
      }, {
        value: 3,
        label: '公司CEO'
      }],
      // 就职情况选项
      optionStatus: [{
        value: 0,
        label: '未入职'
      }, {
        value: 1,
        label: '在职'
      },
        {
          value: 2,
          label: '离职'
        }],
      value: '',
      // // 鼠标悬停
      // showHover: false,
      // 获取用户列表的参数对象
      queryInfo: {
        name: '',
        rights: '',
        role: '',
        status: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页多少条数据
        pagesize: 5
      },
      queryInfoDefault: {
        name: '',
        rights: '',
        role: '',
        status: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页多少条数据
        pagesize: 5
      },
      // 总共多少条数据
      total: 0,

      // 添加表单验证规则对象
      addFormRules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '用户名的长度在1~10个字符之间', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请输入角色', trigger: 'blur'}
        ],
        rights: [
          {required: true, message: '请输入权限', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入就职状态', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请输入性别', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入地址', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 控制查看名片对话框的显示与隐藏
      showDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        id: '',
        name: '',
        role: '',
        rights: '',
        status: '',
      },
      // 查询到的用户名片对象
      showForm: {
        name: '',
        sex: '',
        address: '',
        phone: '',
        email: ''
      },
      // 修改表单验证规则对象
      editFormRules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '用户名的长度在1~10个字符之间', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请输入角色', trigger: 'blur'}
        ],
        rights: [
          {required: true, message: '请输入权限', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入就职状态', trigger: 'blur'}
        ]
      },
      // 用户信息数据源
      tableData: []
    }
  },

  mounted() {
    this.getUserList()
  },
  methods: {
    reset() {
      this.queryInfo.role = ''
      this.queryInfo.rights = ''
      this.queryInfo.status = ''
      this.queryInfo.name = ''
      this.queryInfo.pagenum = 1
      this.getUserList();
    },
    getAll() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/employee/list/all',
        params: {
          'current': this.queryInfo.pagenum,
          'size': this.queryInfo.pagesize,
        }
      }).then(function (response) {
        this_vue.tableData = response.data.recordList;
        this_vue.total = response.data.count;
      })
    },

    getUserList() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/employee/list/all',
        params: {
          'current': this.queryInfo.pagenum,
          'size': this.queryInfo.pagesize,
          'name': this.queryInfo.name,
          'rights': this.queryInfo.rights,
          'role': this.queryInfo.role,
          'status': this.queryInfo.status
        }
      }).then(function (response) {
        this_vue.tableData = response.data.recordList;
        this_vue.total = response.data.count;
        this_vue.loading = false;
      })
    },

    formatterStatus(row, column) {
      let statue = row[column.property];
      if (statue === 0) return "未入职"
      if (statue === 1) return "在职"
      if (statue === 2) return "离职"
    },

    formatterRights(row, column) {
      let rights = row[column.property];
      if (rights === 3) return "公司CEO";
      if (rights === 2) return "部门管理员";
      if (rights === 1) return "普通成员";
    },

    formatterRole(row, column) {
      let role = row[column.property];
      switch (role) {
        case -1:
          return '无角色';
        case 1:
          return '客服';
        case 2:
          return '财务';
        case 3:
          return '技术工程师';
        case 4:
          return '库管';
        case 5:
          return '运营监督';
        case 6:
          return 'HR';
        case 7:
          return 'CEO执行总裁';
        default:
          return '无角色'
      }
    },

    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAll()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getAll()
    },

    // 修改用户信息并提交
    editUserInfo() {
      let this_vue = this
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$axios({
            method: 'put',
            url: '/employee',
            params: {
              'id': this_vue.editForm.id,
              'role': this_vue.editForm.role,
              'rights': this_vue.editForm.rights
            }
          }).then(function (response) {
            if (response.flag) {
              this_vue.$message({
                message: response.message,
                type: 'success'
              });
            }
          })
        } else {
          this_vue.$message({
            message: "表单填写不合法",
            type: 'warning'
          })
        }
      })
      this.editDialogVisible = false
      this.getAll()
    },


    // 展示编辑用户的对话框
    showEditDialog(row) {
      this.editForm = Object.assign({}, row)
      this.editDialogVisible = true
    },
    // 展示查看名片的对话框
    showUserDialog(row) {
      this.showForm = Object.assign({}, row)
      this.showDialogVisible = true
    },
    // 监听修改用户对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听查看名片对话框关闭事件
    showDialogClosed() {
      this.$refs.editFormRef.resetFields()
    }
  }
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

/deep/ .el-dialog__footer {
  padding-bottom: 50px;
}
</style>
