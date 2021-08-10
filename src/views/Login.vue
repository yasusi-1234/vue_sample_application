<template>
  <div>
    <h1>ログインページ</h1>
    <div class="login-form">
    <!-- <el-card shadow="always" class="card">
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
    </el-card> -->
      
      <div class="form">
        <div class="form-inner">
          <div class="form-inner-item form-inner-item-top">
            <label class="form-label" for="categoryName">ユーザーID:</label>
            <input
              class="form-input" type="text" v-model="form.id" :class="isError" />
          </div>
          <div class="form-inner-item">
            <label class="form-label" for="categoryName">パスワード:</label>
            <input
              class="form-input" type="password" v-model="form.password" :class="isError"/>
          </div>
          <div class="form-inner-item">
            <el-button type="info" icon="el-icon-unlock" size="midium"
            class="form-inner-button" @click="loginRequest">ログイン</el-button>
          </div>
        </div>
      </div>

    </div>
    <!-- <div>
      {{ form }}
    </div> -->
  </div>
</template>

<script>
// import axios from '../communication/communication'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: "login",
  data(){
    return {
      form:{
        id: null,
        password: null,
      },
      loginfailed: false,
    }
  },
  computed:{
    ...mapGetters(["headerInAccessToken"]),
    isError(){
      return this.loginfailed ? 'form-input-error' : '';
    }
  },
  methods:{
    ...mapActions(["setSales", "setProducts", "setCategories", "setAccessToken"]),
    async loginRequest(){
      let params = new URLSearchParams();
      params.append('mailAddress', this.form.id)
      params.append('password', this.form.password)
      // ログイン処理
      const loginRequest = await axios.post('http://localhost:8080/login', params)
        .then(res =>{
          // console.log(res['headers'].authorization)
          this.loginfailed = false;

          this.setAccessToken(res['headers'].authorization)

          return true
        }).catch(error =>{
          console.log(error)
          this.$message({
            type: 'error',
            message: 'ログインに失敗しました'
          })
          this.loginfailed = true;
          return false
        })
      
      if(loginRequest){
        // ログインに成功したら
        const url = 'http://localhost:8080/api/'
        const resultSet = await Promise.all([
          axios.get(url + 'sales', this.headerInAccessToken).then(res => {
            this.setSales(res.data)
            return true
          }).catch(error => {
            console.log(error)
            return false
          }),

          axios.get(url + 'product', this.headerInAccessToken).then(res =>{
            this.setProducts(res.data)
            return true
          }).catch(error =>{
            console.log(error)
            return false
          }),

          axios.get(url + 'product/category', this.headerInAccessToken).then(res =>{
            this.setCategories(res.data);
            return true
          }).catch(error =>{
            console.log(error)
            return false
          }),
        ])
        // 全ての処理に成功したかどうか
        const result = resultSet.every(result => result)
        
        if(result){
          this.$message({
            type: 'success',
            message: 'ログインに成功しました'
          })
          this.$router.push('/')
        }
      }
      // const result = this.loginChange(this.form)
      // console.log(result)
      // // resultの結果によって遷移先を制御
      // this.$router.push('/')
    }
  }
};
</script>

<style scoped lang="scss">
@import '../style/login.scss';

.form {
  margin-top: 30px;
  margin-right: 20px;
  border: 3px solid #cad0d6;
  border-radius: 8px;
  box-shadow: 2px 2px 5px 0px #00000030;

  &-inner{
    margin: 15px;
    &-item{
      // margin-bottom: 13px;
      margin: 25px 0px 13px 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      &-top{
        margin-top: 40px;
      }
    }

    &-button{
      margin: auto;
      margin-bottom: 10px;
    }
  }

  &-label{
    display: inline-block;
    min-width: 100px;
    width: 100px;
    font-weight: bold;
  }

  &-input{
    height: 30px;
    font-size: 17px;
    min-width: 100px;
    width: 60%;

    &:focus{
      border: 2px solid #8ad08a;
      background-color: #ebfffc;
      outline: none;
    }

    &-error{
      border: 2px solid #f56c6c;
      background-color: #f5dfdf;
      &:focus{
        outline: none; 
        border-color: red;
        background-color: #f5dfdf;
      }
    }
  }

}

</style>