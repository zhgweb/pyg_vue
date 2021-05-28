<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ?'200px':'60px'">
      <div class="logo" :class="{smallLogo:!isCollapse}"></div>
      <el-menu
      :collapse="!isCollapse"
      :collapse-transition="false"
        background-color="#002033"
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1"
              ><i class="el-icon-menu"></i>用户列表</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1"
              ><i class="el-icon-menu"></i>角色列表</el-menu-item
            >
            <el-menu-item index="2-2"
              ><i class="el-icon-menu"></i>权限列表</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-shopping-cart-2"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1"
              ><i class="el-icon-menu"></i>商品列表</el-menu-item
            >
            <el-menu-item index="3-2"
              ><i class="el-icon-menu"></i>分类参数</el-menu-item
            >
            <el-menu-item index="3-3"
              ><i class="el-icon-menu"></i>商品分类</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1"
              ><i class="el-icon-menu"></i>订单列表</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-picture-outline"></i>
            <span>数据统计</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="5-1"
              ><i class="el-icon-menu"></i>数据报表</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-class">
          <span class="header-icon" :class="!isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="openFn()"></span>
          <span>品优购后台管理系统</span>
        </div>
        <el-button type="danger" round size='mini' style="float:right;margin-top:15px;">退出</el-button>
      </el-header>
      <el-main>
      <!-- 二级路由 -->
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: true,
      iconArr: ['icon-user-fill', 'icon-cog', 'icon-shoppingcart', 'icon-file', 'icon-chart-area']
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    openFn () {
      this.isCollapse = !this.isCollapse
      console.log(this.isCollapse)
    }
  }
}
</script>

<style scoped lang='less'>
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/images/logo_admin.png) no-repeat
        center / 140px auto;
    }
    //覆盖小图变大图
    .smallLogo {
      //  width: 100%;
      // height: 60px;
      background-image: url(../../assets/images/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .el-menu {
    border-right: none;
  }

  .el-header {
    border-bottom: 1px solid #ddd;
    .header-class {
      float: left;
      .header-icon {
        font-size: 30px;
        vertical-align: middle;
        padding-right: 20px;
      }
      font-size: 18px;
    }

    line-height: 60px;
  }
}
</style>
