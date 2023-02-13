<!-- 用于编写当前组件的结构代码 -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!-- 用于编写当前组件的业务代码 -->
<script>
</script>

<!-- 用于编写当前组件的样式代码 -->
<style>
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
::-webkit-scrollbar {
  width: 0.3em;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #a2a1a1;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}

</style>
