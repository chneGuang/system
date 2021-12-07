<template>
  <div>
    <top title1="订单管理" title2="订单列表"></top>
    <div class="bottom">
      <search :pagename="page"  @find="getv"></search>
      <!-- 表格 -->
      <template>
        <el-table
          :data="tableData"
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
          <el-table-column prop="order_number" label="订单编号" width="600">
          </el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="120">
          </el-table-column>
          <el-table-column prop="pay_status" label="是否付款" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.pay_status === '0'" class="pay1"
                >未付款</span
              >
              <span v-else class="pay2">已付款</span>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="180">
          </el-table-column>
          <el-table-column prop="create_time" label="下单时间" width="300">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="order_address(scope.$index, scope.row)"
              ></el-button>
              <el-button
                size="small"
                type="success"
                @click="order_position(scope.$index, scope.row)"
                icon="el-icon-location"
              ></el-button>
              <el-button
                size="small"
                type="success"
                @click="order_change(scope.$index, scope.row)"
                icon="el-icon-more"
              ></el-button>
              <el-button
                size="small"
                type="success"
                @click="order_status(scope.$index, scope.row)"
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
    <!-- 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="isaddress">
      <el-form :model="form" :rules="add_rules">
        <el-form-item label="省市区/县" label-width="120px" prop="address1">
          <el-cascader
            placeholder="请选择"
            :options="address"
            filterable
            v-model="form.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px" prop="address2">
          <el-input v-model="form.address2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset_add">取 消</el-button>
        <el-button type="primary" @click="sub_add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog title="查看物流信息" :visible.sync="isposition">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in posi_data"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 查看订单详情 -->
    <el-dialog title="查看订单信息" :visible.sync="ischange">
      <el-form :model="info">
        <el-form-item label="订单编号" label-width="120px">
          <el-input
            v-model="info.order_id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单号" label-width="120px">
          <el-input
            v-model="info.order_number"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单价格" label-width="120px">
          <el-input
            v-model="info.order_price"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改订单状态 -->
    <el-dialog title="修改订单状态" :visible.sync="isstatus">
      <el-form :model="sta_info">
        <el-form-item label="订单ID" label-width="120px">
          <el-input
            v-model="sta_info.id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单是否发货" label-width="120px">
          <el-input v-model="sta_info.is_send" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单支付" label-width="120px">
          <el-input v-model="sta_info.order_pay" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单价格" label-width="120px">
          <el-input
            v-model="sta_info.order_price"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单数量" label-width="120px">
          <el-input
            v-model="sta_info.order_number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态" label-width="120px">
          <el-input v-model="sta_info.pay_status" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset_order">取 消</el-button>
        <el-button type="primary" @click="sub_order">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import top from "./content_top.vue";
import search from "./serach.vue";
import http from "../http";
import address from "../assets/city_data2017_element";
export default {
  props: {},
  data() {
    return {
      // 当前页面
      page:'/orders',
      tableData: [],
      page_size: 10,
      page_sizes: [10, 20, 30],
      current: 1,
      total_: 1,
      currentPage: 1,
      isaddress: false,
      // 获取到的数据
      form: {
        address1: [],
        address2: "",
      },
      // 地址验证规则
      add_rules: {
        address1: [
          { required: true, message: "请选择区域", trigger: "change" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      // 地址
      address: address,
      // 物流信息
      isposition: false,
      posi_data: {},
      // 查看订单信息
      ischange: false,
      info: {},
      // 改变订单状态
      isstatus: false,
      sta_info: {
        id: 0,
        is_send: 0,
        order_pay: 0,
        order_price: 0,
        order_number: 0,
        pay_status: 0,
      },
      // 选中的商品id
      change_id: "",
    };
  },
  methods: {
    // 获取查询数据
    getv(v){
      // console.log(v);
      this.tableData=v;
      this.current=1;
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
    // 修改地址
    order_address(index, row) {
      console.log(index, row);
      this.isaddress = true;
      this.change_id = row.order_id;
    },
    // 修改信息取消按钮
    reset_add() {
      this.isaddress = false;
      this.form.address1 = [];
      this.form.address2 = "";
    },
    // 修改信息确定按钮
    sub_add() {
      if (this.form.address1 == "" && this.form.address2 == "") {
        this.$message.error("必填项不能为空");
      } else {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.reset_add();
      }
    },
    // 查看物流信息
    order_position(index, row) {
      console.log(index, row);
      this.change_id = row.order_id;
      if (row.is_send == "否") {
        http({
          url: `/kuaidi/${this.change_id}`,
        }).then((res) => {
          if (res.meta.status != 200) {
            this.$message.error(res.meta.message);
          } else {
            // console.log(res.data.data);
            this.posi_data = res.data.data;
          }
        });
      } else {
        this.isposition = true;
        http({
          url: "/kuaidi/1106975712662",
        }).then((res) => {
          if (res.meta.status != 200) {
            this.$message.error(res.meta.message);
          } else {
            // console.log(res.data.data);
            this.posi_data = res.data.data;
          }
        });
      }
    },
    // 查看订单详情
    order_change(index, row) {
      console.log(index, row);
      this.change_id = row.order_id;
      this.ischange = true;
      http({
        url: `/orders/${this.change_id}`,
      }).then((res) => {
        console.log(res);
        this.info = res.data;
      });
    },
    // 修改订单状态
    order_status(index, row) {
      console.log(index, row);
      // this.change_id = row.order_id;
      console.log(row.order_id);
      this.sta_info.id = row.order_id;
      if (row.is_send == "否") {
        this.sta_info.is_send = 0;
      } else {
        this.sta_info.is_send = 1;
      }
      this.sta_info.order_pay = row.order_pay;
      this.sta_info.order_price = row.order_price;
      this.sta_info.order_number = 0;
      this.sta_info.pay_status = row.pay_status;
      this.isstatus = true;
    },
    // 取消按钮
    reset_order() {
      this.sta_info = {};
    },
    // 修改订单确定
    sub_order() {
      http({
        url: `/orders/${this.sta_info.id}`,
        type: "put",
        data: this.sta_info,
      }).then((res) => {
        this.isstatus = false;
        console.log(res);
        if (res.meta.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }else{
          this.$message.error('修改失败');
        }
      });
    },
    indexMethod(index) {
      return index + 1;
    },
    // order请求封装
    send(cur, page) {
      http({
        url: `/orders?pagenum=${cur}&pagesize=${page}`,
      }).then((res) => {
        this.total_ = res.data.total;
        let arr = res.data.goods.map((item) => {
          // console.log(item.create_time);
          let date = new Date(item.create_time);
          // console.log(date);
          item.create_time = date.toLocaleString("ja");
          return item;
        });
        this.tableData = arr;
      });
    },
  },
  mounted(){
    this.send(this.current, this.page_size);
  },
  components: {
    top,
    search,
  },
};
</script>

<style scoped lang="scss">
.bottom {
  // width: 1128px;
  height: 1000px;
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
  .pay1 {
    color: #f56c6c;
    background-color: #fef0f0;
    border: 1px solid #fcd6d6;
    padding: 0px 5px;
  }
  .pay2 {
    color: rgb(255, 255, 255);
    background-color: rgb(157, 235, 154);
    border: 1px solid rgb(87, 223, 46);
    padding: 0px 5px;
  }
}
.el-pagination {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
