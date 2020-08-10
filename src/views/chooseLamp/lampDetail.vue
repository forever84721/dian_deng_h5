<template>
  <div class="lampDetail">
      <van-nav-bar
        :title="$t('m.lampDetail.onlineLamp')"
        left-arrow
        @click-left="onClickLeft"
      />
    <div class="detail" :style="{height:lampHeight +'px'}">
      <div class="mainBox" :style="{height:mainBoxHeight +'px'}">
        <div class="detailImg">
          <img :src="'https://wenxuanguangmingdeng.com/attachment/'+lampDetail.image" alt="">
<!--          <van-swipe class="my-swipe" :autoplay="3000" indicator="white">-->
<!--            <van-swipe-item v-for=" (image,index) in url" :key="index"  >-->
<!--              <img :src="'https://wenxuanguangmingdeng.com/attachment/'+ image">-->
<!--            </van-swipe-item>-->
<!--          </van-swipe>-->
        </div>
        <div class="detailTitle">
          {{lampDetail.name}}
        </div>
        <div class="detailSelect">
          <span>{{$t('m.lampDetail.select')}}</span>
          <div>
            <ul>
              <li v-for="(item,index) in lampSelect" :key="index">{{item.duration.name}}</li>
            </ul>
          </div>
        </div>
        <van-divider />
        <div class="detailIntro">
          {{lampDetail.description}}
        </div>
      </div>
      <div class="btnBox" :style="{height:btnSpaceHeight +'px'}">
        <div class="needLamp" @click="nextTo">
          {{$t('m.lampDetail.needLamp')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  import {post} from "@/utils/request";

  export default {
    name: 'lampDetail',
    data() {
      return {
        lampId:'',
        lampDetail:{},
        lampHeight:0,
        // 灯种规格数据
        lampSelect:[],
        // 寺庙描述
        // tempDes:'',
        mainBoxHeight: 0,
        btnSpaceHeight: 0,
        url: '' //轮播图片地址
      }
    },
    mounted() {
      // window.onresize=function () {
      //   window.location.reload();
      // }
      this.lampHeight =  window.innerHeight - 96;
      this.mainBoxHeight = this.lampHeight * (8.5/10) ;
      this.btnSpaceHeight = this.lampHeight * (1.5/10) ;
      window.addEventListener('touchend',(e) => {
        // let timer = setTimeout(()=>{
          this.lampHeight =  window.innerHeight - 96;
          this.mainBoxHeight = this.lampHeight * (8.5/10) ;
          this.btnSpaceHeight = this.lampHeight * (1.5/10) ;
          // clearTimeout(timer);
        // },500);
      });
      this.lampId= this.$route.query.lampCategoryId;
      console.log(this.lampId);
      // 查询灯种详情
      post('api/lampCategory/findById',{id:this.lampId},res => {
        console.log(res);
        this.lampDetail = res.data.data.lampCategory;
        this.lampSelect = res.data.data.lampGoodsList;
        console.log(this.lampDetail,this.lampSelect);
        this.getUrl()
      });
      // post('api/lampGoods/findByLampCategoryId',{lampCategoryId:this.lampId},res => {
      //   this.lampSelect = res.data.data;
      //   console.log(this.lampSelect);
      // });
      this.tempDes = JSON.parse(localStorage.getItem('selectTempData')).description;
    },
    methods:{
      // 返回上一级
      onClickLeft() {
        this.$router.go(-1);
      },
      nextTo() {
        this.$router.push({path:"/home",query:{lampCategoryId:this.lampId,lampHolderId:this.$route.query.lampHolderId}})
      },
      //获取轮播图片地址
      getUrl() {
        //轮播土图片URL
        this.url = []
        this.url = this.lampDetail.image.split(',')
        // for(let i =0; i<this.urlArr.length; i++){
        //   this.url[i] = this.urlArr[i]
        //   return this.url
        // }
        console.log(this.url)
      }
    }
  }
</script>

<style lang="less" scoped>

  .detail {
    /*width: 100%;*/
    /*position: fixed;*/
    /*bottom: 50px;*/
    /*left: 0;*/
    .mainBox {
      box-sizing: border-box;
      padding: 0.32rem 0.52rem 0 0.52rem;
      overflow: auto;
    }
    .btnBox {
      .needLamp {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        line-height: 2.96rem;
        width: 11.92rem;
        height: 2.96rem;
        font-size: 0.72rem;
        color: #885022;
        background-image: url("../../assets/images/b_btn_search_1.png");
        background-size: 100%;
      }
    }
    .detailImg {
      height: 14rem;
      border-radius:0.4rem;
      img {
        width: 100%;
        height: 14rem;
        border-radius: 0.4rem;
      }
    }
    .detailTitle {
      text-align: center;
      margin-top: 1rem;
      margin-bottom: 1rem;
      font-size: 0.72rem;
      color: #885022;
    }
    .detailSelect {
      margin-bottom: 0.6rem;
      span {
        font-size: 0.56rem;
      }
      ul {
        overflow: hidden;
        margin-top: 0.32rem;
        li {
          width: 3.36rem;
          height: 0.92rem;
          text-align: center;
          line-height: 0.92rem;
          background-image: url("../../assets/images/b_ic_tag.png");
          background-size: 3.36rem 0.92rem;
          float: left;
          font-size: 0.48rem;
          color: #F06A36;
          margin-right: 0.6rem;
          margin-top: 0.4rem;
        }
      }
    }
    .detailIntro {
      font-size: 0.56rem;
      margin-bottom: 0.8rem;

    }
  }
</style>
