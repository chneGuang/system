<template>
  <div class="search">
    <input type="text" placeholder="请输入内容" v-model="id" />
    <i class="el-icon-search" @click="search_()"></i>
  </div>
</template>

<script>
import http from "../http";
export default {
  props: {
    pagename: {
      type: String,
    },
  },
  data() {
    return {
      id: "",
      list: [],
    };
  },
  methods: {
    search_() {
      if (this.pagename == "/orders" && this.id != "") {
        http({
          url: `${this.pagename}?pagenum=1&pagesize=10`,
        }).then((res) => {
          // this.total_ = res.data.total;
          let arr = res.data.goods.map((item) => {
            // console.log(item.create_time);
            let date = new Date(item.create_time);
            // console.log(date);
            item.create_time = date.toLocaleString("ja");
            return item;
          });
          // console.log(arr);
          this.list = arr;
          this.$emit("find", this.list);
        });
      } else if (this.pagename == "/users" && this.id != "") {
        http({
          url: `users/${this.id}`,
        }).then((res) => {
          if (res.meta.status != 200) {
            this.$message.error("查询失败");
          } else {
            console.log(res);
            this.$message({
              message: res.meta.msg,
              type: "success",
            });
            this.list.push(res.data);
            console.log(this.list);
            this.$emit("find", this.list);
          }
        });
      } else {
        this.$message.error("请输入正确的查询信息");
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.search {
  width: 360px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding-left: 15px;
  color: #dcdfe6;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 15px;
  margin-right: 20px;
  input {
    flex: 1;
    color: #c0c4cc;
    font-size: 18px;
    padding-right: 10px;
  }
  i {
    display: block;
    width: 56px;
    height: 38px;
    background-color: #f5f7fa;
    text-align: center;
    line-height: 38px;
    border-left: 1px solid #dcdfe6;
    font-size: 20px;
    color: #93969f;
  }
}
</style>
