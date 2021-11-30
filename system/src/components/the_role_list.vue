<template>
  <div class="therole">
    <div>
      <button class="top">添加角色</button>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="expand">
          <div>123</div>
        </el-table-column>
        <el-table-column label="#" prop="id"> </el-table-column>
        <el-table-column label="角色名称" prop="name"> </el-table-column>
        <el-table-column label="角色描述" prop="desc"> </el-table-column>
        <el-table-column label="操作" prop="operation"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      tableData: [
        {
          id: "",
          name: "",
          desc: "",
          operation: "",
        },
      ],
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.therole {
  .top {
    width: 98px;
    height: 40px;
    background-color: #409eff;
    color: white;
    border-radius: 3px;
    margin-bottom: 15px;
  }
}
</style>
