<template>
  <div class="outer-wrapper">
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-submenu index="2">
        <template slot="title">{{ selfName }}</template>
        <el-menu-item index="2-1">设置</el-menu-item>
        <el-menu-item index="2-2">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="wrapper">
      <h3>群聊</h3>

      <div class="message-panel">
        <msg-box v-for="(item, index) of msgList" :key="index+Math.random()" :uname="item.name" :content="item.msg"
                 :isself="item.isSelf"></msg-box>

      </div>
      <div class="input-area">
        <textarea class="input" v-model="msg" @keyup.enter="sendMsg"></textarea>
        <!-- <button class="send" @click="sendMsg">发送</button> -->
        <el-button class="send-btn" @click="sendMsg">发送</el-button>

      </div>
    </div>
  </div>
</template>

<script>
import msgBox from './msgBox.vue';
import headMenu from './head-menu.vue';

export default {
  name: 'chat',
//   props: {
//     msg: String
//   }
  data() {
    return {
      content: 'hahhahaha',
      selfName: '',
      targetName: '',
      targetId: '',
      msg: '',
      msgList: [],
      socket: null
    }
  },
  components: {
    msgBox,
    headMenu,
  },
  mounted() {
    this.socket = this.$websocket.initWebSocket();
    this.socket.onmessage = this.webSocketOnMessage;
    const this_vue = this;
    this.$axios({
      method: 'GET',
      url: '/message/chat/lists',
    }).then(res => {
      let lists = res.data
      for (let index in lists) {
        let value = lists[index]
        if (index === '0') {
          if (value.isSelf) {
            this_vue.selfName=value.sname
            this_vue.targetName=value.aname
          }else {
            this_vue.selfName=value.aname
            this_vue.targetName=value.sname
          }
        }
        this_vue.msgList.push({
          name: value.isSelf ? value.sname : value.aname,
          msg: value.content,
          isSelf: value.isSelf
        })
      }
    })
  },
  methods: {
    handleSelect(key, keyPath) {
    },
    sendMsg() {
      const this_vue = this;
      this.$axios({
        method: 'POST',
        url: '/socket/msg',
        params: {
          message: this_vue.msg
        }
      }).then()
      this.msgList.push({
        name: this.selfName,
        msg: this.msg,
        isSelf: true
      })
    },
    webSocketOnMessage(e) {
      this.response = e.data;
      this.msgList.push({
        name: this.targetName,
        msg: this.response,
        isSelf: false
      })
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
  position: relative;
  width: 650px;
  background-color: #fff;
  opacity: 0.85;
  height: 610px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  display: flex;
  top: 80px;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;

}

.message-panel {
  width: 85%;
  height: 350px;
  border-top: 1px #ebebeb solid;
  border-bottom: 1px #ebebeb solid;
  overflow: scroll;
  overflow-x: hidden;
  padding: 10px;

}

.input-area {
  width: 85%;
  border-radius: 4px;
  height: 120px;
  margin-top: 20px;
  border: 0 solid black;
}

.send-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.input {
  width: 100%;
  height: 100%;
  border: 0px #ebebeb solid;
  border-radius: 4px;
  outline: none;
  padding: 5px;
}

.fix-top {
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
}


</style>