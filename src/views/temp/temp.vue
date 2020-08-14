<template>
  <div>
    <div class="temp">
      <van-nav-bar
        :title="$t('m.footerNav.temp')"
      />
      <div class="box" :style="{height:boxHeight + 'px'}" v-if="show">
        <div class="mainBox" :style="{height:mainBoxHeight + 'px'}">
          <div class="tempTitle" @click="goToSelectTemp">
            <div class="tempTitle_1">
              {{tempData.name}}
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="tempImg">
<!--            <img :src="'https://wenxuanguangmingdeng.com/attachment/'+tempData.cover" alt="">-->
<!--            // 轮播图片-->
            <van-swipe class="my-swipe" :autoplay="3000" indicator="white">
              <van-swipe-item v-for=" (image,index) in url" :key="index"  >
                <img :src="'https://wenxuanguangmingdeng.com/attachment/'+ image">
                <div>{{image[index]}}</div>
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="tempDetail">
            <div class="tempDetail_1">
              <span>初步地址:</span>
              <span>{{tempData.address}}</span>
            </div>
            <div class="tempDetail_2">
              <div>{{$t('m.temp.lampServe')}}:</div>
              <div style="overflow:hidden">
                <ul style="overflow:hidden;margin-top: 0">
                  <li style="margin-top: 0.4rem" v-for="(item, index) in lampList" :key="index">
                    {{item.name}}
                  </li>
                </ul>
              </div>
            </div>
            <div class="tempDetail_3" style="margin: 0.48rem 0"></div>
            <div class="tempDetail_4">
              {{tempData.description}}
            </div>
          </div>
        </div>
        <div class="btnSpace" :style="{height:btnSpaceHeight + 'px'}">
          <!--          <div class="onlineLamp" @click="clickLamp">-->
          <!--            {{$t('m.temp.onlineLamp')}}-->
          <!--          </div>-->
          <div class="btnSpace_1" @click="clickLamp">
            <span class="myLamp">{{$t('m.temp.onlineLamp')}}</span>
          </div>
          <div class="btnSpace_2" @click="goDonate">
            <span class="donate">{{$t('m.donateMoney')}}</span>
          </div>
        </div>
      </div>

      <div class="noTemp" v-if="!show" :style="{height:boxHeight+'px'}">
        <div class="selectImg"></div>
        <div class="content">
          <p>{{$t('m.temp.temp_1')}}</p>
          <p>{{$t('m.temp.temp_2')}}</p>
        </div>

        <div class="selectTemp" @click="goToSelectTemp">
          {{$t('m.temp.temp_3')}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  import {post} from '@/utils/request/index'
  import {Swipe,SwipeItem} from 'vant'

  export default {
    name: "temp",
    data() {
      return {
        show: false,
        // 选择的寺庙Id
        selectedTempId: '',
        // 寺庙数据
        tempData: {},
        // 盒子高度
        boxHeight: 0,
        // 寺庙展示区域主体高度
        mainBoxHeight: 0,
        // 按钮区域主体高度
        btnSpaceHeight: 0,
        lampList: [],
        userCode: '',
        // 屏幕可用主体区域高度
        // showHeight: 0,
        images: [
          'https://img.yzcdn.cn/vant/apple-1.jpg',
          'https://img.yzcdn.cn/vant/apple-2.jpg',
        ],
        url:''
      }

    },
    methods: {
      goDonate() {
        this.$router.push('/donate');
      },
      // 实现返回上一级
      onClickLeft() {
        this.$router.go(-1);
      },
      // 前往点灯列表页面
      clickLamp() {
        // let browserInfo = navigator.userAgent.toLowerCase();
        // if (browserInfo.match(/MicroMessenger/i) == 'micromessenger') {
        //   post('api/user/getLoginType', {}, res => {
        //     if (res.data.code === 200) {
        //       if (res.data.data === "phone") {
        //         if(!window.localStorage.getItem('wxPhoneOpenId')&&(JSON.parse(window.localStorage.getItem('wxPhoneOpenId')).id = JSON.parse(window.localStorage.getItem('userMsg')).id)){
        //           location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=http%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Ftemp&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        //         }else {
        //           this.$router.push({path: '/chooseLamp', query: {tempId: this.tempData.id}});
        //         }
        //       }
        //     }
        //   });
        // }else {
        //   this.$router.push({path: '/chooseLamp', query: {tempId: this.tempData.id}});
        // }
        // post('api/cameraControl/getLiveBroadcastAddress', {
        //   "deviceSerial": "D82674077",
        //   "channelNo": "1",
        //   "expireTime": "300"
        // }, res => {
        //   console.log(res)
        //   // let url = res
        //   // this.movieUrl = url
        // })
        this.$router.push({path: '/chooseLamp', query: {tempId: this.tempData.id}});
      },
      // 前往选择寺庙页面
      goToSelectTemp() {
        this.$router.push({path: '/selectTemp'});
      },
      //获取轮播图片地址
      getUrl() {
        //轮播土图片URL
        this.url = []
        this.url = this.tempData.cover.split(',')
        // for(let i =0; i<this.urlArr.length; i++){
        //   this.url[i] = this.urlArr[i]
        //   return this.url
        // }
        console.log(this.url)
      }
    },
    mounted() {
      // if(window.sessionStorage.getItem('payCount')){
      //   window.sessionStorage.setItem('payCount');
      // }
      // if(window.sessionStorage.getItem('payCount1')){
      //   window.sessionStorage.setItem('payCount1');
      // }
      // if(window.sessionStorage.getItem('payCount2')){
      //   window.sessionStorage.setItem('payCount2');
      // }
      // if (location.href.indexOf('code') !== -1) {
      //   this.userCode = this.getvar(location.href, 'code');
      //   let browserInfo = navigator.userAgent.toLowerCase();
      //   if (browserInfo.match(/MicroMessenger/i) == 'micromessenger') {
      //     post('api/user/getLoginType', {}, res => {
      //       if (res.data.code === 200) {
      //         if (res.data.data === "phone") {
      //           post('api/user/getWechatOpenId',
      //             {
      //               code: this.userCode,
      //             },
      //             res1 => {
      //              if(res1.data.code === 200){
      //                 let obj = {
      //                   id:JSON.parse(window.localStorage.getItem('userMsg')).id,
      //                   openId:JSON.parse(res1.data.data).openid
      //                 };
      //                 window.localStorage.setItem('wxPhoneOpenId',JSON.stringify(obj));
      //              }
      //             })
      //         }
      //       }
      //     });
      //   }
      // }
      // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
      // 设置屏幕可用区域高度
      // 删除当前账号信息，用于测试
      // post('api/user/deleteUser',{id:58},res => {
      //   console.log(res);
      // });
      // 初始化页面布局，动态分配元素高度

      // setTimeout(()=>{
      this.boxHeight = window.innerHeight - 96;
      this.mainBoxHeight = this.boxHeight * (8.5 / 10);
      this.btnSpaceHeight = this.boxHeight * (1.5 / 10);
      // },100);
      console.log(this.boxHeight, this.mainBoxHeight, this.btnSpaceHeight);
      window.addEventListener('touchend', (e) => {
        // let timer = setTimeout(()=>{
        this.boxHeight = window.innerHeight - 96;
        this.mainBoxHeight = this.boxHeight * (8.5 / 10);
        this.btnSpaceHeight = this.boxHeight * (1.5 / 10);
        // clearTimeout(timer);
        // },1000);
      });

      // this.boxOtherHeight =  document.body.clientHeight - 50;
      // 如果有重新选择寺庙，获取寺庙信息
      if (this.$route.query.tempId) {
        this.selectedTempId = this.$route.query.tempId;
        console.log(this.selectedTempId);
        post('api/temple/findById', {id: this.selectedTempId}, res => {
          this.tempData = res.data.data;
          console.log(this.tempData)
          this.getUrl()
          console.log(this.url)
          console.log(this.tempData.cover.split(','))
          post('api/lampCategory/findWithTempleId', {templeId: this.tempData.id}, res => {
            console.log(res);
            this.lampList = res.data.data;
            console.log(this.lampList);
            // this.showHeight = document.body.clientHeight - 50;
          })
          this.tempData.userId = JSON.parse(window.localStorage.getItem('userMsg')).id;
          window.localStorage.setItem('selectTempData', JSON.stringify(this.tempData));
          this.show = true;
          this.tempData = JSON.parse(window.localStorage.getItem('selectTempData'));
          console.log(this.tempData);

        })
      } else {

        if (window.localStorage.getItem('templeId')) {
          this.selectedTempId = JSON.parse(window.localStorage.getItem('templeId'));
          // 判断当前寺庙是否还存在在数据库
          post('api/temple/isExist', {id: this.selectedTempId}, res => {
            if (res.data.code === 200) {
              if (res.data.data === false) {
                window.localStorage.removeItem('selectTempData');
                window.localStorage.removeItem('templeId');
              } else {
                post('api/temple/findById', {id: this.selectedTempId}, res => {
                  console.log(res.data.data.enable,'enable0')
                  if(res.data.data.enable) {
                    console.log(res.data.data.enable,'enable')
                    this.tempData = res.data.data;
                    this.getUrl()
                    post('api/lampCategory/findWithTempleId', {templeId: this.tempData.id}, res => {
                      console.log(res);
                      this.lampList = res.data.data;
                      console.log(this.lampList);
                      // this.showHeight = document.body.clientHeight - 50;
                    });
                    this.tempData.userId = JSON.parse(window.localStorage.getItem('userMsg')).id;
                    window.localStorage.setItem('selectTempData', JSON.stringify(this.tempData));
                    this.show = true;
                    this.tempData = JSON.parse(window.localStorage.getItem('selectTempData'));
                    console.log(this.tempData);
                  }else {
                    this.show =false
                  }

                })
              }
            }
          });
        } else {
          // 如果本地存储有寺庙信息,并且对应当前账户就从本地读取
          if (window.localStorage.getItem('selectTempData') && JSON.parse(window.localStorage.getItem('selectTempData')).userId === JSON.parse(window.localStorage.getItem('userMsg')).id) {
            post('api/temple/isExist', {id: JSON.parse(window.localStorage.getItem('selectTempData')).id}, res => {
              if (res.data.code === 200) {
                if (res.data.data === false) {
                 window.localStorage.removeItem('selectTempData');
                  this.getUrl()
                }else {
                  post('api/temple/findById', {id: JSON.parse(window.localStorage.getItem('selectTempData')).id}, res => {
                    console.log(res.data.data.enable,'enable2')
                    if(res.data.data.enable) {
                      console.log(res.data.data.enable,'enable3')
                      this.tempData = res.data.data;
                      this.getUrl()
                      post('api/lampCategory/findWithTempleId', {templeId: this.tempData.id}, res => {
                        console.log(res);
                        this.lampList = res.data.data;
                        console.log(this.lampList,'list');
                        // this.showHeight = document.body.clientHeight - 50;
                      });
                      this.tempData.userId = JSON.parse(window.localStorage.getItem('userMsg')).id;
                      window.localStorage.setItem('selectTempData', JSON.stringify(this.tempData));
                      this.show = true;
                      this.tempData = JSON.parse(window.localStorage.getItem('selectTempData'));
                      console.log(this.tempData);
                    }
                  })
                  // this.show = true;
                  // this.tempData = JSON.parse(window.localStorage.getItem('selectTempData'));
                  // console.log(this.tempData);
                  // post('api/lampCategory/findWithTempleId', {templeId: this.tempData.id}, res => {
                  //   console.log(res);
                  //   this.lampList = res.data.data;
                  //   console.log(this.lampList);
                  //   this.getUrl()
                    // this.showHeight = document.body.clientHeight - 50;
                  // });
                }
              }
            });
          }
        }
      }
    },
    beforeDestroy() {
      if (window.localStorage.getItem('templeId')) {
        window.localStorage.removeItem('templeId');
      }
    }
  }
</script>

<style scoped lang="less">
  .temp {
    .box {
      /*width: 100%;*/
      /*position: fixed;*/
      /*bottom: 50px;*/
      /*left: 0;*/

      .mainBox {
        overflow: auto;

        .tempTitle {
          overflow: hidden;
          height: 2rem;
          /*background-color: lightblue;*/

          .tempTitle_1 {
            position: relative;
            left: 50%;
            top: 0.4rem;
            transform: translateX(-50%);
            height: 1.04rem;
            width: 13.68rem;
            /*margin: 0.4rem 0.56rem 0.64rem 0.72rem;*/
            /*background-color: red;*/
            background-image: url("../../assets/images/b_ic_curve.png");
            background-size: cover;
            text-align: center;
            line-height: 1.04rem;
            font-size: 0.56rem;
            color: #333333;

            .van-icon, .van-icon::before {
              /*margin-left: 5rem;*/
              float: right;
              margin-top: 0.13rem;
            }
          }
        }

        .tempImg {
          height: 6.8rem;
          /*background-color: #5AC55A;*/

          img {
            width: 100%;
            height: 100%;
          }
        }

        .tempDetail {
          margin-top: 0.2rem;
          padding: 0 0.96rem 0 1.04rem;

          .tempDetail_1 {
            padding-top: 0.64rem;
            font-size: 0.56rem;
          }

          .tempDetail_2 {
            margin-top: 1rem;
            font-size: 0.56rem;
            /*height: 2.4rem;*/

            ul {
              margin-top: 0.4rem;

              li {
                text-align: center;
                width: 3.33rem;
                float: left;
                height: 0.92rem;
                line-height: 0.92rem;
                background-image: url("../../assets/images/b_ic_tag.png");
                margin-right: 0.52rem;
                font-size: 0.48rem;
                background-size: 3.33rem 0.92rem;
              }
            }
          }

          .tempDetail_3 {
            width: 100%;
            height: 1px;
            background-color: #F3F3F3;
            margin-top: 1.8rem;
          }

          .tempDetail_4 {
            height: 3.6rem;
            /*background-color: pink;*/
            font-size: 0.56rem;
            line-height: 1rem;
          }
        }
      }

      .btnSpace {
        width: 100%;
        position: relative;

        .btnSpace_1 {
          position: absolute;
          left: 0;
          width: 50%;
          top: 50%;
          transform: translateY(-50%);
        }

        .btnSpace_2 {
          position: absolute;
          right: 0;
          width: 50%;
          top: 50%;
          transform: translateY(-50%);
        }

        span {
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          display: inline-block;
          background-image: url("../../assets/images/b_btn_lamp_1.png");
          background-size: cover;
          border-radius: 0.2rem;
          line-height: 2rem;
          text-align: center;
          width: 6rem;
          height: 2rem;
          font-size: 0.72rem;
          color: #885022;
        }

        /*.onlineLamp {*/
        /*  background-image: url("../../assets/images/b_btn_search.png");*/
        /*  background-size: cover;*/
        /*  !*margin: 1.2rem 2.48rem;*!*/
        /*  width: 10.04rem;*/
        /*  height: 2rem;*/
        /*  !*background-color: #00B1E4;*!*/
        /*  line-height: 2rem;*/
        /*  text-align: center;*/
        /*  color: #885022;*/
        /*  font-size: 0.72rem;*/
        /*  position: absolute;*/
        /*  top: 50%;*/
        /*  transform: translate(-50%, -50%);*/
        /*  !*transform: translateX(-50%);*!*/
        /*  left: 50%;*/
        /*  border-radius: 0.2rem;*/
        /*}*/
      }
    }

    .noTemp {
      position: relative;
      overflow: hidden;

      .selectImg {
        width: 7.28rem;
        height: 7.2rem;
        /*margin: 1.48rem 3.24rem 2.32rem 3.96rem;*/
        position: relative;
        left: 50%;
        margin-top: 1.48rem;
        transform: translateX(-50%);
        background-image: url("../../assets/images/b_default_t.png");
        background-size: cover;
      }

      .content {
        font-size: 0.56rem;
        color: #999999;
        /*margin: 0 4rem;*/
        position: relative;
        left: 50%;
        margin-top: 2.32rem;
        transform: translateX(-50%);
        text-align: center;
      }

      .selectTemp {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 10.04rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        background-image: url("../../assets/images/b_btn_search.png");
        background-size: 100%;
        color: #885022;
        font-size: 0.72rem;
      }
    }
    .my-swipe {
      width:100%;
      height: 6.8rem;
    }
     .van-swipe-item {
      height: 6.8rem;
      overflow: hidden;
      display: inline-block;
       .img {
         width: 100%;
         height: 6.8rem;
       }
    }
  }
</style>
