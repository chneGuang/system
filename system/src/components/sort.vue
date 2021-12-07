<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="tt">
      <el-breadcrumb-item :to="{ path: '/index/shop/sort' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="nav">
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加分类</el-button
      >
      <el-dialog
        title="添加分类"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form">
          <el-form-item label="分类名称" :label-width="formLabelWidth" required>
            <el-input v-model="cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="父级分类"
            :label-width="formLabelWidth"
            v-model="cat_level"
          >
            <div class="block">
              <el-cascader
                :options="options"
                v-model="form.value"
                :props="{
                  label: 'cat_name',
                  value: 'cat_id',
                  checkStrictly: true,
                }"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>

      <template>
        <div>
          <el-table
            :data="tableData"
            style="width: 100%"
            border
            row-key="cat_id"
            :selection-type="false"
            index-text="索引"
            show-index
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column type="index" prop="index" label="#" width="67" />
            <el-table-column prop="cat_name" label="分类名称">
            </el-table-column>
            <el-table-column label="是否有效">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-check"
                show-icon
                circle
              ></el-button>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序">
              <template slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0"
                  >一级</el-tag
                >
                <el-tag
                  size="mini"
                  type="success"
                  v-else-if="scope.row.cat_level === 1"
                  >二级</el-tag
                >
                <el-tag size="mini" type="warning" v-else>三级</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  ><i class="el-icon-edit"></i
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  ><i class="el-icon-delete"></i
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <template>
            <!-- 分页器 -->
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[5, 10, 20, 30, 40]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import http from "../http/index";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      cat_name: "",
      cat_level: "",
      cat_pid: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      addDialogVisible: false,
      options: [],
      form: {
        name: "",
        value: "",
      },
      formLabelWidth: "120px",
    };
  },
  mounted() {
    this.start();
    http({
      url: "categories",
    }).then((res) => {
      console.log(res.data);
      this.options = res.data;
    });
  },
  methods: {
    start() {
      http({
        url: "categories",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        this.tableData = res.data.result;
        this.total = res.data.total;
        console.log(res.data);
      });
    },
    // 联级选择器转字符串
    handleChange(value) {
      console.log(value);
      //   this.form.value= this.cat_name.length ;
      this.cat_level = this.form.value.length;
      //   this.cat_pid = this.form.value.length;
      this.cat_pid = value[value.length - 1];
      console.log(this.cat_pid);
    },
    // 删除数据
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        http({
          url: `categories/${row.cat_id}`,
          method: "delete",
        }).then((res) => {
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg);
            http({
              url: "/categories",
              params: {
                pagenum: this.pagenum,
                pagesize: this.pagesize,
              },
            }).then((res) => {
              this.total = res.data.total;
              // this.goodsList = res.data.goods;
              this.tableData = res.data.goods;
              // console.log(this.tableData);
              this.start()
            });
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },

    // 每页多少条数据
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = `${val}`;
      this.start();
    },
    // 当前多少页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = `${val}`;
      this.start();
    },

    // 提交添加数据
    submit() {
      this.dialogFormVisible = true;
      http({
        url: "categories",
        method: "post",
        data: {
          cat_name: this.cat_name,
          cat_pid: this.cat_pid,
          cat_level: this.cat_level,
        },
      }).then((res) => {
        console.log(res);
        console.log(this.cat_name, this.cat_pid, this.cat_level);
        this.dialogFormVisible = false;
            this.start();
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.tt {
  padding-bottom: 40px;
}
.nav {
  width: 100%;
  background-color: #ffffff;
}
</style>
