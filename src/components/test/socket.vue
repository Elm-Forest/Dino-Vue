<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="sendMsg">发送文本</el-button>
    <el-button type="primary" @click="createSession">创建会话</el-button>
    <el-button type="primary" @click="removeSession">删除会话</el-button>
    <el-input v-model="sessionId" placeholder="请输入sessionID"></el-input>
    <el-button type="primary" @click="recoverSession">恢复会话</el-button>
    <el-input
        placeholder="来自客户端的消息"
        v-model="response"
        :disabled="true">
    </el-input>
    <el-button type="primary" @click="getSessionLists">对话列表</el-button>
    <el-input
        placeholder="来自客户端的消息"
        v-model="sessionLists"
        :disabled="true">
    </el-input>
    <el-button type="primary" @click="selectChatInfo">详细信息</el-button>
    <el-input
        placeholder="来自客户端的消息"
        v-model="sessionInfo"
        :disabled="true">
    </el-input>
  </div>

</template>
<script>
import {requestUrl} from "@/utils/back-end";

export default {
  data() {
    return {
      input: '',
      response: '',
      socket: null,
      sessionId: '',
      sessionLists: [],
      sessionInfo:''
    }
  },
  mounted() {
    this.socket = this.initWebSocket("/connection/gpt");
    this.socket.onmessage = this.webSocketOnMessage;
  },
  methods: {
    sendMsg() {
      this.response = '';
      const this_vue = this;
      this.$axios({
        method: 'POST',
        url: '/socket/gpt',
        params: {
          sessionId: this_vue.sessionId,
          message: this_vue.input
        }
      }).then()
    },
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
    getSessionLists() {
      const this_vue = this;
      this.$axios({
        method: 'GET',
        url: '/message/gpt/lists',
      }).then(res => {
        this_vue.sessionLists = JSON.stringify(res.data);
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
        this_vue.sessionInfo = JSON.stringify(res.data);
      })
    },
    webSocketOnMessage(e) {
      const data = JSON.parse(e.data).content;
      if (data !== '[DONE]' && data !== '' && data !== undefined) {
        this.response += JSON.parse(e.data).content;
      }
    },
    initWebSocket(url = null) {
      const wsUrl = 'ws://' + requestUrl + url;
      this.socket = new WebSocket(wsUrl, [localStorage.getItem('token')])
      this.socket.onerror = this.$websocket.webSocketOnError;
      this.socket.onclose = this.$websocket.closeWebsocket;
      return this.socket;
    }
  }
}
</script>