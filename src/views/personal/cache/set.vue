<template>
    <div>
      <van-nav-bar
        :title = "$t('m.personal.setting')"
        left-arrow
        @click-left="onClickLeft"
      />
      <van-cell  :title="$t('m.personal.safe')" size="large" v-if="loginType==='phone'"  is-link @click="goSafePage"/>
      <van-cell  :title="$t('m.personal.reGrad')" size="large"  is-link @click="goAboutPage"/>
      <van-cell  :title="$t('m.personal.help')" size="large"  is-link @click="goHelpPage" />
      <van-cell  :title="$t('m.personal.advice')" size="large"  is-link @click="goAdvicePage"/>
      <van-cell  :title="$t('m.personal.customerService')" size="large"  is-link @click="goPhone" />
      <div class="loginOut" @click="logout">{{$t('m.personal.loginOut')}}</div>
    </div>
</template>

<script>
  import {Toast} from "vant"
  import {post}  from "@/utils/request/index.js"
    export default {
        name: "set",
        data(){
          return {
            tel:'',
            loginType:''
          }
        },
        methods:{
          logout(){
            // let user = localStorage.getItem('userMsg');
            // let id = JSON.parse(user).id;
            post("api/user/logout",{},
            res=>{
              console.log(res);
              if(res.data.code===200){
                localStorage.removeItem('userMsg');
                Toast('已退出登录');
                this.$router.push("/login");
              }else{
                Toast('已退出登录');
                localStorage.removeItem('userMsg');
                this.$router.push("/login");
              }
            })
          },
          // 实现返回上一级
          onClickLeft() {
            this.$router.go(-1);
          },
          // 前往更换手机号页面
          goSafePage() {
            this.$router.push('/safe');
          },
          // 前往更换关于我们页面
          goAboutPage() {
            this.$router.push('/about');
          },
          // 前往帮助中心页面
          goHelpPage() {
            this.$router.push('/help')
          },
          // 前往意见反馈页面
          goAdvicePage() {
            this.$router.push('/advice')
          },
          // 联系客服
          goPhone(){
            post('api/other/getProperty',{
              "name": "phone"
            },res => {
              console.log(res);
              if(res.data.code === 200){
                this.tel = res.data.data;
                window.location.href = "tel:"+this.tel;
              }
            })
          }
        },
        mounted() {
          // 获取当前登录方式
          post('api/user/getLoginType', {}, res => {
            if (res.data.code === 200) {
              this.loginType = res.data.data;
            }
          });
        }
    }
</script>

<style  lang="less" scoped>
.loginOut {
  height: 2rem;
  width: 10.04rem;
  line-height: 2rem;
  text-align: center;
  background-image: url("../../../assets/images/b_btn_search.png");
  background-size: 100%;
  font-size: 0.72rem;
  color: #885022;
  position: relative;
  top: 1.76rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
