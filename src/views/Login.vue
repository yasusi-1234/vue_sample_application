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
              class="form-input" type="text" v-model="form.id" />
          </div>
          <div class="form-inner-item">
            <label class="form-label" for="categoryName">パスワード:</label>
            <input
              class="form-input" type="password" v-model="form.password" />
          </div>
          <div class="form-inner-item">
            <el-button type="info" icon="el-icon-unlock" size="midium"
            class="form-inner-button">ログイン</el-button>
          </div>
        </div>
      </div>

    </div>
    <div>
      {{ form }}
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
      }
    }
  }

}

</style>