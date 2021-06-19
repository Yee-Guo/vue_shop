<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索输入框 -->
      <!-- 栅栏 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
           
          >
            <el-button slot="append" icon="el-icon-search"   @click="getUserList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="addvisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 border 和stripe 是样式类名 -->
      <el-table :data="userlist" border stripe>
        <!--prop传入值  -->
        <!-- 索引index列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 插槽获取所在行的所有数据 。.mg_stage是一个布尔值 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              @change="userstageChanege(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            @click="showmotifyDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removebyid(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- current-page 当前页数 page-size 当前每页显示多少条 -->
      <!-- layout 是各种部分 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <!-- visible.sync是一个布尔值 表示表单是否显示 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addvisible"
  width="30%"
  @close="addDialogClosed">
  <!-- 主体 -->
  <!-- rules动态绑定一个对象 在每个el-form-item里面通过prop 绑定对应规则 -->
  <!-- model动态绑定数据对象 在el-input里 v-model对应对象里的数据 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormref" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addvisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户 -->
<el-dialog
  title="修改用户信息"
  :visible.sync="motifyvisible"
  width="30%"
  @close="motifyClosed">
  <!-- 主体 -->
  
  <el-form :model="motifyForm" :rules="addFormRules" ref="motifyref" label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="motifyForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="motifyForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="motifyForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="motifyvisible = false">取 消</el-button>
    <el-button type="primary" @click="motifyUserinfo" >确 定</el-button>
  </span>
</el-dialog>
<!-- 是否删除提示 -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    //   自定义校验规则
        var checkEmail = (email, value, callback) => {
            const regEmail = /^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(regEmail.test(value)){
                return callback();
            }
          callback(new Error('请输入正确的邮箱！'));
        }
        var checkPhone = (mobile, value, callback) => {
            const regPhone = /^1[0-9]{10}$/;
            if(regPhone.test(value)){
                return callback();
            }
          callback(new Error('请输入正确的手机号！'));
        }
      
    return {
      queryInfo: {

        query: "",
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 2,
      },
      userlist: [],
    //   获取用户列表时 返回total
      total: 0,
      mg_stage: true,
      addvisible:false,
      motifyvisible:false,
      addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
      },
      addFormRules:{
        username:[ { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }],
        email:[{ required: true, message: '请输入邮箱', trigger: 'blur' },
        {validator: checkEmail, trigger: 'blur'}],
        mobile:[{ required: true, message: '请输入电话号', trigger: 'blur' },
        {validator: checkPhone, trigger: 'blur'}]
      },
    //   空对象 之后查询获取存进来
      motifyForm:{},
     

    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表信息
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败！");
      }
      // 成功便赋值
      this.userlist = res.data.users;
      this.total = res.data.total;
    //   console.log(params);
    },
    handleSizeChange(newSize){
        // console.log(newSize);
        this.queryInfo.pagesize = newSize;
        this.getUserList();

    },
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage; 
        // 赋值后 重新获取用户列表
        this.getUserList();

    },
    // 监听开关
  async  userstageChanege(userinfo){
        // console.log(userinfo);
        // 这里是一个url put方法修改用户状态
    const {data: res} = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_stage}`
    )
    if (res.meta.status!=200){
        userinfo.mg_stage=!userinfo.mg_stage;
        return this.$message.error('更新用户状态失败！');
    }
    this.$message.success('更新用户状态成功！');

    },
    addDialogClosed(){
        this.$refs.addFormref.resetFields();
    },
    addUser(){
        this.$refs.addFormref.validate(async valid =>{
            if(!valid) return
            // console.log(this.$refs);
            // 校验成功可以发起添加用户请求
          const {data:res} =   await this.$http.post('users',this.addForm)
          if(res.meta.status!=201) return this.$message.error("添加用户失败！");
            this.$message.success('添加成功！');
            // 添加用户对话框隐藏
            this.addvisible = false;
            // 重新获取用户列表
            this.getUserList();
        })
    },
   async showmotifyDialog(id){
       const {data:res} = await this.$http.get('users/'+id)
       if(res.meta.status!=200){
       return this.$message.error('查询用户信息失败！');}
        this.motifyForm= res.data
        this.motifyvisible=true;
    },
    motifyClosed(){
        this.$refs.motifyref.resetFields();
    },
    motifyUserinfo(){
        this.$refs.motifyref.validate(async valid =>{
            // console.log(valid);
            if(!valid) return 
            // 校验通过 发起请求 需带回id和邮箱电话
            const {data:res} = await this.$http.put(`users/`+this.motifyForm.id,
            {email:this.motifyForm.email
            ,mobile:this.motifyForm.mobile})
            if(res.meta.status!=200){
                return this.$message.error("修改失败！！！")
            }
            this.$message.success("修改成功！");
            this.motifyvisible=false;
            this.getUserList();
        })      
    },
   async removebyid(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err) 
        console.log(confirmResult);
        // 如果确认删除 返回字符串confirm
        // 取消删除 返回字符串 cancel
          if(confirmResult!='confirm'){
              return this.$message.info('已取消删除');
          }
          this.$message.success('删除成功！');
          const {data:res} = await this.$http.delete('users/'+id);
          if(res.meta.status!=200){
              return this.$message.error("删除失败！")
          }
        // this.$message.success("删除成功！！！");
        this.getUserList();
   

    },

   
  },
};
</script>
<style scoped>
.el-pagination{
    margin-top: 15px;
}
</style>
