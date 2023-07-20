<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业消息</el-breadcrumb-item>
      <el-breadcrumb-item>私信</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="outer-wrapper">
      <div class="wrapper" v-loading="loading">
        <div class="left_wrapper">
          <ul class="contact_list">
            <li v-for="contact in contactList" :key="contact.id" class="contact_item"
                @click="handleContactClick(contact.id)">
              <div class="contact_avatar">
                <el-avatar :src="contact.headImg" class="el-dropdown-link" id="headImg" alt=""></el-avatar>
              </div>
              <span class="contact_name">{{ contact.name }}</span>
            </li>
          </ul>
        </div>
        <div class="divider"></div>
        <div class="right_wrapper">
          <h3 style="text-align: center">
            {{ targetName }}
          </h3>
          <div class="message-panel" v-loading="msg_loading">
            <msg-box v-for="(item, index) of msgList" :key="index+Math.random()" :uname="item.name" :content="item.msg"
                     :isself="item.isSelf" :headImg="(function() {
                       return item.isSelf?selfUrl:targetUrl
                     })()"></msg-box>
          </div>
          <div class="input-area">
            <el-input
                class="input"
                type="textarea"
                :rows="5"
                placeholder=""
                v-model="msg">
            </el-input>
            <el-button class="send-btn" @click="sendMsg" type="info" :disabled="button_disable">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import msgBox from './msgBox.vue';
import headMenu from './head-menu.vue';

export default {
  name: 'chat',
  data() {
    return {
      content: 'hh',
      loading: true,
      msg_loading: false,
      selfName: '',
      selfUrl: '',
      targetName: '选择联系人',
      targetId: '',
      targetUrl: '',
      msg: '',
      msgList: [],
      contactList: [],
      socket: null,
      button_disable: true
    }
  },
  components: {
    msgBox,
    headMenu,
  },
  mounted() {
    this.socket = this.$websocket.initWebSocket('/connection/chat');
    this.socket.onmessage = this.webSocketOnMessage;
    if (this.$route.query.suId !== undefined) {
      this.handleContactClick(this.$route.query.suId)
    }
    this.selectSelfInfo();
    this.getConnectorLists();
  },
  methods: {
    handleContactClick(id) {
      this.msgList = [];
      this.msg = null;
      this.targetId = id;
      this.msg_loading = true;
      this.setConnector();
      this.selectChatInfo();
      this.button_disable = false;
    },
    getConnectorLists() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/message/chat/connector/lists',
      }).then(res => {
        this_vue.contactList = res.data;
        this_vue.loading = false;
      })
    },
    setConnector() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/message/chat/connector/info',
        params: {
          id: this_vue.targetId,
        }
      }).then(res => {
        this_vue.targetName = res.data.name;
        this_vue.targetUrl = res.data.headImg;
      })
    },
    selectSelfInfo() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/user/userinfo',
      }).then(res => {
        this_vue.selfName = res.data.name;
        this_vue.selfUrl = res.data.headImg;
      })
    },
    selectChatInfo() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/message/chat/lists',
        params: {
          connectorId: this_vue.targetId,
        }
      }).then(res => {
        let lists = res.data
        for (let index in lists) {
          let value = lists[index]
          this_vue.msgList.push({
            name: value.sname,
            msg: value.content,
            isSelf: value.isSelf
          })
        }
        this_vue.$nextTick(() => {
          const messagePanel = document.querySelector('.message-panel');
          messagePanel.scrollTop = messagePanel.scrollHeight;
          this_vue.msg_loading = false;
        });

      })
    },
    sendMsg() {
      const this_vue = this;
      this.$axios({
        method: 'POST',
        url: '/socket/chat',
        params: {
          id: this_vue.targetId,
          message: this_vue.msg
        }
      }).then()
      this.msgList.push({
        name: this.selfName,
        msg: this.msg,
        isSelf: true
      })
      this.msg = ''
      this.$nextTick(() => {
        const messagePanel = document.querySelector('.message-panel');
        messagePanel.scrollTop = messagePanel.scrollHeight;
      });
    },
    webSocketOnMessage(e) {
      this.response = e.data;
      this.msgList.push({
        name: this.targetName,
        msg: JSON.parse(this.response).data.content,
        isSelf: false
      })
      this.$nextTick(() => {
        const messagePanel = document.querySelector('.message-panel');
        messagePanel.scrollTop = messagePanel.scrollHeight;
      });
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.outer-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.wrapper {
  position: absolute;
  background-color: #fff;
  opacity: 0.85;
  height: 600px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  top: 7%;
  left: 2%;
  right: 2%;
  display: flex;
  padding-top: 3px;
}

.right_wrapper {
  width: 1200px;
  margin-right: 5%;
  top: 0;
}

.left_wrapper {
  width: 300px;
  left: 25%;
  overflow: scroll;
  overflow-x: hidden;
}


.divider {
  width: 1px;
  background-color: #ccc;
  height: 100%;
}

.contact_list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.contact_item {
  padding: 20px;
  border-bottom: 1px solid #ebebeb;
  text-align: center;
  margin-top: 0; /* 添加这行代码 */
}

.contact_item:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}


.input-area {
  border-radius: 4px;
  height: 50px;
  margin-top: 20px;
  border: 0 solid black;
}

.send-btn {
  position: absolute;
  right: 0;
  margin-right: 4%;
  bottom: 10px;
}

.message-panel {
  height: 300px;
  border-top: 1px #ebebeb solid;
  border-bottom: 1px #ebebeb solid;
  overflow-y: scroll; /* 修改为overflow-y */
  overflow-x: hidden;
}

.input {
  width: 100%;
  height: 100%;
  border: 0 #ebebeb solid;
  border-radius: 4px;
  outline: none;
  padding: 5px;
}

.contact_item {
  display: flex;
  align-items: center;
}

.contact_avatar {
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 10px;
}

.contact_name {
  margin: 0 0 0 15px;
  font-size: 19px;
  font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
</style>