<template>
  <el-container class="home_contanier">
    <el-header
      ><div class="header_c">
        <img src="../assets/logo.png" alt="" />
        <span>电信学院实验室管理系统</span>
        <el-button class="btns" type="info" plain @click="logout"
          >退出</el-button
        >
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!--  :default-active当前激活菜单的 index 动态赋值 去下边定义值 存在session里 再加载时取出
        这样才能保证二级列表被选中时的颜色-->
        <el-menu
          background-color="#6a7583"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 在一级菜单里遍历 index绑定id 是唯一的 点开哪个哪个就展开
        然后：index 绑定字符串id是数字 拼接一个字符串就能转换 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="iconsObj[item.id]" id="iconl"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 开启路由后 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <!-- api返回了path 加个“/” -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavstate('/'+subItem.path)"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <!-- 路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        // 这个数字对应左侧菜单的id
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠
      isCollapse: false,
      // 3.3.1被激活的链接地址
      activePath:'',
    };
  },
  // 加载立马渲染
  created() {
    this.getmenuList();
    // 3.3.3把当前激活菜单的 index 从session里取出
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      // 退出 清空token
      window.sessionStorage.clear();
      //   路由到login页
      this.$router.push("/login");
    },
    // 获取左侧所有菜单 异步 解构赋值
    async getmenuList() {
      const { data: res } = await this.$http.get("menus");
      // 状态码200为成功，不成功返回报错 成功把值赋给menulist
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      // console.log(res);
      // console.log(this.menuList);
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapse() {
      // 取反
      this.isCollapse = !this.isCollapse;
    },
    saveNavstate(activePath){
      // 3.3.2把当前激活菜单的 index 存在session中
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
      

    },
  },
};
</script>
<style  scoped>
.home_contanier {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #587772;
  color: rgb(243, 239, 239);
  /* text-align: center; */
  line-height: 60px;
}

.el-aside {
  background-color: #6a7583;

  /* color: #333;
  text-align: center;
  line-height: 200px; */
}
.el-menu {
  border-right: none;
}

.el-main {
  /* background-color: #cedff0; */
  /* color: #333;
  text-align: center;
  line-height: 300px; */
}
.header_c span {
  position: absolute;
  left: 60px;
  /* width: 90%; */
}
.header_c .btns {
  position: absolute;
  right: 5px;
  top: 10px;
  color: #2b11a1;
  border: 1px solid rgb(31, 161, 75);
  background-color: rgb(149, 161, 192);
}
.header_c img {
  width: 50px;
  height: 50px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 3px;
}
#iconl {
  padding-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 34px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>