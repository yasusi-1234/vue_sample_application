import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../communication/communication'

import { sortObj } from '../utils/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sales: [],
    products: [],
    categories: [],
  },
  getters:{
    // 
    sales: state => state.sales,
    products: state => state.products,
    simpleSales: state => {
      return state.sales.map(sale =>{
        return {
          salesId: sale.salesId,
          salesTime: sale.salesTime,
          soldCount: sale.soldCount,
          productName: sale.product.productName,
          price: sale.product.price,
          category: sale.product.category.categoryName,
          parseDate: Date.parse(sale.salesTime)
        }
      })
    },
    simpleProducts: state =>{
      return state.products.map(pro =>{
        return {
          category: pro.category.categoryName,
          productName: pro.productName,
          price: pro.price,
          productId: pro.productId,
          stock: pro.stock,
          count: 0,
        }
      })
    },
    simpleProductSize: state => state.products.length,
    categories: state => state.categories,
  },
  mutations: {
    setSales(state, salesData){
      state.sales = salesData
    },
    setProducts(state, productsData){
      state.products = productsData 
    },
    setCategories(state, categoryData){
      state.categories = categoryData
    },
    // sales情報の追加を行うメソッド
    addSales(state, responseData){
      state.sales.push(responseData)
    },
    addProduct(state, requestProduct){
      state.products.push(requestProduct)
    },
    addCategory(state, categoryData){
      state.categories.push(categoryData)
    },
    // productの情報を更新するメソッド
    updateProducts(state, responseData){
      // stateの状態を更新する処理
      const products = state.products;
      let product = products.find(p => p.productId == responseData.product.productId)
      // stateのproductsの内部情報更新
      product.stock = responseData.product.stock
      product.count = 0
    }
  },
  actions: {
    setSales({ commit }, salesData){
      commit('setSales', salesData)
    },
    setProducts({ commit }, productData){
      commit('setProducts', productData)
    },
    setCategories({ commit }, categoryData){
      sortObj(categoryData, 'categoryId');
      commit('setCategories', categoryData)
    },
    // 販売完了ボタン(salesRegistration.vueで使われるメソッド)
    orderRequest( { commit } , orderData){
      // 処理:販売情報に問題無い事を確認した上でを確認しサーバー側にアップデートリクエストを投げる
      if(orderData.stock < orderData.soldCount || orderData.soldCount <= 0){
        alert('注文数の値を修正してください。')
        return
      }
      // test用サンプルemployeeId、security情報作成後はユーザーごとのデータを注入する
      const employeeId = 'E004'
      const {soldCount, productId} = orderData
      const requestData = {soldCount, productId, employeeId}
      // postRequest
      axios.post('/sales/register',requestData).then(res => {
        console.log(res.data)
        commit('addSales', res.data)
        commit('updateProducts', res.data)
      }).catch(error =>{
        console.log(error.response)
        // 商品情報のズレがある場合の返却値が含まれていれば
        if(error.response.data.product){
          commit('updateProducts', (error.response.data));
        }
      })
    },
    addProduct({ commit }, productData){
      commit('addProduct', productData);
    },
    addCategory({ commit }, categoryData){
      commit('addCategory', categoryData)
    }
  },
  modules: {
  }
})
