<template>

  <div class="homeNav">
    <div class="buttonR">
      <img src="../../../assets/images/_s-b_ic_lotus.png" alt="我的明灯" @click="light">
      我的明灯
    </div>
<!--    <div class="shu"></div>-->
    <div class="buttonL">
      <img src="../../../assets/images/_s-b_ic_personal.png" alt="个人中心" @click="person">
      个人中心
    </div>
  </div>
</template>

<script>
  export default {
    name: "homeNav",
    data(){
      return{
      }
    },
    methods:{
      light(){
        this.$router.push({name:'myBrightLamp'})
      },
      person(){
        this.$router.push({name:'personal'})
      }
    }


  }

</script>

<style scoped lang="less">
  .homeNav {
    padding-top: 21px;
    width: 100%;
    height: 80px;
    background-color: white;
    display: flex;
    color: #F16E3A;
    font-size: 11px;
    justify-content: space-around;
    font-family: PingFang-SC-Medium;
    img{
      margin:0 auto;
      display: block;
      box-sizing: content-box;
      width: 40px;
      height: 40px;
    }
    .shu{
      width: 1px;
      height: 52px;
      border: 0.49px solid #EC8514 ;
    }
  }


</style>
