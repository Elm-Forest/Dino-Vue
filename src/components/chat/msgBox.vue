<template>

  <div class="msg-wrapper" v-bind:class="{ self: isself }">
    <div class="uname">
      <el-avatar :src="headImg" class="el-dropdown-link" id="headImg" alt=""></el-avatar>
    </div>

    <div class="content_box">
      <div class="content">{{ content }}</div>
    </div>

  </div>

</template>

<script>
export default {
  name: 'msgBox',
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

  methods: {}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.msg-wrapper {
  display: flex;
  flex-direction: row;
  padding: 10px;
}

.content_box{
  padding: 10px 10px 15px;
}

.content {
  padding: 7px;

  border-radius: 8px;
  background-color: #e8e8e8;
}

.self {
  flex-direction: row-reverse;
}


</style>