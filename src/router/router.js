import Vue from 'vue'
import Router from 'vue-router'

import headerArea from '../views/Header.vue'
import footerArea from '../views/Footer.vue'

import home from '../views/Home.vue'
import login from '../views/Login.vue'

import product from '../views/ProductManagement.vue'
import salesRegistration from '../views/product/SalesRegistration.vue'
import productRegistration from '../views/product/ProductRegistration.vue'
import productSupply from '../views/product/ProductSupply.vue'

import salesReport from '../views/SalesReport.vue'
import confirmation from '../views/sales/SalesConfirmation.vue'


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
      children:[
        {
          path: 'confirmation',
          name: 'confirmation',
          components:{
            confirmation: confirmation
          }
        }
      ]
    }
  ],

});
export default router
