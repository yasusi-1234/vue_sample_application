import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import headerArea from '../views/Header.vue'
import footerArea from '../views/Footer.vue'

import home from '../views/Home.vue'
import login from '../views/Login.vue'
import logout from '../views/Logout.vue'

import product from '../views/ProductManagement.vue'
import salesRegistration from '../views/product/SalesRegistration.vue'
import productRegistration from '../views/product/ProductRegistration.vue'
import productSupply from '../views/product/ProductSupply.vue'
import salesCancel from '../views/product/SalesCancel.vue'

import salesReport from '../views/SalesReport.vue'
import confirmation from '../views/sales/SalesConfirmation.vue'

import elementUI from 'element-ui'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes:[
    {
      path:'/',
      name:'home',
      components:{
        default: home,
        header: headerArea,
        footer: footerArea
      }
    },
    {
      path: '/login',
      name: 'login',
      components:{
        default: login,
        header: headerArea
      },
      beforeEnter(to, from, next){
        if(store.getters.isLogin){
          // ログインしている
          alreadyLogin()
          next('/')
        }else{
          // ログインしていない
          next()
        }
      }
    },
    {
      path: '/logout',
      name: 'logout',
      components:{
        header: headerArea,
        default: logout,
        footer: footerArea
      },
      beforeEnter(to, from, next){
        if(store.getters.isLogin){
          // ログインしている
          next()
        }else{
          pleaseLogin()
          // ログインしていない
          next('/login')
        }
      }
    },
    {
      path: '/products',
      name: 'products',
      components:{
        header: headerArea,
        default: product,
        footer: footerArea
      },
      beforeEnter(to, from, next){
        if(store.getters.isLogin){
          // ログインしている
          next()
        }else{
          // ログインしていない
          pleaseLogin()
          next('/login')
        }
      },
      children:[
        {
          path: 'sales',
          name: 'sales',
          components:{
            sales: salesRegistration
          }
        },
        {
          path: 'registration',
          name: 'productRegistration',
          components:{
            productRegistration: productRegistration
          }
        },
        {
          path: 'supply',
          name: 'supply',
          components:{
            productSupply: productSupply
          }
        },
        {
          path: 'cancel',
          name: 'cancel',
          components:{
            salesCancel: salesCancel
          }
        }
      ]
    },
    {
      path: '/sales',
      name: 'sales',
      components:{
        default: salesReport,
        header: headerArea,
        footer: footerArea
      },
      beforeEnter(to, from, next){
        if(store.getters.isLogin){
          // ログインしている
          next()
        }else{
          // ログインしていない
          pleaseLogin()
          next('/login')
        }
      },
      children:[
        {
          path: 'confirmation',
          name: 'confirmation',
          components:{
            confirmation: confirmation
          }
        }
      ]
    },
    // レダイレクト
    {
      path: '*',
      redirect: '/'
    }
  ],

})
export default router

function pleaseLogin(){
    elementUI.Message({
    message: 'ログイン処理を完了してください',
    type: 'error',
    duration: 4000
  })
}

function alreadyLogin(){
    elementUI.Message({
    message: 'ログインは既に完了しています',
    type: 'info',
    duration: 4000
  })
}

