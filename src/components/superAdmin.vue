<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="head_img">
        <el-avatar :src="headImg.dept" class="el-dropdown-link" id="deptImg" alt="" :size="30"></el-avatar>
      </div>
      <span id="title" style="position: absolute;display: block;margin-left: 20px;">{{ name.dept }} | {{ role }}</span>
      <span id="title" style="position: absolute;display: block;right: 100px">欢迎您，{{ name.user }}</span>
      <el-dropdown style="position: absolute;display: block;right: 90px;top:20px">
        <div class="el-icon-message-solid" style="color:#FFFFFF;font-size:20px;"
             @mouseenter="getNotifications"></div>
        <div class="notification-dot" v-if="ableNotificationDot"></div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="message in message_lists"
                            @click.native="redirectToRoute(message.id,message.suId);">
            {{
              message.suName !== '' && message.suName !== null && message.suName !== undefined ? "您收到了来自" + message.suName + "的新消息" : "暂无消息"
            }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#fafafa" :router="true" :unique-opened="true">
          <el-menu-item index="/super/home">
            <i class="el-icon-house"></i>
            <span>首页</span>
          </el-menu-item>
          <!-- 1.文档管理平台 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-upload"></i>
              <span>企业云盘</span>
            </template>
            <el-menu-item index="/super/selectFile">
              <i class="el-icon-folder-opened"></i>
              <span>文件管理</span>
            </el-menu-item>
            <el-menu-item index="/super/recycle">
              <i class="el-icon-delete"></i>
              <span>回收站</span>
            </el-menu-item>
            <el-menu-item index="/super/record">
              <i class="el-icon-s-order"></i>
              <span>操作日志</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2.消息管理平台 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span>企业邮箱</span>
            </template>
            <el-menu-item index="/super/add">
              <i class="el-icon-s-promotion"></i>
              <span>发邮件</span>
            </el-menu-item>
            <el-menu-item index="/super/fjx">
              <i class="el-icon-takeaway-box"></i>
              <span>发件箱</span>
            </el-menu-item>
            <el-menu-item index="/super/sjx">
              <i class="el-icon-reading"></i>
              <span>收件箱</span>
            </el-menu-item>
            <el-menu-item index="/super/cgx">
              <i class="el-icon-edit"></i>
              <span>草稿箱</span>
            </el-menu-item>
            <el-menu-item index="/super/ljx">
              <i class="el-icon-delete"></i>
              <span>垃圾箱</span>
            </el-menu-item>
            <el-menu-item index="/super/bindMailbox">
              <i class="el-icon-user"></i>
              <span>邮箱账户</span>
            </el-menu-item>

          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-chat-dot-round"></i>
              <span>企业消息</span>
            </template>
            <el-menu-item index="/super/chat">
              <i class="el-icon-chat-line-round"></i>
              <span>企业私信</span>
            </el-menu-item>
            <el-menu-item index="/super/gpt">
              <i class="el-icon-cpu"></i>
              <span>GPT助理</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3.考勤管理平台 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-circle-check"></i>
              <span>考勤管理</span>
            </template>
            <el-menu-item index="/super/searchSign">
              <i class="el-icon-search"></i>
              <span>员工考勤记录</span>
            </el-menu-item>
            <el-menu-item index="/super/signTime">
              <i class="el-icon-setting"></i>
              <span>考勤规则管理</span>
            </el-menu-item>
            <el-menu-item index="/super/approve">
              <i class="el-icon-s-check"></i>
              <span>员工申请审批</span>
            </el-menu-item>
          </el-submenu>

          <!-- 4.日程管理平台 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span>日程管理</span>
            </template>
            <el-menu-item index="/super/schedule">
              <i class="el-icon-s-order"></i>
              <span>我的日程</span>
            </el-menu-item>
            <el-menu-item index="/super/deptSchedule">
              <i class="el-icon-s-claim"></i>
              <span>部门日程</span>
            </el-menu-item>
          </el-submenu>

          <!-- 5.企业管理平台 -->
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span>企业管理</span>
            </template>
            <el-menu-item index="/super/admUser">
              <i class="el-icon-user"/>
              <span>成员管理</span>
            </el-menu-item>
            <el-menu-item index="/super/offer">
              <i class="el-icon-check"/>
              <span>OFFER管理</span>
            </el-menu-item>
            <el-menu-item index="/super/company">
              <i class="el-icon-edit-outline"/>
              <span>企业信息管理</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>个人管理</span>
            </template>
            <el-menu-item index="/super/userinfo">
              <i class="el-icon-user"/>
              <span>个人信息管理</span>
            </el-menu-item>
            <el-menu-item index="/super/account">
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
      socket_notifications: null,
      ableNotificationDot: false,
      headImg: {
        user: user_img,
        dept: dept_img
      },
      userInfo: false,
      name: {
        user: '路人甲',
        dept: 'OA办公自动化'
      },
      role: '未指定部门',
      message_lists: [{}],
    }
  },
  created() {
    this.socket_notifications = this.$websocket.initWebSocket("/connection/wait");
    this.socket_notifications.onmessage = this.webSocketOnMessage;
    this.getUserHeadImg();
    this.getBaseInfo();
    this.getNotifications();
  },
  methods: {
    webSocketOnMessage() {
      this.showNotificationDot();
    },
    hideNotificationDot() {
      this.ableNotificationDot = false; // 点击后隐藏红点
    },
    showNotificationDot() {
      this.ableNotificationDot = true; // 显示红点的函数
    },
    userinfo() {
      this.$router.push('/super/userinfo');
    },
    redirectToRoute(id, suId) {
      if (id !== null && id !== '' && id !== undefined) {
        this.marked_read(id);
        this.$router.push({
          path: '/super/chat', query: {
            suId: suId
          }
        });
      }
    },
    getNotifications() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/message/chat/notification',
      }).then(function (response) {
        if (response.data.length !== 0) {
          this_vue.showNotificationDot();
          this_vue.message_lists = response.data
        } else {
          this_vue.message_lists = [{}]
          this_vue.hideNotificationDot();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    marked_read(id) {
      const this_vue = this;
      this.$axios({
        method: 'delete',
        url: '/message/chat/notification/delete',
        params: {
          id: id,
        }
      }).then(_ => {
        this_vue.getNotifications();
      }).catch(function (error) {
        console.log(error);
      });
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
    showInfo() {
      this.userInfo = true
    },
    logout() {
      let this_vue = this
      this.$axios({
        method: 'post',
        url: '/user/logout',
      }).then(() => {
        localStorage.removeItem('token');
        this_vue.$router.push('/login');
        this_vue.$message({
          message: '您已登出！',
          type: 'warning'
        })
      }).catch((error) => {
        console.log(error);
      })
    }
  }
}
;
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

.notification-dot {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}


.head_img {
  padding: 5px 10px 0;
}
</style>
