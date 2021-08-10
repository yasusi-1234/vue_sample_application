<template>
  <div>
    <h1>商品売上・確認メニュー</h1>
    <el-row class="tac" :gutter="20">
      <el-col :span="5">
        <h4>売上確認メニュー</h4>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1"  @click="handleSelect" route="/sales/confirmation">
            <i class="el-icon-document"></i>
            <span>売上確認</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <router-view name="confirmation"></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "sales",
  methods: {
      handleSelect(el){
          // console.log(el.route, this.$router.currentRoute.path)
          if(el.route != this.$router.currentRoute.path){
              this.$router.push(el.route);
          }
      }
    }
};
</script>
