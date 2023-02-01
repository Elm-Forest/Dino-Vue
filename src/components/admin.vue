<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header style="height: 90px">
      <div>
        <span id="title">OA自动化办公系统</span>
      </div>
      <el-dropdown>
        <img
          src="../images/background.jpg"
          class="el-dropdown-link"
          @mouseover="showInfo"
          @mouseleave="hideInfo"
          alt=""
          id="headImg"
        />
        <template v-slot:dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userinfo"
              >查看账户详细信息</el-dropdown-item
            >
            <el-dropdown-item @click="logout">退出 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 1.文档管理平台 -->
          <el-sub-menu index="1">
            <template v-slot:title>
              <el-icon><el-icon-document /></el-icon>
              <span>文档管理平台</span>
            </template>
            <el-menu-item index="1-1">
              <el-icon><el-icon-folder-add /></el-icon>
              <span @click="newFile">新建文档</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <el-icon><el-icon-search /></el-icon>
              <span @click="selectFile">查询文档</span>
            </el-menu-item>
            <el-menu-item index="1-3">
              <el-icon><el-icon-delete /></el-icon>
              <span @click="recycle">回收站</span>
            </el-menu-item>
            <el-menu-item index="1-4">
              <el-icon><el-icon-s-order /></el-icon>
              <span @click="record">文档日志</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 2.消息管理平台 -->
          <el-sub-menu index="2">
            <template v-slot:title>
              <el-icon><el-icon-chat-dot-square /></el-icon>
              <span>消息管理平台</span>
            </template>
            <el-menu-item index="2-1">
              <el-icon><el-icon-s-grid /></el-icon>
              <span @click="adminList">消息列表</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 3.考勤管理平台 -->
          <el-sub-menu index="3">
            <template v-slot:title>
              <el-icon><el-icon-circle-check /></el-icon>
              <span>考勤管理平台</span>
            </template>
            <el-menu-item index="3-1">
              <el-icon><el-icon-search /></el-icon>
              <span @click="searchSign">考勤信息查询</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <el-icon><el-icon-setting /></el-icon>
              <span @click="signTime">考勤时间管理</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <el-icon><el-icon-chat-dot-square /></el-icon>
              <span @click="approve">员工申请审批</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 4.日程管理平台 -->
          <el-sub-menu index="4">
            <template v-slot:title>
              <el-icon><el-icon-date /></el-icon>
              <span>日程管理平台</span>
            </template>
            <el-menu-item index="4-1">
              <el-icon><el-icon-user /></el-icon>
              <span @click="schedule">我的日程</span>
            </el-menu-item>
            <el-menu-item index="4-2">
              <el-icon><el-icon-user-solid /></el-icon>
              <span @click="friendsSchedule">联系人日程</span>
            </el-menu-item>
            <el-menu-item index="4-3">
              <el-icon><el-icon-more /></el-icon>
              <span @click="deptSchedule">部门日程</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 5.部门管理平台 -->
          <el-sub-menu index="5">
            <template v-slot:title>
              <el-icon><el-icon-s-grid /></el-icon>
              <span>部门管理平台</span>
            </template>
            <el-menu-item index="5-1">
              <el-icon><el-icon-user /></el-icon>
              <span @click="admUser">成员管理</span>
            </el-menu-item>
            <el-menu-item index="5-2">
              <el-icon><el-icon-office-building /></el-icon>
              <span @click="offer">offer管理</span>
            </el-menu-item>
            <el-menu-item index="5-3">
              <el-icon><el-icon-office-building /></el-icon>
              <span @click="company">企业名片</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  Document as ElIconDocument,
  FolderAdd as ElIconFolderAdd,
  Search as ElIconSearch,
  Delete as ElIconDelete,
  SOrder as ElIconSOrder,
  ChatDotSquare as ElIconChatDotSquare,
  SGrid as ElIconSGrid,
  CircleCheck as ElIconCircleCheck,
  Setting as ElIconSetting,
  Date as ElIconDate,
  User as ElIconUser,
  UserSolid as ElIconUserSolid,
  More as ElIconMore,
  OfficeBuilding as ElIconOfficeBuilding,
} from '@element-plus/icons'
export default {
  components: {
    ElIconDocument,
    ElIconFolderAdd,
    ElIconSearch,
    ElIconDelete,
    ElIconSOrder,
    ElIconChatDotSquare,
    ElIconSGrid,
    ElIconCircleCheck,
    ElIconSetting,
    ElIconDate,
    ElIconUser,
    ElIconUserSolid,
    ElIconMore,
    ElIconOfficeBuilding,
  },
  data() {
    return {
      userInfo: false,
    }
  },
  created() {
    this.getUserHeadImg()
  },
  methods: {
    userinfo() {
      console.log(666)
      this.$router.push('/admin/userinfo')
    },
    getUserHeadImg() {
      this.$axios({
        method: 'get',
        url: '/user/img',
      })
        .then(function (response) {
          document.getElementById('headImg').src = response.data
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    hideInfo() {
      setTimeout(() => {
        this.userInfo = false
      }, 3000)
      console.log(1)
    },
    //当触发mouseover时调用的方法
    showInfo() {
      this.userInfo = true
      console.log(1)
    },
    // 返回登录界面
    logout() {
      var this_vue = this
      this.$axios({
        method: 'post',
        url: '/user/logout',
      })
        .then(function (response) {
          localStorage.removeItem('token')
          this_vue.$router.push('/login')
          this_vue.$message({
            message: '您已登出！',
            type: 'warning',
          })
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看消息按钮
    showNews() {
      this.$router.push('/admin/adminList')
    },
    // 新建文档界面
    newFile() {
      this.$router.push('/admin/newFile')
    },
    // 查询文档界面
    selectFile() {
      this.$router.push('/admin/selectFile')
    },
    // 文件回收站界面
    recycle() {
      this.$router.push('/admin/recycle')
    },
    // 文档日志界面
    record() {
      this.$router.push('/admin/record')
    },
    // 消息列表界面
    adminList() {
      this.$router.push('/admin/adminList')
    },
    // 考勤信息查询界面
    searchSign() {
      this.$router.push('/admin/searchSign')
    },
    // 考勤时间管理界面
    signTime() {
      this.$router.push('/admin/signTime')
    },
    // 员工申请审批界面
    approve() {
      this.$router.push('/admin/approve')
    },
    // 我的日程界面
    schedule() {
      this.$router.push('/admin/schedule')
    },
    // 联系人日程界面
    friendsSchedule() {
      this.$router.push('/admin/friendsSchedule')
    },
    // 部门日程界面
    deptSchedule() {
      this.$router.push('/admin/deptSchedule')
    },
    // 成员管理界面
    admUser() {
      this.$router.push('/admin/admUser')
    },
    // 公司招牌界面
    company() {
      this.$router.push('/admin/company')
    },
    offer() {
      this.$router.push('/admin/offer')
    },
    // 获取所有的菜单
    // getMenuList(){
    //     this.$http.get('menus');
    // }
  },
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-image: url(../images/background.png);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#title {
  color: aliceblue;
  font-size: 45px;
  position: absolute;
  top: 14px;
  left: 40px;
}
.el-aside {
  background-color: #545c64;
}
.el-main {
  background-color: white;
}
#logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  line-height: 90px;
  position: absolute;
  top: 4px;
}
.el-dropdown-link {
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 45px;
}
.userMessage {
  width: 100%;
  height: 100%;
}
:hover {
  cursor: pointer;
}
.box2 {
  position: absolute;
  bottom: -60px;
  left: -10px;
  border: 1px solid #ccc;
  width: 50px;
  height: 60px;
  background-color: #fff;
  box-sizing: border-box;
}
p {
  margin-top: 6px;
  text-align: center;
  font-size: 12px;
}
:hover {
  cursor: pointer;
}
</style>
