<template>
  <div>
    <h1 class="title">ログアウト</h1>
    
    <div class="logut-form">
      
      <div class="form">
        <div class="form-inner">
            <div class="form-inner-item">
              <div class="form-inner-mes">
                <p class="message-item">
                    <span class="message-item-help">※注意※</span>
                    処理途中のデータ情報等は破棄されます
                    </p>
                <p class="message-item">
                    ご確認の上ログアウトしてください
                </p>
              </div>
          </div>

          <div class="form-inner-item">
            <el-button type="info" icon="el-icon-magic-stick" size="midium"
            class="form-inner-button" @click="logoutHandler">ログアウト</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// import axios from '../communication/communication'
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
      ...mapActions(["loginChange"]),
    logoutHandler(){
        console.log('click')
        this.loginChange(false)
        this.$message({ type: 'success', message: 'ログアウトしました'})
        this.$router.push('/login')
    }
  }
};
</script>

<style scoped lang="scss">
@import '../style/login.scss';

.title{
    text-align: center;
}
.form {
  margin: auto;
  width: 50%;
  margin-top: 30px;
  border: 3px solid #cad0d6;
  border-radius: 8px;
  box-shadow: 2px 2px 5px 0px #00000030;

  &-inner{
    &-item{
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

    &-mes{
        margin: auto;
        text-align: center;
        & .message-item{
            font-size: 18px;
            &-help{
                margin-right: 10px;
                border: 1.5px dotted #d66767;
                background-color: #f5eaea;
                font-size: 15px;
                color: #d66767;
                border-radius: 30px;
                padding: 2px;
            }
        }
    }
  }

}

</style>