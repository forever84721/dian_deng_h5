<template>
    <div class="images-swiper">
      <div class="back" @click="back">
        <van-icon name="arrow-left" size="18" color="white"></van-icon>
      </div>
      <van-swipe @change="onChange">

        <van-swipe-item v-for="(item,index) in swiperList" :key="index">
          <img :src="item" alt="">
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator">
          {{ current + 1 }}/{{swiperList.length}}
        </div>
      </van-swipe>
    </div>
</template>

<script>
    export default {
        name: "imagesSwiper",
        props:{
          swiperList:{
              type:Array,
              default:[]
          }
        },
        data(){
            return{
                current:0
            }
        },
        methods:{
            onChange(index){
                this.current=index
            },
            back(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="less" scoped>
.images-swiper{
  .back{
    position: fixed;
    top:15px;
    left: 15px;
    z-index: 10;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    text-align: center;
    line-height: 34px;
    background-color: #868686;
  }
  img{
    width: 100%;
    height: 335px;
  }
}
  .van-swipe{
    .custom-indicator{
      position: absolute;
      bottom: 13px;
      right: 15px;
      padding: 2px 14px;
      border-radius: 20px;
      font-size: 12px;
      color: #ffffff;
      background-color: rgba(191,191,191,.8);
    }
  }
</style>
