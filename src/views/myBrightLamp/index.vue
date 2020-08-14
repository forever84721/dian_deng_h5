<template>
  <div class="activeCenter">
    <van-nav-bar
      :title="$t('m.footerNav.myLamp')"
    />
    <div class="showList" v-if="show" :style="{height:showHeight+'px'}">
      <div :class="['card',item.endTime <= currentTime ? 'closed' :'']" v-for="(item,index) in lampList" :key=index @click="toDetail(item)">
        <div class="tag" v-if="item.important && !item.expired">
          贵宾
        </div>
        <div class="outDate" v-if="item.expired">
          已过期
        </div>
        <div class="cardImg">
          <img :src="'https://wenxuanguangmingdeng.com/attachment/' + item.lampCategoryThumbnail" alt="">
        </div>
        <div class="cardPro">
          <p class="tip">
            <span>{{item.lampCategoryName}}</span>
          </p>
          <p>
            <span>灯位: </span>{{item.seat}}
          </p>
          <p>
            <span>寻灯编号: </span>{{item.number}}
          </p>
          <p>
            <span>安灯结束日期: </span>{{item.endAt.slice(0,10)}}
          </p>
          <img src="../../assets/images/b_ic_more.png" alt="">
        </div>
      </div>
    </div>
    <div class="noMessage clearFix" v-if="!show">
      <div class="messageImg">
      </div>
      <p>{{tip}}</p>
      <div class="goLamp" @click="goOrder">{{$t('m.personal.onlineClickLamp')}}</div>
    </div>
  </div>
</template>

<script>
  import {post} from '@/utils/request/index'
  import {Toast} from 'vant'
  import '../../assets/css/topNav.css'

  export default {
    name: "activeCenter",
    data() {
      return {
        lampList: [],
        showHeight:0,
        show:true,
        currentTime:0,
        tip:''
      }
    },
    methods: {
      // 前往我的明灯详情
      toDetail(item) {
        this.$router.push({path: '/lightDetail',query:{id:item.id,pilgrimId:item.pilgrimId}});
      },
      // 前往点灯页面
      goOrder() {
        // 如果已经选择寺庙，则前往灯种列表页面，否则前往寺庙首页
        if(window.localStorage.getItem('selectTempData')){
          this.$router.push({path:'chooseLamp',query:{tempId:JSON.parse(localStorage.getItem('selectTempData')).id}});
        }else {
          this.$router.push({path:'/temp'});
        }
      }
    },
    mounted() {
      this.currentTime = new Date().getTime();
      console.log(this.currentTime, "45")
      // 设置屏幕可用区域高度
      this.showHeight=document.body.clientHeight-96;
      // window.onresize=function () {
      //   this.showHeight=document.body.clientHeight-96;
      //   window.location.reload()
      // }
      // 获取我的明灯信息
      post('api/lamp/findByUser',{},res => {
        console.log(res);
        if(res.data.code === 200 ){
          this.lampList = res.data.data;
          //适配微信浏览器
          if(localStorage.getItem('environment') === 'weixin' || localStorage.getItem('environment') === 'ios') {
            console.log('weixin')
            this.lampList.forEach((item,index)=> {
            console.log(item.endAt);
            item.endAt = item.endAt.replace(/-/g, '/');
            console.log(item.endAt)
            item.endTime = new Date(item.endAt)

            item.endTime = new Date(item.endAt).getTime();
            console.log(item.endTime)
          });
          }else {
            this.lampList.forEach((item,index)=> {
              console.log(item.endAt)
              item.endTime = new Date(item.endAt).getTime();

              // item.endTime = new Date(item.endAt).getTime();
              console.log(item.endTime,)
            });
          }
          console.log(this.lampList);
          if(this.lampList.length === 0){
            this.show = !this.show;
            this.tip = '您还没有明灯呢，快去点灯吧';
          }
        }else if(res.data.code === 400){
          // this.$toast('登录失效，请重新登录');
          this.show = !this.show;
        }
      });
      // line续灯的调用监听
      if (location.href.indexOf("transactionId") !== -1) {
        post('api/order/linePayRenewConfirm',{
          "transactionId": this.$route.query.transactionId,
          "money": this.$route.query.money,
          "pilgrimId": this.$route.query.pilgrimId,
          "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id,
          "durationQuantity": this.$route.query.durationQuantity ,
          "accountId": JSON.parse(localStorage.getItem("userMsg")).id,
        }, res => {
          console.log(res)
          if (res.data.data === true) {
            post('api/lamp/findByUser',{},res => {
              console.log(res);
              if(res.data.code === 200 ){
                this.lampList = res.data.data;
                //适配微信浏览器
                if(localStorage.getItem('environment') === 'weixin') {
                  console.log('weixin')
                  this.lampList.forEach((item,index)=> {
                  console.log(item.endAt);
                  item.endAt = item.endAt.replace(/\-/g, '/');
                  console.log(item.endAt)
                  item.endTime = new Date(item.endAt)

                  item.endTime = new Date(item.endAt).getTime();
                  console.log(item.endTime)
                });
                }else {
                  this.lampList.forEach((item,index)=> {
                    console.log(item.endAt)
                    item.endTime = new Date(item.endAt)

                    // item.endTime = new Date(item.endAt).getTime();
                    console.log(item.endTime)
                  });
                }
                console.log(this.lampList);
                if(this.lampList.length === 0){
                  this.show = !this.show;
                  this.tip = '您还没有明灯呢，快去点灯吧';
                }
              }else if(res.data.code === 400){
                // this.$toast('登录失效，请重新登录');
                this.show = !this.show;
              }
            });
            Toast("续灯成功")
          }else {
            Toast("续灯失败")
          }

        })
      }
      // post('api/pilgrim/findByUserIdAndTempleIdOrderByStartLightAtDesc',
      //   {templeId:JSON.parse(window.localStorage.getItem('selectTempData')).id},
      //   res => {
      //
      //     let lamp = res
      //     console.log(lamp)
      //   });
      // if(window.localStorage.getItem('selectTempData') && JSON.parse(window.localStorage.getItem('selectTempData')).userId === JSON.parse(window.localStorage.getItem('userMsg')).id){
      //
      // }else {
      //   this.show = !this.show;
      //   this.tip = '您还未选择寺庙，请先选择寺庙';
      // }
    }
  }
