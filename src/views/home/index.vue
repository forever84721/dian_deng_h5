<template>
  <div class="container">
    <van-nav-bar
      :title="$t('m.lampDetail.onlineLamp')"
      left-arrow
      @click-left="onClickLeft"
    />
    <!--    头部区域-->
    <div class="lampMessage">
      <div class="lampNav">
        <div class="lampNav1"></div>
        <div>{{tempDetail.name}}</div>
      </div>
      <div class="lampMain">
        <div class="lampMain1">
          <img :src="'https://wenxuanguangmingdeng.com/attachment/'+lampDetail.image" alt="燈">
        </div>
        <div class="lampMain2">
          <p class="des-title">{{lampDetail.name}}</p>
          <p class="des-content">{{lampDetail.description}}</p>
        </div>
      </div>
    </div>

    <div class="br"></div>

    <!--    下单详情展示区域-->
    <div class="order">
      <div class="orderTitle">
        <div class="text">
          <span class="s1"></span>
          <span class="s3">{{$t('m.lampMenu.lightDetail')}}</span>
          <span class="s2"></span>
        </div>
      </div>

      <div class="orderDetail">
        <div class="van-cell-group">
          <van-cell :title="$t('m.lampMenu.num')" value="内容">
            <template slot="default">
              <van-stepper v-model="quantity" :disabled=isDisable :max="lampTotal" step="1" @change="changeNum" integer
                           @overlimit="tipMessage"/>
            </template>
          </van-cell>
          <van-cell :title="$t('m.lampMenu.select')" :value="showText" is-link @click="showNumSelect"
                    :arrow-direction="arrowStyle"/>
          <div class="num" v-if="numShow">
            <ul>
              <li v-for="(item,index) in lampSelect" :key="index" :class="[ifSelectNum === index?'choose':'nochoose']"
                  @click="selectStandard(item,index)">{{item.duration.name}}
              </li>
            </ul>
          </div>
          <van-cell :title="$t('m.lampMenu.lampSeat')"
                    :value="radio === '随机配灯'? $t('m.lampMenu.randomLamp') : $t('m.lampMenu.selfSelect')" is-link
                    @click="showDialog"/>
          <van-cell :title="$t('m.lampMenu.already')" is-link/>
          <!--           所选择的灯 -->
          <ul class="choose_list" v-if="chooseSeatList.length!==0">
            <li v-for="(item,index) in chooseSeatList"  :key="index">
                <span class="s5">
                  <span class="s3">{{item.number}}</span>
                  <span class="s4">{{item.price}}元</span>
                </span>
              <img src="../../assets/images/b_g_h_d.png" alt="" width="20" height="20"
                   @click="deleteSeat(index)">
            </li>
          </ul>
        </div>

        <div class="total"><span class="total_1">{{$t('m.lampMenu.all')}}:</span><span>￥{{money}} 元</span></div>
      </div>

      <div class="submitOrder" @click="next">
        <span>{{$t('m.lampMenu.submitOrder')}}</span>
      </div>

    </div>

    <!--    选择灯位弹窗 -->
    <div class="dialog" v-if="dialogShow">
      <p>{{$t('m.lampMenu.pleaseSelectLamp')}}</p>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell :title="$t('m.lampMenu.randomLamp')" clickable>
            <van-radio slot="right-icon" name="随机配灯"/>
          </van-cell>
          <van-cell :title="$t('m.lampMenu.selfSelect')" clickable>
            <van-radio slot="right-icon" name="自选灯位"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="confirm">
        <span class="s1" @click="closeDialog">取消</span>
        <span class="s2" @click="selectType">确认</span>
      </div>
    </div>

    <!--  遮罩  -->
    <div class="shade" v-if="dialogShow">
    </div>

  </div>
</template>

