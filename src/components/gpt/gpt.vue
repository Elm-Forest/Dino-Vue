<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/'+this.$store.state.rights+'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业消息</el-breadcrumb-item>
      <el-breadcrumb-item>GPT工作助手</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="outer-wrapper">
      <div class="wrapper">
        <div class="left_wrapper">
          <ul class="contact_list">
            <li v-for="session in sessionList" :key="session.id" class="contact_item"
                @click="handleContactClick(session.sessionId,session.title)">
              <span class="contact_name">{{ session.title === null ? '无标题' : session.title }}</span>
            </li>
          </ul>
        </div>
        <div class="divider"></div>
        <div class="right_wrapper">
          <h3 style="text-align: center">
            {{  title === null ? '无标题' : title }}
          </h3>
          <div class="message-panel">
            <md-msg-box v-for="(item, index) of msgList" :key="index+Math.random()" :uname="item.name"
                        :content="item.msg"
                        :isself="item.isSelf" :headImg="(function() {
                       return item.isSelf?selfUrl:gptUrl
                     })()"></md-msg-box>
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
import headMenu from "@/components/chat/head-menu.vue";
import {requestUrl} from "@/utils/back-end";
import MdMsgBox from "@/components/gpt/mdMsgBox.vue";
import gpt_helper from '../../assets/images/gpt_helper.png'
import {GPT_ID} from "@/utils/const";

export default {
  name: 'chat',
  data() {
    return {
      content: 'hh',
      selfName: '',
      selfUrl: '',
      GptName: 'GPT工作助手',
      title: null,
      gptUrl: gpt_helper,
      msg: '',
      msgList: [],
      sessionList: [],
      socket: null,
      button_disable: true,
      response: '',
      sessionId: '',
      index_gpt: 0
    }
  },
  components: {
    MdMsgBox,
    headMenu,
    gpt_helper
  },
  mounted() {
    this.socket = this.initWebSocket('/connection/gpt');
    this.socket.onmessage = this.webSocketOnMessage;
    this.selectSelfInfo();
    this.getSessionLists();
  },
  methods: {
    removeSession() {
      const this_vue = this;
      return this.$axios({
        method: 'DELETE',
        url: '/socket/gpt/remove',
        params: {
          sessionId: this_vue.sessionId
        }
      })
    },
    recoverSession() {
      this.response = '';
      const this_vue = this;
      this.$axios({
        method: 'POST',
        url: '/socket/gpt/recover',
        params: {
          sessionId: this_vue.sessionId
        }
      }).then()
    },
    createSession() {
      const this_vue = this;
      this.response = '';
      this.removeSession().then(_ => {
        this.$axios({
          method: 'GET',
          url: '/socket/gpt/start'
        }).then(res => {
          this_vue.sessionId = res;
        })
      })
    },
    handleContactClick(id,title) {
      this.msgList = [];
      this.msg = null;
      this.title = title;
      this.sessionId = id;
      this.selectChatInfo();
      this.recoverSession()
      this.button_disable = false;
    },
    getSessionLists() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/message/gpt/lists',
      }).then(res => {
        this_vue.sessionList = res.data;
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
        url: '/message/gpt/info',
        params: {
          sessionId: this_vue.sessionId
        }
      }).then(res => {
        let lists = res.data
        for (let index in lists) {
          let value = lists[index]
          this_vue.msgList.push({
            name: value.suId !== GPT_ID ? this_vue.selfName : this_vue.GptName,
            msg: value.content,
            isSelf: value.suId !== GPT_ID
          })
        }
        this_vue.$nextTick(() => {
          const messagePanel = document.querySelector('.message-panel');
          messagePanel.scrollTop = messagePanel.scrollHeight;
        });
      })
    },
    sendMsg() {
      const this_vue = this;
      this.response = '';
      this.$axios({
        method: 'POST',
        url: '/socket/gpt',
        params: {
          sessionId: this_vue.sessionId,
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
      const data = JSON.parse(e.data).content;
      if (this.index_gpt == 0) {
        this.msgList.push({
          name: this.GptName,
          msg: ' ',
          isSelf: false
        })
        this.$nextTick(() => {
          const messagePanel = document.querySelector('.message-panel');
          messagePanel.scrollTop = messagePanel.scrollHeight;
        });
      }
      this.index_gpt = this.index_gpt + 1

      if (data !== '[DONE]' && data !== '' && data !== undefined) {
        const msg_val = this.msgList[this.msgList.length - 1]
        this.msgList[this.msgList.length - 1].msg = msg_val.msg + JSON.parse(e.data).content;
      }
      if (data === '[DONE]') {
        this.index_gpt = 0;
      }

    }, initWebSocket(url = null) {
      const wsUrl = 'ws://' + requestUrl + url;
      this.socket = new WebSocket(wsUrl, [localStorage.getItem('token')])
      this.socket.onerror = this.$websocket.webSocketOnError;
      this.socket.onclose = this.$websocket.closeWebsocket;
      return this.socket;
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
  left: 10px;
  height: 300px;
  border-top: 1px #ebebeb solid;
  border-bottom: 1px #ebebeb solid;
  overflow-y: scroll; /* 修改为overflow-y */
  overflow-x: hidden;
  padding: 10px;
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
  align-items: center;
  text-align: center;
}

.contact_name {
  text-align: center;
  font-size: 15px;
  font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
</style>