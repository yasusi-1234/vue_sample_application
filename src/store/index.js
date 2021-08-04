import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../communication/communication'

import { sortObj, sortObjReverse, betweenSpecifyDate } from '../utils/utils'

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
    // 製品販売情報のリスト
    simpleSales: state => {
      return state.sales.map(sale =>{
        return {
          salesId: sale.salesId,
          salesTime: sale.salesTime,
          soldCount: sale.soldCount,
          productName: sale.product.productName,
          price: sale.product.price,
          category: sale.product.category.categoryName,
          categoryId: sale.product.category.categoryId,
          parseDate: Date.parse(sale.salesTime),
        }
      })
    },
    // simpleSalesのオブジェクトを売上日時の降順に並べ替えたデータ
    simpleOrderDateSales: (state, getters) => ({categoryId, specifyDate, productName}) => {
      let returnData = getters.simpleSales.map(sale =>({...sale}))
      const trimProductName = productName.trim()
      const isCategoryAll = categoryId === 0
      const specifyDateObj = betweenSpecifyDate(specifyDate)

      // 分岐if文だと可読性が悪いため、こちらではスピードを犠牲にして記述
      if(specifyDateObj){
        // 日付指定有の場合
        returnData = returnData.filter(sale => specifyDateObj.start <= sale.parseDate && sale.parseDate <= specifyDateObj.end)
      }

      if(!isCategoryAll){
        // カテゴリーに全て以外が選択されていた場合
        returnData = returnData.filter(sale => sale.categoryId === categoryId)
      }

      if(trimProductName){
        // 商品名指定がある場合
        returnData = returnData.filter(sale => sale.productName.includes(trimProductName))
      }

      sortObjReverse(returnData , "parseDate") // 日付の降順に並べ替え
      return returnData
    },
    // 製品情報リスト
    simpleProducts: state =>{
      return state.products.map(pro =>{
        return {
          category: pro.category.categoryName,
          categoryId: pro.category.categoryId,
          productName: pro.productName,
          price: pro.price,
          productId: pro.productId,
          stock: pro.stock,
          buyCount: 0,
          supplyCount: 0
        }
      })
    },
    // 製品情報から条件で絞って抽出したデータリスト
    searchProduct: (state, getters) => ({categoryId, stock, productName}) => {
      const data = getters.simpleProducts.map(product =>({...product}))
      const searchName = productName.trim()
      const noText = searchName === ''
      // console.log(data, categoryId, stock);

      const returnData = data.filter(d => { 
        
        if(stock == 'inStock'){
          // 在庫有かつ
          if(categoryId == 0 && noText){
            // カテゴリー指定なし 商品名が空の場合 
            return d.stock > 0
          }else if(categoryId == 0 && !noText){
            // カテゴリー指定無し 商品名に指定がある場合
            return d.stock > 0 && d.productName.includes(searchName)
          }else if(noText){
            // カテゴリー指定有 商品名が空の場合
            return d.stock > 0 && d.categoryId == categoryId
          }else if(!noText){
            // カテゴリー指定有 商品名に指定がある場合
            return d.stock > 0 && d.categoryId == categoryId && d.productName.includes(searchName)
          }
        }else if(stock == 'outStock'){
          // 在庫無し含むかつ
          if(categoryId == 0 && noText){
            // カテゴリー指定無し 商品名が空の場合
            return true
          }else if(categoryId == 0 && !noText){
            // カテゴリー指定無し 商品名の指定有の場合
            return d.productName.includes(searchName)
          }else if(noText){
            // カテゴリー指定有り 商品名が指定されていない場合
            return d.categoryId == categoryId
          }else{
            // カテゴリー指定有り 商品名が指定されている場合
            return d.categoryId == categoryId && d.productName.includes(searchName)
          }
        }
      })
      return returnData;
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
    // productの情報を更新するメソッド(SalesRegistration.vue用)
    updateProducts(state, responseData){
      // stateの状態を更新する処理
      const products = state.products;
      let product = products.find(p => p.productId == responseData.product.productId)
      // stateのproductsの内部情報更新
      product.stock = responseData.product.stock
      product.buyCount = 0
    },
    // productの情報を更新するメソッド(ProductSupply.vue用)
    updateSupplyProducts(state, requestData){
      // stateの状態を更新する処理
      const products = state.products;
      let product = products.find(p => p.productId == requestData.productId)
      // stateのproductsの内部情報更新
      product.stock = requestData.stock
      product.supplyCount = 0
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
    orderRequest( { commit } , {orderData, message, productName}){
      // 処理:販売情報に問題無い事を確認した上でを確認しサーバー側にアップデートリクエストを投げる
      if(orderData.soldCount <= 0){
        // リクエストの値が0以下の場合
        message({
          message: "値が0になっています。値を入力してください",
          type: "warning"
        })
        return
      }
      if(orderData.stock < orderData.soldCount){
        // 在庫数を超えたリクエストがされた場合
        message({
          message: "不正な値が入力されています。修正してください。現在の在庫数：" + orderData.stock + " リクエストされた在庫数： " + orderData.soldCount,
          type: "error",
          duration: 5000,
        })
        orderData.soldCount = orderData.stock
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
        message({
          message: "販売リクエストが完了しました。販売商品： " + productName + " 販売数： " + soldCount,
          type: "success"
        })
      }).catch(error =>{
        console.log(error.response)
        // 商品情報のズレがある場合の返却値が含まれていれば
        if(error.response.data.product){
          commit('updateProducts', (error.response.data));
          message({
            message: "在庫数にズレがあったため、販売リクエストが失敗しました。実在庫数： " +
            error.response.data.product.stock + " リクエスト販売数： " + soldCount + " 値を修正してください。",
            type: "warning"
          })
          
        }else{
          // 予期しないエラー
          message({
            message: error,
            type: error
          })
        }

      })
    },
    addProduct({ commit }, productData){
      commit('addProduct', productData);
    },
    addCategory({ commit }, categoryData){
      commit('addCategory', categoryData)
    },
    // 商品の補充を受け付けるメソッド
    supplyProduct({ commit }, {requestData, message, productName}){
      if(requestData.requestValue <= 0){
        message({
          message: "供給量が0になっています。値を修正してください。",
          type: "warning"
        })
        return
      }
      axios.patch('/product/update',requestData).then(res =>{
        console.log(res.data)
        commit('updateSupplyProducts', res.data)
        message({
          message: "商品： " + productName + "を" + requestData.requestValue + "個補充しました",
          type: "success",
        });
      }).catch(error =>{
        console.log(error)
        message({
          message: error,
          type: "error",
          duration: 5000,
        });
      })
    },
    // 複数の注文を受け付けるメソッド
    multipleOrderRequest({ commit }, { requestData, message }){
      if(requestData.length === 0){
        // リクエストデータが空の場合
        message({
          type: 'error',
          message: 'リクエストデータがありません。処理を中断しました'
        })
        return false
      }
      // リクエストデータ作成
      const salesForms = requestData.map(data => {
        return {
          // 後にログイン者のIDを設定するようにする
          employeeId: 'E001',
          productId: data.productId,
          soldCount: data.buyCount
        }
      });
      console.log(salesForms)
      const ListSalesForm = {salesForms}
      const result = axios.post('/sales/multiple/register', ListSalesForm).then( res =>{
        console.log(res.data)
        res.data.forEach(data =>{
          // 販売情報の追加
          commit('addSales', data)
          // 商品状態の更新
          commit('updateProducts', data)
        })
        message({
          message: '販売情報の更新が完了しました',
          type: 'success'
        })
        // // リクエストDataの初期化
        // requestData = []
        return true
      }).catch(error => {
        // 商品情報のズレがある場合の返却値が含まれていれば ただし現状は一つの要素しか返ってこない
        console.log(error.response)
        if(error.response.data.product){
          commit('updateProducts', (error.response.data))
          message({
            message: error.response.data.product.productName + "の在庫数にズレがあったため、販売リクエストが失敗しました。実在庫数： " +
            error.response.data.product.stock + " 値を修正してください。",
            type: "warning"
          })
          return false
        }else{
          // 予期しないエラー
          message({
            message: error,
            type: error
          })
          return false
        }
      })
      // 戻り値 成功でtrue 失敗でfalse
      return result
    },
    multipleSupplyRequest({ commit }, { requestData, message }){
      if(requestData.length === 0){
        // リクエストデータが空の場合
        message({
          type: 'error',
          message: 'リクエストデータがありません。処理を中断しました'
        })
        return false
      }
      const updateProducts = requestData.map(data => {
        return {productId: data.productId, requestValue: data.supplyCount, subtraction: false}
      });
      console.log(updateProducts)
      const updateProductsForm = { updateProducts }

      const result = axios.patch('/product/multiple/update', updateProductsForm).then(res =>{
        console.log(res.data);
        res.data.forEach(data => commit('updateSupplyProducts', data))
        
        message({
          type: 'success',
          message: '商品の補充処理が成功しました'
        })
        return true
      }).catch(error => {
        // 失敗したときの処理
        message({
          type: 'warning',
          message: error
        })
        return false
      })

      return result
    }
  },
  modules: {
  }
})
