<template>
  <div id="app">
    <router-view name="header"></router-view>
    <router-view></router-view>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from './communication/communication'
// test用
console.log('hello vue.js')
export default{
  name: "app",
  data(){
    return {
      access: false,
    }
  },
  methods:{
    ...mapActions(["setSales", "setProducts", "setCategories"])
  },
  created(){
    if(this.access){
      axios.get('sales').then(res => {
        console.log('sales data dawnloaded')
        this.setSales(res.data)
      })
      axios.get('product').then(res =>{
        this.setProducts(res.data)
      })
      axios.get('product/category').then(res =>{
        this.setCategories(res.data);
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

</style>
