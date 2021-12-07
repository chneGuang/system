<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="tt">
      <el-breadcrumb-item :to="{ path: '/index/shop/list' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="list">
      <div class="top">
        <!-- 搜索查询 -->
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="input"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="find()"
          ></el-button>
        </el-input>
        <!-- 添加商品 -->
        <el-button type="primary" @click="add()">添加商品</el-button>
      </div>
      <div class="nav">
        <template>
          <!-- 列表数据渲染 -->
          <el-table
            :data="tableData"
            style="width: 100%"
            max-height="650"
            height="650"
            stripe
            border
            flex
          >
            <el-table-column type="index" prop="index" label="#" width="67" />
            <el-table-column prop="goods_name" label="商品名称" width="619px" />
            <el-table-column
              prop="goods_price"
              label="商品价格(元)"
              width="114"
            />
            <el-table-column prop="goods_weight" label="商品重量" width="89" />
            <el-table-column prop="upd_time" label="创建时间" width="159" />
            <el-table-column label="操作" width="139">
              <!-- 编辑和删除操作 -->
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
                  ><i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!--编辑参数的对话框-->
        <el-dialog
          title="编辑商品"
          :visible.sync="editDialogVisible"
          width="50%"
        >
          <!--内容主体区域-->
          <el-form :model="editForm" label-width="90px">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品介绍" prop="goods_introduce">
              <el-input v-model="editForm.goods_introduce"></el-input>
            </el-form-item>
          </el-form>
          <!--底部按钮区域-->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editGoods">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <template>
        <!-- 分页器 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
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
      index: 1,
      tableData: [],
      search: "",
      pagenum: 1,
      pagesize: 10,
      total: 0,
      input: "",
      editDialogVisible: false,
      editForm: {
        goods_name: "",
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_introduce: "",
        goods_cat: [],
      },
    };
  },
  mounted() {
    this.start();
  },
  computed: {},
  methods: {
    // 获取列表数据
    start() {
      http({
        url: "/goods",
        params: {
          query: this.input,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        this.total = res.data.total;
        // this.goodsList = res.data.goods;
        this.tableData = res.data.goods;
        this.$message.success(res.meta.msg);
        // console.log(this.tableData);
      });
    },
    // 修改数据
    handleEdit(index, row) {
      console.log(index, row);
      console.log(row.goods_name);
      this.editDialogVisible = true;
      http({
        url: `goods/${row.goods_id}`,
      }).then((res) => {
        this.editForm = res.data;
      });
    },
    // 点击确认 编辑修改商品
    editGoods() {
      // 可以发起修改商品信息的网络请求
      http({
        url: "goods/" + this.editForm.goods_id,
        method: "put",
        data: {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight,
          goods_introduce: this.editForm.goods_introduce,
          goods_cat: this.editForm.goods_cat,
        },
      }).then((res) => {
        this.editForm = res.data;
        if (res.meta.status !== 200) {
          return this.$message.error("修改商品信息失败！");
        }
        this.$message.success("修改商品信息成功！");
        // 关闭对话框
        this.editDialogVisible = false;
        // 重新发起请求商品列表
        this.start();
      });
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
          url: `goods/${row.goods_id}`,
          method: "delete",
        }).then((res) => {
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg);
            http({
              url: "/goods",
              params: {
                query: this.input,
                pagenum: this.pagenum,
                pagesize: this.pagesize,
              },
            }).then((res) => {
              this.total = res.data.total;
              // this.goodsList = res.data.goods;
              this.tableData = res.data.goods;
              // console.log(this.tableData);
            });
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },

    // 查找数据
    find() {
      http({
        url: `goods/${this.input}`,
      }).then((res) => {
        if (this.input != "") {
          this.tableData = Array(res.data);
        } else {
          this.start();
        }
        // console.log(this.tableData);
        this.input = "";
      });
    },

    // 添加数据
    add() {
      this.$router.push("./add");
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
  },
  components: {},
};
</script>

<style scoped lang="scss">
.tt {
  padding-bottom: 40px;
}
.list {
  font-size: 16px;
  padding: 0px 20px;
  width: 100%;
  background-color: #ffffff;
  .top {
    padding-top: 20px;
    margin-bottom: 15px;
    .input-with-select {
      margin-right: 21px;
      width: 288px;
      height: 38px;
    }
  }
  .block {
    margin-top: 17px;
    padding-bottom: 22px;
  }
}
</style>
