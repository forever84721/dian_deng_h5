<template>
  <div class="orderDetail">
    <van-nav-bar
      :title="$t('m.personal.serviceLog')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="needPay" v-if="orderDetail.status === 'pending' && this.orderTimeShow ">
      <p style="font-size: 0.64rem;margin-top: 0.68rem;">等待付款</p>
      <p style="font-size: 0.48rem">剩{{roCallTime}}分钟后自动关闭</p>
    </div>
    <div class="serviceDetail">
      <div class="title">
        <div class="line"></div>
        {{$t('m.lampMenu.lightDetail')}}
      </div>
      <div class="orderMain" v-for="(item,index) in orderDetail.lampList" :key="index">
        <div class="tag" v-if="item.important">
          贵宾
        </div>
        <div class="logo">
          <div class="logo_left">
            <img :src="'https://wenxuanguangmingdeng.com/attachment/' + item.lampCategoryImage" alt="燈">
          </div>
          <div class="logo_right">
              <p><span>{{$t('m.footerNav.temp')}}:</span>{{item.templeName}}</p>
              <p><span>{{$t('m.lampDetail.lampCateGory')}}:</span>{{item.lampCategoryName}}</p>
            <p><span>{{$t('m.lightDetailPage.findNum')}}:<span style="font-size: 0.5rem">{{item.number}}</span></span></p>


          </div>
        </div>
        <div class="footer">
          <div>
          <p><span>{{$t('m.lampMenu.lampSeat')}}:</span>{{item.seat}}</p>
          <p><span>{{$t('m.anDonStartTime')}}:</span>{{orderDetail.startLightAt}}</p>
          <p><span>{{$t('m.anDonEndTime')}}:</span>{{orderDetail.endLightAt}}<span class="renew"
                                                                 v-if="orderDetail.isPaid === true  "
                                                                 @click="continueLamp(item)">{{$t('m.lightDetailPage.RenewLight')}}</span></p>
          </div>
          <div><div class="outTime" v-if="orderDetail.expired">已过期</div></div>
        </div>
        <van-divider v-if="orderDetail.lampList.length - 1 !== index"/>
      </div>
    </div>
    <div class="orderMessage">
      <div class="title">
        <div class="line"></div>
        {{$t('m.orderInfo')}}
      </div>
      <div class="main">
        <p><span>{{$t('m.orderMoney')}}:</span>{{orderDetail.amount}} 元</p>
        <p><span>{{$t('m.orderNum')}}:</span>{{orderDetail.id}}</p>
        <p><span>{{$t('m.createTime')}}:</span>{{orderDetail.updateAt}}</p>
<!--        <p v-if="orderDetail.status === '已付款'"><span>付款时间:</span>{{this.endLightAt}}</p>-->
        <p><span style="font-size: 0.56rem;color: #EC3400" @click="goCheckThank(orderDetail.id)"  v-if="orderDetail.isPaid === true  ">{{$t('m.checkThank')}}</span></p>
      </div>
    </div>
    <div class="btn" v-if="orderDetail.status === 'pending' && this.orderTimeShow" @click="goPay">
      付款
    </div>
    <div class="btn" v-if="orderDetail.status === 'closed' || (orderDetail.status === 'pending' && !this.orderTimeShow)   ">
      已结束
      <!--   阴影遮罩    -->
      <div class="shade">
      </div>

    </div>
<!--    <div class="btn" v-if="orderDetail.status === 'pending' && !this.orderTimeShow ">-->
<!--      已取消-->
<!--      &lt;!&ndash;   阴影遮罩    &ndash;&gt;-->
<!--      <div class="shade">-->
<!--      </div>-->

