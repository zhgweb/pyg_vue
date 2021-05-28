<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ?'200px':'60px'">
      <div class="logo" :class="{smallLogo:!isCollapse}"></div>
      <el-menu
        router
        :collapse="!isCollapse"
        :collapse-transition="false"
        background-color="#002033"
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened>
          <!--一级菜单-->
          <!-- 注意： 一级菜单 index 和 二级菜单 index 是有从属关系的 -->
          <!-- 一级菜单的索引 id  二级菜单的索引  item.id-lastItem.id -->
        <el-submenu :index="item.id.toString()" v-for="(item,i) in menusData" :key="item.id" >
          <template slot="title">
            <i :class="['iconfont',iconArr[i]]"></i>
            <span>&nbsp;{{item.authName}}</span>
          </template>
           <!--二级菜单  只要index唯一就可以了 -->
          <el-menu-item-group>
            <el-menu-item :index="'/'+lastItem.path" v-for="lastItem in item.children" :key="lastItem.id"><i class="el-icon-menu"></i>{{lastItem.authName}}</el-menu-item>
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
        <el-button type="danger" round size='mini' style="float:right;margin-top:15px;" @click="outFn()">退出</el-button>
      </el-header>
      <el-main>
      <!-- 二级路由 -->
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      isCollapse: true,
      iconArr: ['icon-user-fill', 'icon-cog', 'icon-shoppingcart', 'icon-file', 'icon-chart-area'],
      menusData: []
    }
  },
  mounted () { this.menusFn() },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 开关列表
    openFn () {
      this.isCollapse = !this.isCollapse
    },
    // 退出登录
    outFn () {
      local.delUser()
      this.$router.push('/login')
    },
    async menusFn () {
      const { data: { data } } = await this.$http.get('menus')
      this.menusData = data
      console.log(data)
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
