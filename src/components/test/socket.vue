<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="sendMsg">主要按钮</el-button>
    <el-input
        placeholder="来自客户端的消息"
        v-model="response"
        :disabled="true">
    </el-input>
    <div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
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