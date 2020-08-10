<template>
  <div class="light-detail">
    <van-nav-bar
      :title="$t('m.brightLampDetail')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="container">
      <div class="top">
<!--        <img :src="'https://wenxuanguangmingdeng.com/attachment/'+lightDetail.lampCategoryImage" alt="">-->
        <van-swipe class="my-swipe" :autoplay="3000" indicator="white">
          <van-swipe-item v-for=" (image,index) in this.lightUrl" :key="index"  >
            <img :src="'https://wenxuanguangmingdeng.com/attachment/'+ image">
<!--            <div>{{image[index]}}</div>-->
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="welcome">
        <p class="title">{{lightDetail.lampCategoryName}}</p>
        <div class="content">
          <p>{{lightDetail.pilgrimRealName}}，祝您{{lightDetail.lampStandBlessing}}</p>
          <!--          <p>{{$t('m.lightDetailPage.bless')}}</p>-->
        </div>
      </div>
      <div class="br"></div>
      <div class="lampMessage">
        <div class="text">
          <span class="s1"></span>
          <span class="s3">{{$t('m.lightDetailPage.lightMessage')}}</span>
          <span class="s2"></span>
        </div>
        <div class="main">
          <p><span>香客:</span>{{lightDetail.pilgrimRealName}}</p>
          <p><span>{{$t('m.lightDetailPage.findNum')}}:</span>{{lightDetail.number}}</p>
          <p><span>所在位置:</span>{{lightDetail.seat}}</p>
          <!--          <p><span>{{$t('m.lightDetailPage.begin_end_Time')}}:</span>{{lightDetail.startLightAt.substr(0,10)}}~{{lightDetail.endLightAt.substr(0,10)}}-->
          <!--          </p>-->
          <p class="main_1"><span>{{$t('m.lightDetailPage.lightStatus')}}:</span>
            <span class="lampStatus" style="margin-top: 0.08rem" v-if="lightDetail.healthStatue === 'normal'">正常</span>
            <span class="lampStatus" style="margin-top: 0.08rem" v-if="lightDetail.healthStatue === 'anomaly'">异常</span>
            <span class="lampStatus" style="margin-top: 0.08rem"
                  v-if="lightDetail.healthStatue === 'maintenance'">维修中</span>
          </p>
          <div><span>{{$t('m.lightDetailPage.endTime')}}:</span>{{lightDetail.endLightAt}}<span
            class="continueLamp" @click="renew">续灯</span>
          </div>
        </div>
        <div class="footer" v-if="!isPase">
          <div class="seeMovie" @click="seeMovie">{{$t('m.lightDetailPage.seeMovie')}}</div>
          <div class="findLamp" @click="showPopup" id="findLight">{{$t('m.lightDetailPage.findLight')}}</div>
        </div>
        <div class="pase" v-if="isPase">
          已过期
        </div>
        <div class="shade" v-if="isPase"></div>
      </div>

      <!--  实时影像窗口   -->
      <van-overlay :show="movieShow" z-index="0" />
      <van-popup v-model = 'movieShow' :overlay="false" >
        <div class="moviePopup">
          <video id="myVideo"
                 class="video-js vjs-default-skin vjs-big-play-centered"
                 autoplay
                 controls
                 muted
                 preload="auto"
                 style="width:100%; height: 70%"

          >
<!--            <source src="http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8"  type="application/x-mpegURL"/>-->
            <source  :src="seeMovieUrl" type="application/x-mpegURL"/>
          </video>
        </div>

      </van-popup>
      <div class="closeMovie" v-if="movieShow" >
        <div style="margin: 1rem" @click="closeMoviePopup"><img  src="../../assets/images/c_btn_close.png" alt="">
          <p style="font-size: 0.64rem;text-align: center;color: #323233;margin-left: 0.1rem">{{movieTotalTime}}s</p></div>
        <div class="movieLamp" @click="showMusicStrat">{{$t('m.lightDetailPage.findLight')}}</div>
      </div>

<!--      <van-popup v-model="movieShow" overlay>-->
<!--        <div class="moviePopup">-->
<!--&lt;!&ndash;          <video src="http://hls01open.ys7.com/openlive/temp.hd.m3u8?t=JquXRnYe1oLKDVEcCBEAgnza-PBOMezeV0FJMuqJiT-BAvH6SH3NyEO40Dur5mCe"&ndash;&gt;-->
<!--&lt;!&ndash;          controls&ndash;&gt;-->
<!--&lt;!&ndash;          autoplay>&ndash;&gt;-->
<!--&lt;!&ndash;          </video>&ndash;&gt;-->
<!--          <video id="muVideo" class="video-js vjs-default-skin vjs-big-play-centered"-->
<!--          controls-->
<!--          preload="auto"-->
<!--          >-->
<!--            <source id="source" src="http://hls01open.ys7.com/openlive/2f3fd91a2f7542498df4e53cca388191.hd.m3u8"  type="apalication/x-mpegURL"/>-->
<!--          </video>-->
<!--        </div>-->
<!--      </van-popup>-->

      <!--  续灯弹窗    -->
      <van-popup v-model="dialogShow" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="dialogShow = false"
          @confirm="onConfirm"
          :default-index="0
"
          title="请选择续灯的时间"
        />
      </van-popup>
    </div>

    <!--  音乐播放  -->
    <audio :src="yyUrl" @ended="wordsEnd" id="welcome"></audio>
