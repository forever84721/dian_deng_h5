<template>
  <div class="container">
    <van-nav-bar
      :title="$t('m.lampDetail.onlineLamp')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="logo">
      <img src="../../../assets/images/b_icn_success.png" :style="{width:'98px',height:'98px'}">
      <br>
      <span :style="{fontSize:'15px',}">点灯成功</span>
    </div>
    <div class="footer">
      <div class="btn" @click="thanks">查看感谢状</div>
      <div class="btn" @click="sort">查看排行榜</div>
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'

  export default {
    name: "success",
    methods: {
      onClickLeft() {
        // this.$router.go(-1);
        this.$router.push({path:'myBrightLamp'});
      },
      thanks() {
        this.$router.push({path:'/thanks',query:{orderId:this.$route.query.orderId}});
      },
      sort() {
        this.$router.push('/sort');
      }
    }
  }
</script>

<style scoped lang="less">
  .container {
    min-height: 100vh;
    background-color: white;
    overflow: hidden;

    .logo {
      width: 100vw;
      text-align: center;

      img {
        margin-top: 100px;
        width: 98px;
        height: 98px;
      }
    }

    .footer {
      position: fixed;
      bottom: 1.6rem;
      display: flex;
      left: 50%;
      transform: translateX(-50%);

      .btn {
        text-align: center;
        line-height: 64px;
        width: 178px;
        height: 64px;
        background-image: url("../../../assets/images/b_btn_lamp.png");
        background-size: 179px 64px;
        background-repeat: no-repeat;
        font-size: 16px;
        color: #885022;
        font-family: PingFangSC-Medium;
      }
    }
  }


</style>
