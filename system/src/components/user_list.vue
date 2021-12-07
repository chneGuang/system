<template>
  <div>
    <top title1="用户管理" title2="用户列表"></top>
    <div class="bottom">
      <div class="b-top">
        <search :pagename="page"  @find="getv"></search>
        <el-button type="primary" size="mini" @click="user_add"
          >添加用户</el-button
        >
      </div>
      <!-- 表格 -->
      <template>
        <el-table
          :data="users"
          style="width: 1751px"
          :border="true"
          header-row-class-name="table_top"
          max-height="850"
        >
          <el-table-column
            type="index"
            :index="indexMethod"
            width="50"
            label="#"
          >
          </el-table-column>
          <el-table-column prop="username" label="姓名" width="250">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="300">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="300">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="250">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态" width="250">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="switch_(scope.$index, scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="user_edit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                size="small"
                type="success"
                @click="user_del(scope.$index, scope.row)"
                icon="el-icon-delete"
              ></el-button>
              <el-button
                size="small"
                type="success"
                @click="user_set(scope.$index, scope.row)"
                icon="el-icon-s-tools"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页脚 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="page_sizes"
        :page-size="page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_"
      >
      </el-pagination>
    </div>
    <!-- 添加用户 -->
    <el-dialog title="修改地址" :visible.sync="isadd">
      <el-form :model="user" :rules="add_rules">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="120px" prop="mobile">
          <el-input v-model="user.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset_user_add">取 消</el-button>
        <el-button type="primary" @click="sub_user_add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改地址" :visible.sync="isedit">
      <el-form :model="user_" :rules="edit_rules">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input
            v-model="user_.username"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="user_.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="120px" prop="mobile">
          <el-input v-model="user_.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset_edit_add">取 消</el-button>
        <el-button type="primary" @click="sub_edit_add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改地址" :visible.sync="isrole">
      <el-form>
        <el-form-item label="当前用户" label-width="120px">
          <span>{{ role.name }}</span>
        </el-form-item>
        <el-form-item label="当前角色" label-width="120px">
          <span>{{ role.role_name }}</span>
        </el-form-item>
        <el-form-item label="分配新角色" label-width="120px" prop="mobile">
          <el-select v-model="new_role" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="res_role_edit">取 消</el-button>
        <el-button type="primary" @click="sub_role_edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import top from "./content_top.vue";
import search from "./serach.vue";
import http from "../http";
export default {
  props: {},
  data() {
    return {
      page:'/users',
      user_id:'',
      find_id:0,
      users: [],
      current: 1,
      page_sizes: [2, 4, 6],
      page_size: 2,
      total_: 1,
      currentPage: 1,
      // 添加用户信息
      isadd: false,
      user: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      add_rules: {
        username: [
          { required: true, message: "请选择正确的用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入正确密码", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入正确的邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "change" },
        ],
        mobile: [
          { required: true, message: "请输入正确的电话号", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
          },
        ],
      },
      // 修改用户信息
      isedit: false,
      user_: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      edit_rules: {
        email: [
          { required: true, message: "请输入正确的邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "change" },
        ],
        mobile: [
          { required: true, message: "请输入正确的电话号", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
          },
        ],
      },
      // 分配角色
      isrole: false,
      role: {
        id: "",
        name: "",
        role_name: "",
      },
      options: [{
          value: '30',
          label: '超级管理员'
        }, {
          value: '20',
          label: '测试角色'
        }, {
          value: '15',
          label: '测试角色1'
        }],
      new_role:'',
    };
  },
  mounted() {
    this.send(this.current, this.page_size);
  },
  methods: {
    // 获取查询数据
    getv(v){
      console.log(v);
      this.users=v;
      this.current=1;
      this.total_=1;
    },
    // 条数变化
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page_size = val;
      this.send(this.current, this.page_size);
    },
    // 页数变化
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.current = val;
      this.send(this.current, this.page_size);
    },
    //改变用户状态变化
    switch_(index, row) {
      console.log(index, row);
      http({
        url: `/users/${row.id}/state/${row.mg_state}`,
        method: "put",
      }).then((res) => {
        console.log(res.meta);
        if (res.meta.status != "200") {
          this.$message.error("用户状态修改失败");
        } else {
          this.$message({
            message: "用户状态修改成功",
            type: "success",
          });
        }
      });
    },
    // 编辑用户
    user_edit(index, row) {
      console.log(index, row);
      this.isedit = true;
      this.user_.id = row.id;
      this.user_.username = row.username;
      this.user_.email = row.email;
      this.user_.mobile = row.mobile;
    },
    // 编辑用户取消按钮
    reset_edit_add() {
      this.isedit = false;
      this.user_ = {
        id: "",
        username: "",
        email: "",
        mobile: "",
      };
    },
    // 编辑用户确定按钮
    sub_edit_add() {
      http({
        url: `/users/${this.user_.id}`,
        method: "put",
        data: this.user_,
      }).then((res) => {
        // console.log(res.meta);
        if (res.meta.status != "200") {
          this.$message.error(res.meta.msg);
        } else {
          this.isedit = false;
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.send(1, 2);
        }
      });
    },
    // 删除用户
    user_del(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `users/${row.id}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status != "200") {
              this.$message.error("删除失败");
            } else {
              this.send(1, 2);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配用户角色
    user_set(index, row) {
      console.log(index, row);
      this.isrole = true;
      this.role.id=row.id;
      this.role.name=row.username;
      this.role.role_name=row.role_name;
    },
    // 分配角色取消
    res_role_edit(){
      this.isrole=false;
    },
    // 分配角色确定
    sub_role_edit(){
      http({
        url: `/users/${this.role.id}/role`,
        method: "put",
        data:{
          id:this.role.id,
          rid:this.new_role,
        }
      }).then((res) => {
        // console.log(res.meta);
        if (res.meta.status != "200") {
          this.$message.error(res.meta.msg);
        } else {
          this.isrole = false;
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.send(1, 2);
        }
      });
    },
    // 添加用户
    user_add() {
      this.isadd = true;
    },
    // 取消按钮
    reset_user_add() {
      this.isadd = false;
      this.user = {
        username: "",
        password: "",
        email: "",
        mobile: "",
      };
    },
    // 确定按钮
    sub_user_add() {
      http({
        url: "/users",
        method: "post",
        data: this.user,
      }).then((res) => {
        // console.log(res.meta);
        if (res.meta.status != "201") {
          this.$message.error(res.meta.msg);
        } else {
          this.isadd = false;
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.users.push(res.data);
          this.total_++;
          this.current = 1;
        }
      });
    },
    // 表格前面的编号
    indexMethod(index) {
      return index + 1;
    },
    //   封装请求
    send(cur, page) {
      http({
        url: `/users?pagenum=${cur}&pagesize=${page}`,
      }).then((res) => {
        // console.log(res);
        this.total_ = res.data.total;
        this.users = res.data.users;
      });
    },
  },
  components: {
    top,
    search,
  },
};
</script>

<style scoped lang="scss">
.bottom {
  height: 1000px;
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
  .b-top {
    height: 40px;
    display: flex;
    margin-bottom: 15px;
  }
}
// 页脚样式
.el-pagination {
  margin-top: 20px;
}
</style>
