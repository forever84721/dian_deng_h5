<template>
  <div class="myLampList">
    <van-nav-bar
      :title="$t('m.footerNav.myLamp')"
    />
    <div class="showList" v-if="show" :style="{height:showHeight+'px'}">
      <div class="card" v-for="(item,index) in lampList" :key=index @click="toDetail(item.id,item.lampCategory.id)">
        <div class="cardImg">
          <img :src="'http://47.96.71.160/attachment/' + item.lampCategory.thumbnail" alt="">
        </div>
        <div class="cardPro">
          <p class="tip">
            <span>{{item.lampCategory.name}}</span>
          </p>
          <p>
            <span>灯位:</span>{{item.lamp.location}}
          </p>
          <p>
            <span>寻灯编号:</span>{{item.lamp.code}}
          </p>
          <p>
            <span>安灯结束日期:</span>{{item.endLightAt.substring(0,10)}}
          </p>
          <img src="../../assets/images/b_ic_more.png" alt="">
        </div>
      </div>
    </div>
    <div class="noHave" v-if="!show" :style="{height:showHeight+'px'}">
      <div>
        <div class="Img"></div>
        <p>您还没有明灯呢，快去点灯吧</p>
      </div>
      <div class="goLamp" @click="goOrder">{{$t('m.personal.onlineClickLamp')}}</div>
    </div>
  </div>
</template>

<script>
  import {post} from '@/utils/request/index'
  import {Toast} from 'vant'
  import '../../assets/css/topNav.css'
  export default {
    name: "index",
    data() {
      return {
        lampList: [],
        showHeight:0,
        show:true
      }
    },
    methods: {
      // 前往我的明灯详情
      toDetail(id,lampId) {
        this.$router.push({path: '/lightDetail',query:{blessUserId:id,lampCategoryId:lampId}});
      },
      // 前往点灯页面
      goOrder() {
        // 如果已经选择寺庙，则前往灯种列表页面，否则则前往寺庙首页
        if(window.localStorage.getItem('selectTempData')){
          this.$router.push({path:'chooseLamp',query:{tempId:JSON.parse(localStorage.getItem('selectTempData')).id}});
        }else {
          this.$router.push({path:'/temp'});
        }
      }
    },
    mounted() {
      // 设置屏幕可用区域高度
      this.showHeight=window.screen.height-96;
      window.onresize=function () {
        this.showHeight=document.body.clientHeight-96;
        window.location.reload()
      }
      if(window.localStorage.getItem('selectTempData')){
        // 根据寺庙id获取我的明灯信息
        post('api/pilgrim/findByUserIdAndTempleIdOrderByStartLightAtDesc',{templeId:JSON.parse(window.localStorage.getItem('selectTempData')).id},res => {
          if(res.data.code === 200 ){
            this.lampList = res.data.data;
            window.localStorage.setItem("lampCategoryId", this.lampList.lampCategory.id)
            console.log(this.lampList);
            if(this.lampList.length === 0){
              this.show = !this.show;
            }
          }
        });
      }else {
        this.show = !this.show;
      }
    }
  }
</script>

<style scoped lang="less">

  .myLampList {
    .showList {
      background-color: #F5F5F5;
      overflow: auto;
      /*padding: 0.32rem 0.52rem 0 0.52rem;*/
      padding-top: 0.32rem;
      box-sizing: border-box;
      margin-bottom: 2.3rem;
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
        .cardImg {
          width: 5.08rem;
          height: 3.84rem;
          background-image: url("../../assets/images/c_icn_picturebox_2.png");
          background-size: cover;
          margin: 0.88rem 0.4rem 0.88rem 0.6rem;
          text-align: center;
          padding: 0.2rem 0.24rem;
          box-sizing: border-box;
          img {
            width: 4.6rem;
            height: 3.36rem;
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
    }

    .noHave {
      background-color: #F5F5F5;
      overflow: hidden;
      .Img {
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
        margin-top: 3.44rem;
      }
      .goLamp {
        width: 10.04rem;
        height: 2rem;
        background-image: url("../../assets/images/b_btn_search.png");
        background-size: cover;
        position: relative;
        margin-top: 4.5rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.72rem;
        color: #885022;
        text-align: center;
        line-height: 2rem;
      }
    }
  }

</style>
