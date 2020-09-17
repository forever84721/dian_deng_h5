<template>
  <div class="pay">
    <van-nav-bar
      title="支付"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="money">
      ￥{{money}}
    </div>
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
          <van-cell title="LINE支付" clickable v-if="wenxinShow">
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
    </div>

    <div class="confirmPay" @click="pay">
      确认支付
    </div>

<!--    <van-overlay :show="overlayShow" @click="overlayClick">-->
<!--      <template #default>-->
<!--        <div class="wrapper" @click.stop style="height:100px;width:100px;">-->
<!--          <div class="block" />-->
<!--          &lt;!&ndash;          由于微信浏览器的限制，请在第三方浏览器打开该页面，完成line支付（步骤点击右上角的按钮，然后点击在浏览器中打开）&ndash;&gt;-->
<!--        </div>-->
        <!--      <div>111</div>-->
<!--      </template>-->

<!--    </van-overlay>-->

    <van-dialog v-model="show" :show-cancel-button="false" :showConfirmButton="false" class="isPay">
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
  import '../../assets/css/topNav.css'
  import {post} from '@/utils/request/index'
  import {Dialog} from 'vant'

  export default {
    name: 'pay',
    data() {
      return {
        radio: '0',
        money: 0,
        orderId: '',
        show: false,
        openId: '',
        cellphone: '',
        overlayShow: false,
        wenxinShow: true,
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      closeIsPay() {
        this.show = false;
        post('api/pay/orderQuery', {
          "orderId": this.orderId
        }, res => {
          console.log(res);
          if (res.data.code === 200) {
            if (res.data.data) {
              this.$toast('支付成功');
              if(window.sessionStorage.getItem('orderInfo')){
                window.sessionStorage.removeItem('orderInfo');
              }
              window.sessionStorage.setItem('paySuccess', this.orderId);
              this.$router.push({path: '/blessMessage', query: {orderId: this.orderId}});
            } else {
              this.$toast('支付失败');
              this.$router.push({path: '/orderDetail', query: {orderId: this.orderId}});
            }
          }
        })
      },
      //查询支付结果
      searchResult(type) {
        // this.$router.push({path: '/blessMessage', query: {orderId: this.orderId}});
        if (type === 'ok') {
          post('api/pay/orderQuery', {
            "orderId": this.orderId
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              if (res.data.data) {
                this.$toast('支付成功');
                if(window.sessionStorage.getItem('orderInfo')){
                  window.sessionStorage.removeItem('orderInfo');
                }
                window.sessionStorage.setItem('paySuccess', this.orderId);
                this.$router.push({path: '/blessMessage', query: {orderId: this.orderId}});
              } else {
                this.$toast('支付失败');
                this.$router.push({path: '/orderDetail', query: {orderId: this.orderId}});
              }
            }
          })
        } else {
          post('api/pay/orderQuery', {
            "orderId": this.orderId
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              if (res.data.data) {
                this.$toast('您已支付成功,请勿重复支付');
                if(window.sessionStorage.getItem('orderInfo')){
                  window.sessionStorage.removeItem('orderInfo');
                }
                window.sessionStorage.setItem('paySuccess', this.orderId);
                this.$router.push({path: '/blessMessage', query: {orderId: this.orderId}});
              } else {
                this.pay();
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
        if (typeof WeixinJSBridge == "undefined"){
          if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', function (){
              that.onBridgeReady(pay_params);
            }, false);
          }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', function (){
              that.onBridgeReady(pay_params);
            });
            document.attachEvent('onWeixinJSBridgeReady', function (){
              that.onBridgeReady(pay_params);
            });
          }
        }else{
          that.onBridgeReady(pay_params);
        }
        // if (typeof WeixinJSBridge == "undefined") {
        //   if (document.addEventListener) {
        //     document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        //   } else if (document.attachEvent) {
        //     document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
        //     document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        //   }
        // } else {
        //   this.onBridgeReady(pay_params);
        // }
      },
      onBridgeReady(params) {
        // this.$router.push({path: '/blessMessage', query: {orderId: this.orderId}});
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
              that.$toast('支付成功');
              if(window.sessionStorage.getItem('orderInfo')){
                window.sessionStorage.removeItem('orderInfo');
              }
              // window.sessionStorage.setItem('paySuccess', that.orderId);
              window.sessionStorage.setItem('paySuccess', that.orderId);
              that.$router.push({path: '/blessMessage', query: {orderId: that.orderId}});
              // that.$router.push({path: '/blessMessage', query:{orderId: this.$route.query.orderId}})
            } else {
              that.$toast('支付失败');
              that.$router.push({path: '/orderDetail', query: {orderId: that.orderId}});
            }
          });
      },
      // test() {
      //   console.log('111')
      //   this.$router.push({path: '/blessMessage', query: {orderId: this.$route.query.orderId}});
      //   console.log('222')
      //
      // },
      // 支付
      pay() {
        // post('api/pay/paytest',{orderId:1,deposit:0.1},res => {
        //   console.log(res,res.data.data.mweb_url);
        //   location.href=res.data.data.mweb_url;
        // })
        // this.$router.push({path: '/blessMessage', query: {orderId: this.orderId}});


        if (window.sessionStorage.getItem('paySuccess') && String(window.sessionStorage.getItem('paySuccess')) === String(this.orderId)) {
          this.$toast('您已支付成功,请勿重复支付');
        }
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
                      post('api/pay/jspay', {
                        "type": 1,
                        "orderId": this.orderId,
                        "deposit": this.money,
                        "consumeType": "save",
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
                }else {
                  if(this.openId !== ''){
                    post('api/pay/jspay', {
                      "type": 1,
                      "orderId": this.orderId,
                      "deposit": this.money,
                      "consumeType": "save",
                      "openId": this.openId,
                      "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
                    }, res1 => {
                      console.log(res1);
                      if (res1.data.code === 200) {
                        this.wxPay(res1.data.data);
                      }
                    })
                  }else {
                    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fpay&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                  }
                }
              }
            })
          } else {
            post('api/pay/h5pay', {
              "type": 1,
              "orderId": this.orderId,
              "deposit": this.money,
              "consumeType": "save"
            }, res => {
              console.log(res);
              if (res.data.code === 200) {
                this.ceshi = res.data.data;
                // return false;
                location.href = res.data.data.mwebUrl + '&redirect_url=' + 'https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fpay%3ForderId%3D' + this.orderId + '%26money%3D' + this.$route.query.money +'%26templeId%3D' + this.$route.query.templeId +'%26origin%3D'
              }
            })
          }
        }
        else if(this.radio === '3') {
          console.log('radio3')
          post('api/beneficiary/encryptionKeyAndSecret' ,
            {
              // "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id
              "templeId": this.$route.query.templeId,
            } ,res1 => {
              console.log('encry', res1)
              // let secret = res1.data.data.secret;
              // let key = res1.data.data.key;
              post('line/pay/linePay', {
                "orderId": this.orderId,
                "deposit": this.money,
                // "templeId": JSON.parse(window.localStorage.getItem('selectTempData')).id,
                "templeId": this.$route.query.templeId,
                "channelId": res1.data.data.appKey,
                "secretKey": res1.data.data.appSecret,
              }, res => {
                console.log(res.data.info.paymentUrl.web)
                location.href= res.data.info.paymentUrl.web;
              })
          })

        }
        else if(this.radio === '2'){
          post('api/pay/ecPay',
            {
              "orderId":  this.orderId,
              "deposit":  this.money,
              "durationQuantity":this.$route.query.durationQuantity,
              "templeId":this.$route.query.templeId,
              // "type": 2,
              // "orderId": this.orderId,
              // "deposit": this.money,
              // "consumeType": "save",
              // "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
            }, res=> {
              let param = {index:0}
              localStorage.setItem('ecPay', param)
              console.log(res.data.data)
              // const payDiv = document.getElementById('payDiv')
              const div = document.createElement('div');
              div.innerHTML = res.data.data
              document.body.appendChild(div)
              div.id = "payDiv"
              document.getElementById('payDiv').getElementsByTagName('form')[0].submit();
          })
        } else{
          this.$toast('请选择支付方式');
        }
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
      },
      // overlayClick () {
      //   this.overlayShow = false;
      //   this.radio = '1'
      // }
    },
    mounted() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        this.wenxinShow = false
      }

      //监听绿界回调
      if(localStorage.ecPay) {
        post('api/pay/ecPayConfirm',{
          "templeId":JSON.parse(localStorage.getItem('ecPayItem')).templeId,
          "orderId": JSON.parse(localStorage.getItem('ecPayItem')).orderId
        }, res=> {
          console.log(!window.sessionStorage.getItem('paySuccess') || String(window.sessionStorage.getItem('paySuccess')) !== String(this.orderId), 'nikajdksdk');
          if(res.data.data === true) {
            this.$toast('支付成功');
            window.sessionStorage.setItem('paySuccess', JSON.parse(localStorage.getItem('ecPayItem')).orderId);
            this.$router.push({path: '/blessMessage', query: {orderId: JSON.parse(window.localStorage.getItem("ecPayItem")).orderId}});
            window.localStorage.removeItem('ecPayItem')
            window.localStorage.removeItem('ecPay')
          }else {
            this.$toast('支付失败');
            this.$router.push({path: '/orderDetail', query: {orderId: JSON.parse(window.localStorage.getItem("ecPayItem")).orderId}});
            window.localStorage.removeItem('ecPayItem')
            window.localStorage.removeItem('ecPay')
          }
        })

      }
      post('api/user/get', {}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.cellphone = res.data.data.cellphone;
        }
      });
      if (window.sessionStorage.getItem('payCount')) {
        this.payCount = JSON.parse(window.sessionStorage.getItem('payCount'));
      }
      if (this.$route.query.money && this.$route.query.orderId) {
        this.money = this.$route.query.money;
        this.orderId = this.$route.query.orderId;
        let obj = {
          money: this.$route.query.money,
          orderId: this.$route.query.orderId
        };
        window.sessionStorage.setItem('orderInfo', JSON.stringify(obj));
      } else {
        if (window.sessionStorage.getItem('orderInfo')) {
          this.money = JSON.parse(window.sessionStorage.getItem('orderInfo')).money;
          this.orderId = JSON.parse(window.sessionStorage.getItem('orderInfo')).orderId
        }
      }
      if (location.href.indexOf('code') !== -1 ) {
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
                    post('api/pay/jspay', {
                      "type": 1,
                      "orderId": this.orderId,
                      "deposit": this.money,
                      "consumeType": "save",
                      "openId": this.openId,
                      "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
                      // "templeId": this.$route.query.templeId,
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
        // post('api/user/getWechatOpenId',
        //   {
        //     code: this.userCode,
        //   },
        //   res => {
        //     // this.$toast(res);
        //     if (res.data.code === 200) {
        //       this.openId = res.data.data;
        //       if (!res.data.data) {
        //         return false;
        //       }
        //       // this.$toast(1111,this.openId);
        //       // post('api/user/updateOpenIdByCellphone', {
        //       //   "cellphone": this.cellphone,
        //       //   "openId": this.openId,
        //       //   "type": "微信"
        //       // }, res1 => {
        //       //   console.log(res1);
        //       //   this.$toast('请重新发起支付');
        //       //   this.payCount = 2;
        //       //   window.sessionStorage.setItem('payCount', JSON.stringify(this.payCount));
        //       // })
        //     }
        //   })
      }
      // console.log(window.sessionStorage.getItem('paySuccess'),this.orderId);
      console.log(location.href, location.href.indexOf('redirect_url') !== -1);
      console.log(123,this.$route.query)
      if (!window.sessionStorage.getItem('paySuccess') || String(window.sessionStorage.getItem('paySuccess')) !== String(this.orderId)) {
        if (location.href.indexOf('origin') !== -1) {
          // this.$toast(1);
          this.show = true;
        }
      }
      //line支付监听回调地址
      let transactionId = this.$route.query.transactionId
      console.log(transactionId)
      if (location.href.indexOf('transactionId') !== -1) {
        console.log(this.$route.query.orderId)
        let transactionId = this.$route.query.transactionId
        console.log(transactionId)
        let that = this;
        this.orderId = this.$route.query.orderId
        post('api/order/linePayConfirm', {
          transactionId: transactionId,
          money: this.$route.query.money,
          // "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id
          templeId: this.$route.query.templeId,
        } , res => {
          // console.log(typeof(res.data))
          console.log(res.data)
          if (res.data.data === true) {
            that.$toast('支付成功');
            if(window.sessionStorage.getItem('orderInfo')){
              window.sessionStorage.removeItem('orderInfo');
            }
            if(!window.localStorage.getItem('selectTempData')){
              window.localStorage.setItem('selectTempData',{"id": this.$route.query.templeId});
              console.log(window.localStorage.getItem('selectTempData'))
            }
            // window.sessionStorage.setItem('paySuccess', that.orderId);
            window.sessionStorage.setItem('paySuccess', that.orderId);
            that.$router.push({path: '/blessMessage', query: {orderId: that.orderId}});
          }else {
            that.$toast('支付失败');
            that.$router.push({path: '/orderDetail', query: {orderId: that.orderId}});
          }
        })
      }
    },
    updated() {
      if (this.radio === '3') {
        if (localStorage.getItem('environment') === 'weixin') {
          Dialog.alert({
            message: ' 由于微信浏览器的限制，请在第三方浏览器打开该页面，完成line支付（步骤:点击右上角的按钮，然后点击在浏览器中打开）',
          }).then(() => {
            this.radio = '0'
          });

        }
      }
    },
    beforeDestroy() {
      if(localStorage.ecPayItem) {
        localStorage.removeItem('ecPayItem')
      }
      if (!window.sessionStorage.getItem('paySuccess') || String(window.sessionStorage.getItem('paySuccess')) !== String(this.orderId)) {
        this.$toast('支付失败');
        // return false;
        this.$router.push({path: '/orderDetail', query: {orderId: this.orderId}});
      }
    }
  }
