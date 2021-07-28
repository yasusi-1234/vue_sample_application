<template>
  <div>
    <h4>売上</h4>
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
        <tr v-for="sale in simpleSales" :key="sale.salesId">
          <td class="table-td">{{ replaceDay(sale.salesTime) }}</td>
          <td class="table-td">{{ sale.category }}</td>
          <td class="table-td">{{ sale.productName }}</td>
          <td class="table-td">{{ sale.soldCount }}</td>
          <td class="table-td">{{  "¥ " + (sale.soldCount * sale.price).toLocaleString()  }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 下記の場合nは1からスタート、simpleSalesの要素がない場合にはエラーになるので
    全要素数を事前に知っておく必要あり -->
    <p v-for="n in 9" :key="n">{{ simpleSales[n - 1].salesTime }} : {{ simpleSales[n - 1].category }} : {{ simpleSales[n - 1].parseDate }}</p>
    <p>
      <!-- {{ sales }} -->
    </p>
    <p>
      <!-- {{ simpleSales }} -->
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "confirmation",
  computed:{
    ...mapGetters(["sales","simpleSales"]),
  },
  methods:{
    replaceDay(dayObj){
      return dayObj.replace(/-/,'年').replace(/-/,'月').replace(/T/,'日 ');
    }
  }
};
</script>

<style scoped lang="scss">
  .table{
    width: 100%;
    border-spacing: 0;
    &-th{
      border-bottom: 4px solid #DDDDDD;
    }
    &-td{
      border-bottom: 2px solid #DDDDDD;
    }
    
    & tbody td{
      padding: 15px 0;
    }
  }


</style>