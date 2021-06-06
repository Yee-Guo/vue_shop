<template>
  <div>
    home
    <el-button type="info" plain @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      // 退出 清空token
      window.sessionStorage.clear();
      //   路由到login页
      this.$router.push("/login");
    },
  },
};
</script>
<style  scoped>
</style>