</script>

<style lang="less" scoped>
  .money {
    width: 3.64rem;
    height: 1.2rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 1.76rem;
    margin-bottom: 2.12rem;
    text-align: center;
    font-size: 1rem;
    color: #885022;
  }

  .way {
    font-size: 14px;
    color: #333333;
    box-sizing: border-box;
    padding: 0 0.88rem;

    .iconWay {
      width: 1.84rem;

      img {
        width: 1.2rem;
        height: 0.96rem;
      }
    }

    .title {
      margin-bottom: 1.24rem;
    }
  }
  /*.wrapper {*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  justify-content: center;*/
  /*  background-color: yellow;*/
  /*  height: 100%;*/
  /*}*/

  /*.block {*/
  /*  width: 120px;*/
  /*  height: 120px;*/
  /*  background-color: #cccccc;*/
  /*}*/
  .confirmPay {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 2rem;
    width: 13.08rem;
    height: 2rem;
    line-height: 2rem;
    background-image: url("../../assets/images/b_btn_pay.png");
    background-size: 100%;
    text-align: center;
    color: #885022;
    font-size: 0.72rem;
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
        right: 0.6rem;
        top: 50%;
        font-size: 0.8rem;
        transform: translateY(-50%);
      }
    }

    .complete, .noComplete {
      font-size: 0.56rem;
    }
  }
</style>
