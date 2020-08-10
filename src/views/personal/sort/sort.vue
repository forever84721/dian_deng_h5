<template>
  <div class="sort">
    <van-nav-bar
      :title="$t('m.personal.onlineClickLamp')"
      left-arrow
      @click-left="onClickLeft"
    >
      <van-icon :name="setting" slot="right" @click="sortSetting"/>
    </van-nav-bar>
    <div class="main">
      <div class="bg">
        <div class="text">
          <p>{{$t('m.personal.consumePower')}}</p>
          <span v-if="ranking !==''">我的名次:</span>
          <span v-if="ranking !==''">{{ranking}}</span>
        </div>
        <div class="cup">
          排行榜
        </div>
      </div>

      <div class="show">
        <div class="nav">
          <span>名次</span>
          <span class="name">姓名</span>
          <span class="money">消费支出(元)</span>
        </div>
        <van-divider />
        <div class="list">
          <div class="list-item" v-for="(item,index) in rankList" :key="index">
            <div class="avatar">
              <img src="../../../assets/images/e_j_1.png" alt="" v-if="index === 0">
              <img src="../../../assets/images/e_j_2.png" alt="" v-if="index === 1">
              <img src="../../../assets/images/e_j_3.png" alt="" v-if="index === 2">
              <span  :class="[index>2 ? 'rankColor' : '' , 'ranking']">{{index+1}}</span>
            </div>
            <div class="name">
              {{item.userName}}
            </div>
            <div class="money">
             {{item.amount}}
            </div>
          </div>
          <van-divider />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {post} from '@/utils/request/index'
  export default {
    name: 'help',
    data() {
      return {
        setting: require('../../../assets/images/e_s_b.png'),
        rankList:[],
        ranking:''
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      // 前往设置是否显示排行信息页面
      sortSetting() {
        this.$router.push('/sortSetting');
      }
    },
    mounted() {
      // 获取排行榜信息
      if(JSON.parse(localStorage.getItem('selectTempData')).id){
        post('api/templeTransaction/rank',{
          "templeId": JSON.parse(localStorage.getItem('selectTempData')).id
        },res => {
          console.log(res);
          if(res.data.code ===200){
            this.rankList = res.data.data;
            this.rankList.forEach((item,index) => {
              if(!item.userName || item.userName === '') {
                item.userName = '大德';
              }
            });
          }else {
            this.$toast('获取排行榜信息失败');
          }
        });
        // 获取当前用户是否上榜信息
        post('api/user/getInvisible', {}, res => {
          console.log(res);
          if (res.data.code === 200) {
            if(res.data.data){
              console.log('111')
              // 查看我在当前寺庙的排名
              post('api/templeTransaction/findMyRank',{templeId:JSON.parse(window.localStorage.getItem('selectTempData')).id},res => {
                console.log(res);
                if(res.data.code ===200){
                  if(this.ranking ===0){
                    this.ranking = '99+'
                  }else {
                    this.ranking = res.data.data;
                  }
                }
              })
            }
          }
        })
      }else {
        this.$toast('您还未选择寺庙哦，请先选择寺庙');
      }
    }
  }
</script>

<style lang="less" scoped>
  .sort {
    background-color: #f5f5f5;
    height: 100vh;
  }

  .van-image {
    height: 1rem;
    width: 1rem;

    img {
      height: 1rem;
      width: 1rem;
    }
  }
  .van-nav-bar {
    background-image: url("../../../assets/images/e_bj.png");
    background-size: cover;
  }
  .main {
    position: relative;
    .bg {
      color: #FFFFFF;
      width: 100%;
      height: 4.92rem;
      background-image: url("../../../assets/images/e_bj.png");
      background-size: cover;
      background-position: 0 -2rem;
      overflow: hidden;

      .text {
        font-size: 0.56rem;
        /*background-color: #00B1E4;*/
        height: 2.2rem;
        width: 4rem;
        margin-top: 1.4rem;
        margin-left: 0.96rem;

        p {
          font-size: 0.72rem;
          margin-bottom: 0.35rem;
        }

        span {
          font-size: 0.56rem;
          margin-right: 0.2rem;
        }
      }

      .cup {
        height: 3.84rem;
        width: 3.72rem;
        background-image: url("../../../assets/images/e_bj_1.png");
        background-size: cover;
        position: relative;
        left: 70%;
        bottom: 60%;
        text-align: center;
        line-height: 2.4rem;
        font-size: 0.48rem;
      }
    }
    .show {
      width: 14.2rem;
      overflow: auto;
      height: 75%;
      background-color: #FFFFFF;
      /*position: absolute;*/
      /*top: 4.2rem;*/
      /*left: 50%;*/
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      padding: 0.92rem;
      font-size: 0.56rem;
      border-top-left-radius: 0.2rem;
      border-top-right-radius: 0.2rem;

      .van-divider {
        background-color: #f5f5f5;
        margin: 0 !important;
      }

      .nav {
        font-weight: 600;
        margin-bottom: 0.64rem;
        position: relative;

        .name {
          position: absolute;
          left: 43%;
          transform: translateX(-50%);
        }
        .money {
          position: absolute;
          right: 0;
        }
      }

      .list {
        .list-item {
          height: 1.68rem;
          width: 100%;
          position: relative;
          .avatar {
            position: relative;
            display: inline-block;
            height: 1.4rem;
            width: 1.4rem;
            /*margin-top: 0.12rem;*/
            img {
              height: 1.4rem;
              width: 1.4rem;
            }
            .ranking {
              position: absolute;
              left: 50%;
              bottom: 0.16rem;
              transform: translateX(-50%);
              font-size: 0.48rem;
              color: white;
            }

            .rankColor {
              color: #000000!important;
              position: absolute;
              left: 50%;
              bottom: 0.16rem;
              transform: translateX(-50%);
              font-size: 0.48rem;
            }
          }
          .name {
            display: inline-block;
            height: 1.68rem;
            line-height: 1.68rem;
            position: absolute;
            left: 43%;
            transform: translateX(-50%);
          }
          .money {
            display: inline-block;
            height: 1.68rem;
            line-height: 1.68rem;
            position: absolute;
            left: 85%;
            transform: translateX(-50%);
          }
        }
      }

    }
  }
</style>
