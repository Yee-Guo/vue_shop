<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <!-- 给表单加引用 ref 然后打印获取 -->
      <el-form
        ref="loginFormRef"
        :rules="loginFormrules"
        :model="loginForm"
        label-width="0"
        class="login_form"
      >
        <!-- prop绑定一个校验规则 -->
        <el-form-item prop="username">
          <!-- 通过属性给input添加icon 通过阿里矢量图标库 -->
          <!-- v-model绑定数据，在data中写一个对象 -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!-- 密码 -->
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">注销</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //   表单验证规则对象
      loginFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //   重置表单
    resetLoginForm() {
      // console.log(this);
      // 在原型链上查找到对象，调用resetfield方法
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        //   验证表单是否通过 bool值
        // console.log(valid);
        // false 则返回没通过
        if (!valid) return;
        // 发起登录请求，（先启动mysql，运行app.js)
        // 解构出 data赋值给 res data中的状态码200则成功
        // await 只能修饰异步的 所以把valid前加上async
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(res);
        // 调用element的弹框
        if (res.meta.status != 200)
          return this.$message.error("用户名或密码错误！");
        this.$message.success("登录成功！");
        // 登录成功后 token保存在sessionStorage中
        // 编程式导航跳转到后台主页
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style  scoped>
.login_container {
  background-color: #849fb9;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  /* margin: 0 auto; */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_container .login_box .avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #fff;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  padding: 5px;
  box-shadow: 0 0 10px #ddd;
  transform: translate(-50%, -50%);
  background-color: #567ace;
}
.login_container .login_box .avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  /* 绝对定位 向下对齐 盒模型改为border-box */
  bottom: 0;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
