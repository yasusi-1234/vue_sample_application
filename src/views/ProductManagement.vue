<template>
  <div>
    <h1>商品・管理メニュー</h1>
    <el-row class="tac" :gutter="20">
      <el-col :span="5">
        <h4>商品管理メニュー</h4>
          <!-- @open="handleOpen"
          @close="handleClose" -->
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>Navigator One</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item one</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-submenu>
          </el-submenu> -->
          <el-menu-item index="1" @click="handleSelect" route="/products/sales">
            <i class="el-icon-notebook-1"></i>
            <span>売上登録</span>
          </el-menu-item>
          <el-menu-item index="2" @click="handleSelect" route="/products/supply">
            <i class="el-icon-box"></i>
            <span>在庫補充</span>
          </el-menu-item>
          <el-menu-item index="3" @click="handleSelect" route="/products/registration">
            <i class="el-icon-setting"></i>
            <span>商品登録</span>
          </el-menu-item>
          <el-menu-item index="4" @click="handleSelect" route="/products/cancel">
            <i class="el-icon-delete"></i>
            <span>商品取り消し</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <router-view name="sales"></router-view>
        <router-view name="productRegistration"></router-view>
        <router-view name="productSupply"></router-view>
        <router-view name="salesCancel"></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "products",
  methods: {
    //   handleOpen(key, keyPath) {
    //     console.log(key, keyPath);
    //   },
    //   handleClose(key, keyPath) {
    //     console.log(key, keyPath);
    //   },
      handleSelect(el){
          console.log(el.route, this.$router.currentRoute.path)
          if(el.route != this.$router.currentRoute.path){
              this.$router.push(el.route);
          }
      }
    }
};
</script>
