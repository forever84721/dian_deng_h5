<template>
  <div class="donate">
    <van-nav-bar
      :title="$t('m.donateMoney')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bgImg"></div>
    <div class="donateMoney">
      <p>
        金额 (元)
      </p>
      <div class="money">
        ￥<input type="text" v-model="donateMoney" placeholder="请输入您要捐赠的金额" @input="inputNum(donateMoney)">
      </div>
    </div>
    <div class="error">
      {{errorMsg}}
    </div>

    <div class="submit" @click="showPay">
      {{$t('m.donateMoney')}}
    </div>

    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="top">
        <img src="../../assets/images/d_ic_close.png" alt="" @click="closePay">
        <span>捐赠</span>
      </div>
      <p class="p1">￥{{donateMoney}}</p>

      <div class="way">
        <div class="title">支付方式</div>
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
            <van-cell title="LINE支付" clickable v-if="weixinShow">
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
        <div class="nowDonate" @click="goResult">
          立即捐赠
        </div>
      </div>
    </van-popup>

    <van-dialog v-model="isDonateSuccessShow"  :show-cancel-button="false" :showConfirmButton="false" class="isPay">
      <template slot="default">
        <div class="problem">
          请确认{{radio === '1' ? '微信支付' : ''}}是否已经完成
          <van-icon name="close" class="close" @click="closeIsPay"/>
        </div>
        <van-divider />
        <div class="complete" @click="searchResult('ok')">
          已完成支付
        </div>
        <van-divider />
        <div class="noComplete" @click="searchResult('mistake')">
          支付遇到问题，重新支付
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  import {post} from '@/utils/request/index'
  import {Dialog} from "vant";

  export default {
    name: 'help',
    data() {
      return {
        value: '',
        show: false,
        donateMoney: '',
        radio: '1',
        Icon1: require('../../assets/images/d_wa.png'),
        Icon2: require('../../assets/images/d_ec.png'),
        Icon3: require('../../assets/images/d_li.png'),
        maxDonateMoney: '', // 最大捐赠金额
        errorMsg:'',
        isDonateSuccessShow:false,
        openId:'',
        userCode:'',
        weixinShow: true,
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      closeIsPay(){
        this.isDonateSuccessShow = false;
        post('api/pay/orderQuery',{
          "orderId": JSON.parse(window.sessionStorage.getItem('donateOrderId')),
          "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
        },res => {
          console.log(res);
          if(res.data.code ===200){
            if(res.data.data){
              this.$toast('支付成功');
              this.$router.push({path: '/donateSuccess'});
            }else {
              this.$toast('支付失败');
              this.isDonateSuccessShow = false;
            }
          }
        })
      },
      searchResult(type){
        if(type === 'ok'){
          post('api/pay/orderQuery',{
            "orderId": JSON.parse(window.sessionStorage.getItem('donateOrderId')),
            "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
          },res => {
            console.log(res);
            if(res.data.code ===200){
              if(res.data.data){
                this.$toast('支付成功');
                this.$router.push({path: '/donateSuccess'});
              }else {
                this.$toast('支付失败');
                this.isDonateSuccessShow = false;
              }
            }
          })
        }else {
          post('api/pay/orderQuery',{
            "orderId": JSON.parse(window.sessionStorage.getItem('donateOrderId')),
            "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
          },res => {
            console.log(res);
            if(res.data.code ===200){
              if(res.data.data){
                this.$toast('您已支付成功,请勿重复支付');
                this.$router.push({path: '/donateSuccess'});
              }else {
                // this.nowPay();
                this.isDonateSuccessShow = false;
              }
            }
          })
        }
      },
      showPay() {
        if (this.donateMoney.trim().length === 0) {
          this.$toast('请输入捐赠金额');
          return false;
        }
        let regx = /^(\d+\.?)?\d{0,2}$/;
        if (!regx.test(this.donateMoney)) {
          // console.log(1);
          this.errorMsg = '您输入的金额格式有误，请重新输入';
          this.donateMoney='';
          return  false;
        }
        if (this.donateMoney.slice(0, 1) === '0') {
          // console.log(2);
          this.donateMoney='';
          this.errorMsg = '您输入的金额格式有误，请重新输入';
          return  false;
        }
        if (this.donateMoney > this.maxDonateMoney) {
          this.$toast('超出单次最大捐赠金额，请重新输入金额');
          this.donateMoney = '';
          return false;
        }
        this.errorMsg = '';
        this.show = true;
      },
      closePay() {
        this.show = false;
      },
      //微信浏览器支付
      wxPay(param){
        let that = this;
        let pay_params = {
          timeStamp : param.timeStamp,
          package : param.package,
          appId : param.appId,
          paySign : param.sign,
          signType : param.signType,
          nonceStr : param.nonceStr
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
        // if (typeof WeixinJSBridge == "undefined"){
        //   if( document.addEventListener ){
        //     document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        //   }else if (document.attachEvent){
        //     document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
        //     document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        //   }
        // }else{
        //   this.onBridgeReady(pay_params);
        // }
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
          function(res){
            console.log(res);
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
              that.$toast('支付成功');
              that.$router.push({path: '/donateSuccess'});
            }else {
              that.$toast('支付失败');
            }
          });
      },
      goResult() {
        console.log(parseInt(this.donateMoney));
        console.log(this.radio)
        // return false;
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
                      post('api/pay/donate',{
                        "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
                        "type": 'jsapi',
                        "deposit": Number(this.donateMoney),
                        "openId": this.openId
                      },res1 => {
                        console.log(res1);
                        if(res1.data.code === 200){
                          this.wxPay(res1.data.data);
                        }
                      })
                    }
                  });
                } else {
                  if (this.openId !== '') {
                    post('api/pay/donate',{
                      "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
                      "type": 'jsapi',
                      "deposit": Number(this.donateMoney),
                      "openId": this.openId
                    },res1 => {
                      console.log(res1);
                      if(res1.data.code === 200){
                        this.wxPay(res1.data.data);
                      }
                    })
                  } else {
                    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fdonate%3Fmoney%3D'+this.donateMoney+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                  }
                }
              }
            })
            // post('api/user/getOpenIdByUser', {}, res => {
            //   console.log(res);
            //   // this.$toast(res);
            //   if (res.data.code === 200) {
            //     this.openId = res.data.data;
            //     post('api/pay/donate',{
            //       "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
            //       "type": 'jsapi',
            //       "deposit": this.money,
            //       "openId": this.openId
            //     },res1 => {
            //       console.log(res1);
            //       if(res1.data.code === 200){
            //         this.wxPay(res1.data.data);
            //       }
            //     })
            //   }
            // })
          }else {
            post('api/pay/donate',{
              "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
              "deposit": Number(this.donateMoney),
              "type": "h5",
              "openId": ""
            } , res => {
              console.log(res);
              // return false;
              if (res.data.code === 200) {
                // this.$router.push('/donateSuccess');
                // http%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fdonate%26origin%3D1
                window.sessionStorage.setItem('donateOrderId',JSON.stringify(res.data.data.orderId));
                location.href = res.data.data.mwebUrl+'&redirect_url=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fdonate%3Forigin%3D1'
              }
            })
          }
        } else if (this.radio === '3'){
          post('api/beneficiary/encryptionKeyAndSecret', {
            "templeId": JSON.parse(localStorage.getItem('selectTempData')).id
          }, res1 => {
            console.log('encry', res1)
            post('line/pay/linePayDonate' ,{
              "deposit": Number(this.donateMoney),
              "accountId": JSON.parse(localStorage.getItem("userMsg")).id  ,
              "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
              "channelId": res1.data.data.appKey,
              "secretKey": res1.data.data.appSecret,
            }, res => {
              console.log(res.data)
              location.href = res.data.info.paymentUrl.web
            })
          })

        } else if(this.radio === '2'){
          post('api/pay/ecPay',
            {
              "deposit": Number(this.donateMoney),
              "accountId": JSON.parse(localStorage.getItem("userMsg")).id  ,
              "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
            }, res=> {
              const div = document.createElement('div')
              div.innerHTML = res.data.data
              document.appendChild(div)
              div.id = 'payDiv'
              document.getElementById('payDiv').getElementsByTagName('form')[0].submit()
            })
        }else{
          this.$toast('请选择支付方式');
        }
      },
      //input输入框只能输入数字和 小数点后两位
      inputNum(val) {
        // console.log(val);
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
    mounted() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        this.weixinShow = false
      }
      console.log(location.href);
      if(location.href.indexOf('origin') !== -1){
        // this.$toast(1);
        this.isDonateSuccessShow = true;
      }
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
                    if (JSON.parse(res2.data.data).errcode == 40163 || JSON.parse(res2.data.data).errcode == 40029) {
                      // this.$toast('请重新发起支付');
                      return false;
                    }
                    this.openId = JSON.parse(res2.data.data).openid;
                    post('api/pay/donate',{
                      "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
                      "type": 'jsapi',
                      "deposit": this.$route.query.money,
                      "openId": this.openId
                    },res1 => {
                      console.log(res1);
                      if(res1.data.code === 200){
                        this.wxPay(res1.data.data);
                      }
                    })
                  }
                }
              )
            }
          }
        });
      }
      //获取line的订单状态，跳转页面
      if (location.href.indexOf('transactionId' ) !== -1) {
        // let transactionId = this.$route.query.transactionId
        let param = {
          "transactionId": this.$route.query.transactionId,
          "money": this.$route.query.money,
          "accountId": JSON.parse(localStorage.getItem('userMsg')).id,
          "templeId": JSON.parse(localStorage.getItem('selectTempData')).id,
        }
        post ('api/order/linePayDonateConfirm', param, res => {
          console.log(res)
          if (res.data.data === true) {
            this.$toast("捐赠成功")
            this.$router.push('/donateSuccess')
          }else {
            this.$toast("捐赠失败")
          }
        })
      }
      // 获取单次所能捐赠的最大金额
      post('api/configuration/findByTempleId', {templeId: JSON.parse(localStorage.getItem('selectTempData')).id}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.maxDonateMoney = res.data.data.maxDonateAmount;
        }
      })
    },
    updated() {
      if (this.radio === '3') {
        if (localStorage.getItem('environment') === 'weixin') {
          Dialog.alert({
            message: ' 由于微信浏览器的限制，请在第三方浏览器打开该页面，完成line支付（步骤:点击右上角的按钮，然后点击在浏览器中打开）',
          }).then(() => {
            this.radio = '1'
          });

        }
      }
    },
  }