<!--    </div>-->

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
  import {post} from '@/utils/request/index'
  import '../../assets/css/topNav.css'
  import {Dialog, Toast} from 'vant'

  export default {
    name: "index",
    data() {
      return {
        titleStyle: {
          fontSize: "15px",
          fontFamily: "PingFangSC-Regular", color: "black"
        },
        orderDetail: {},
        dialogShow: false,
        columns: [],
        dayArr: [],
        payShow: false,
        radio: '1',
        needMoney: '',
        blessUserInfo: {},
        isPaySuccessShow: false,
        payCount1: 1,
        orderId: "",
        userCode: '',
        openId: '',
        days: '',
        orderTimeData: {
          formatCreateTime: '',
          currentTime: '',
        },
        roCallTime: '',
        orderTimeShow: true
      }
    },
    methods: {
      goCheckThank(id) {
        this.$router.push({path:'/thanks',query:{orderId:id}});
      },
      closePay() {
        this.payShow = false;
      },
      nowPay() {
        post('api/order/checkIsRenewable', {
          lampId: this.blessUserInfo.id,
          userId: JSON.parse(window.localStorage.getItem('selectTempData')).userId
        }, res => {
          console.log(res);

          if (res.data.data === true) {
            if (this.radio === '1') {
              console.log(this.day , 'nowpay')
              let browserInfo = navigator.userAgent.toLowerCase();
              if (browserInfo.match(/MicroMessenger/i) == 'micromessenger') {
                post('api/user/getLoginType', {}, res => {
                  if (res.data.code === 200) {
                    if (res.data.data === "wx") {
                      post('api/user/getOpenIdByUser', {}, res2 => {
                        console.log(res2);
                        // this.$toast(res);
                        if (res2.data.code === 200) {
                          console.log('loc', JSON.parse(localStorage.getItem('selectTempData')))
                          this.openId = res2.data.data;
                          post('api/pay/renewPay', {
                            "pilgrimId": this.blessUserInfo.pilgrimId,
                            "deposit": Number(this.needMoney),
                            "durationQuantity": this.days,
                            "type": "jsapi",
                            "openId": this.openId,
                            "templeId":JSON.parse(localStorage.getItem('selectTempData')).id
                          }, res1 => {
                            console.log(res1);
                            if (res1.data.code === 200) {
                              this.wxPay(res1.data.data);
                            }else  {
                              console.log(res1.data.message)
                              Toast(res1.data.message)
                            }
                          })
                        }
                      });
                    } else {
                      if (this.openId !== '') {
                        console.log("openId", JSON.parse(localStorage.getItem('selectTempData')))
                        post('api/pay/renewPay', {
                          "pilgrimId": this.blessUserInfo.pilgrimId,
                          "deposit": Number(this.needMoney),
                          "durationQuantity": this.days,
                          "type": "jsapi",
                          "openId": this.openId,
                          "templeId":JSON.parse(localStorage.getItem('selectTempData')).id
                        }, res1 => {
                          console.log(res1);
                          if (res1.data.code === 200) {
                            this.wxPay(res1.data.data);
                          }else  {
                            Toast(res1.data.message)
                          }
                        })
                      } else {
                        console.log('phone', JSON.parse(localStorage.getItem('selectTempData')))
                        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2ForderDetail%3Fid%3D' + this.$route.query.id + '%26pilgrimId%3D' + this.blessUserInfo.pilgrimId + '%26money%3D' + this.needMoney + '%26durationQuantity%3D' + this.days + '%26orderId%3D' + this.$route.query.orderId + '+&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
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
                //       "pilgrimId": this.blessUserInfo.pilgrimId,
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
                  "deposit": Number(this.needMoney),
                  "durationQuantity": this.days,
                  "type": "h5",
                  "pilgrimId": this.blessUserInfo.pilgrimId,
                  "openId": "",
                  "templeId":JSON.parse(localStorage.getItem('selectTempData')).id
                }, res => {
                  console.log(res);
                  // this.$toast(1);
                  this.payShow = false;
                  if (res.data.code === 200) {
                    // this.$toast(2);
                    // location.href = res.data.data.mwebUrl + '&redirect_url=' + 'http%3A%2F%2Flocalhost%3A81%2F%23%2ForderDetail%3ForderId%3D'+res.data.data.orderId+'3%26origin%3D'+res.data.data.orderId;
                    location.href = res.data.data.mwebUrl + '&redirect_url=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2ForderDetail%3ForderId%3D' + this.$route.query.orderId + '%26origin%3D1';
                    // location.href = res.data.data.mwebUrl+'&redirect_url=http%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2ForderDetail%3Forigin%3D1';
                    window.sessionStorage.setItem('renewOrderId', JSON.stringify(res.data.data.orderId));
                  }else {
                      Toast(res.data.message)
                  }
                });
              }
            } else if (this.radio === '3') {
              post('api/pay/renewLinePay', {
                "pilgrimId": this.blessUserInfo.pilgrimId,
                "deposit": this.needMoney,
                "durationQuantity": this.days,
              }, res => {
                console.log(res)
                console.log(res.data)
                location.href = res.data.data.info.paymentUrl.web
              })
            }else {
              this.$toast('该支付方式暂未开放，请重新选择支付方式');
            }
          } else {
            this.$toast('该灯位已被占用~');
          }
        });
      },
      closeIsPay() {
        this.isPaySuccessShow = false;
        post('api/pay/orderQuery', {
          "orderId": JSON.parse(window.sessionStorage.getItem('renewOrderId'))
        }, res => {
          console.log(res);
          if (res.data.code === 200) {
            if (res.data.data) {
              this.$toast('支付成功');
              window.sessionStorage.setItem('renewPaySuccess', JSON.stringify(JSON.parse(window.sessionStorage.getItem('renewOrderId'))));
              this.$router.push({path: '/order'});
            } else {
              this.$toast('支付失败');
              this.$router.push({path: '/order'});
            }
          }
        })
      },
      searchResult(type) {
        if (type === 'ok') {
          post('api/pay/orderQuery', {
            "orderId": JSON.parse(window.sessionStorage.getItem('renewOrderId'))
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              if (res.data.data) {
                this.$toast('支付成功');
                this.$router.push({path: '/order'});
                window.sessionStorage.setItem('renewPaySuccess', JSON.stringify(JSON.parse(window.sessionStorage.getItem('renewOrderId'))));
              } else {
                this.$toast('支付失败');
                this.$router.push({path: '/order'});
              }
            }
          })
        } else {
          post('api/pay/orderQuery', {
            "orderId": JSON.parse(window.sessionStorage.getItem('renewOrderId'))
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              if (res.data.data) {
                this.$toast('您已支付成功,请勿重复支付');
                window.sessionStorage.setItem('renewPaySuccess', JSON.stringify(JSON.parse(window.sessionStorage.getItem('renewOrderId'))));
                this.$router.push({path: '/order'});
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
          function (res) {
            console.log(res);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              that.$toast('续灯成功');
              that.$router.push({path: '/order'});
            } else {
              that.$toast('续灯失败');
              that.$router.push({path: '/order'});
            }
          });
      },
      // 返回上一级
      onClickLeft() {
        this.$router.go(-1);
      },
      // 前往支付页面
      goPay() {
        this.$router.push({path: '/pay', query: {orderId: this.$route.query.orderId, money: this.orderDetail.amount}});
      },
      onConfirm(value, index) {
        this.dialogShow = false;
        this.payShow = true;
        console.log(index,'zhi')
        this.days = this.dayArr[index];
        console.log(this.days, 'cjx')
        console.log(value);
        console.log(index);
        this.needMoney = value.split('￥')[1];
        console.log(this.days, Number(this.needMoney));
      },
      // 续灯
      continueLamp(item) {
        this.blessUserInfo = item;
        console.log(item);
        post('api/order/checkIsRenewable', {
          lampId: this.blessUserInfo.id,
          userId: JSON.parse(window.localStorage.getItem('selectTempData')).userId
        }, res => {
          console.log(res);
          if (res.data.data === true) {
            this.dialogShow = true;
            // 获取灯种规格
            post('api/lampGoods/findByLampId', {lampId: item.id}, res => {
              console.log(res);
              this.lampSelect = res.data.data;
              console.log(this.lampSelect , 'nijapo');
              // 续灯选择器相关配置项的处理
              this.columns = [];
              this.lampSelect.forEach((item, index) => {
                let price = '';
                if (!item.important) {
                  price = item.standardPrice
                } else {
                  price = item.vipPrice
                }
                let newItem = item.durationName + '￥' + price;
                //this.columns = [];
                this.columns.push(newItem);
                console.log(111 ,this.columns);
                this.dayArr.push(item.durationQuantity);
                //console.log(222,item.durationQuantity)
              });
              console.log(333, this.columns);
              console.log(444, this.dayArr);
            });
          } else if(res.data.data === false) {
            // this.$toast(res.data.message)
            this.$toast('该灯位已被占用~');
          }
        });
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
      formatDateTime(date) {
        let y = date.getFullYear()
        let m = date.getMonth() +1
        m = m < 10 ? ('0' + m) : m
        let d = date.getDate()
        d = d  < 10 ? ('0' + d) : d
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let min = date.getMinutes()
        min = min < 10 ? ('0' + min) : min
        let sec = date.getSeconds()
        sec = sec < 10 ? ('0' + sec) : sec
        return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec
      },
      //倒计时
      ComputerTime(data) {
        let st = data.currentTime.replace(/-/g, "/")//当前服务器时间
         let  ct = data.formatCreateTime.replace(/-/g, "/")//创建订单时间
        console.log(ct)
        console.log(st)
        console.log(st)
        let ts = new Date(st).getTime()
         let tc = new Date(ct).getTime();
        console.log(tc)

        let cm = 15 * 60 * 1000 - (ts - tc);console.log(ts)
        console.log(cm)
        this.runBack(cm);
      },
      runBack(cm) {
        if (cm > 0) {
          cm > 60000
            ? (this.roCallTime =
            (new Date(cm).getMinutes() < 10
              ? "0" + new Date(cm).getMinutes()
              : new Date(cm).getMinutes()) +
            ":" +
            (new Date(cm).getSeconds() < 10
              ? "0" + new Date(cm).getSeconds()
              : new Date(cm).getSeconds()))
            : (this.roCallTime =
            "00:" +
            (new Date(cm).getSeconds() < 10
              ? "0" + new Date(cm).getSeconds()
              : new Date(cm).getSeconds()));
          let _msThis = this;
          setTimeout(function() {
            cm -= 1000;
            _msThis.runBack(cm);
          }, 1000);
        } else {
          this.orderTimeShow = false
        }
      },
    },
    mounted() {
      //订单倒计时
      // line续灯的调用监听
      if (location.href.indexOf("transactionId") !== -1) {
        post('api/order/linePayRenewConfirm',{
          "transactionId": this.$route.query.transactionId,
          "money": this.needMoney,
          "pilgrimId": this.$route.query.pilgrimId,
          "templeId":JSON.parse(window.localStorage.getItem('selectTempData')).id,
          "durationQuantity": this.$route.query.durationQuantity ,
          "accountId": JSON.parse(localStorage.getItem("userMsg")).id,
        }, res => {
          console.log(res)
          if (res.data.data === true) {
            Toast("续灯成功")
          }else {
            Toast("续灯失败")
          }

        })
      }
      // this.$toast(location.href);
      // console.log('11111111111111111111');
      console.log(location.href);
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
                    post('api/pay/renewPay', {
                      "pilgrimId": this.$route.query.pilgrimId,
                      "deposit": Number(this.$route.query.money),
                      "durationQuantity": this.$route.query.durationQuantity,
                      "type": "jsapi",
                      "openId": this.openId,
                      "templeId":JSON.parse(localStorage.getItem('selectTempData')).id
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
      }
      // if(window.sessionStorage.getItem('payCount1')){
      //   this.payCount1 = JSON.parse(window.sessionStorage.getItem('payCount1'));
      // }
      // if (location.href.indexOf('code') !== -1 && this.payCount === 1) {
      //   post(
      //     'api/user/getWechatOpenId',
      //     {
      //       code: this.userCode,
      //     },
      //     res => {
      //       if (res.data.code === 200) {
      //         this.openId = res.data.data;
      //         post('api/user/updateOpenIdByToken', {"openId": this.openId}, res1 => {
      //           console.log(res1);
      //           this.$toast('请重新发起支付');
      //           this.payCount1 = 2;
      //           window.sessionStorage.setItem('payCount', JSON.stringify(this.payCount1));
      //         })
      //       }
      //     })
      // }
      if (location.href.indexOf('origin') !== -1) {
        this.orderId = this.getvar(location.href, 'orderId');
        if (window.sessionStorage.getItem('renewPaySuccess')) {
          if (JSON.parse(window.sessionStorage.getItem('renewPaySuccess')) !== this.orderId) {
            this.isPaySuccessShow = true;
            // 根据订单id查询订单详情
            post('api/order/findDtoById', {id: this.orderId}, res => {
              this.orderDetail = res.data.data;

            });
          }
        } else {
          this.isPaySuccessShow = true;
          // 根据订单id查询订单详情
          post('api/order/findDtoById', {id: this.orderId}, res => {
            this.orderDetail = res.data.data;
            console.log(this.orderDetail);
          });
        }
      } else {
        // 根据订单id查询订单详情
        post('api/order/findDtoById', {id: this.$route.query.orderId}, res => {
          this.orderDetail = res.data.data;
          console.log(this.orderDetail);
        });
      }
      // if (location.href.indexOf(''))
      setTimeout(() => {
        this.orderTimeData.currentTime = this.formatDateTime(new Date())
        this.orderTimeData.formatCreateTime = this.orderDetail.createAt
        this.ComputerTime(this.orderTimeData)

      },500)

      // this.orderTimeData.currentTime = this.formatDateTime(new Date())
      // this.orderTimeData.formatCreateTime = JSON.stringify(this.orderDetail.updateAt)
      // console.log(this.orderDetail.updateAt)
      // console.log(this.orderTimeData.formatCreateTime)
      // this.ComputerTime(this.orderTimeData)
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
  .needPay {
    width: 14rem;
    height: 2.8rem;
    background-image: url("../../assets/images/qiujifoju.png");
    background-size: cover;
    margin-top: 0.22rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    color: #885022;

    p {
      margin-left: 1.82rem;
    }
  }

  .orderDetail {
    height: 100vh;
    background-color: #F5F5F5;
    overflow: auto;
    padding-bottom: 1rem;
    box-sizing: border-box;
  }

  .serviceDetail {
    width: 90%;
    position: relative;
    left: 50%;
    top: 0.32rem;
    transform: translateX(-50%);
    background-color: white;
    border-radius: 0.4rem;
    padding-top: 0.52rem;
    padding-bottom: 0.5rem;
    box-sizing: border-box;

    .title {
      height: 0.92rem;
      line-height: 0.92rem;
      font-size: 0.6rem;
      margin-bottom: 0.4rem;

      .line {
        height: 0.92rem;
        width: 0.12rem;
        background-color: #BF6C29;
        float: left;
        margin-right: 0.36rem;
      }
    }

    .orderMain {
      /*margin-top: 0.4rem;*/

      .tag {
        width: 1.4rem;
        height: 0.68rem;
        background-image: url("../../assets/images/d_ic_chunk.png");
        background-size: cover;
        margin-left: 0.6rem;
        margin-top: 0.36rem;
        margin-bottom: 0.36rem;
        font-size: 0.44rem;
        font-family: PingFang SC;
        font-weight: 300;
        color: rgba(255, 254, 254, 1);
        line-height: 0.72rem;
        text-align: center;
      }

      .logo {
        margin-left: 0.6rem;
        height: 4rem;

        .logo_left {
          float: left;
          width: 5.08rem;
          height: 3.84rem;
          background-image: url("../../assets/images/c_icn_picturebox_2.png");
          background-size: cover;
          /*padding: 0.28rem 0.23rem;*/
          box-sizing: border-box;

          img {
            width: 4.4rem;
            height: 3.1rem;
            margin-top: 0.35rem;
            margin-left: 0.35rem;
          }
        }

        .logo_right {
          float: left;
          margin-left: 0.3rem;
          width: 7.2rem;
          font-size: 0.56rem;
          font-family: PingFangSC-Regular;
          position: relative;

          p {
            margin-bottom: 0.6rem;
          }

          span {
            margin-right: 0.2rem;
          }

        }
      }

      .footer {
        margin-top: 0.64rem;
        margin-left: 0.88rem;
        font-size: 0.48rem;
        color: #666666;
        position: relative;
        p {
          margin-bottom: 0.4rem;

          span {
            margin-right: 0.32rem;
          }
        }

        .renew {
          margin-left: 0.4rem;
          color: #EC3400;
        }
        .outTime {
          width: 2.5rem;
          height: 0.92rem;
          position: absolute;
          top: 0.1rem;
          right: 0.36rem;
          background-color: #7d7e80;
          color: #cccccc;
          line-height: 0.92rem;
          text-align: center;
        }
      }

      .van-divider {
        border-color: #999999;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
      }
    }
  }

  .orderMessage {
    width: 90%;
    position: relative;
    left: 50%;
    top: 0.32rem;
    transform: translateX(-50%);
    background-color: white;
    border-radius: 0.4rem;
    padding-top: 0.52rem;
    box-sizing: border-box;
    margin-top: 0.32rem;

    .title {
      height: 0.92rem;
      line-height: 0.92rem;
      font-size: 0.6rem;
      margin-bottom: 0.4rem;
      position: relative;

      .line {
        height: 0.92rem;
        width: 0.12rem;
        background-color: #BF6C29;
        float: left;
        margin-right: 0.36rem;
      }

    }

    .main {
      font-size: 0.48rem;
      color: #666666;
      margin-left: 0.88rem;
      padding-bottom: 0.8rem;
      box-sizing: border-box;

      p {
        margin-bottom: 0.52rem;

        span {
          margin-right: 0.32rem;
        }
      }
    }
  }

  .btn {
    width: 13.08rem;
    height: 2rem;
    background-image: url("../../assets/images/b_btn_pay.png");
    background-size: cover;
    border-radius: 0.2rem;
    font-size: 0.72rem;
    color: #885022;
    line-height: 2rem;
    text-align: center;
    margin-top: 1.5rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;

    .shade {
      position: absolute;
      top: 0;
      left: 0;
      width: 13.08rem;
      height: 2rem;
      border-radius: 0.2rem;
      background-color: #c0c0c0;
      opacity: 0.5;
    }
  }

  .van-picker /deep/ .van-picker__toolbar /deep/ .van-picker__cancel, .van-picker /deep/ .van-picker__toolbar /deep/ .van-picker__confirm {
    padding: 0 16px;
    color: #885022;
    font-size: 14px;
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
      transform: translate(-50%, -50%);
    }

    font-size: 0.72rem;
  }

  .p1 {
    font-size: 1.2rem;
    text-align: center;
    margin-top: 1.28rem;
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
