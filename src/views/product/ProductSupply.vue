<template>
  <div>
    <h4>在庫補充</h4>
    <div class="form">
      <div class="form-inner">
        <div class="form-item">
          <label class="form-item-label" for="category">カテゴリー:</label>
          <select id="gategory" v-model="search.categoryId" class="form-item-select">
            <option :value="0">指定なし</option>
            <option
              v-for="category in categories"
              :key="category.categoryId"
              :value="category.categoryId"
              >{{ category.categoryName }}</option
            >
          </select>
        </div>

        <div class="form-item">
          <label class="form-item-label" for="category">商品名:</label>
          <!-- v-model.lazyを使うか検討 -->
          <input type="text" v-model="search.productName" class="form-item-input" />
        </div>

        <div class="form-item">
            <el-button
                type="primary"
                icon="el-icon-goods"
                size="midium"
                plain
                @click="hiddenClass"
                >一括補充</el-button
            >
        </div>
      </div>
    </div>
    <table class="table">
      <thead class="table-thead">
        <tr class="table-row-head">
          <th class="table-th">カテゴリー</th>
          <th class="table-th">製品名</th>
          <th class="table-th">売上数</th>
          <th class="table-th">登録</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="product in searchProduct" :key="product.productId"> -->
        <tr v-for="product in partData" :key="product.productId">
          <td class="table-td">{{ product.category }}</td>
          <td class="table-td">{{ product.productName }}</td>
          <td class="table-td">
            <input
              type="number"
              min="0"
              max="500"
              v-model.number="product.supplyCount"
              class="input-number"
              @input="supplyCountChecker(product)"
            />
          </td>
          <td class="table-td">
            <!-- security実装後はorderRequestMethodにユーザーID(employeeId)を含める必要あり -->
            <el-button
              type="primary"
              icon="el-icon-goods"
              size="midium"
              plain
              @click="
                supplyProduct({requestData: {
                  productId: product.productId,
                  requestValue: product.supplyCount,
                  subtraction: false,
                }, message, productName: product.productName})
              "
              >補充</el-button
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div>
        <!-- @size-change="handleSizeChange" -->
        <!-- total:全ページ数 page-size:表示させたい要素数  -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="displayCount"
        layout="prev, pager, next, jumper"
        :total="dataSize"
        class="pagination"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </div>
    <!-- <p>productSize : {{ simpleProductSize }}</p>
    <p>products: {{ simpleProducts }}</p>
    <p>search: {{ search }} </p>
    <p>searchProduct: {{ searchProduct }}</p> -->
    <p>dataSize: {{ dataSize }}, displayCount: {{ displayCount }}, partData: {{ partData }}</p>
    <p>{{ currentPage }}</p>
    <p>{{ withSupplyData }}</p>

     <!-- 一括補充で使う場所-->
        <div class="inner" :class="{active: isActive}" @click.self="hiddenClass">
          <div class="inner-element">
            <table class="table inner-element-table">
              <thead class="table-thead">
                <tr class="table-row-head inner-element-table-head">
                  <th class="table-th">カテゴリー</th>
                  <th class="table-th">製品名</th>
                  <th class="table-th">補充数</th>
                </tr>
              </thead>
              <tbody>
                <!-- <tr v-for="product in searchProduct" :key="product.productId"> -->
                <tr v-for="product in withSupplyData" :key="product.productId">
                  <td class="table-td">{{ product.category }}</td>
                  <td class="table-td">{{ product.productName }}</td>
                  <td class="table-td">{{ product.supplyCount }}</td>
                </tr>
              </tbody>
            </table>
             <el-button
                  type="primary"
                  icon="el-icon-goods"
                  size="midium"
                  plain
                  class="inner-element-button"
                  :loading="loading"
                  v-if="withSupplyData.length > 0"
                  @click="multiSupply"
                  >一括補充</el-button>
                  <!-- @click="multiOrder" -->
          </div>
        </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "sales",
  data() {
    return {
      search: {
        categoryId: 0,
        stock: "outStock", // 在庫無しも含む固定
        productName: "",
      },
      displayCount: 10, // 1ページ当たりの表示件数
      currentPage: 1, // 現在のページ
      isActive: false, // 一括補充用の表示・非表示用トグル
      withSupplyData: [],  // 一括注文用データ
      loading: false  // 一括処理用のボタンの制御用
    }
  },
  computed: {
    ...mapGetters(["simpleProducts", "simpleProductSize", "categories"]),
    searchProduct() {
      return this.$store.getters.searchProduct(this.search);
    },
    // searchProductのデータ数
    dataSize() {
      return this.searchProduct.length;
    },
    // 表示するデータ
    partData(){
      const partStartIndex = (this.currentPage - 1) * this.displayCount 
      const partEndIndex = partStartIndex + this.displayCount
      return this.searchProduct.slice(partStartIndex, partEndIndex)
    },
    message(){
        return this.$message
    }
  },
  methods: {
    ...mapActions(["supplyProduct", "multipleSupplyRequest"]),
    handleCurrentChange(val) {
        console.log(`current page: ${val}`);
    },
    // input type number部分のバリデーション
    supplyCountChecker(product){
      if(product.supplyCount < 0){
        product.supplyCount = 0
      }
    },
    // 一括処理用データの更新処理
    withSupplyDataCounter(){
        this.withSupplyData = this.searchProduct.filter(product=> product.supplyCount > 0)
    },
    // 一括処理用のHTMLの表示のON・OFFを切り替える処理と、条件によって一括データを更新する処理
    hiddenClass(event){
    //   console.log(event)
      if(event !== undefined && event.target.className != 'inner'){
        this.withSupplyDataCounter()
      }
      return this.isActive = !this.isActive
    },
    // 一括補充リクエストメソッド
    async multiSupply(){
        // ボタンロック
        this.loading = true
        const result = await this.multipleSupplyRequest({requestData: this.withSupplyData, message: this.message })

        console.log(result)
        // ロック解除
        this.loading = false
        // 一括ウィンドウを閉じる
        this.hiddenClass()
        if(result){
            // 成功時の処理
        }else{
            // 失敗時の処理
        }
    }
  },
};
</script>

<style scoped lang="scss">
@import '../../style/show_table.scss';
@import '../../style/inner_table.scss';
@import '../../style/search_form.scss';
@import '../../style/pagination.scss';

</style>
