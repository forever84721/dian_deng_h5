<template>
    <div class="live-component">
      <ul class="lists">
        <li class="list-item clearfix" v-for="(item,index ) in liveLists" :key="index">
          <div class="item-left">
            <img class="item-img" :src="item.imgSrc" alt="">
          </div>
          <div class="item-right">
            <p class="item-title">{{item.title}}</p>
            <div class="live-time">
              <van-icon name="clock" size="14px" color="#00B1E4"></van-icon><span>{{item.time}}</span><br/>
              <van-icon name="location" size="14px" color="#00B1E4"></van-icon><span>{{item.address}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "liveComponent",
        props:{
            liveLists:{
                type:Array,
                default:[]
            }
        }
    }
</script>

<style lang="less" scoped>
.live-component{

}
  .lists{
    padding: 5px 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.2);
  }
    .list-item{
      position: relative;
      min-height: 99px;
      margin: 10px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #dddddd;
      &:last-child{
        border-bottom: none;

      }
    }
    .clearfix:after{
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
      .item-left{
        float: left;
        margin-right: 10px;
        img{
          width: 127px;
          height: 99px;
          border-radius: 8px;
        }

      }
      .item-right{
        height: 100%;
        .item-title{
          min-height: 34px;
          font-size: 13px;
          color: #666666;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing:2px;
        }
      }
        .live-time {
          position: absolute;
          bottom: 14px;
          left: 137px;
          margin: 3px 0;
          font-size: 13px;
          color: #999999;
          .van-icon{
            vertical-align: middle;
          }
          span{
            margin-left: 5px;
            margin-top: 4px;

            vertical-align: middle;
          }
        }
</style>