<!--    <audio src="http://47.96.71.160/attachment/music.mp3" id="wish" loop></audio>-->
    <!--  寻灯弹窗  -->
    <van-popup v-model="isShow" @close="closePopup" >
      <div class="findLamp">
        <div class="logo">
          <img :src="'https://wenxuanguangmingdeng.com/attachment/'+lightDetail.lampCategoryImage" alt="" class="lampImg">
          <img src="../../assets/images/c_sh_1.png" alt="" v-if="isPlay" data-play="play"
               @click="changePlayImg($event)" id="play_1">
          <img src="../../assets/images/c_sh_2.png" alt="" v-if="!isPlay" data-play="noplay"
               @click="changePlayImg($event)" id="play_2">
        </div>
        <div class="message">
          <p class="p_name">{{lightDetail.pilgrimRealName}}</p>
          <p>祝您{{lightDetail.lampStandBlessing}}</p>
        </div>
        <div class="userMessage">
          <p>寻灯编号:<span style="margin-left: 0.4rem">{{lightDetail.number}}</span></p>
          <p>灯位:<span style="margin-left: 0.4rem">{{lightDetail.seat}}</span><span class="status">寻灯中</span></p>
        </div>
      </div>
    </van-popup>
    <div class="close" v-if="isShow" @click="closePopup">
      <img src="../../assets/images/c_btn_close.png" alt="">
      <p style="font-size: 0.64rem;text-align: center;color: #323233;margin-left: 0.1rem">{{totalTime}}s</p>
    </div>


    <!-- 支付弹窗 -->
    <van-popup
      v-model="payShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="top">
        <!--        <img src="../../assets/images/d_ic_close.png" alt="" @click="closePay">-->
        <van-icon name="arrow-left" @click="closePay"/>
        <span>续灯</span>
      </div>
      <p class="p1">￥{{needMoney}}</p>

      <div class="way">
        <div class="title">选择支付方式</div>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell title="微信支付" clickable>
              <template slot="icon">
                <div class="iconWay">
                  <img src="../../assets/images/weiXin.png" alt="">
                </div>
              </template>
              <van-radio slot="right-icon" name="1" checked-color="#9D3024">
              </van-radio>
            </van-cell>
            <van-cell title="绿界支付" clickable>
              <template slot="icon">
                <div class="iconWay">
                  <img src="../../assets/images/pay.png" alt="">
                </div>
              </template>
              <van-radio slot="right-icon" name="2" checked-color="#9D3024">
              </van-radio>
            </van-cell>
            <van-cell title="LINE支付" clickable>
              <template slot="icon">
                <div class="iconWay">
                  <img src="../../assets/images/line.png" alt="">
                </div>
              </template>
              <van-radio slot="right-icon" name="3" checked-color="#9D3024">
              </van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="nowDonate" @click="nowPay">
          确认支付
        </div>
      </div>
    </van-popup>

    <van-dialog v-model="isPaySuccessShow" :show-cancel-button="false" :showConfirmButton="false" class="isPay">
      <template slot="default">
        <div class="problem">
          请确认{{radio === '1' ? '微信支付' : ''}}是否已经完成
          <van-icon name="close" class="close" @click="closeIsPay"/>
        </div>
        <van-divider/>
        <div class="complete" @click="searchResult('ok')">
          已完成支付
        </div>
        <van-divider/>
        <div class="noComplete" @click="searchResult('mistake')">
          支付遇到问题，重新支付
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script>
  import {post} from "../../utils/request";
  import {Toast} from 'vant'
  import {Popup} from 'vant';
  import '../../assets/css/topNav.css'
  // import '../../assets/js/ezuikit.js'
  import videojs from "video.js"
  import 'video.js/dist/video-js.css'
  import 'videojs-contrib-hls'

  export default {
    name: "index",
    data() {
      return {
        isShow: false, // 控制寻灯对话框的显示与隐藏
        lightDetail: {},
        yyUrl: "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI('结束了谢谢'),
        code: '', // 寻灯编号
        lampId: '', // 灯种ID
        totalTime: 0, // 设置寻灯弹窗的显示时间
        movieTime: '', //实时影像定时器ID
        cutTime: '', // 寻灯定时器ID
        dialogShow: false, // 寻灯弹窗
        columns: [], // 续灯选项
        payShow: false, // 支付弹窗的显示与隐藏
        radio: '1', // 默认选中的支付方式
        needMoney: 0, //续灯所需要的的金额
        isPlay: true, //控制当前显示是否播放音乐的图片
        isPlayMusic: true, // 控制当前是否播放音乐，默认为播放
        isWelcomeWordsEnd: false, // 欢迎语是否播放完毕
        // isBgmEnd:false, // 背景音乐是否播放完毕
        welcomeNum: 1, // 欢迎语播放次数
        lampSelect: [], //灯的规格
        dayArr: [], // 天数数组
        days: '', // 续灯天数
        isPase: false, // 判断当前是否过期
        isPaySuccessShow: false, // 是否支付成功对话框
        openId: '',
        userCode:'',
        movieShow: false, //是否展示实时视频窗口
        seeMovieUrl: '',  //实时视频的url数据
        posterSrc:'',//实时视频的封面图URL
        urlData: '',
        movieTotalTime: '',//設置影像視頻的顯示時間
        lampCategoryId: '',
        lightUrl: ''//轮播图图片地址
      }
    },

    methods: {
      // 关闭查询支付结果弹窗
      closeIsPay() {
        this.isPaySuccessShow = false;
        post('api/pay/orderQuery', {
          "orderId": JSON.parse(window.sessionStorage.getItem('renewOrderId')),
          "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id
        }, res => {
          console.log(res);
          if (res.data.code === 200) {
            if (res.data.data) {
              this.$toast('支付成功');
              this.$router.push({path: '/myBrightLamp'});
            } else {
              this.$toast('支付失败');
              this.$router.push({path: '/myBrightLamp'});
            }
          }
        })
      },
      // 查询支付结果
      searchResult(type) {
        if (type === 'ok') {
          post('api/pay/orderQuery', {
            "orderId": JSON.parse(window.sessionStorage.getItem('renewOrderId')),
            "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              if (res.data.data) {
                this.$toast('支付成功');
                this.$router.push({path: '/myBrightLamp'});
              } else {
                this.$toast('支付失败');
                this.$router.push({path: '/myBrightLamp'});
              }
            }
          })
        } else {
          post('api/pay/orderQuery', {
            "orderId": JSON.parse(window.sessionStorage.getItem('renewOrderId')),
            "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              if (res.data.data) {
                this.$toast('您已支付成功,请勿重复支付');
                this.$router.push({path: '/myBrightLamp'});
              } else {
                // this.nowPay();
                this.isPaySuccessShow = false;
              }
            }
          })
        }
      },
      //微信浏览器支付
      wxPay(param) {
        let that = this;
        let pay_params = {
          timeStamp: param.timeStamp,
          package: param.package,
          appId: param.appId,
          paySign: param.sign,
          signType: param.signType,
          nonceStr: param.nonceStr
        }
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', function () {
              that.onBridgeReady(pay_params);
            }, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', function () {
              that.onBridgeReady(pay_params);
            });
            document.attachEvent('onWeixinJSBridgeReady', function () {
              that.onBridgeReady(pay_params);
            });
          }
        } else {
          that.onBridgeReady(pay_params);
        }
      },
      onBridgeReady(params) {
        let that = this;
        const pay_params = params;
        console.log(params);
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": pay_params.appId,  //公众号名称，由商户传入
            "timeStamp": pay_params.timeStamp,  //时间戳，自1970年以来的秒数
            "nonceStr": pay_params.nonceStr,  //随机串
            "package": pay_params.package,
            "signType": 'MD5',  //微信签名方式：
            "paySign": pay_params.paySign  //微信签名
          },
          function (res) {
            console.log(res);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              that.$toast('续灯成功');
              that.$router.push({path: '/myBrightLamp'});
            } else {
              that.$toast('续灯失败');
              that.$router.push({path: '/myBrightLamp'});
            }
          });
      },
      // 立即支付
      nowPay() {
        // 检查是否满足续灯的条件
        post('api/order/checkIsRenewable', {
          lampId: this.$route.query.id,
          userId: JSON.parse(window.localStorage.getItem('selectTempData')).userId
        }, res => {
          console.log(res);
          if (res.data.code === 200) {
            if (this.radio === '1') {
              let browserInfo = navigator.userAgent.toLowerCase();
              if (browserInfo.match(/MicroMessenger/i) == 'micromessenger') {
                post('api/user/getLoginType', {}, res => {
                  if (res.data.code === 200) {
                    if (res.data.data === "wx") {
                      post('api/user/getOpenIdByUser', {}, res2 => {
                        console.log(res2);
                        // this.$toast(res);
                        if (res2.data.code === 200) {
                          this.openId = res2.data.data;
                          post('api/pay/renewPay', {
                            "pilgrimId": this.$route.query.pilgrimId,
                            "deposit": Number(this.needMoney),
                            "durationQuantity": this.days,
                            "type": "jsapi",
                            "openId": this.openId,
                            "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
                          }, res1 => {
                            console.log(res1);
                            if (res1.data.code === 200) {
                              this.wxPay(res1.data.data);
                            }
                          })
                        }
                      });
                    } else {
                      if (this.openId !== '') {
                        post('api/pay/renewPay', {
                          "pilgrimId": this.$route.query.pilgrimId,
                          "deposit": Number(this.needMoney),
                          "durationQuantity": this.days,
                          "type": "jsapi",
                          "openId": this.openId,
                          "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
                        }, res1 => {
                          console.log(res1);
                          if (res1.data.code === 200) {
                            this.wxPay(res1.data.data);
                          }
                        })
                      } else {
                        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2FlightDetail%3Fid%3D'+this.$route.query.id+'%26pilgrimId%3D'+this.$route.query.pilgrimId+'%26money%3D'+this.needMoney+'%26durationQuantity%3D'+this.days+'+&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                      }
                    }
                  }
                })
                // post('api/user/getOpenIdByUser', {}, res => {
                //   console.log(res);
                //   // this.$toast(res);
                //   if (res.data.code === 200) {
                //     this.openId = res.data.data;
                //     post('api/pay/renewPay',{
                //       "pilgrimId": this.$route.query.pilgrimId,
                //       "deposit": Number(this.needMoney),
                //       "durationQuantity": this.days,
                //       "type": "jsapi",
                //       "openId": this.openId
                //     },res1 => {
                //       console.log(res1);
                //       if(res1.data.code === 200){
                //         this.wxPay(res1.data.data);
                //       }
                //     })
                //   } else {
                //     location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=http%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fpay&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                //   }
                // })
              } else {
                post('api/pay/renewPay', {
                  "pilgrimId": this.$route.query.pilgrimId,
                  "deposit": Number(this.needMoney),
                  "durationQuantity": this.days,
                  "type": "h5",
                  "openId": "",
                  "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
                }, res => {
                  console.log(res);
                  // return false;
                  if (res.data.code === 200) {
                    location.href = res.data.data.mwebUrl + '&redirect_url=' + 'https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2FlightDetail%3Fid%3D' + this.$route.query.id + '%26pilgrimId%3D' + this.$route.query.pilgrimId + '%26origin%3D1%26orderId%3D' + res.data.data.orderId;
                    window.sessionStorage.setItem('renewOrderId', JSON.stringify(res.data.data.orderId));
                  }
                });
              }
            } else {
              this.$toast('该支付方式暂未开放，请重新选择支付方式');
            }
          } else {
            this.$toast('该灯位已被占用~');
          }
        });
      },
      // 关闭支付
      closePay() {
        this.payShow = false;
      },
      // 确认续灯的时长
      onConfirm(value, index) {
        this.dialogShow = false;
        this.payShow = true;
        this.days = this.dayArr[index];
        console.log(value);
        console.log(index);
        this.needMoney = value.split('￥')[1];
        console.log(this.days, Number(this.needMoney));
      },
      // 观看实时影象

      seeMovie() {
        Toast.setDefaultOptions({duration: 10000});
        // this.getVideo()
        this.getWebSocket();
        // setTimeout(() =>{
        //   console.log('77'+ this.seeMovieUrl)
        // },0)


        Toast({
          message: '正在排队中...',
          icon: 'like-o',
          duration: 2000
        });

        setTimeout(()=> {
          // this.getViewList();
          console.log('77'+ this.seeMovieUrl)
          this.movieShow = true;

          //this.save()
          console.log(this.movieTotalTime)
          clearInterval(this.movieCutTime);
          this.movieCutTime = setInterval(() => {
            this.movieTotalTime--;
            if (this.movieTotalTime <= 0) {
              this.movieShow = false;
              clearInterval(this.movieCutTime);
              //document.getElementById('wish').pause();
            }
          }, 1000);
        }, 2000);
        this.movieTotalTime = JSON.parse(window.sessionStorage.getItem('movieTotalTime'));

      },
      getWebSocket() {
        let _t = this
        const ws = new WebSocket("wss://www.wenxuanguangmingdeng.com/wss");
        console.log('開始鏈接')
        let wsData =  {
          "type": "LIVE",
          "id": 15382674,
          "templeId": 120,
          // "id":this.$route.query.id,
          // "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id,
          "userId": JSON.parse(window.localStorage.getItem('selectTempData')).userId
        }
        let wsDataString = JSON.stringify(wsData)
        console.log(wsDataString)
        ws.onopen = function () {
          // console.log('open')

          // ws.send({
          //   "type": "LIVE",
          //   "id":this.$route.query.id,
          //   "templeId": JSON.stringify(window.localStorage.getItem('selectTempData')).id,
          //   "userId": JSON.stringify(window.localStorage.getItem('selectTempData')).userId
          // })
          ws.send(wsDataString)
          console.log('數據發送中')

          };

        ws.onmessage = function (evt) {
          let url = evt.data;
          _t.seeMovieUrl = url
          console.log( _t)
          // let seeMovieObj = JSON.parse(this.seeMovieUrl)
          // getSeeMovieObj(seeMovieObj)
          console.log(_t.seeMovieUrl)
          console.log('數據已接收');
          //this.getVideo();
          _t.getViewList();
        };
        // let seeMovieObj = function actionSeeMovie(val) {
        //   this.seeMovieUrl = JSON.stringify(val)
        //   console.log(this.seeMovieUrl+ '111')
        // }
        // let getSeeMovieObj = seeMovieObj.bind(this);
        ws.onclose = function() {
          console.log('連接已關閉')
        }
        //this.seeMovieUrl = _t.seeMovieUrl
        //console.log('ll'+ this.seeMovieUrl)
      },


      //关闭影像窗口
      closeMoviePopup() {
        this.movieShow = false
        this.movieTotalTime = JSON.parse(window.sessionStorage.getItem('movieTotalTime'));
        clearInterval(this.movieCutTime);
        let param = {
          id:this.lightDetail.id
        }
        if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
              window.speechSynthesis.pause();
            }else {
              let welcomeWords = document.getElementById('welcome');
              welcomeWords.pause();
            }
        let bgm = document.getElementById('wish');
        bgm.pause();


        // if (!this.isPlayMusic) {
        //   // 暂停文字和背景音乐的播放
        //   if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        //     window.speechSynthesis.pause();
        //   }else {
        //     let welcomeWords = document.getElementById('welcome');
        //     welcomeWords.pause();
        //   }
        //   let bgm = document.getElementById('wish');
        //   bgm.pause();
        // } else {
        //   // 如果文字播报还没有播报完毕，继续播报欢迎文字
        //   if (this.welcomeNum === 1) {
        //     if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        //       window.speechSynthesis.resume();
        //     }else {
        //       let welcomeWords = document.getElementById('welcome');
        //       welcomeWords.play();
        //     }
        //   }
        //   // 如果文字播报已经完毕，播放背景音乐
        //   if (this.isWelcomeWordsEnd) {
        //     let bgm = document.getElementById('wish');
        //     bgm.play();
        //   }
        // }

        post('api/lamp/recoverCamera', {
          lamp: param
        }, res => {
          console.log(res)
        })
      },

      //配置video.jsVideo
      getVideo() {
        videojs("myVideo", {
          bigPlayButton: true,
          textTrackDisplay: false,
          errorDisplay: false,
          autoPlay: true,
          hls: {
            withCredentials: true
          }
        }, function () {
          this.play();
        })
        console.log('video2')
      },

      //请求数据，拿到视频流
      getViewList() {
        let _t = this

        //console.log(_t.lampCategoryId + '0000Video')
        let myPlayer = videojs('myVideo')
        myPlayer.src({
          type: 'application/x-mpegURL',
          src: 'seeMovieUrl'
        })
        console.log(this.seeMovieUrl)
        // post('api/lamp/getVideo', {
        //   // "deviceSerial": "D82674077",
        //   // "channelNo": "1",
        //   // "expireTime": "300"
        //   "id":this.$route.query.id,
        //   "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id
        //     },
        //   res => {
        //       let url = res.data.data
        //       this.seeMovieUrl = url
        //       //this.urlData =  this.seeMovieUrl.substring(0, this.seeMovieUrl.indexOf('?'))
        //       //console.log(this.seeMovieUrl)
        //       let myPlayer = videojs('myVideo')
        //       myPlayer.src({
        //         type: 'application/x-mpegURL',
        //         src: 'seeMovieUrl'
        //       })
        //     //myPlayer.play()
        // })
      },
      //请求数据，拿到视频流
      // getViewList() {
      //   post('api/cameraControl/getLiveBroadcastAddress', {
      //     "deviceSerial": "D82674077",
      //       "channelNo": "1",
      //       "expireTime": "300"
      //   }, res => {
      //     let url = res.data;
      //     this.seeMovieUrl = url;
      //     //console.log(this.seeMovieUrl.data)
      //     console.log(this.myVideo)
      //     this.myVideo.src({
      //       src:'http://hls01open.ys7.com/openlive/2f3fd91a2f7542498df4e53cca388191.hd.m3u8',
      //       type: 'application/x-mpegURL'
      //     })
      //   })
      // },

      // 点击续灯显示对话框
      renew() {
        post('api/order/checkIsRenewable', {
          lampId: this.$route.query.id,
          userId: JSON.parse(window.localStorage.getItem('selectTempData')).userId
        }, res => {
          console.log(res);
          // if (res.data.code === 200) {
          //   this.dialogShow = true;
          // } else {
          //   this.$toast('该灯位已被占用~');
          // }
          if(res.data.data === true) {
            this.dialogShow = true;
          }else {
            this.$toast('该灯位已被占用')
          }
        });
      },
      onClickLeft() {
        this.$router.go(-1)
      },
      //实时影像点灯寻灯音乐播放
      showMusicStrat() {
        let str = this.lightDetail.pilgrimRealName + '祝您' + this.lightDetail.lampStandBlessing;
        this.yyUrl = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
        //console.log(this.yyUrl)
        if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
          console.log('ios');
          if (this.isPlayMusic) {
            this.$nextTick(() => {
              // let welcomeWords = document.getElementById('welcome');
              // welcomeWords.load();
              // welcomeWords.play();
              let msg = new SpeechSynthesisUtterance(this.lightDetail.pilgrimRealName + '祝您' + this.lightDetail.lampStandBlessing);
              //console.log(msg)
              msg.lang = 'zh';
              msg.voice = speechSynthesis.getVoices().filter(function(voice) {
                return voice.name == 'Whisper';
              })[0];
              msg.onend = (event) => {  //语音合成结束时候的回调
                this.welcomeNum++;
                this.isWelcomeWordsEnd = true;
                console.log('欢迎语播放完毕');
                // let bgm = document.getElementById('wish');
                // bgm.load();
                // bgm.play();
              };
              speechSynthesis.resume();
              speechSynthesis.speak(msg);
            });
          }
          // return false;
        }else {
          if (this.isPlayMusic) {
            this.$nextTick(() => {
              let welcomeWords = document.getElementById('welcome');
              welcomeWords.load();
              welcomeWords.play();
            })
          }
          console.log('安卓')
        }

        if (this.welcomeNum === 1) {
              if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                window.speechSynthesis.resume();
              }else {
                let welcomeWords = document.getElementById('welcome');
                welcomeWords.play();
              }
            }
            // 如果文字播报已经完毕，播放背景音乐
            if (this.isWelcomeWordsEnd) {
              // let bgm = document.getElementById('wish');
              // bgm.play();
            }

      },
      // 展示寻灯弹窗
      showPopup() {
        this.isShow = true;
        this.movieShow = false;
        this.isWelcomeWordsEnd = false;
        this.isShow = true;
        let str = this.lightDetail.pilgrimRealName + '祝您' + this.lightDetail.lampStandBlessing;
        this.yyUrl = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
        clearInterval(this.cutTime);
        this.cutTime = setInterval(() => {
          this.totalTime--;
          if (this.totalTime <= 0) {
            this.isShow = false;
            clearInterval(this.cutTime);
          }
        }, 1000);
        // if (this.isPlayMusic) {
        //   this.$nextTick(() => {
        //     let welcomeWords = document.getElementById('welcome');
        //     welcomeWords.load();
        //     welcomeWords.play();
        //   });
        // }
        if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
          console.log('ios');
          if (this.isPlayMusic) {
            this.$nextTick(() => {
              // let welcomeWords = document.getElementById('welcome');
              // welcomeWords.load();
              // welcomeWords.play();
              let msg = new SpeechSynthesisUtterance(this.lightDetail.pilgrimRealName + '祝您' + this.lightDetail.lampStandBlessing);
              msg.lang = 'zh';
              msg.voice = speechSynthesis.getVoices().filter(function(voice) {
                return voice.name == 'Whisper';
              })[0];
              msg.onend = (event) => {  //语音合成结束时候的回调
                this.welcomeNum++;
                this.isWelcomeWordsEnd = true;
                console.log('欢迎语播放完毕');
                // let bgm = document.getElementById('wish');
                // bgm.load();
                // bgm.play();
              };
              speechSynthesis.resume();
              speechSynthesis.speak(msg);
            });
          }
          // return false;
        }else {
          if (this.isPlayMusic) {
            this.$nextTick(() => {
              let welcomeWords = document.getElementById('welcome');
              welcomeWords.load();
              welcomeWords.play();
            })
          }
          console.log('安卓')
        }
      },
      // 关闭寻灯弹窗
      closePopup() {
        this.welcomeNum = 1;
        this.isShow = false;
        this.totalTime = JSON.parse(window.sessionStorage.getItem('totalTime'));
        console.log(this.totalTime);
        // let welcomeWords = document.getElementById('welcome');
        // welcomeWords.load();
        this.$nextTick(() => {
          if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.speechSynthesis.resume();
          }else {
            let welcomeWords = document.getElementById('welcome');
            welcomeWords.load();
            welcomeWords.pause();
          }
        });
        this.$nextTick(() => {
          let bgm = document.getElementById('wish');
          bgm.load();
          bgm.pause();
        });
        clearInterval(this.cutTime);

      },
      //控制是否播放音乐
      changePlayImg(e) {
        this.isPlay = !this.isPlay;
        console.log(e.target.getAttribute('data-play'));
        // 变换样式图片
        if (e.target.getAttribute('data-play') !== 'play') {
          this.isPlayMusic = true;
        } else {
          this.isPlayMusic = false;
        }
        console.log(this.isPlayMusic);
        if (!this.isPlayMusic) {
          // 暂停文字和背景音乐的播放
          if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.speechSynthesis.pause();
          }else {
            let welcomeWords = document.getElementById('welcome');
            welcomeWords.pause();
          }
          let bgm = document.getElementById('wish');
          bgm.pause();
        } else {
          // 如果文字播报还没有播报完毕，继续播报欢迎文字
          if (this.welcomeNum === 1) {
            if(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
              window.speechSynthesis.resume();
            }else {
              let welcomeWords = document.getElementById('welcome');
              welcomeWords.play();
            }
          }
          // 如果文字播报已经完毕，播放背景音乐
          if (this.isWelcomeWordsEnd) {
            let bgm = document.getElementById('wish');
            bgm.play();
          }
        }
      },
      // 当文字语音播放完毕后播放背景音乐
      wordsEnd() {
        this.welcomeNum++;
        this.isWelcomeWordsEnd = true;
        console.log('欢迎语播放完毕');
        let bgm = document.getElementById('wish');
        bgm.load();
        bgm.play();
      },
      getvar(url, par) {
        let urlsearch = url.split('?');
        let pstr = urlsearch[1].split('&');
        for (let i = pstr.length - 1; i >= 0; i--) {
          let tep = pstr[i].split('=');
          if (tep[0] === par) {
            return tep[1];
          }
        }
        return -1;
      }
    },
    computed: {
      // poster() {
      //   return this.posterSrc ? this.posterSrc : require('../../assets/images/timg.jpg')
      // }
    },
    mounted() {
      console.log(new Date(new Date().toLocaleDateString()).getTime())
      // if (window.sessionStorage.getItem('payCount2')) {
      //   this.payCount2 = JSON.parse(window.sessionStorage.getItem('payCount2'));
      // }
      // this.$toast(location.href);
      if (location.href.indexOf('code') !== -1) {
        this.userCode = this.getvar(location.href, 'code');
        post('api/user/getLoginType', {}, res => {
          if (res.data.code === 200) {
            if (res.data.data === "phone") {
              post('api/user/getWechatOpenId',
                {
                  code: this.userCode,
                },
                res2 => {
                  // this.$toast(res);
                  if (res2.data.code === 200) {
                    if(JSON.parse(res2.data.data).errcode == 40163 || JSON.parse(res2.data.data).errcode == 40029){
                      // this.$toast('请重新发起支付');
                      return false;
                    }
                    this.openId = JSON.parse(res2.data.data).openid;
                    post('api/pay/renewPay', {
                      "pilgrimId": this.$route.query.pilgrimId,
                      "deposit": Number(this.$route.query.money),
                      "durationQuantity": this.$route.query.durationQuantity,
                      "type": "jsapi",
                      "openId": this.openId,
                      "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
                    }, res1 => {
                      console.log(res1);
                      if (res1.data.code === 200) {
                        this.wxPay(res1.data.data);
                      }
                    })
                  }
                }
              )
            }
          }
        });
        // post(
        //   'api/user/getWechatOpenId',
        //   {
        //     code: this.userCode,
        //   },
        //   res => {
        //     if (res.data.code === 200) {
        //       this.openId = res.data.data;
        //       post('api/user/updateOpenIdByToken', {"openId": this.openId}, res1 => {
        //         console.log(res1);
        //         this.$toast('请重新发起支付');
        //         this.payCount2 = 2;
        //         window.sessionStorage.setItem('payCount', JSON.stringify(this.payCount2));
        //       })
        //     }
        //   })
      }
      console.log(location.href);
      if (location.href.indexOf('origin') !== -1) {
        // this.$toast(1);
        this.isPaySuccessShow = true;
      }
      // 获取明灯详情
      post('api/lamp/findDtoById', {pilgrimId: this.$route.query.pilgrimId}, res => {
        console.log(res);
        this.lightDetail = res.data.data;
        this.lightUrl = []
        this.lightUrl = this.lightDetail.lampCategoryImage.split(',')
        console.log(this.lightUrl);
        // 对时间格式的处理，判断当前是否过期
        let currentTime = new Date().getTime();
        let endTime = new Date(this.lightDetail.endLightAt).getTime();
        console.log(currentTime, endTime);
        if (currentTime >= endTime) {
          this.isPase = true;
        }
        // 获取灯种规格
        post('api/lampGoods/findByLampId', {lampId: this.lightDetail.id}, res => {
          console.log(res);
          this.lampSelect = res.data.data;
          console.log(this.lampSelect);
          this.lampCategoryId = this.lampSelect[0].lampCategory.id
          //console.log(this.lampCategoryId);
          // 续灯选择器相关配置项的处理
          this.lampSelect.forEach((item, index) => {
            let price = '';
            if (!this.lightDetail.important) {
              price = item.standardPrice
            } else {
              price = item.vipPrice
            }
            let newItem = item.durationName + '￥' + price;
            this.columns = [];
            this.columns.push(newItem);
            console.log(this.columns);
            this.dayArr.push(item.durationQuantity);
          });
          console.log(this.columns);
          console.log(this.dayArr);
        });
      });
      // 获取寻灯弹窗的显示时间
      post('api/configuration/findByTempleId', {templeId: JSON.parse(window.localStorage.getItem('selectTempData')).id}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.totalTime = res.data.data.h5ShowWindowTime;
          this.movieTotalTime = res.data.data.showVideoTime
          console.log(this.movieTotalTime)
          window.sessionStorage.setItem('totalTime',JSON.stringify(this.totalTime));
          window.sessionStorage.setItem('movieTotalTime',JSON.stringify(this.movieTotalTime));
        }
      });
      if (this.isShow) {
        document.getElementById('findLight').addEventListener('touchstart', function () {
          if (this.isPlayMusic) {
            this.$nextTick(() => {
              let welcomeWords = document.getElementById('welcome');
              welcomeWords.load();
              welcomeWords.play();
            })
          }
        });

        document.getElementById('play_1').addEventListener('touchstart', function () {
          this.changePlayImg();
        });

        document.getElementById('play_2').addEventListener('touchstart', function () {
          this.changePlayImg();
        })
      }
      // this.getWebSocket();
      let _t = this;
      // this.getVideo()
      // setTimeout(() => {
      //   _t.getVideo();
      //   console.log('video1')
      // },300)
      // this.getViewList()
      // this.$nextTick(() => {
      //   this.getVideo();
      //   console.log('video1')
      // });
      // this.getViewList()
      videojs("myVideo", {
        bigPlayButton: true,
        textTrackDisplay: false,
        errorDisplay: false,
        autoPlay: true,
        hls: {
          withCredentials: true
        }
      }, function () {
        this.play();
      })
    },
    destroyed() {
      window.sessionStorage.removeItem('totalTime');
      window.sessionStorage.removeItem('movieTotalTime')
    }
  }
