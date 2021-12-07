<template>
  <div>
    <top title1="数据统计" title2="数据列表"></top>
    <div class="bottom">
      <div id="main" class="main_container"></div>
    </div>
  </div>
</template>

<script>
import top from "./content_top.vue";
import http from "../http";
export default {
  props: {},
  data() {
    return {
      shuju: "",
    };
  },
  // 折线图
  mounted() {
    var myChart = this.$echarts.init(document.getElementById("main"));
    http({
      url: "/reports/type/1",
    }).then((res) => {
      console.log(res);
      this.shuju = res.data;
      var options = this.shuju;
      options.title = {
        text: "用户来源",
      };
      options.tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      };
      myChart.setOption(options);
    });
  },
  methods: {},
  components: {
    top,
  },
};
</script>

<style scoped lang="scss">
.bottom {
  width: 1800px;
  height: 1000px;
  border-radius: 10px;
  padding: 25px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  #main {
    width: 80%;
    height: 80%;
  }
}
</style>
