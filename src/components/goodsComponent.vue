<template>
    <div class="goods-component">
      <van-row type="flex"  tag="div" gutter="5">
        <van-col span="11" v-for="(item,index) in goodsLists" :key="index" >
          <img :src="item.imgSrc" alt="" @click="toGoodDetail(item)">
          <div class="content" @click="toGoodDetail(item)" >
            <p class="title">{{item.goodsTitle}}</p>
            <span class="new-price">￥{{item.newPrice}}</span>
            <div class="foo">
              <span class="old-price">￥{{item.oldPrice}}</span>
              <p class="sold-num">已售{{item.soldNum}}<span>+</span></p>
            </div>

          </div>
        </van-col>
      </van-row>
    </div>
</template>

<script>
    export default {
        name: "goodsComponent",
        props:{
            goodsLists:{
                type:Array,
                default:[]
            }
        },
        methods:{
            toGoodDetail(item){
                console.log(item);
                this.$router.push({name:'goodDetail'})
            }
        }
    }
</script>

<style lang="less" scoped>
.goods-component{

}
  .van-row--flex{
    flex-wrap: wrap;
    margin-left: 13px !important;
    padding-bottom: 20px;
  }
    .van-col{
      margin-right: 10px;
      margin-top: 15px;
      border-radius: 10px;
      box-shadow: 1px 1px 5px #cccccc;
      img{
        width: 100%;
        height: 135px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
      .content{

        padding: 0 4px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        background-color: #ffffff;
        min-height: 90px;
        .title{
          width: 100%;
          min-height: 40px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #666666;
          letter-spacing:1px;
        }
        .new-price{
          font-size: 14px;
          color: #FFB400;
        }
        .foo{
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          .old-price{
            font-size: 12px;
            color: #999999;
            text-decoration: line-through;
            vertical-align: middle;
          }
          .sold-num{
            font-size: 12px;
            color: #999999;

          }
        }

      }
</style>
