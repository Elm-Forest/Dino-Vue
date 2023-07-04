<template>

  <div class="head-wrapper flex-start">
    <div class="user-name">{{uname}}</div>
  </div>

</template>


<script>
export default {

  props: {
    uname: String,
  },
  data() {
    return {

    }
  }


}
</script>
<style scoped>

.user-name {
  font-size: 20px;
  color: #fff;
  width: 100px;
  line-height: 50px;
  text-align: center;

}
.head-wrapper {
  width: 100%;
  height: 50px;
  background-color: #666;
  display: flex;
}

.flex-start {

  align-items: flex-start;
}

</style>