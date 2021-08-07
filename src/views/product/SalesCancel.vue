<template>
    <div>
    <h4>注文情報</h4>
    <div class="form">
      <div class="form-inner">
        <div class="form-item">
          <label class="form-item-label" for="category">カテゴリー:</label>
          <select id="cgategory" v-model="search.categoryId" class="form-item-select">
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
          <label class="form-item-label" for="dates">カテゴリー:</label>
          <select id="dates" v-model="search.specifyDate" class="form-item-select">
            <option
              v-for="date in dates"
              :key="date.id"
              :value="date.id"
              >{{ date.date }}</option
            >
          </select>
        </div>

        <div class="form-item">
          <label for="category" class="form-item-label">商品名:</label>
          <!-- v-model.lazyを使うか検討 -->
          <input type="text" v-model="search.productName" class="form-item-input"/>
        </div>

        <div class="form-item">
           <el-button
                type="primary"
                icon="el-icon-goods"
                size="midium"
                plain
                @click="hiddenClass"
                >削除</el-button
            >
        </div>
      </div>
    </div>

    <table class="table">
      <thead class="table-thead">
        <tr class="table-row-head">
            <th class="table-th">選択</th>
            <th class="table-th">日付</th>
            <th class="table-th">カテゴリー</th>
            <th class="table-th">製品名</th>
            <th class="table-th">売上数</th>
            <th class="table-th">売上額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in partData" :key="sale.salesId">
            <td class="table-td">
                <input type="checkbox" v-model="sale.checked" @input="checkBoxHandler(sale)">
            </td>
            <td class="table-td">{{ replaceDay(sale.salesTime) }}</td>
            <td class="table-td">{{ sale.category }}</td>
            <td class="table-td">{{ sale.productName }}</td>
            <td class="table-td">{{ sale.soldCount }}</td>
            <td class="table-td">{{  "¥ " + (sale.soldCount * sale.price).toLocaleString()  }}</td>
        </tr>
      </tbody>
    </table>
    <div>
        
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

    <p>
      {{ search }}
    </p>
    
    <div>
      {{ simpleOrderDateSales }}
    </div>

    <div>
        {{ withDeleteData }}
    </div>

    <!-- 削除で使う場所-->
        <div class="inner" :class="{active: isActive}" @click.self="hiddenClass">
          <div class="inner-element">
            <table class="table inner-element-table">
              <thead class="table-thead">
                <tr class="table-row-head inner-element-table-head">
                  <th class="table-th">販売時期</th>
                  <th class="table-th">カテゴリー</th>
                  <th class="table-th">製品名</th>
                  <th class="table-th">販売数</th>
                </tr>
              </thead>
              <tbody>
                <!-- <tr v-for="product in searchProduct" :key="product.productId"> -->
                <tr v-for="sale in withDeleteData" :key="sale.salesId">
                  <td class="table-td">{{ sale.salesTime }}</td>
                  <td class="table-td">{{ sale.category }}</td>
                  <td class="table-td">{{ sale.productName }}</td>
                  <td class="table-td">{{ sale.soldCount }}</td>
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
                  v-if="withDeleteData.length > 0"
                  @click="deleteRequest"
                  >一括削除</el-button>
                  <!-- @click="multiOrder" -->
          </div>
        </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "confirmation",
  data() {
    return {
      search: {
        categoryId: 0,
        specifyDate: "thisMonth",
        productName: "",
      },
      dates:{
        thisMonth: { id: 'thisMonth', date: '今月'},
        thisWeek: { id: 'thisWeek', date: '今週'},
        today: { id: 'today', date: '今日'},
        thisYear: { id: 'thisYear', date: '今年'},
        all: { id: 'all', date: '全て'},
      },
      withDeleteData: [],
      displayCount: 10, // 1ページ当たりの表示件数
      currentPage: 1, // 現在のページ
      isActive: false, // 削除用の表示・非表示用トグル
      loading: false,  // 一括処理用のボタンの制御用
    };
  },
  computed:{
    ...mapGetters(["categories", "sales"]),
    simpleOrderDateSales(){
      return this.$store.getters.simpleOrderDateSales(this.search)
    },
      // simpleOrderDateSalesのデータ数
    dataSize() {
      return this.simpleOrderDateSales.length;
    },
    // 表示するデータ
    partData(){
      const partStartIndex = (this.currentPage - 1) * this.displayCount 
      const partEndIndex = partStartIndex + this.displayCount
      return this.simpleOrderDateSales.slice(partStartIndex, partEndIndex)
    },
    message(){
        return this.$message
    },
    confirm(){
        return this.$confirm
    }
  },
  methods:{
      ...mapActions(['deleteSalesRequest']),
    replaceDay(dayObj){
      return dayObj.replace(/-/,'年').replace(/-/,'月').replace(/T/,'日 ');
    },
    handleCurrentChange(val) {
        console.log(`current page: ${val}`);
    },
    hiddenClass(event){
    //   console.log(event)
      if(event !== undefined && event.target.className != 'inner'){
        // this.withSupplyDataCounter()
      }
      return this.isActive = !this.isActive
    },
    // 削除の選択チェックボタンが押された際に発火し、withDeleteDataに値を挿入する
    checkBoxHandler(sale){
        console.log(sale)
        console.log(sale.checked) // 何故か反転する これが解らない
        if(!sale.checked){
            // 選択されている状態になった場合の処理
            this.withDeleteData.push(sale)
        }else{
            // 選択が解除された場合の処理
            // let a = ['a']
            this.withDeleteData = this.withDeleteData.filter(data => sale !== data)
        }

    },
    // デリートリクエスト処理
    async deleteRequest(){
        console.log('aaa')
        this.loading = true
        const requestDeleteData = this.withDeleteData.map(sale => sale.salesId)
        this.hiddenClass()
        const result = await this.deleteSalesRequest({deleteData: requestDeleteData, message: this.message, confirm: this.confirm})
        console.log(result)
        if(result){
            // 正常に処理が完了した場合
            // 削除リクエストを格納するデータリストを初期化
            this.withDeleteData = []
        }else{
            // 処理に失敗したまたはキャンセルした場合
        }
        this.loading = false
    },
  },
  created(){
      // withDeleteData(取り消し一覧データ)の初期化
      this.withDeleteData = this.sales.filter(sale => sale.checked === true)
  }
};
</script>

<style scoped lang="scss">
@import '../../style/search_form.scss';
@import '../../style/show_table.scss';
@import '../../style/pagination.scss';
@import '../../style/inner_table.scss';

</style>