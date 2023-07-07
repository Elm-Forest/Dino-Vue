<template>

  <div class="msg-wrapper" v-bind:class="{ self: isself }">
    <div class="uname">
      <el-avatar :src="headImg" class="el-dropdown-link" id="headImg" alt=""></el-avatar>
    </div>

    <div class="content_box">
      <div class="content" v-html="renderHTML()"></div>
    </div>

  </div>

</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  name: 'mdMsgBox',
  props: {
    uname: String,
    content: String,
    isself: Boolean,
    headImg: String
  },
  data() {
    return {
      userName: '',
      msg: '',
      msgList: [],
    }
  },
  mounted() {

  },

  methods: {
    renderHTML() {
      const md = new MarkdownIt();
      this.renderedHTML = md.render(this.content);
      return this.renderedHTML
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.msg-wrapper {
  display: flex;
  flex-direction: row;
  padding: 10px;
}

.content_box {
  padding: 10px 10px 15px;
}

.content {
  padding: 1px 15px 1px;
  border-radius: 8px;
  background-color: #e8e8e8;
}

.self {
  flex-direction: row-reverse;
}


</style>