</script>

<style scoped lang="less">

  .br {
    height: 0.32rem;
    background-color: #F5F5F5;
    width: 100%;
  }

  .container {
    .top {
      width: 100%;
      height: 6.8rem;

      img {
        width: 100%;
        height: 6.8rem;
      }
    }

    .welcome {
      width: 100%;
      height: 4.2rem;
      /*background-color: #00B1E4;*/
      color: #885022;
      text-align: center;
      overflow: hidden;

      .title {
        font-size: 0.72rem;
        font-family: PingFangSC-Regular;
        margin-top: 0.88rem;
        margin-bottom: 0.4rem;
        font-weight: bold;
      }

      .content {
        font-size: 0.6rem;
        font-family: PingFangSC-Light;
      }
    }

    .text {
      position: relative;
      top: 0;
      text-align: center;

      span {
        box-sizing: border-box;
      }

      .s3 {
        font-size: 0.6rem;
        margin: 0 0.1rem;
      }

      .s1 {
        display: inline-block;
        height: 0.04rem;
        width: 1.32rem;
        border-bottom: 1px solid #666666;
        margin-bottom: 0.16rem;
      }

      .s2 {
        display: inline-block;
        height: 0.04rem;
        width: 1.32rem;
        border-bottom: 1px solid #666666;
        margin-bottom: 0.16rem;
      }
    }

    .main {
      font-size: 0.56rem;
      color: #666666;
      margin-top: 1rem;
      margin-left: 1.04rem;

      p {
        margin-bottom: 0.72rem;
      }

      .main_1 {
        margin-bottom: 0.72rem;
      }

      span {
        margin-right: 0.6rem;
      }

      .continueLamp {
        color: #EC3400;
        margin-left: 0.4rem;
      }

      .lampStatus {
        position: absolute;
        display: inline-block;
        width: 2rem;
        height: 0.64rem;
        text-align: center;
        line-height: 0.64rem;
        border-radius: 0.08rem;
        background-color: #5ac55a;
        font-size: 0.48rem;
        color: #ffffff;
      }
    }

    .footer {
      width: 13.84rem;
      height: 2rem;
      position: fixed;
      left: 50%;
      bottom: 1.16rem;
      transform: translateX(-50%);
      color: #885022;
      font-size: 0.72rem;

      div {
        float: left;
        width: 6.84rem;
        height: 2rem;
        background-image: url("../../assets/images/c_a_s.png");
        background-size: cover;
        text-align: center;
        line-height: 2rem;
      }

      .seeMovie {
        margin-right: 0.16rem;
      }
    }

    .pase {
      height: 2rem;
      width: 13.08rem;
      text-align: center;
      line-height: 2rem;
      background-image: url("../../assets/images/b_btn_pay.png");
      background-size: cover;
      border-radius: 0.2rem;
      position: absolute;
      bottom: 1.28rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.72rem;
      color: #885022;
    }

    .shade {
      height: 2rem;
      width: 13.08rem;
      position: absolute;
      bottom: 1.28rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: #999999;
      opacity: 0.4;
    }
  }

  .van-picker /deep/ .van-picker__toolbar /deep/ .van-picker__cancel, .van-picker /deep/ .van-picker__toolbar /deep/ .van-picker__confirm {
    padding: 0 16px;
    color: #885022;
    font-size: 14px;
  }

  .light-detail[data-v-17713bc0] .van-popup {
    background-color: #ffffff;
  }

  .top {
    height: 1.92rem;
    line-height: 1.92rem;
    border-bottom: 1px solid #F5F5F5;
    position: relative;

    .van-icon {
      margin-left: 0.6rem;
      margin-right: 5.2rem;
      vertical-align: middle;
      width: 0.68rem;
      height: 0.68rem;
    }

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }

    font-size: 0.72rem;
  }

  .p1 {
    font-size: 1.2rem;
    text-align: center;
    margin-top: 1.28rem;
  }

  .way {
    font-size: 14px;
    color: #333333;
    box-sizing: border-box;
    padding: 0 0.88rem;

    .title {
      margin-bottom: 0.8rem;
    }

    .iconWay {
      width: 1.84rem;

      img {
        width: 1.36rem;
        height: 0.88rem;
      }
    }
  }

  .nowDonate {
    width: 13.08rem;
    height: 2rem;
    background-image: url("../../assets/images/b_btn_thankmylamp.png");
    background-size: cover;
    line-height: 2rem;
    text-align: center;
    position: absolute;
    bottom: 0.64rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.72rem;
    color: #885022;
  }

  .moviePopup {
    width:13.08rem;
    height: auto;
  }

  .van-popup {
    border-radius: 0.4rem;

    .findLamp {
      position: relative;
      width: 12.4rem;
      height: 14.4rem;
      background-color: #ffffff;

      .logo {
        position: relative;
        width: 12.4rem;
        height: 6.04rem;
        /*background-image: url("../../assets/images/b_pic_statue.jpg");*/
        /*background-size: cover;*/

        .lampImg {
          width: 12.4rem;
          height: 6.04rem;
        }

        img {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 1.6rem;
          height: 1.6rem;
        }
      }

      .message {
        position: relative;
        left: 50%;
        top: 0.52rem;
        transform: translateX(-50%);
        width: 11.48rem;
        height: 3.56rem;
        background-image: url("../../assets/images/c_s_l_3.png");
        background-size: cover;
        overflow: hidden;

        p {
          color: #F7E280;
          font-size: 0.48rem;
          text-align: center;
          margin-bottom: 0.4rem;
        }

        .p_name {
          font-size: 0.6rem;
          margin-top: 0.2rem;
        }
      }

      .userMessage {
        width: 11.48rem;
        font-size: 0.56rem;
        position: relative;
        left: 50%;
        top: 1.92rem;
        transform: translateX(-50%);
        padding: 0 0.6rem;
        box-sizing: border-box;

        p {
          margin-bottom: 0.48rem;
          position: relative;
        }

        .status {
          /*float: right;*/
          position: absolute;
          right: 0;
          top: -1px;
          display: inline-block;
          width: 2rem;
          height: 0.8rem;
          line-height: 0.8rem;
          border-radius: 0.16rem;
          background-color: #D78D4C;
          color: white;
          font-size: 0.44rem;
          text-align: center;
        }
      }

      .close {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        img {
          width: 1.32rem;
          height: 1.32rem;
        }
      }
    }
  }

  .light-detail /deep/ .van-overlay {
    background-color: rgba(0, 0, 0, 0.2) !important;
  }


  .close {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 3.5rem;

    img {
      width: 1.32rem;
      height: 1.32rem;
    }
  }
  .closeMovie {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 4rem;
    background-color: rgba(255,255,255,0);
    img {
      width: 1.32rem;
      height: 1.32rem;
    }
  }

  .isPay {
    .van-divider {
      margin: 0;
    }

    .problem, .complete, .noComplete {
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      color: #885022;
    }

    .problem {
      font-size: 0.64rem;
      position: relative;

      .close {
        position: absolute;
        right: -4rem;
        top: 30%;
        font-size: 0.8rem;
        transform: translateY(-50%);
      }
    }

    .complete, .noComplete {
      font-size: 0.56rem;
    }
  }
  .movieLamp {
    width:3rem;
    height: 1rem;
    border-radius: 10%;
    background-color: #bf6c29;
    font-size: 16px;
    text-align: center;
  }

</style>
