<template>
  <template v-for="menu in userMenu">
    <!-- 判断是否是一级菜单 -->
    <el-submenu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :key="menu._id"
      :index="menu.path"
    >
      <template #title>
        <i :class="menu.icon"></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <TreeMenu :userMenu="menu.children" />
    </el-submenu>
    <!-- 二级菜单 -->
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu._id"
    >
      <template #title>{{ menu.menuName }}</template>
    </el-menu-item>
  </template>
  <!-- <el-submenu index="1">
    <template #title>
      <i class="el-icon-setting"></i>
      <span>系统管理</span>
    </template>
    <el-menu-item index="1-1">
      <template #title>用户管理</template>
    </el-menu-item>
    <el-menu-item index="1-2">
      <template #title>菜单管理</template>
    </el-menu-item>
  </el-submenu>
  <el-submenu index="2">
    <template #title>
      <i class="el-icon-location"></i>
      <span>审批管理</span>
    </template>
    <el-menu-item index="2-1">
      <template #title>休假申请</template>
    </el-menu-item>
    <el-menu-item index="2-2">
      <template #title>待我审批</template>
    </el-menu-item>
  </el-submenu> -->
</template>

<script>

export default {
  name: 'TreeMenu',
  props: {
    userMenu: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style>
</style>