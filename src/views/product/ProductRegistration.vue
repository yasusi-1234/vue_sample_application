<template>
  <div id="top">
    <div>
      <h3 class="form-title">商品登録</h3>
      <div class="form">
        <div class="form-inner">
          <div class="form-inner-item">
            <!-- リクエストはカテゴリーIDを送る -->
            <label class="form-label" for="category">カテゴリー: </label>
            <select id="category" v-model="addProductData.categoryId" class="form-select">
              <option
                v-for="category in categories"
                :key="category.categoryId"
                :value="category.categoryId"
                >{{ category.categoryName }}</option
              >
            </select>
          </div>
          <div class="form-inner-item">
            <label class="form-label" for="productName">商品名:</label>
            <input
              class="form-input"
              type="text"
              id="productName"
              v-model="addProductData.productName"
            />
          </div>
          <div class="form-inner-item">
            <label class="form-label" for="price">価格:</label>
            <input
              class="form-input"
              type="number"
              id="price"
              min="10"
              value="10"
              v-model.number="addProductData.price"
            />
          </div>
          <div class="form-inner-item">
            <label class="form-label" for="stock">在庫数:</label>
            <input
              class="form-input"
              type="number"
              id="stock"
              min="0"
              value="0"
              v-model.number="addProductData.stock"
            />
          </div>
          <div class="form-inner-item">
            <el-button
              type="info"
              icon="el-icon-plus"
              size="midium"
              @click="createProductRequest"
              >登録</el-button
            >
          </div>
      </div>
    </div>

    <h3 class="form-title">カテゴリー追加:</h3>
    <div class="form">
      <div class="form-inner">
        <div class="form-inner-item">
          <label class="form-label form-label-category" for="categoryName">カテゴリー名:</label>
          <input
            class="form-input" type="text" v-model="addCategoryData" />
        </div>
        <div class="form-inner-item">
          <el-button type="info" icon="el-icon-plus" size="midium" @click="createCategoryRequest">登録</el-button>
        </div>
      </div>
    </div>

    <div>
      {{ addProductData }}
    </div>
    <div>
      {{ addCategoryData }}
    </div>
    <div>
      {{ categories }}
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "productRegistation",
  data() {
    return {
      addProductData: {
        categoryId: null,
        productName: "",
        price: null,
        stock: null,
      },
      addCategoryData: "",
    };
  },
  computed: {
    ...mapGetters(["categories", "headerInAccessToken"]),
  },
  methods: {
    ...mapActions(["createProduct", "createCategory"]),
    async createProductRequest() {
      // validation用
      let message = "";
      const { categoryId, productName, price, stock } = this.addProductData;
      message = categoryId ? message : "カテゴリー名が指定されていません\r\n";
      message = productName ? message : message + "商品名が入力されていません\r\n";
      message = price < 10 ? message + "価格が入力されていません。または値が10未満です\r\n" : message;
      message = stock ? message : message + "在庫数が入力されていません";

      // messageに値が入力されていた場合はエラーの処理
      if (message) {
        this.$message({
          message,
          type: "warning",
          duration: 5000,
        });
      } else{
        // 登録リクエスト
        const result = await this.createProduct({addProductData: this.addProductData})
        console.log(result)
        if(result){
          // 新規商品登録処理に成功した場合
          // addProductDataの初期化
          this.addProductData = { categoryId: null,  productName: "", price: null, stock: null, }
        }
      }
    },
    async createCategoryRequest(){
      // validation用
      let message = "";
      message = this.addCategoryData.trim() ? message : "カテゴリー名が指定されていません";

      // messageに値が入力されていた場合はエラーの処理
      if (message) {
        this.$message({ message, type: "warning" });
      } else {
        // 問題無ければ新規カテゴリー登録リクエスト
        const result = await this.createCategory({ categoryName: this.addCategoryData })
        if(result){
          // 処理に成功した場合
          this.addCategoryData = ""
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
.form {
  margin-top: 20px;
  margin-right: 20px;
  border: 3px solid #cad0d6;
  border-radius: 8px;


  &-inner{
    margin: 15px;
    &-item{
      // margin-bottom: 13px;
      margin: 20px 0px 13px 10px;
      display: flex;
      align-items: center;
    }
  }

  &-label{
    display: inline-block;
    width: 90px;
    font-weight: bold;
    &-category{
      width: 120px;
    }
  }

  &-input{
    height: 20px;
    font-size: 17px;
  }

  &-select{
    height: 25px;
    font-size: 15px;
  }
}

</style>
