<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="sendMsg">主要按钮</el-button>
    <el-input
        placeholder="来自客户端的消息"
        v-model="response"
        :disabled="true">
    </el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        commList: {
          commId: 6,
          commName: 5
        }
      },
      input: '',
      response: '',
      socket: null
    }
  },
  mounted() {
    this.socket = this.$websocket.initWebSocket();
    this.socket.onmessage = this.webSocketOnMessage;
  },
  methods: {
    sendMsg() {
      const this_vue = this;
      this.$axios({
        method: 'POST',
        url: '/socket/msg',
        params: {
          message: this_vue.input
        }
      }).then()
    },
    webSocketOnMessage(e) {
      this.response = e.data;
    }
  }
}
</script>