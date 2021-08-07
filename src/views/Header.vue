<template>
  <div>
      <!-- :default-active="activeIndex2" -->
      <!-- @select="handleSelect" -->
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
    <template v-if="!isLogin">
      <el-menu-item index="1" route="/login" @click="jump"
        >ログイン</el-menu-item
      >
    </template>

    <template v-if="isLogin">
      <el-menu-item index="2" route="/" @click="jump"
        >ホーム</el-menu-item
      >
      <el-menu-item index="3" route="/products/sales" @click="jump"
        >商品管理</el-menu-item
      >
      <el-menu-item index="4" @click="jump" route="/sales/confirmation"
        >売上詳細</el-menu-item
      >
      <el-submenu index="5">
        <template slot="title">Workspace</template>
        <el-menu-item index="5-1">item one</el-menu-item>
        <el-menu-item index="5-2">item two</el-menu-item>
        <el-menu-item index="5-3">item three</el-menu-item>
        <el-submenu index="5-4">
          <template slot="title">item four</template>
          <el-menu-item index="5-4-1">item one</el-menu-item>
          <el-menu-item index="5-4-2">item two</el-menu-item>
          <el-menu-item index="5-4-3">item three</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="6" @click="jump" route="/logout">ログアウト</el-menu-item>

    </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "header-area",
  computed:{
    ...mapGetters(['isLogin'])
  },
  methods:{
      jump(el){
          console.log(el.route, this.$router.currentRoute.path)
          if(this.$router.currentRoute.path != el.route){
              this.$router.push(el.route)
          }
      }
  }
};
</script>
