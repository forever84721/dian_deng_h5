<template>
  <div class="activeCenter">
    <van-nav-bar
      :title="$t('m.activeCenter.activeMessage')"
    />
    <div class="cardList" v-if="!show" :style="{height:showHeight+'px'}">
      <div class="card" v-for="(item,index) in activeMsgList" :key="index" @click="goDetail(item.id)">
        <div>
         <span class="title">
           {{item.title}}
         </span>
          <span class="time">
           {{item.createAt}}
         </span>
        </div>
        <div class="content " >
<!--          {{item.content}}-->
          <div v-html="item.content"></div>
        </div>
      </div>
    </div>
    <div class="noMessage clearFix" v-if="show" :style="{height:showHeight + 'px'}">
      <div class="messageImg">
      </div>
      <p>暂无活动消息</p>
      <!--      <div class="goLamp">测试按钮</div>-->
    </div>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  import {post} from '@/utils/request/index'

  export default {
    name: "activeCenter",
    data() {
      return {
        showHeight: 0,
        show: false,
        activeMsgList: []
      }
    },
    mounted() {
      // 设置屏幕可用区域高度
      this.showHeight = window.innerHeight - 96;
      window.addEventListener('touchend', (e) => {
        // let timer1 = setTimeout(()=>{
        this.showHeight = window.innerHeight - 96;
        // },500)
      });
      post('api/messageExtend/findByUserIdAndTempleId', {templeId: JSON.parse(window.localStorage.getItem('selectTempData')).id}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.activeMsgList = res.data.data;
          if (this.activeMsgList.length === 0) {
            this.show = true;
          }
        }
      })
    },
    methods: {
      goDetail(id) {
        this.$router.push({path: '/activeDetail', query: {id: id}});
      }
    }
  }
</script>

<style scoped lang="less">
  .activeCenter {
    background-color: #F5F5F5;

    .cardList {
      background-color: #F5F5F5;
      overflow: auto;
      box-sizing: border-box;
      /*padding: 0.32rem 0.5rem;*/
      padding-top: 0.32rem;

      .card {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        box-sizing: border-box;
        padding: 0.58rem;
        margin-bottom: 0.32rem;
        width: 14rem;
        min-height: 4.24rem;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.4rem;

        .title {
          display: inline-block;
          height: 1.3119999999999998rem;
          margin: 0;
          font-size: 0.6rem;
          font-weight: 700;
        }

        .time {
          display: inline-block;
          height: 1.3119999999999998rem;
          line-height: 1.68rem;
          margin: 0;
          float: right;
          font-size: 0.48rem;
          color: #999999;
        }

        .content {
          margin-top: 0.4rem;
          font-size: 0.48rem;
          color: #666666;
          width: 100%;
          padding: 5% ;
          box-sizing: border-box;
        }
      }
    }
    .content /deep/ img {
      background-size: contain;
      width: 100%;
      height: auto;
      margin: 0 auto;
      display: block;
    }
    .noMessage {
      box-sizing: border-box;
      background-color: #F5F5F5;
      /*height: calc(100vh - 96px);*/
      /*overflow: hidden;*/
      position: relative;
      /*width: 100%;*/
      /*bottom: 50px;*/
      /*left: 0;*/

      .messageImg {
        height: 7.12rem;
        width: 7.12rem;
        background-image: url("../../assets/images/d_activity.png");
        background-size: cover;
        border-radius: 3.56rem;
        margin-top: 3.12rem;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }

      p {
        font-size: 0.56rem;
        color: #999999;
        text-align: center;
        margin-top: 0.96rem;
      }

      .goLamp {
        width: 10.04rem;
        height: 2rem;
        background-image: url("../../assets/images/b_btn_search.png");
        background-size: cover;
        border-radius: 0.2rem;
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.72rem;
        color: #885022;
        text-align: center;
        line-height: 2rem;
      }
    }
  }

  .clearFix::before {
    content: '';
    display: table;
  }
</style>
