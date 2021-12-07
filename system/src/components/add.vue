<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="tt">
      <el-breadcrumb-item :to="{ path: '/index/shop/list' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="add">
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-tabs
        tab-position="left"
        v-model="activeName"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form
            class="demo-dynamic"
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRules"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <div class="block">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="options"
                  :props="{
                    label: 'cat_name',
                    value: 'cat_id',
                  }"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form>
          <div v-for="item in cs" :key="item.attr_id">
              <el-form-item :label="item.attr_name"></el-form-item>
            <div>
              <el-checkbox
                :label="item.attr_vals"
                border
              ></el-checkbox>
            </div>
          </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form v-for="item in sx" :key="item.attr_id">
            <el-form-item :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://192.168.124.61:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="addForm.goods_introduce"
            class="text"
          ></quill-editor>
          <el-button type="primary" style="margin-top: 12px" @click="submit"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import http from "../http/index";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  props: {},
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      options: [],
      activeName: "",
      value: "",
      catLength: "",
      cs: "",
      sx: "",
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        checked1: true,
      },
      // 表单验证
      addFormRules: {
        goods_name: [
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    http({
      url: "categories",
    }).then((res) => {
      console.log(res);
      this.options = res.data;
    });
    // console.log(this.addForm.goods_name);
  },
  methods: {
    // 阻止标签切换
    beforeTabLeave(activeName, oldActiveName) {
      console.log("即将离开的标签页名字是" + oldActiveName);
      console.log("即将进入的标签页名字是" + activeName);
      this.catLength = this.addForm.goods_cat.split(",");
      if (oldActiveName === "0" && this.catLength.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 联级选择器转字符串
    handleChange(value) {
      console.log(value);
      this.addForm.goods_cat = this.addForm.goods_cat.join(",");
      // console.log(this.addForm.goods_cat);
      const cateId = [...this.addForm.goods_cat];
      // console.log(cateId);
      http({
        url: `categories/${cateId}/attributes`,
        params: { sel: "many" },
      }).then((res) => {
        // console.log(res);
        this.cs = res.data;
      });
      http({
        url: `categories/${cateId}/attributes`,
        params: { sel: "only" },
      }).then((res) => {
        // console.log(res);
        this.sx = res.data;
      });
    },

    // 预览图片时候，触发的方法
    handlePreview(result) {
      this.previewImgSrc = result.response.data.url;
      this.previewVisible = true;
    },
    // 当移除图片，会触发这个方法
    handleRemove(result) {
      // 根据 result.response.data.temp_path 从 addForm.pics 数组中，找到要删除那个对象的索引值
      const index = this.addForm.pics.findIndex(
        (item) => item.pic === result.response.data.tmp_path
      );
      // 根据索引删除对应的图片信息对象
      this.addForm.pics.splice(index, 1);
    },
    handleSuccess(result) {
      if (result.meta.status === 200) {
        this.addForm.pics.push({ pic: result.data.tmp_path });
      }
    },

    // 提交添加数据
    submit() {
      // console.log(this.addForm);
      http({
        url: "goods",
        method: "post",
        data: {
          goods_name: this.addForm.goods_name,
          goods_cat: this.addForm.goods_cat,
          goods_price: this.addForm.goods_price,
          goods_number: this.addForm.goods_number,
          goods_weight: this.addForm.goods_weight,
          goods_introduce:this.addForm.goods_introduce,
        },
      }).then((res) => {
        console.log(res);
        this.$router.push("./list");
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
.add {
  background-color: white;
}
.text {
  height: 250px;
  margin-bottom: 50px;
}
</style>
