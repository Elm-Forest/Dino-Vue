<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="head_img">
        <el-avatar :src="headImg.dept" class="el-dropdown-link" id="headImg" alt="" :size="30"
                   @mouseover="showInfo" @mouseleave="hideInfo"></el-avatar>
      </div>
      <span id="title" style="position: absolute;display: block;margin-left: 20px;">{{ name.dept }} | {{ role }}</span>
      <span id="title" style="position: absolute;display: block;right: 60px">欢迎您，{{ name.user }}</span>
      <div class="head_img">
        <el-dropdown>
          <el-avatar :src="headImg.user" class="el-dropdown-link" id="headImg" alt="" :size="30"
                     @mouseover="showInfo" @mouseleave="hideInfo"></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="userinfo">账户详情</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px">
        <el-menu
            background-color="#fafafa"
            :router="true"
            :unique-opened="true"
        >
          <el-menu-item index="/normal/home">
            <i class="el-icon-house"></i>
            <span>首页</span>
          </el-menu-item>
          <!-- 1.文档管理平台 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>企业云盘</span>
            </template>
            <el-menu-item index="/normal/selectFile">
              <i class="el-icon-document"></i>
              <span>文件管理</span>
            </el-menu-item>
            <el-menu-item index="/normal/recycle">
              <i class="el-icon-delete"></i>
              <span>回收站</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2.企业邮箱平台 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-chat-dot-square"></i>
              <span>企业邮箱</span>
            </template>
            <el-menu-item index="/normal/add">
              <i class="el-icon-right"></i>
              <span>发邮件</span>
            </el-menu-item>
            <el-menu-item index="/normal/fjx">
              <i class="el-icon-edit-outline"></i>
              <span>发件箱</span>
            </el-menu-item>
            <el-menu-item index="/normal/sjx">
              <i class="el-icon-chat-dot-square"></i>
              <span>收件箱</span>
            </el-menu-item>
            <el-menu-item index="/normal/cgx">
              <i class="el-icon-edit"></i>
              <span>草稿箱</span>
            </el-menu-item>
            <el-menu-item index="/normal/ljx">
              <i class="el-icon-delete"></i>
              <span>垃圾箱</span>
            </el-menu-item>
            <el-menu-item index="/normal/bindMailbox">
              <i class="el-icon-user"></i>
              <span>邮箱账户</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-chat-dot-round"></i>
              <span>企业消息</span>
            </template>
            <el-menu-item index="/normal/chat">
              <i class="el-icon-chat-line-round"></i>
              <span>企业私信</span>
            </el-menu-item>
            <el-menu-item index="/normal/gpt">
              <i class="el-icon-cpu"></i>
              <span>GPT助理</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3.考勤管理平台 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-circle-check"></i>
              <span>考勤</span>
            </template>
            <el-menu-item index="/normal/signIn">
              <i class="el-icon-check"></i>
              <span>签到/签退</span>
            </el-menu-item>
            <el-menu-item index="/normal/checkList">
              <i class="el-icon-date"></i>
              <span>考勤记录</span>
            </el-menu-item>
            <el-menu-item index="/normal/addSign">
              <i class="el-icon-circle-check"></i>
              <span>补签/请假</span>
            </el-menu-item>
          </el-submenu>

          <!-- 4.日程管理平台 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span>日程</span>
            </template>
            <el-menu-item index="/normal/schedule">
              <i class="el-icon-user"></i>
              <span>我的日程</span>
            </el-menu-item>
            <el-menu-item index="/normal/deptSchedule">
              <i class="el-icon-more"></i>
              <span>部门日程</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>个人管理</span>
            </template>
            <el-menu-item index="/normal/userinfo">
              <i class="el-icon-s-custom"/>
              <span>个人信息管理</span>
            </el-menu-item>
            <el-menu-item index="/normal/account">
              <i class="el-icon-key"/>
              <span>账号管理</span>
            </el-menu-item>
          </el-submenu>
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
import user_img from '../assets/images/user_img.png'
import dept_img from '../assets/images/corp_default.png'
import {dept_list} from '@/utils/const'

export default {
  data() {
    return {
      socket: null,
      headImg: {
        user: user_img,
        dept: dept_img
      },
      userInfo: false,
      name: {
        user: '路人甲',
        dept: 'OA办公自动化'
      },
      role: '未指定部门'
    }
  },
  created() {
    this.socket = this.$websocket.initWebSocket();
    this.socket.onmessage = this.webSocketOnMessage;
    this.getUserHeadImg();
    this.getBaseInfo();
  },
  mounted: {},
  methods: {
    webSocketOnOpen() {
      this.$message({
        message: "成功与服务器建立websocket连接",
        type: 'success'
      })
    },
    webSocketOnMessage(e) {
      this.$message({
        message: "来自服务器的消息：" + e,
        type: 'success'
      })
    },
    userinfo() {
      this.$router.push('/normal/userinfo');
    },
    getUserHeadImg() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/user/img',
      }).then(function (response) {
        this_vue.headImg.user = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    getBaseInfo() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/user/userinfo/base',
      }).then(res => {
        let userName = res.data.userName;
        let deptName = res.data.deptName;
        let role = res.data.role;
        let deptImg = res.data.deptUrl;
        if (userName === null || userName === '') {
          userName = '普通用户(未命名)';
        }
        this_vue.name.user = userName;
        if (deptName === null || deptName === '') {
          deptName = '未命名企业'
        }
        this_vue.name.dept = deptName;
        if (deptImg === null || deptImg === '') {
          deptImg = dept_img
        }
        this_vue.headImg.dept = deptImg;
        if (role === null || role === '') {
          role = '未指定部门'
        } else {
          role = dept_list[role - 1]
        }
        this_vue.role = role;
      })
    },
    hideInfo() {
      setTimeout(() => {
        this.userInfo = false
      }, 3000)
    },
    //当触发mouseover时调用的方法
    showInfo() {
      this.userInfo = true
    },
    // 返回登录界面
    logout() {
      let this_vue = this
      this.$axios({
        method: 'post',
        url: '/user/logout',
      }).then(function () {
        localStorage.removeItem('token');
        this_vue.$router.push('/login');
        this_vue.$message({
          message: '您已登出！',
          type: 'warning'
        })
      }).catch(function (error) {
        console.log(error);
      })
    }
  }
};
</script>

<style scoped>
.el-aside {
  border-right: 1px solid #e8e8e8;
  box-shadow: 1px 1px 4px rgb(99 99 99 / 15%);
  display: block;
}

.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
}

.el-main {
  position: absolute;
  left: 250px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.el-menu {
  border-right: solid 0;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #0b2342;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#title {
  padding: 0 30px;
  color: aliceblue;
  font-size: 16px;
  font-weight: 400;
  font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}

.el-aside {
  background-color: #fafafa;
}

/*.el-aside {*/
/*  background-color: #545c64;*/
/*}*/

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
  margin-right: 10px;
}

.userMessage {
  width: 100%;
  height: 100%;
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


.head_img {
  padding: 5px 10px 0;
}
</style>
