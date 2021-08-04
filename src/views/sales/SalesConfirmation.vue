<template>
  <div>
    <h4>売上</h4>
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

        <!-- <div class="form-item">
          <span>日付指定:</span>
          <input
            type="radio"
            id="thisMonth"
            value="thisMonth"
            v-model="search.specifyDate"
          /><label class="form-item-label" for="thisMonth">今月</label>
          <input
            type="radio"
            id="thisWeek"
            value="thisWeek"
            v-model="search.specifyDate"
          /><label for="thisWeek">今週</label>
          <input
            type="radio"
            id="today"
            value="today"
            v-model="search.specifyDate"
          /><label for="today">今日</label>
          <input
            type="radio"
            id="all"
            value="all"
            v-model="search.specifyDate"
          /><label for="all">全て</label>
        </div> -->

        <div class="form-item">
          <label for="category" class="form-item-label">商品名:</label>
          <!-- v-model.lazyを使うか検討 -->
          <input type="text" v-model="search.productName" class="form-item-input"/>
        </div>
      </div>
    </div>

    <table class="table">
      <thead class="table-thead">
        <tr class="table-row-head">
          <th class="table-th">日付</th>
          <th class="table-th">カテゴリー</th>
          <th class="table-th">製品名</th>
          <th class="table-th">売上数</th>
          <th class="table-th">売上額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in partData" :key="sale.salesId">
          <td class="table-td">{{ replaceDay(sale.salesTime) }}</td>
          <td class="table-td">{{ sale.category }}</td>
          <td class="table-td">{{ sale.productName }}</td>
          <td class="table-td">{{ sale.soldCount }}</td>
          <td class="table-td">{{  "¥ " + (sale.soldCount * sale.price).toLocaleString()  }}</td>
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

    <p>
      {{ search }}
    </p>
    <p>
      <!-- {{ simpleSales }} -->
    </p>
    <div>
      {{ simpleOrderDateSales }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { sortObj } from '../../utils/utils'

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
      displayCount: 10, // 1ページ当たりの表示件数
      currentPage: 1 // 現在のページ
    };
  },
  computed:{
    ...mapGetters(["sales", "categories"]),
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
    }
  },
  methods:{
    replaceDay(dayObj){
      return dayObj.replace(/-/,'年').replace(/-/,'月').replace(/T/,'日 ');
    },
    handleCurrentChange(val) {
        console.log(`current page: ${val}`);
    },
  }
};
</script>

<style scoped lang="scss">
@import '../../style/search_form.scss';
@import '../../style/show_table.scss';
@import '../../style/pagination.scss';

</style>