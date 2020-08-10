<template>
  <div class="safe">
    <van-nav-bar
      :title="$t('m.personal.safe')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="showInfo">
      <span class="sp1">{{userInfo.cellphone}}</span>
      <span class="sp2">{{userInfo.realName}}</span>
    </div>
    <div class="btn" @click="nextTo">
      更换手机号
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {post} from "@/utils/request/index.js"

  export default {
    data() {
      return {
        userInfo:{}
      }
    },
    methods:{
      onClickLeft() {
        this.$router.go(-1);
      },
      nextTo() {
        this.$router.push({path:'/safeVerify'})
      }
    },
    mounted() {
      let user = localStorage.getItem('userMsg');
      if(user) {
        post('api/user/get',{},res => {
          // console.log(res);
          this.userInfo = res.data.data;
          console.log(this.userInfo);
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .safe {
    height: 100vh;
    background-color: #f5f5f5;
    .showInfo {
      width: 100%;
      height: 1.8rem;
      background-color: #FFFFFF;
      font-size: 0.56rem;
      line-height: 1.8rem;
      padding: 0 0.96rem;
      box-sizing: border-box;
      .sp1 {
        float: left;
      }
      .sp2 {
        float: right;
        color: #999999;
      }
    }

    .btn {
      width: 13.08rem;
      height: 2rem;
      background-image: url("../../../assets/images/b_btn_pay.png");
      background-size: cover;
      border-radius: 0.2rem;
      line-height: 2rem;
      text-align: center;
      color: #885022;
      font-size: 0.72rem;
      position: relative;
      left: 50%;
      top: 0.68rem;
      transform: translateX(-50%);
    }
  }

</style>
