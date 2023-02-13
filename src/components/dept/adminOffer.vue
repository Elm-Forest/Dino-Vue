<template xmlns="">
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理平台</el-breadcrumb-item>
      <el-breadcrumb-item>offer管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column label="姓名" align="center" prop="name"></el-table-column>
        <el-table-column label="性别" align="center" prop="sex"></el-table-column>
        <el-table-column label="联系方式" align="center" prop="phone"></el-table-column>
        <el-table-column label="地址" align="center" prop="address"></el-table-column>
        <el-table-column label="操作" align="center" width="225">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 名片按钮 -->
            <el-button type="success" size="medium" @click="showUserDialog(scope.row.id)">名片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%" @close="addDialogClosed">
        <!-- 对话框主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="auto">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <template>
              <el-select v-model="optionRoles.value" placeholder="请选择角色">
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
              <el-select v-model="optionRights.value" placeholder="请选择权限">
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
              <el-select v-model="optionStatus.value" placeholder="请选择就职情况">
                <el-option
                    v-for="item in optionStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <template>
              <el-radio v-model="addForm.radio" label="1">男</el-radio>
              <el-radio v-model="addForm.radio" label="2">女</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="地址:" prop="address">
            <el-input v-model="addForm.address"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog
          title="筛选offer"
          :visible.sync="editDialogVisible"
          width="50%" @close="editDialogClosed">
        <!-- 对话框主体区 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="auto">
          <el-form-item label="角色安排">
            <el-select v-model="editForm.role" placeholder="角色">
              <el-option v-for="(item,index) in optionRoles " :label="item.label" :value="index+1"
                         :key="index+1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限安排">
            <el-select v-model="editForm.rights" placeholder="权限">
              <el-option v-for="(item,index) in optionRights" :label="item.label" :value="index+1"
                         :key="index+1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="offerPass()">确 定</el-button>
                </span>
      </el-dialog>
      <!-- 查看名片的对话框 -->
      <el-dialog
          title="名片"
          :visible.sync="showDialogVisible"
          width="30%" @close="showDialogClosed">
        <!-- 对话框主体区 -->
        <el-form :model="tableData" ref="showFormRef" label-width="auto">
          <el-form-item label="姓名" prop="name">
            <el-lable v-model="tableData.name"></el-lable>
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-lable v-model="tableData.sex"></el-lable>
          </el-form-item>
          <el-form-item label="地址:" prop="address">
            <el-lable v-model="tableData.address"></el-lable>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-lable v-model="tableData.phone"></el-lable>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-lable v-model="tableData.email"></el-lable>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import JSONbig from "json-bigint";

export default {
  data() {
    // 验证邮箱规则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的邮箱'))
    };
    // 验证手机号规则
    const checkPhonenum = (rule, value, cb) => {
      const rePhonenum = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (rePhonenum.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的手机号'))
    };
    return {
      // 角色选项
      optionRoles: [{
        value: '选项1',
        label: '客服'
      }, {
        value: '选项2',
        label: '财务'
      }, {
        value: '选项3',
        label: '技术工程师'
      }, {
        value: '选项4',
        label: '库管'
      }, {
        value: '选项5',
        label: '运营监督'
      }, {
        value: '选项6',
        label: 'HR'
      }, {
        value: '选项7',
        label: 'CEO执行总裁'
      }],
      // 权限选项
      optionRights: [{
        value: '选项1',
        label: '普通成员'
      }, {
        value: '选项2',
        label: '部门管理员'
      }, {
        value: '选项3',
        label: '公司CEO'
      }],
      // 就职情况选项
      optionStatus: [{
        value: '选项1',
        label: '离职'
      }, {
        value: '选项2',
        label: '未入职'
      }, {
        value: '选项3',
        label: '在职'
      }],
      value: '',
      // // 鼠标悬停
      // showHover: false,
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页多少条数据
        pagesize: 2
      },
      // 总共多少条数据
      total: 4,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        name: '',
        role: '',
        rights: '',
        status: ''
      },
      // 添加表单验证规则对象
      addFormRules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur'}
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
          {validator: checkPhonenum, trigger: 'blur'}
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
        role: null,
        rights: null
      },
      // 查询到的用户名片对象
      showForm: {
        name: "张三",
        sex: '男',
        address: '湖北省宜昌市西陵区',
        phone: '13388889999',
        email: '123456@163.com'
      },
      // 修改表单验证规则对象
      editFormRules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名的长度在2~10个字符之间', trigger: 'blur'}
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
      tableData: [],
      page: {
        current: 1,
        size: 5
      },
      currentId: '',
      role: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/employee/list/all',
        params: {
          'current': 1,
          'size': 5,
          'status': 0,
          'name': this.queryInfo.query,
          'role': -1,
          'rights': -1
        }
      }).then(function (response) {
        this_vue.tableData = response.data.recordList;
      })
    },
    offerPass() {
      var this_vue = this;
      this.$axios({
        method: 'post',
        url: '/employee/entry',
        params: {
          'id': String(this.currentId),
          'role': this.editForm.role,
        },
      }).then(function (response) {
        this_vue.editDialogVisible = false
        this_vue.getUserList();
        this_vue.$message({
          message: response.message,
          type: 'success'
        });
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
      })
    },
    // 展示编辑用户的对话框
    showEditDialog(id) {
      this.currentId = id;
      this.editDialogVisible = true
    },
    // 监听修改用户对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.$axios({
          method: 'post',
          url: '/employee/entry',
          params: {
            'id': this.currentId,
            'role': this.role,
          },
        }).then(function (response) {
          console.log(JSON.stringify(response.data));
        }).catch(function (error) {
          console.log(localStorage.getItem('token'))
          console.log(error);
        });
      })
    },
    // 展示查看名片的对话框
    showUserDialog(id) {
      this.showDialogVisible = true
    },
    // // 监听查看名片对话框关闭事件
    // showDialogClosed(){
    //     this.$refs.editFormRef.resetFields()
    // }
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