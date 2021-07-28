<template>
  <div>
    <h1>ログインページ</h1>
    <div class="login-form">
    <el-card shadow="always" class="card">
      <el-form
        status-icon
        label-width="100px"
      >
        <el-form-item label="ユーザーID" class="mt ft-size mr">
          <el-input
            type="text"
            v-model="form.id"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="パスワード" class="ft-size mr">
          <el-input
            type="password"
            v-model="form.password"
            class="input"
          ></el-input>
        </el-form-item>
          <el-button type="primary"  icon="el-icon-search" 
            >ログイン</el-button
          >
      </el-form>
    </el-card>
    </div>
    <div>
      {{ form }}
    </div>
    <div>
      <div>this is test axios</div>
      <input type="text" v-model="requestPath">
      <input type="radio" v-model="requestMethod" id="get" value="get"><label>GET</label><br>
      <input type="radio" v-model="requestMethod" id="post" value="post"><label>POST</label><br>
      <button @click="acsess">アクセス</button>
      <p>
        {{ requestPath }} : {{ requestMethod }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from '../communication/communication'
import { mapActions } from 'vuex'

export default {
  name: "login",
  data(){
    return {
      form:{
        id: null,
        password: null,
      },
        // test
        requestPath: '',
        requestMethod: '',
    }
  },
  methods:{
    ...mapActions(["setSales", "setProducts"]),
    acsess(){
      if(this.requestMethod == 'get'){
        axios.get(this.requestPath).then(res => {
          console.log(res.data)
          this.setSales(res.data)
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.login-form{
  width: 40%;
  margin: auto;
}

.mt{
  margin-top: 30px;
}

.mr{
  margin-right: 30px;
}

.ft-size{
  font-weight: bold;
}

.card{
  border-radius: 10px;
}

</style>