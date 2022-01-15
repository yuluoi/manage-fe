<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in breakList" :key="item.path">
      <router-link to="/welcome" v-if="index == 0">
        {{ item.meta.title }}
      </router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  mounted () {
    console.log(this.$route);
  },
  computed: {
    breakList () {
      return this.$route.matched
    }
  }
}
</script>

<style>
</style>