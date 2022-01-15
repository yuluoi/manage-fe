<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // this.$storage.setItem('age', '30')
    // console.log(this.$storage.getItem('age'));
    // this.$storage.clearItem('age')
    // this.$storage.clearAll()
  }
}
</script>

<style lang="sass">
@import './assets/style/index.scss'
@import './assets/style/reset.css'
</style>