</script>

<style scoped lang="less">
  .donate {
    .bgImg {
      width: 100vw;
      height: 6.8rem;
      background-image: url("../../assets/images/b_pic_foxiang.png");
      background-size: cover;
    }

    .donateMoney {
      overflow: hidden;
      width: 15rem;
      height: 4.56rem;
      /*background-color: #00B1E4;*/
      font-size: 0.56rem;
      box-sizing: border-box;

      p {
        margin-top: 1.12rem;
        margin-bottom: 0.88rem;
        text-indent: 0.92rem;
      }

      .money {
        padding-left: 0.92rem;

        input {
          margin-left: 0.2rem;
          display: inline-block;
          height: 1.6rem;
          border: 0;
          font-size: 0.56rem;
          width: 80%;
        }
      }
    }

    .error {
      font-size:  0.56rem;
      color: red;
      margin-left: 0.92rem;
    }

    .submit {
      width: 13.08rem;
      height: 2rem;
      background-image: url("../../assets/images/b_btn_thankmylamp.png");
      background-size: cover;
      line-height: 2rem;
      text-align: center;
      font-size: 0.72rem;
      color: #885022;
      position: fixed;
      bottom: 1.6rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .top {
      height: 1.92rem;
      line-height: 1.92rem;
      border-bottom: 1px solid #F5F5F5;
      position: relative;

      img {
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

    .br {
      width: 100%;
      height: 0.04rem;
      background-color: rgba(153, 153, 153, 1);
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
    }

    .isPay {
      .van-divider {
        margin: 0;
      }
      .problem,.complete,.noComplete {
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
          right: 0.6rem;
          top: 50%;
          font-size: 0.8rem;
          transform: translateY(-50%);
        }
      }
      .complete,.noComplete {
        font-size: 0.56rem;
      }
    }
  }
</style>
