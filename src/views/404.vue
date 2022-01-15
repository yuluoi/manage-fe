<template>
  <div class="exception">
    <img src="@/assets/images/404.jpeg" alt="" />
    <el-button class="btn" @click="goHome">回首页</el-button>
  </div>
</template>

<script>
export default {
  name: '404',
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.exception {
  position: relative;
  img {
    width: 100%;
    height: 100vh;
  }
  .btn {
    position: fixed;
    left: 50%;
    bottom: 100px;
    transform: translate3d(-50%, -50%, 0);
    // margin-left: -34px;
  }
}
</style>