<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="exitLogin">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="collapse?'auto':'200px'">
        <div class="toogle-button" @click="collapseBtn ">|||</div>
        <!--侧边栏菜单-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="this.collapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!--一级目录-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="'/'+secitem.path"
                v-for="secitem in item.children"
                :key="secitem.id"
                @click="saveNavState('/'+secitem.path)"
              >
                <i class="el-icon-menu"></i>
                {{secitem.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体部分-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-tools",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-marketing"
      },
      collapse: false,
      //激活链接地址
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    exitLogin() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(res);
    },
    //点击折叠
    collapseBtn() {
      this.collapse = !this.collapse;
    },
    //保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.toogle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>