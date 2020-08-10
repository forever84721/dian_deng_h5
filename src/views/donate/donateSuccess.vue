<template>
  <div class="donateSuccess">
    <van-nav-bar
      :title="$t('m.personal.onlineClickLamp')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="success">
      <img src="" alt="">
    </div>
    <p>捐赠成功</p>

    <div class="footer">
      <span class="myLamp" @click="goMyLamp">{{$t('m.footerNav.myLamp')}}</span>
      <span  @click="checkSort">查看排行榜</span>
    </div>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  export default {
    name:'help',
    data() {
      return{}
    },
    methods:{
      onClickLeft() {
        this.$router.go(-1);
      },
      // 我的明灯
      goMyLamp() {
        this.$router.push('/myBrightLamp');
      },
      // 查看排行榜
      checkSort() {
        this.$router.push('/sort');
      }
    }
  }
</script>

<style lang="less" scoped>
 .success {
   width: 3.04rem;
   height: 3.04rem;
   background-image: url("../../assets/images/b_icn_success.png");
   background-size: cover;
   margin-top: 3.36rem;
   position: relative;
   left: 50%;
   transform: translateX(-50%);
 }
  p {
    margin-top: 0.88rem;
    text-align: center;
    font-size: 0.6rem;
  }
 .footer {
   position: fixed;
   transform: translateX(-50%);
   width: 13rem;
   height: 2rem;
   left: 50%;
   bottom: 1.76rem;
   font-size: 0;
   span {
     display: inline-block;
     background-image: url("../../assets/images/b_btn_lamp_1.png");
     background-size: cover;
     line-height: 2rem;
     text-align: center;
     width: 6rem;
     height: 2rem;
     font-size: 0.72rem;
     color: #885022;
   }
   .myLamp {
     margin-right: 1rem;
   }
 }
</style>
