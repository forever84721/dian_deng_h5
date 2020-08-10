<template>
    <div class="contestant-component">
      <van-row type="flex"  tag="div" gutter="5">
        <van-col span="11" class="contestant-item" v-for="(item,index) in contestantList" :key="index" >
          <div class="top">
            <div class="right">
              <img :src="item.contestantIcon" alt="">
            </div>
            <div class="left">
              <p class="entry-num">编号：{{item.entryNum}}</p>
              <p class="contestant-name">{{item.contestantName}}</p>
            </div>
          </div>
          <div class="middle">
            <img class="img" :src="item.imgSrc" alt="">
          </div>
          <div class="bottom">
            <ul>
              <li class="vote-btn">投票</li>
              <li class="vote-num">{{item.voteNum}}票</li>
            </ul>
          </div>
        </van-col>
      </van-row>
    </div>
</template>

<script>
    export default {
        name: "contestantComponent",
        props:{
            contestantList:{
                type:Array,
                default:[]
            }
        }
    }
</script>

<style lang="less" scoped>
  .contestant-component{
    .van-row--flex{
      flex-wrap: wrap;
      margin-left: 5px !important;
      padding-bottom: 20px;
      .van-col{
        margin-top: 15px;
        padding: 0 !important;
        border-radius: 10px;
        box-shadow: 1px 1px 5px #cccccc;
        background-color: #ffffff;
        &:nth-child(2n){
          margin-left: 20px;
        }
        .top{
          margin: 10px;
          display: flex;
          .right{
            img{
              width: 30px;
              height: 30px;
              margin-right: 5px;
            }
          }
          .left{
            font-size: 11px;
            .entry-num{
              color: #F8B23A;
            }
            .contestant-name{

            }
          }
        }
        .middle{
          .img{
            width: 100%;
            height: 118px;
          }
        }
        .bottom{
          margin: 10px;
          ul{
            display: flex;
            li{
              margin-left: 2px;
              font-size: 12px;
              color: #ffffff;
              background-color:#00B1E4 ;
            }
            .vote-btn{
              padding: 4px 8px;
            }
            .vote-num{
              padding: 4px 23px;
            }
          }
        }
      }
    }
  }
</style>