<script>
  // import homeNav from "@/views/home/cache/homeNav"
  import {post} from "@/utils/request/index"
  import {Toast} from "vant"
  import '../../assets/css/topNav.css'

  export default {
    name: "index",
    data() {
      return {
        arrowStyle: '', // 控制箭头方向
        numShow: false, // 控制选择规格部分是否显示
        isDisable: true,
        // 灯种详情
        lampDetail: {},
        // 寺庙详情
        tempDetail: {},
        // 灯种规格
        lampSelect: [],
        // 选择规格的Id
        selectStandardId: '',
        // 用于判断当前规格是否选中
        ifSelectNum: 99999,
        //当前选中的安灯类型
        radio: '随机配灯',
        //当前选中的安灯类型
        dialogShow: false,
        // 规格要显示的文字
        showText: '',
        //提交订单时间
        orderTime: '',
        // 数量
        quantity: 1,
        // 灯的剩余总数
        lampTotal: 0,
        // 当前规格价格
        price: '',
        // 总价
        totalMoney: 0,
        // 规格天数
        days: '',
        // 提交订单所使用的灯位的座位列表
        seatList: [],
        // 是否显示自选灯位相关样式
        isShowSelfLamp: false,
        // 所选择的座位信息列表
        chooseSeatList: [],
        // 价格列表
        priceList: {
          vipPrice: 0,
          standardPrice: 0
        },
        isChangeQuantity:false,
        lampGoodId:''
      }
    },
    methods: {
      // 点击不可用按钮时触发的函数
      tipMessage() {
        if (this.showText === '') {
          this.$toast({
            type: 'html',
            message: '请先选择规格!',
            duration: 2000
          });
          console.log(this.quantity);
        }
      },
      // 关闭弹窗
      closeDialog() {
        this.dialogShow = false;
        if (!window.localStorage.getItem('seatInfo')) {
          this.radio = '随机配灯'
        }
      },
      // 选择灯位弹窗显示与隐藏
      showDialog() {
        this.dialogShow = true;
      },
      // 控制选择规格相关样式
      showNumSelect() {
        this.numShow = !this.numShow;
        if (this.numShow) {
          this.arrowStyle = 'down';
        } else {
          this.arrowStyle = '';
        }
      },
      onClickLeft() {
        this.$router.go(-1)
      },
      // 改变数量
      changeNum(value, detail) {
        console.log(1);
        console.log(this.quantity);
        console.log(value, detail);
        if (this.showText === '') {
          this.$toast('请先选择规格!');
          console.log(this.quantity);
          return false;
        }
        // this.chooseSeatList = [];
        // post('api/lamp/saveLampsWithRandom', {
        //   "lampHolderId": this.$route.query.lampHolderId,
        //   "quantity": this.quantity
        // }, res => {
        //   console.log(res);
        //   if (res.data.code === 200) {
        //     res.data.data.forEach((item, index) => {
        //       let obj = {};
        //       obj.id = item.id;
        //       obj.number = item.number;
        //       if (!item.important) {
        //         obj.price = this.priceList.standardPrice;
        //       } else {
        //         obj.price = this.priceList.vipPrice;
        //       }
        //       this.chooseSeatList.push(obj);
        //       console.log(this.chooseSeatList);
        //     })
        //   }else {
        //     this.$toast(res.data.message)
        //   }
        // });
        // this.totalMoney = this.quantity * this.price;
      },
      // 选择规格
      selectStandard(item, index) {
        if (this.radio === '自选灯位') {
          return false;
        } else {
          console.log(this.lampSelect);
          this.isDisable = false;
          this.quantity = 1;
          this.selectStandardId = item.duration.id;
          this.ifSelectNum = index;
          console.log(this.selectStandardId);
          this.showText = item.duration.name;
          this.days = item.duration.quantity;
          post('api/lampGoods/findByDurationIdAndLampCategoryId', {
            durationId: this.selectStandardId,
            lampCategoryId: this.$route.query.lampCategoryId
          }, res => {
            console.log(res);
            this.priceList.vipPrice = res.data.data.vipPrice;
            this.priceList.standardPrice = res.data.data.standardPrice;
            this.lampGoodId = res.data.data.id;
          });
          // this.price = item.vipPrice;
          // this.totalMoney = this.quantity * this.price;
          console.log(this.chooseSeatList);
          console.log(this.quantity);
          console.log(111111111,!this.isChangeQuantity);
          if(!this.isChangeQuantity){
            post('api/lamp/saveLampsWithRandom', {
              "lampHolderId": this.$route.query.lampHolderId,
              "quantity": this.quantity
            }, res => {
              console.log(res);
              if (res.data.code === 200) {
                this.chooseSeatList = [];
                res.data.data.forEach((item, index) => {
                  let obj = {};
                  obj.id = item.id;
                  obj.number = item.number;
                  if (!item.important) {
                    obj.price = this.priceList.standardPrice;
                  } else {
                    obj.price = this.priceList.vipPrice;
                  }
                  this.chooseSeatList.push(obj);
                  console.log(this.chooseSeatList);
                })
              }else {
                this.$toast(res.data.message)
              }
            });
          }
          console.log(this.days, this.totalMoney);
        }
      },
      // 删除选择的座位
      deleteSeat(index) {
        // if(this.radio = '随机配灯'){
        //   return false;
        // }
        console.log(index);
        if(this.radio === '随机配灯'){
          if(this.chooseSeatList.length ===1){
            this.$toast('至少选择一个灯位');
            return false;
          }
          this.chooseSeatList.splice(index, 1);
          this.seatList.splice(index, 1);
          this.quantity = this.chooseSeatList.length;
        }
        if(this.radio === '自选灯位'){
          this.chooseSeatList.splice(index, 1);
          this.seatList.splice(index, 1);
          this.quantity = this.chooseSeatList.length;
          window.localStorage.setItem('seatInfo', JSON.stringify(this.chooseSeatList));
          if (this.chooseSeatList.length === 0) {
            console.log(1);
            window.localStorage.removeItem('seatInfo');
            window.localStorage.removeItem('ifSelectNum');
            this.isDisable = false;
            this.quantity = 1;
            // this.isShowSelfLamp = false;
            this.radio = '随机配灯';
            post('api/lamp/saveLampsWithRandom', {
              "lampHolderId": this.$route.query.lampHolderId,
              "quantity": this.quantity
            }, res => {
              console.log(res);
              if (res.data.code === 200) {
                this.chooseSeatList = [];
                res.data.data.forEach((item, index) => {
                  let obj = {};
                  obj.id = item.id;
                  obj.number = item.number;
                  if (!item.important) {
                    obj.price = this.priceList.standardPrice;
                  } else {
                    obj.price = this.priceList.vipPrice;
                  }
                  this.chooseSeatList.push(obj);
                  console.log(this.chooseSeatList);
                })
              }else {
                this.$toast(res.data.message)
              }
            });
            // this.totalMoney = this.quantity * this.price;
          }
          // elsfe {
          //   this.quantity = this.chooseSeatList.length;
          // }
        }
        // console.log(this.totalMoney, this.seatList, this.chooseSeatList);
      },
      // 选择当前安灯类型
      selectType() {
        console.log(this.radio);
        if (this.radio === '自选灯位') {
          if (this.selectStandardId) {
            window.localStorage.setItem('ifSelectNum', this.ifSelectNum);
            this.$router.push({
              path: '/chooseSeat',
              query: {
                lampCategoryId: this.$route.query.lampCategoryId,
                lampHolderId: this.$route.query.lampHolderId,
                days: this.days,
                vipPrice: this.priceList.vipPrice,
                standardPrice: this.priceList.standardPrice
              }
            });
          } else {
            this.$toast('请先选择规格！');
            this.radio = '随机配灯';
          }
        } else {
          this.isDisable = false;
          location.reload();
          if (window.localStorage.getItem('seatInfo')) {
            window.localStorage.removeItem('seatInfo');
          }
          if (window.localStorage.getItem('ifSelectNum')) {
            window.localStorage.removeItem('ifSelectNum');
          }
        }
        this.dialogShow = false;
      },
      next() {
        // post('api/pay/pay',{
        //   "type": 1,
        //   "orderId": 2,
        //   "deposit": 0.1
        // },res=>{
        //   console.log(res);
        //   location.href = res.data.data.mwebUrl
        // });
        // return false;
        let date = new Date();
        this.orderTime = this.formatDateTime(date)
        console.log(this.orderTime)
        if (this.showText === '请选择规格') {
          this.$toast('请先选择规格!');
          return false;
        }
        if(this.chooseSeatList.length === 0){
          return  false;
        }
        if (this.radio === '随机配灯') {
          // 随机配灯订单提交
          post('api/order/save',{
            "order": {
              "lampQuantity": this.quantity,
              "amount": this.totalMoney,
              "durationQuantity": this.days,
              "distributionMode": "随机安灯",
              "lampGoods": {
                "id": this.lampGoodId
              },
              "lampHolder": {
                "id": this.$route.query.lampHolderId
              },
              "temple": {
                "id": this.tempDetail.id
              },
              "lampIdList": this.seatList
            }
          },res => {
            console.log(res);
            if (res.data.code === 200) {
              this.$toast('提交订单成功');
              this.$router.push({path: '/pay', query: {orderId: res.data.data.id, money: this.totalMoney,time:this.orderTime}})
            } else if(res.data.code === 403 && res.data.message === '访问的数据不存在'){
              this.$toast('登录信息已过期，请重新登录');
              this.$router.push('/login')
            }else {
              this.$toast(res.data.message);
            }
          })
        } else {
          // 自选配灯订单提交
          // console.log(this.seatList);
          // return false;
          post('api/order/save', {
            "order": {
              "lampQuantity": this.quantity,
              "amount": this.totalMoney,
              "durationQuantity": this.days,
              "distributionMode": "自选灯位",
              "lampGoods": {
                "id": this.lampGoodId
              },
              "lampHolder": {
                "id": this.$route.query.lampHolderId
              },
              "temple": {
                "id": this.tempDetail.id
              },
              "lampIdList": this.seatList
            }
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              this.$toast('提交订单成功');
              window.localStorage.removeItem('seatInfo');
              window.localStorage.removeItem('ifSelectNum');
              this.$router.push({path: '/pay', query: {orderId: res.data.data.id, money: this.totalMoney,time:this.orderTime}})
            } else {
              this.$toast(res.data.message);
            }
          });
        }
      },
      //修改时间格式
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
      }
    },
    mounted() {
      let tempInfo = localStorage.getItem('selectTempData');
      if (tempInfo) {
        this.tempDetail = JSON.parse(tempInfo);
        console.log( this.tempDetail);
      }
      post('api/lampCategory/findById', {id: this.$route.query.lampCategoryId}, res => {
        console.log(res);
        this.lampDetail = res.data.data.lampCategory;
        this.lampSelect = res.data.data.lampGoodsList;
        console.log(this.lampDetail, this.lampSelect);
        if (window.localStorage.getItem('seatInfo') && JSON.parse(window.localStorage.getItem('seatInfo')).length !== 0) {
          // 自选灯位页面初始化
          this.radio = '自选灯位';
          this.isDisable = true;
          // this.numShow = true;
          this.isShowSelfLamp = true;
          this.ifSelectNum = parseInt(window.localStorage.getItem('ifSelectNum'));
          console.log(this.ifSelectNum);
          this.selectStandardId = this.lampSelect[this.ifSelectNum].duration.id;
          this.showText = this.lampSelect[this.ifSelectNum].duration.name;
          this.days = this.lampSelect[this.ifSelectNum].duration.quantity;
          // this.price = this.lampSelect[this.ifSelectNum].price;
          console.log(this.selectStandardId, this.showText, this.days, this.price, this.totalMoney);
          post('api/lampGoods/findByDurationIdAndLampCategoryId', {
            durationId: this.selectStandardId,
            lampCategoryId: this.$route.query.lampCategoryId
          }, res => {
            console.log(res);
            this.priceList.vipPrice = res.data.data.vipPrice;
            this.priceList.standardPrice = res.data.data.standardPrice;
            this.lampGoodId = res.data.data.id;
          });
          this.chooseSeatList = JSON.parse(window.localStorage.getItem('seatInfo'));
          console.log(this.chooseSeatList);
          // for(let i=0;i<=this.chooseSeatList.length-1;i++){
          //   this.totalMoney = this.chooseSeatList[i].price + this.totalMoney;
          // }
          // this.chooseSeatList.forEach((item, index) => {
          //   this.seatList.push(item.id);
          //   // this.totalMoney = item.price + this.totalMoney;
          // });
          console.log(this.seatList, this.totalMoney);
          this.quantity = this.chooseSeatList.length;
        }else {
          if (this.showText === '') {
            // this.$toast({
            //   type: 'html',
            //   message: '请先选择规格!',
            //   duration: 2000
            // });
            this.showText = '请选择规格';
          }
        }
        setTimeout(()=>{
          console.log(this.chooseSeatList);
        },3000);
      });
      // 获取当前灯座下的库存
      post('api/lamp/countByLampHolderId', {lampHolderId: this.$route.query.lampHolderId}, res => {
        console.log(res);
        this.lampTotal = res.data.data;
      });
    },
    computed: {
      money() {
        // let price = 0;
        // for (let i=0;i<=this.chooseSeatList.length-1;i++){
        //   price = this.chooseSeatList[i].price + price;
        // }
        // this.totalMoney = price;
        this.totalMoney = 0;
        this.chooseSeatList.forEach((item, index) => {
          this.totalMoney = Number(item.price) + this.totalMoney;
          this.seatList.push(item.id);
        });
        console.log(this.totalMoney);
        return this.totalMoney;
      }
    },
    watch:{
      quantity(newQuantity,oldQuantity){
        if(this.radio === '随机配灯'){
          if(newQuantity===1){
            this.isChangeQuantity = false;
            console.log('新值为1',this.isChangeQuantity)
          }else {
            this.isChangeQuantity = true;
          }
          console.log(newQuantity,oldQuantity);
          post('api/lamp/saveLampsWithRandom', {
            "lampHolderId": this.$route.query.lampHolderId,
            "quantity": this.quantity
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              this.chooseSeatList=[];
              res.data.data.forEach((item, index) => {
                let obj = {};
                obj.id = item.id;
                obj.number = item.number;
                if (!item.important) {
                  obj.price = this.priceList.standardPrice;
                } else {
                  obj.price = this.priceList.vipPrice;
                }
                this.chooseSeatList.push(obj);
                console.log(this.chooseSeatList);
              })
            }else {
              this.$toast(res.data.message)
            }
          });
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .br {
    height: 0.52rem;
    width: 100%;
    background-color: #F5F5F5;
  }

  .lampMessage {
    height: 6.8rem;
    width: 100%;
    background-color: #FFFFFF;
    overflow: hidden;

    .lampNav {
      margin-top: 0.36rem;
      margin-bottom: 0.4rem;
      height: 0.92rem;
      line-height: 0.92rem;
      font-size: 0.48rem;

      .lampNav1 {
        float: left;
        width: 0.12rem;
        height: 0.92rem;
        background-color: #BF6C29;
        margin-right: 0.2rem;
      }
    }

    .lampMain {
      display: flex;
      height: 4.4rem;
      overflow: hidden;

      .lampMain1 {
        width: 5.72rem;
        height: 4.32rem;
        background-image: url("../../assets/images/c_icn_picturebox.png");
        background-size: cover;
        margin-left: 0.4rem;
        text-align: center;

        img {
          margin-top: 0.64rem;
          width: 4.16rem;
          height: 3.12rem;
        }
      }

      .lampMain2 {
        box-sizing: border-box;
        width: 9rem;
        height: 4.32rem;

        .des-title {
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 0.6rem;
          margin-bottom: 0.2rem;
          margin-top: 0.32rem;
        }

        .des-content {
          height: 100%;
          width: 100%;
          /*background-color: #5ac55a;*/
          overflow-y: auto;
          //overflow: scroll;
          font-family: PingFangSC-Light;
          font-size: 0.44rem;
          font-weight: lighter;
        }
      }
    }
  }

  .order {
    box-sizing: border-box;

    .orderTitle {
      position: relative;
      width: 100%;
      height: 1.56rem;
      background-image: url("../../assets/images/b_ic_background_1.png");
      background-size: cover;

      .text {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        span {
          box-sizing: border-box;
        }

        .s3 {
          font-size: 0.48rem;
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
    }

    .orderDetail {
      padding: 0.96rem 0.96rem;

      .van-cell-group {
        .van-cell {
          padding: 0.4rem 0;
          border-bottom: 1px solid #F5F5F5;
        }

        .num {
          box-sizing: border-box;
          padding: 0.32rem;
          overflow: hidden;

          ul {
            overflow: hidden;

            li {
              text-align: center;
              list-style: none;
              float: left;
              width: 3.36rem;
              height: 0.92rem;
              background-image: url("../../assets/images/b_ic_tag.png");
              background-size: 3.36rem 0.92rem;
              margin-right: 0.4rem;
              margin-bottom: 0.4rem;
              font-size: 0.48rem;
              line-height: 0.92rem;
              border: 1px solid #999999;
              border-radius: 0.2rem;
            }
          }

          .choose {
            background-color: #965b26;
          }

          .nochoose {
            background-color: #FFFFFF;
          }
        }
      }
    }
  }

  .dialog {
    font-size: 0.56rem;
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 11.2rem;
    height: 8rem;
    background-color: #ffffff;
    border-radius: 0.4rem;
    overflow: hidden;
    padding: 0 0.92rem;
    box-sizing: border-box;

    p {
      margin-top: 1.04rem;
      font-weight: bold;
      margin-bottom: 0.92rem;
    }

    .van-cell {
      padding: 0.32rem 0.64rem;
      font-size: 0.56rem;
    }

    .confirm {
      float: right;

      .s1 {
        display: inline-block;
        color: #999999;
        width: 2.8rem;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
      }

      .s2 {
        display: inline-block;
        color: #885022;
        width: 2.8rem;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
      }
    }
  }

  .shade {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .choose_list {
    display: flex;
    overflow-x: auto;
    margin-top: 0.56rem;
    height: 2.4rem;

    li {
      position: relative;
      font-size: 0.44rem;
      list-style: none;
      width: 4.6rem;
      height: 2rem;
      border: 1px solid #9D3024;
      border-radius: 5px;
      color: #9D3024;
      margin-right: 0.2rem;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    span {
      display: inline-block;
    }

    .s3, .s4 {
      text-align: center;
      width: 3.8rem;
    }

    .s3 {
      margin-bottom: 0.2rem;
    }

    .s5 {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    img {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .total {
    color: #9D3024;
    font-size: 0.56rem;
    float: right;
    margin-top: 0.64rem;
    margin-bottom: 1.4rem;

    .total_1 {
      margin-right: 0.4rem;
    }
  }

  .submitOrder {
    height: 2rem;
    width: 13.08rem;
    line-height: 2rem;
    background-image: url("../../assets/images/b_btn_pay.png");
    background-size: cover;
    border-radius: 0.2rem;
    /*text-align: center;*/
    font-size: 0.72rem;
    color: #885022;
    margin: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    position: relative;
    span {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    /*position: fixed;*/
    /*bottom: 1rem;*/
    /*left: 50%;*/
    /*transform: translateX(-50%);*/
  }

</style>
