<template>
    <div class="sales-top">
      <h4>売上登録</h4>
      <div class="sales-front">
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
              <label class="form-item-label" for="inStock">在庫数:</label>
              <input
                type="radio"
                id="inStock"
                value="inStock"
                v-model="search.stock"
              /><label class="form-item-label" for="inStock">在庫有</label>
              <input
                type="radio"
                id="outStock"
                value="outStock"
                v-model="search.stock"
              /><label class="form-item-label" for="outStock">在庫無含む</label>
            </div>

            <div class="form-item">
              <label class="form-item-label" for="category">商品名:</label>
              <input type="text" class="form-item-input" v-model="search.productName"/>
            </div>
            
            <div class="form-item">
              <el-button
                  type="primary"
                  icon="el-icon-goods"
                  size="midium"
                  plain
                  @click="hiddenClass"
                  >一括注文</el-button
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
                  <!-- @keyup="test(product.buyCount, 'keyup')" -->
                  <!-- :ref="product.productId" -->
                <input
                  class="input-number"
                  type="number"
                  min="0"
                  :max="product.stock"
                  v-model.number="product.buyCount"
                  @input="buyCountChecker(product)"
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
                    orderRequest({orderData: {
                      productId: product.productId,
                      soldCount: product.buyCount,
                      stock: product.stock
                    }, productName: product.productName})
                  "
                  >注文</el-button
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
        <p>{{ withOrderData }}</p>
        <button @click="d++">d++</button>
      </div>

        <!-- 一括注文で使う場所-->
        <div class="inner" :class="{active: isActive}" @click.self="hiddenClass">
          <div class="inner-element">
            <table class="table inner-element-table">
              <thead class="table-thead">
                <tr class="table-row-head inner-element-table-head">
                  <th class="table-th">カテゴリー</th>
                  <th class="table-th">製品名</th>
                  <th class="table-th">売上数</th>
                </tr>
              </thead>
              <tbody>
                <!-- <tr v-for="product in searchProduct" :key="product.productId"> -->
                <tr v-for="product in withOrderData" :key="product.productId">
                  <td class="table-td">{{ product.category }}</td>
                  <td class="table-td">{{ product.productName }}</td>
                  <td class="table-td">{{ product.buyCount }}</td>
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
                  @click="multiOrder"
                  v-if="withOrderData.length > 0"
                  >一括注文</el-button>
                  <!-- @click="multipleOrderRequest({requestData: withOrderData, message})" -->
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
        stock: "inStock",
        productName: "",
      },
      displayCount: 10, // 1ページ当たりの表示件数
      currentPage: 1, // 現在のページ
      isActive: false, // 一括注文用の表示・非表示用トグル
      withOrderData:[], // 一括注文用データ
      loading: false, // 一括処理用のボタンの制御用
    };
  },
  computed: {
    ...mapGetters(["products", "simpleProductSize", "categories"]),
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
  },
  methods: {
    ...mapActions(["orderRequest", "multipleOrderRequest"]),
    handleCurrentChange(val) {
        console.log(`current page: ${val}`);
    },
    // input type number部分のバリデーション
    buyCountChecker(product){
      if(product.buyCount < 0){
        product.buyCount = 0
        return
      }else if(product.buyCount > product.stock){
        product.buyCount = product.stock
      }
    },
    // 一括処理用データの更新処理
    withOrderDataCounter(){
      this.withOrderData = this.searchProduct.filter(product => product.buyCount > 0)
    },
    // 一括処理用のHTMLの表示のON・OFFを切り替える処理と、条件によって一括データを更新する処理
    hiddenClass(event){
      if(event !== undefined && event.target.className != 'inner'){
        this.withOrderDataCounter()
      }
      return this.isActive = !this.isActive
    },
    // 一括注文メソッド
    async multiOrder(){
      // ボタンを続けて押せないように制御
      this.loading = true
      // リクエスト送信
      let result = await this.multipleOrderRequest({ requestData: this.withOrderData })
        // ボタンロック解除
        this.hiddenClass()
        this.loading = false

      if(result){
        // 処理が成功した
      }else{
        // 処理が失敗した
        // 失敗以後に購入用データ情報(this.withOrderData)が初期化されてしまう為、直されたデータを元に購入数データを書き換えている
        // this.searchProduct.forEach(product =>{
        //   this.withOrderData.forEach(buyData =>{
        //     if(product.productId == buyData.productId){
        //       product.buyCount = product.buyCount < buyData.buyCount ? product.stock : buyData.buyCount
        //     }
        //   })
        // })
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