</script>

<style scoped lang="less">
  .activeCenter {
    background-color: #F5F5F5;
    .showList {
      background-color: #F5F5F5;
      overflow: auto;
      padding-top: 0.32rem;
      box-sizing: border-box;
      .card {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        width: 14rem;
        height: 5.6rem;
        background-color: #ffffff;
        border-radius:10px;
        overflow: hidden;
        margin-bottom: 0.3rem;
        .tag,.outDate {
          position: absolute;
          top: 0;
          left: 0;
          background-size: cover;
          height: 0.8rem;
          width: 2rem;
          font-size:11px;
          font-family:PingFang SC;
          font-weight:300;
          color:rgba(255,254,254,1);
          line-height:0.8rem;
          text-align: center;
        }
        .tag {
          background-image: url("../../assets/images/d_ic_chunk.png");
        }
        .outDate {
          background-image: url("../../assets/images/d_ic_h_s.png");
        }
        .cardImg {
          width: 5.08rem;
          height: 3.84rem;
          background-image: url("../../assets/images/c_icn_picturebox_2.png");
          background-size: cover;
          margin: 0.88rem 0.4rem 0.88rem 0.6rem;
          text-align: center;
          /*padding: 0.2rem 0.24rem;*/
          box-sizing: border-box;
          img {
            width: 4.4rem;
            height: 3.1rem;
            margin-top: 0.35rem;
            /*margin-left: 10px;*/
          }
        }
        .cardPro {
          height: 3.84rem;
          width: 7.2rem;
          /*background-color: rebeccapurple;*/
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          .tip {
            font-size: 0.6rem;
            font-weight: bold;
          }
          p {
            font-size: 0.48rem;
            margin-bottom: 0.2rem;
          }
          .p1 {
            font-size: 0.6rem;
            color: white;
          }
          img {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }

      }
      .closed {
        background-color: #E6E6E6 !important;
      }
    }

    .noMessage {
      background-color: #F5F5F5;
      /*position: fixed;*/
      /*width: 100%;*/
      /*bottom: 50px;*/
      /*left: 0;*/
      height: calc(100vh - 96px);
      .messageImg {
        height: 7.12rem;
        width: 7.12rem;
        background-image: url("../../assets/images/c_kx.png");
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
        position: fixed;
        bottom: 4rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.72rem;
        color: #885022;
        text-align: center;
        line-height: 2rem;
        border-radius: 0.2rem;
      }
    }
  }

  .clearFix::before{
    content: '';
    display: table;
  }
</style>
