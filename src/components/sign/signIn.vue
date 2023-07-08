<template>
  <div class="" v-loading="loading">
    <transition name="fade">
      <div v-if="isSignIn === 0" class="transition-container" @click="signIn">
        <h2>签到</h2>
        <div :style="{ backgroundColor: signInColor }" class="circle-button">
          <div class="time">{{ currentTime }}</div>
        </div>
      </div>
      <div v-if="isSignIn === 1" class="transition-container" @click="signOut">
        <h2>签退</h2>
        <div :style="{ backgroundColor: signOutColor }" class="circle-button">
          <div class="time">{{ currentTime }}</div>
        </div>
      </div>
      <div v-if="isSignIn === 2" class="transition-container">
        <h2>该打卡阶段结束</h2>
        <div :style="{ backgroundColor: signNoColor }" class="circle-button">
          <div class="time">{{ currentTime }}</div>
        </div>
      </div>
      <div v-if="isSignIn === 3" class="transition-container">
        <h2>该部门未设置打卡</h2>
        <div :style="{ backgroundColor: signNoColor }" class="circle-button">
          <div class="time">{{ currentTime }}</div>
        </div>
      </div>
      <div v-if="isSignIn === 4" class="transition-container">
        <h2>未在考勤时间内</h2>
        <div :style="{ backgroundColor: signNoColor }" class="circle-button">
          <div class="time">{{ currentTime }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //请假单对话框的显示
      dialogFormVisible: false,
      loading: false,
      currentTime: '',
      isSignIn: 0,
      signInColor: '#f7b55e',
      signOutColor: '#f8516a',
      signNoColor: '#a2a2a2',
    }
  },
  created() {
    this.init();
  },
  computed: {
    updateTime() {
      return setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.currentTime = `${hours}:${minutes}:${seconds}`;
      }, 1000); // 每秒更新一次时间
    },
  },
  beforeDestroy() {
    clearInterval(this.updateTime); // 组件销毁前清除定时器
  },
  mounted() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
    this.updateTime();
  },
  methods: {
    init() {
      let this_vue = this
      this_vue.loading = true
      this.$axios({
        method: 'get',
        url: '/check/judge',
      }).then(function (response) {
        this_vue.isSignIn = response.data
        this_vue.loading = false
      })
    },

    signIn() {
      let this_vue = this

      this.$axios({
        method: 'post',
        url: '/check/sign',
        params: {
          'signType': 0,
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "签到成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init()
      })
    },
    signOut() {
      let this_vue = this

      this.$axios({
        method: 'post',
        url: '/check/sign',
        params: {
          'signType': 1,
        }
      }).then(function (response) {
        if (response.flag) {
          this_vue.$message({
            message: "签退成功",
            type: 'success'
          });
        } else {
          this_vue.$message({
            message: response.message,
            type: 'warning'
          });
        }
        this_vue.init()
      })
    },
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.transition-container {
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-button {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 20px auto;
  animation: scale 1s infinite alternate;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-color: transparent;
}

.sign-label {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  color: gray;
}

.circle-button .time {
  font-size: 24px;
  color: white;
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>
