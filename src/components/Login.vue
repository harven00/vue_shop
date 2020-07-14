<template>
  <div class="login-container">
    <!--头像框-->
    <div class="login-box">
      <div class="avata-img">
        <img src="../assets/logo.png" alt />
      </div>
      <!--登录-->
      <el-form
        label-width="0px"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        @keydown.enter.native="login"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
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
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data:res} = await this.$http.post("login", this.loginForm);
        if(res.meta.status!==200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //1.将登录成功之后的token保存到客户端的sessionStorage中
        //1.1项目中除了登录之外的其他api接口，必须在登录之后才能访问
        //1.2token 只适应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token",res.data.token)
        //2.通过编程式导航跳转到后台主页,路由地址是/home
        this.$router.push("/home")
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.login-box {
  left: 50%;
  top: 50%;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #fff;
  position: absolute;
  transform: translate(-50%, -50%);
  .avata-img {
    margin: 0 auto;
    transform: translate(0, -50%);
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login-form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  border-radius: 5px;
  position: absolute;
  top: 30%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>