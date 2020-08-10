<template>
    <div class="game-component">
          <ul class="lists">
            <li class="list-item clearfix" v-for="(item,index ) in gameLists" :key="index" @click="toContestDetail(item)">
              <div class="item-left">
                <img class="item-img" :src="item.imgSrc" alt="">
              </div>
              <div class="item-right">
                <p class="item-title">{{item.title}}</p>
                <div class="parameter">
                  <van-icon name="friends" size="18px" color="#00B1E4"></van-icon>
                  <span class="num">{{item.enrollment}}</span>
                </div>
                <div class="match-time">
                  <span class="start-time">赛事开始 {{item.start}}</span>
                  <span class="end-time">结束 {{item.end}}</span>
                </div>


              </div>
            </li>
          </ul>
    </div>
</template>

<script>
    export default {
        name: "gameComponent",
        components: {

        },
        props:{
          gameLists:{
              type:Array,
              default:[]
          }
        },
        data(){
            return {}
        },
        methods:{
          toContestDetail(item){
              this.$router.push({path:'/contest/detail/home'})
          }
        }
    }
</script>

<style lang="less" scoped>
.game-component{

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
        p{
          padding: 4px 4px 0 4px;
          min-height: 30px;
          font-size: 13px;
          color: #666666;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing:1px;
        }
        .parameter{
          margin: 10px 0;
          .van-icon{
            vertical-align: middle;
          }
          .num{
            font-size: 13px;
            color: #00B1E4;
            vertical-align: middle;
          }
        }
        .match-time{
          position: absolute;
          bottom: 15px;
          left: 137px;
          font-size: 11px;
          color: #00B1E4;
          .end-time{
            margin-left: 3px;
            color: #F8BA55;
          }
        }
      }
</style>
