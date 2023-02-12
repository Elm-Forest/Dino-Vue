<!-- 发送邮件 -->
<template>
  <div class='box'>
    <div class="sBox" v-if="show">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理平台</el-breadcrumb-item>
        <el-breadcrumb-item>发送邮件</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider content-position="left"><b>发送邮件</b></el-divider>
      <el-form :model="form" label-position="left">
        <el-form-item label="收件人：">
          <el-autocomplete
              prefix-icon="el-icon-user-solid"
              v-model="form.contacts.name"
              :fetch-suggestions="querySearchAsync"
              placeholder="联系人"
              @select="handleSelect"
              clearable
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="邮件主题">
          <el-input v-model="form.title" autocomplete="off" style="width: 800px"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="border: 1px solid #ccc;">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="form.description"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submit">发送</el-button>
      <el-button type="info" @click="submit">保存到草稿</el-button>
    </div>
    <div class="remind" v-if="!show">
      <h1>请绑定邮箱以查看详情</h1>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

export default {
  components: {Editor, Toolbar},
  data() {
    return {
      editor: null,
      html: '<p>hello world</p>',
      toolbarConfig: {},
      editorConfig: {placeholder: '请输入内容...'},
      mode: 'default',

      formLabelWidth: "80px",
      contacts: '',
      form: {
        title: "",
        contacts: {
          id: '',
          name: ''
        },
        description: "",
        file: ""
      },
      show: true,
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },


    loadAll() {
      const this_vue = this;
      this.$axios({
        method: 'get',
        url: '/message/mail/contacts',
        params: {
          'name': this.form.contacts.name,
        }
      }).then(function (response) {
        this_vue.contacts = JSON.parse(JSON.stringify(response.data).replace(/name/g, "value"));
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    querySearchAsync(queryString, cb) {
      const contacts = this.contacts;
      const results = queryString ? contacts.filter(this.createStateFilter(queryString)) : contacts;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500);
    },
    handleSelect(item) {
      this.form.contacts.id = item.id;
    },
    back() {
      this.$router.push("/normal/fjx");
    },
    /* 发送邮箱 */
    submit() {
      let _this = this;
      this.$message({
        message: '正在发送，请稍等',
        duration: 60 * 1000 * 10,
        type: 'info'
      })
      console.log(this.form.contacts.id)
      this.$axios({
        method: 'POST',
        url: '/message/mail',
        params: {
          'auId': this.form.contacts.id,
          'subject': this.form.title,
          'content': this.form.description
        }
      }).then(res => {
        _this.$message.closeAll()
        if (res.flag) {
          _this.$message({
            message: "发送成功",
            type: "success",
            onClose: function () {
              _this.$router.push("/normal/fjx");
            }
          });
        } else {
          _this.$message({
            message: res.message,
            type: "error"
          })
        }
      })

    },
    /* 保存邮箱 */
    save() {
      let _this = this;
      _this.$message({
        message: "保存成功",
        type: "success",
        onClose: function () {
          _this.$router.push("/normal/cgx");
        },
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const this_vue = this;
    this.show = this.$store.state.bindMailbox
    this.$axios.get('/message/mail/account/check').then(response => {
      if (response.data !== null) {
        this_vue.$store.commit('SET_SHOW');
        this_vue.show = this_vue.$store.state.bindMailbox
        this.loadAll();
      }
    })
  },
  beforeCreate() {
  }, //生命周期 - 创建之前
  beforeMount() {
  }, //生命周期 - 挂载之前
  beforeUpdate() {
  }, //生命周期 - 更新之前
  updated() {
  }, //生命周期 - 更新之后
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  destroyed() {
  }, //生命周期 - 销毁完成
  activated() {
  }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang='less' scoped>
//@import url(); 引入公共css类
// 
.remind {
  width: 100%;
  height: 100%;
  display: flex;
}

.remind h1 {
  margin: 150px auto;

}
</style>