<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容-->
    <el-card class="box-card">
      <el-row :gutter="25">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @keydown.native.enter="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户数据区域-->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="设置分类" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--对话框-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="dialogVisibleClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const reqEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (reqEmail.test(value)) {
        //合法邮箱
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkPhone = (rule, value, cb) => {
      const reqPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reqPhone.test(value)) {
        //请输入正确手机号
        return cb();
      }
      cb(new Error("请输入正确手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 1
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空" },
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: "号码不能为空" },
          {validator: checkPhone, trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
    //开关状态的改变
    async userStateChanged(userchange) {
      console.log(userchange);
      const { data: res } = await this.$http.put(
        `users/${userchange.id}/state/${userchange.mg_state}`
      );
      if (res.meta.status !== 200) {
        userchange.mg_state = !userchange.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success("更新状态成功");
    },
    dialogVisibleClose(){
      this.$refs.addFormRef.resetFields()
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        //可以发起用户请求
        const{data:res}=await this.$http.post('users',this.addForm)
        if(res.meta.status!==201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')

        this.dialogVisible = false
        this.getUserList()
      })
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>