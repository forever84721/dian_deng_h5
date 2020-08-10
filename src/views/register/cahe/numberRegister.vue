<template>
   <div>
     <van-cell-group>
       <van-field
         v-model="username"
         required
         clearable
         type="tel"
         label="手机号"
         placeholder="请输入手机号"

       />

       <van-field
         v-model="password"
         type="password"
         label="密码"
         placeholder="请输入密码"
         required
       />
     </van-cell-group>
     <div class="submit" @click="submit">
       注册
     </div>
   </div>
</template>

<script>
  import {post} from '@/utils/request/index'
    export default {
        name: "numberRegister",
      data(){
          return{
            username:'',
            password:'',
          }
      },
      methods:{
          submit(){
            if (!this.username) {
              this.$toast('账号不能为空');
              return;
            } else if (!this.password) {
              this.$toast('密码不能为空');
              return;
            }
            if (this.username.length < 6){
              this.$toast('账号长度不低于6位');
              return;
            }
            post("api/user/save",{
              "type": "H5端",
              "user": {
                "telephone": this.username,
                "password": this.password
              }
            },res=>{
              console.log(res);
              if(res.data.code==400){
                this.$toast(res.data.message);
              }else if (res.data.code == '200') {
                this.$toast("注册成功");
                post('api/user/loginWithPhoneAndPassword',{
                  telephone:this.username,
                  password:this.password
                },res=>{
                  if(res.data.code === 200) {
                    let user = {
                      token : res.data.data.token,
                      id : res.data.data.id
                    };
                    this.$store.commit('SELECT_SHOP',{
                      user:{
                        token:res.data.data.token,
                        id:res.data.data.id
                      }
                    });
                    localStorage.setItem('userMsg',JSON.stringify(user));
                    this.$router.push({name:"person-detail"});
                  }
                })
                // this.$router.push({name:"person-detail"});
              }
            })
          }
      }
    }
</script>

<style scoped lang="less">
  .submit{
    background: url("../../../assets/images/b_btn_pay.png") no-repeat;
    width: 100%;
    background-size: 100% 100%;
    height: 12vh;
    line-height: 12vh;
  }
</style>
