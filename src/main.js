import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'

// element-ui 系インポート
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja.js'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
