<template>
  <div class="outer-wrapper">
    <div class="wrapper">

      <div class="left_wrapper">
        <ul class="contact_list">
          <li v-for="contact in contactList" :key="contact.id" class="contact_item">
            <div class="contact_avatar">
<!--              <img src="#" alt="Avatar">-->
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
        <div class="message-panel">
          <msg-box v-for="(item, index) of msgList" :key="index+Math.random()" :uname="item.name" :content="item.msg"
                   :isself="item.isSelf"></msg-box>
        </div>
        <div class="input-area">
          <el-input
              class="input"
              type="textarea"
              :rows="5"
              placeholder=""
              v-model="msg">
          </el-input>
          <el-button class="send-btn" @click="sendMsg">发送</el-button>
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
      selfName: '',
      targetName: 'xxx',
      targetId: '',
      msg: '',
      msgList: [],
      contactList: [{name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}, {name: '图灵'}],
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
    //_this.$store.state.user_id
    this.$axios({
      method: 'GET',
      url: '/message/chat/lists',
    }).then(res => {
      let lists = res.data
      for (let index in lists) {
        let value = lists[index]
        if (index === '0') {
          if (value.isSelf) {
            this_vue.selfName = value.sname
            this_vue.targetName = value.aname
            this_vue.targetId = value.auId
          } else {
            this_vue.selfName = value.aname
            this_vue.targetName = value.sname
            this_vue.targetId = value.suId
          }
        }
        this_vue.msgList.push({
          name: value.isSelf ? value.sname : value.aname,
          msg: value.content,
          isSelf: value.isSelf
        })

      }

      this_vue.$nextTick(() => {
        const messagePanel = document.querySelector('.message-panel');
        messagePanel.scrollTop = messagePanel.scrollHeight;
      });
    })

  },
  methods: {
    handleSelect(key, keyPath) {
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
        msg: JSON.parse(this.response).data,
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
  height: 750px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  top: 2%;
  left: 5%;
  right: 5%;
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
  height: 450px;
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