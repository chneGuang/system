<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="tt">
      <el-breadcrumb-item :to="{ path: '/index/shop/parameter' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="parame">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        show-icon
        type="warning"
      >
      </el-alert>

      <div class="block">
        <span class="demonstration">选择商品分类：</span>
        <el-cascader
        v-model="selectedCateKeys"
          :options="options"
          :props="{
            label: 'cat_name',
            value: 'cat_id',
          }"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>

      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="isBtnDisabled"
              >添加属性</el-button
            >

            <el-table
              :data="cs"
              style="width: 100%"
              border
              row-key="attr_id"
              :selection-type="false"
              index-text="索引"
              show-index
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
              <el-table-column type="index" prop="index" label="#" width="67" />
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>

              <el-table-column label="操作">
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
          </el-tab-pane>

          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnDisabled"
              >添加属性</el-button
            >

            <el-table
              :data="sx"
              style="width: 100%"
              border
              row-key="attr_id"
              :selection-type="false"
              index-text="索引"
              show-index
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
              <el-table-column type="index" prop="index" label="#" width="67" />
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>

              <el-table-column label="操作">
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
          </el-tab-pane>
        </el-tabs>
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
      options: [],
      catLength: "",
      activeName: "many",
      cs: [],
      sx: [],
      value: "",
      selectedCateKeys:'',
    };
  },
  mounted() {
    http({
      url: "categories",
    }).then((res) => {
      console.log(res);
      this.options = res.data;
    });
  },
   computed: { // 计算属性
    // 如果按钮需要被禁用 则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    }
  },
  methods: {
    go() {
      http({
        url: `categories/${this.value}/attributes`,
        params: { sel: this.activeName },
      }).then((res) => {
        console.log(res);
        if(res.data!=null){
          this.cs = res.data;
          this.sx = res.data;
        }
        // console.log(this.cs);
        // console.log(this.sx);
      });
    },
    handleChange(value) {
      console.log(value);
      this.value = value[value.length - 1];
      console.log(this.value);
      // console.log(cateId);
      this.go();
    },

    handleDelete(index, row) {
      console.log(index,row);
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        http({
          url: `categories/${this.value}/attributes/${row.attr_id}`,
          method: "delete",
        }).then((res) => {
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg);
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },

    // Tabs 标签页
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeName);
      this.go();
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.tt {
  padding-bottom: 40px;
}
.parame {
  background-color: white;
}
</style>
