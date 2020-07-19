<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        show-index
        index-text="#"
        border
      >
        <!--有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted=== false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>

        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="ont" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
          >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--添加分类显示框-->
    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      width="50%"
      @close="cateDialogVisibleClose"
    >
      <el-form ref="addCateRef" :model="addCate" :rules="addCateRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentCateList"
            :props="Cascaderprops"
            @change="parentCateChange"
            v-model="selectKeys"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pushCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑分类显示框-->
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogVisibleColse">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editCateRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "ont"
        }
      ],
      cateDialogVisible: false,
      addCate: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      parentCateList: [],
      Cascaderprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      //选中的父级分类的id数组
      selectKeys: [],
      //编辑分类显示框隐藏
      editDialogVisible: false,
      //查询获取到的数据
      editForm: [],
      editCateRules:{
        cat_name:[{ required: true, message: "请输入分类名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    showCateDialog() {
      this.cateDialogVisible = true;
      this.getParentCateList();
    },
    //获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取父级分类数据失败");
      }
      this.parentCateList = res.data;
    },
    //选择下触发的函数
    parentCateChange() {
      console.log(this.selectKeys);
      //若seleKeys的length大于0则证明选中父级分类
      //反之，则，没有选中父级分类
      if (this.selectKeys.length > 0) {
        //父级分类id
        this.addCate.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        //为当前分类等级赋值
        this.addCate.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCate.cat_pid = 0;
        //为当前分类等级赋值
        this.addCate.cat_level = 0;
      }
    },
    pushCate() {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addCate);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品分类失败");
        }
        this.$message.success("添加商品分类成功");
        this.getCateList();
        this.cateDialogVisible = false;
      });
    },
    //关闭添加分类做的事
    cateDialogVisibleClose() {
      this.$refs.addCateRef.resetFields();
      (this.selectKeys = []),
        (this.addCate.cat_pid = 0),
        (this.addCate.cat_level = 0);
    },
    //查询编辑分类信息
    async editCate(id) {
      console.log(id);
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类信息失败");
      }
      this.editForm = res.data;
      console.log(this.editForm)
      this.editDialogVisible = true;
    },
    //关闭编辑分类对话框取消提示
    editDialogVisibleColse(){
      this.$refs.editFormRef.resetFields()
    },
    //编辑用户并修改
    editFormInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.put(`categories/${this.editForm.cat_id}`,
        {cat_name:this.editForm.cat_name}
        )
        if(res.meta.status!==200){
          return this.$message.error('编辑修改分类失败')
        }
        this.$message.error('编辑修改分类成功')
        this.getCateList()
        this.editDialogVisible = false
        console.log(res)
      })
    },
    //删除分类
    async deleteCate(id){
      const rmCate = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if( rmCate!=="confirm"){
          return this.$message.info('已经取消删除')
        }
        const{data:res}=await this.$http.delete(`categories/${id}`)
        if(res.meta.status!==200){
          return this.$message.error('删除分类失败')
        }
        this.$message.success('删除分类成功')
        this.getCateList()
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>