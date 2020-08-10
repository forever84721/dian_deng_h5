<template>
    <div class="details-component">
      <p>商品详情</p>
      <div class="img-contain">
        <ul>
          <li v-for="(imgSrc,index) in detailsImgs" :key="index">
            <img :src="imgSrc" alt="">
          </li>

        </ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "detailsComponent",
        props:{
            detailsImgs:{
                type:Array,
                default:[]
            }
        }
    }
</script>

<style lang="less" scoped>
.details-component{
  .van-divider{
    padding: 0 80px;
    border-color: #E4E4E4;
    color: #666666;
    margin-top: 5px;
  }
  p{
    margin: 15px;
  }
  .img-contain{
    ul{
      background-color: #ffffff;
      padding-top: 10px;
      padding-bottom: 50px;
      li{
        height: 250px;
        margin: 8px 15px ;
        img{
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
