<template>
  <div>
    <h4>売上登録</h4>
    <div>
      フォーム
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
        <tr v-for="product in simpleProducts" :key="product.productId">
          <td>{{ product.category }}</td>
          <td>{{ product.productName }}</td>
          <td>
            <input type="number" min="0" :max="product.stock" v-model.number="product.count">
          </td>
          <td>
            <!-- security実装後はorderRequestMethodにユーザーID(employeeId)を含める必要あり -->
            <el-button type="primary" icon="el-icon-goods" size="midium" plain
            @click="orderRequest({ productId: product.productId, soldCount: product.count , stock: product.stock})">確定</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      ページング機能追加
    </div>
    <p>productSize : {{ simpleProductSize }}</p>
    <p>products: {{ simpleProducts }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: "sales",
  data(){
    return{
      m: 5
    }
  },
  computed: {
    ...mapGetters(["simpleProducts", "simpleProductSize"]),
  },
  methods:{
    ...mapActions(['orderRequest']),
  }
};
</script>

<style scoped lang="scss">
.table {
  width: 100%;
  border-spacing: 0;
  &-th {
    border-bottom: 4px solid #dddddd;
  }
  &-td {
    border-bottom: 2px solid #dddddd;
  }

  & tbody td {
    padding: 15px 0;
  }
}
</style>
