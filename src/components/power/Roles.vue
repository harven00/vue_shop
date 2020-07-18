<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--用户区域-->
    <el-card>
      <!--添加用户角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdBottom',i1===0 ? 'bdTop' :'', 'vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!--渲染一级-->
              <el-col :span="5">
                <el-tag closable @close="removeRightId(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级-->
              <el-col :span="19">
                <el-row
                  :class="['vcenter',i2===0 ? '':'bdTop']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightId(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightId(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="serachRole(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleId(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加用户显示区域-->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisibleClose"
    >
      <el-form :model="addRole" :rules="addRolesRules" ref="addRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleF">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户区域-->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleClose"
    >
      <el-form :model="editRoles" :rules="editRolesRules" ref="editRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%"
      @close="resetDialogClose"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取用户列表
      userList: [],
      addDialogVisible: false,
      addRole: {
        roleName: "",
        roleDesc: ""
      },
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      },
      editRoles: [],
      editRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      rightDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName"
      },
      defaultKey: [],
      roleId: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data;
    },
    addDialogVisibleClose() {
      this.$refs.addRoleRef.resetFields();
    },
    addRoleF() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRole);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.getUserList();
        this.addDialogVisible = false;
      });
    },
    editDialogVisibleClose() {
      this.$refs.editRoleRef.resetFields();
    },
    //查询用户资料
    async serachRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败");
      }
      this.editRoles = res.data;
      this.editDialogVisible = true;
    },
    //编辑角色资料
    editRole() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRoles.roleId}`,
          {
            roleName: this.editRoles.roleName,
            roleDesc: this.editRoles.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑用户资料失败");
        }
        this.getUserList();
        this.editDialogVisible = false;
        this.$message.success("编辑用户成功");
      });
    },
    //删除角色
    async removeRoleId(id) {
      const removeR = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (removeR !== "confirm") {
        this.$message.info("已取消删除角色");
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户角色失败");
      }
      this.$message.success("删除用户角色成功");
      this.getUserList();
    },
    //移除第三级权限
    async removeRightId(role, rightId) {
      const reqConfirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (reqConfirm !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      role.children = res.data;
    },
    //权限列表
    async showRightDialog(role) {
      this.roleId = role.id;
      this.rightDialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      //调用递归函数
      this.getLeafKeys(role, this.defaultKey);
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
    getLeafKeys(node, arr) {
      //不包含children属性则是第三个节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    //监听分配权限对话框
    resetDialogClose() {
      this.defaultKey = [];
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idstr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
      console.log(idstr)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getUserList();
      this.rightDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-tag {
  margin: 4px;
}
.bdTop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>