<template>
    <div class="photo-template">
      <!--<div class="position-box">
        <vue-better-scroll class="wrapper" ref="scroll">

        </vue-better-scroll>
      </div>-->
      <van-row type="flex"  tag="div" gutter="5">
        <van-col span="11" class="photo-item" v-for="(item,index) in photoTemLists" :key="index">
          <div class="img-content">
            <img :src="item.imgSrc" alt="">
          </div>
          <div class="content">
            <span class="tem-name">{{item.temName}}</span>
            <span class="tem-num">{{item.temNum}}张照片<span v-if="item.price ==0 " class="free">免费</span><span v-else class="price">￥{{item.price}}</span></span>

          </div>
        </van-col>
      </van-row>
    </div>
</template>

<script>
    import VueBetterScroll  from 'vue2-better-scroll'
    export default {
        name: "photoTem",
        data(){
            return{
                photoTemLists:[
                    {
                        imgSrc:'/static/images/timg.jpg',
                        temName:'模板名称',
                        temNum:36,
                        price:100
                    },
                    {
                        imgSrc:'/static/images/timg.jpg',
                        temName:'模板名称',
                        temNum:36,
                        price:0
                    },
                    {
                        imgSrc:'/static/images/timg.jpg',
                        temName:'模板名称',
                        temNum:36,
                        price:100
                    },
                    {
                        imgSrc:'/static/images/timg.jpg',
                        temName:'模板名称',
                        temNum:36,
                        price:0
                    },
                    {
                        imgSrc:'/static/images/timg.jpg',
                        temName:'模板名称',
                        temNum:36,
                        price:0
                    },
                    {
                        imgSrc:'/static/images/timg.jpg',
                        temName:'模板名称',
                        temNum:36,
                        price:0
                    },

                ]
            }
        },
        components:{
            VueBetterScroll
        }
    }
</script>

<style lang="less" scoped>
.photo-template{

}
  .van-row--flex{
    flex-wrap: wrap;
    margin-left: 13px !important;

  }
    .van-col{
      margin-right: 10px;
      margin-top: 15px;
      .img-content{
        position: relative;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        img{
          width: 100%;
          height: 135px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      }
    }
      .content{
        background-color: #ffffff;
        text-align: left;
        padding-bottom: 5px;
        padding-left: 10px;
        min-height: 50px;
        line-height: 23px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        span{
          display: block;
        }
        .tem-name{
          font-size: 14px;
          color: #666666;
          font-weight: bold;
        }
        .tem-num{
          font-size: 12px;
          color: #a1a1a1;
        }
        .free{
          float: right;
          margin-right: 10px;
        }
        .price{
          float: right;
          margin-right: 10px;
          color: #FFB400;
        }
      }

</style>
