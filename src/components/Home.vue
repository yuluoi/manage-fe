<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        router
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
      >
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <!-- 右边菜单 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div :class="['nav-top', isCollapse ? 'fold' : 'unfold']">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
            @click="$router.push('/audit/approve')"
          >
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}<i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'

export default {
  name: 'Home',
  components: {
    TreeMenu,
    BreadCrumb
  },
  data () {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  computed: {
    // 每当处理完审批 更新通知数量
    noticeCount () {
      return this.$store.state.noticeCount
    }
  },
  methods: {
    handleLogout (key) {
      console.log('chufa');
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '');
      this.userInfo = {};
      this.$router.push('/login');
    },
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    // 通知
    async getNoticeCount () {
      try {
        const count = await this.$api.noticeCount()
        // 把获取的noticeCount保存到vuex中
        this.$store.commit('saveNoticeCount', count)
      } catch (err) {
        console.error(err)
      }
    },
    // 菜单列表
    async getMenuList () {
      try {
        const { menuList, actionList } = await this.$api.getPermissionList()
        this.userMenu = menuList
        // 当前用户拥有的菜单
        this.$store.commit('saveUserMenu', menuList)
        // 当前用户拥有的按钮
        this.$store.commit('saveUserAction', actionList)
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted () {
    this.getNoticeCount()
    this.getMenuList()
    console.log(this.$store.state.userInfo)
  }
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;

  overflow-x: hidden;
  overflow-y: auto;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    z-index: 999;
    overflow-x: hidden;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }
    }
    .nav-menu {
      height: calc(100vh-50px);
      // height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    height: 100vh;
    transition: width 0.5s;
    position: relative;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      position: fixed;
      left: 200px;
      right: 0;
      background-color: #fff;
      z-index: 99;
      // 合并
      &.fold {
        left: 64px;
      }
      // 展开
      &.unfold {
        left: 200px;
      }
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      // border: 1px solid red;
      background: #eef0f3;
      padding: 70px 20px 20px 20px;
      min-height: calc(100vh - 50px);
    }
  }
}
</style>