<template>
  <div class="roles">
    <div class="r_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r_but">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.roles {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
  .r_top {
    padding: 20px;
  }
  .r_but{
    background-color: white;
    padding: 20px;
    margin: 20px;
  }
}
</style>
