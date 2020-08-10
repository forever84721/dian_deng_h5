<template>
  <div class="index">
    <van-nav-bar
      :title="$t('m.personal.serviceLog')"
      left-arrow
      @click-left="onClickLeft"
    />
<!--    <div class="space" style="height: 46px"></div>-->

    <div class="have" v-if="show">
      <div class="lightDes" @click="isClick(item)" v-for="(item,index) in orderList" :key="index">
        <div class="title">
          <div>{{item.templeName}}<span style="font-size: 15px"> > </span>
          </div>
<!--          {{item.orderTimeStatus}}+{{item.status}}-->
          <span class="status" v-if=" item.status === 'pending' && item.orderTimeStatus === 'on'  ">待付款</span>
          <span class="status" v-if="item.status === 'paid'">已支付</span>
<!--          <span class="status" v-if=" item.status === 'pending ' ">已取消</span>-->
          <span class="status" v-if="(item.status === 'pending' && item.orderTimeStatus === 'off') || item.status === 'closed'  ">已结束</span>
      </div>
        <div class="content">
          <div class="img">
            <img :src="'https://wenxuanguangmingdeng.com/attachment/' + item.lampCategoryImage" alt="燈">
          </div>
          <div class=des>
            <div>服务类型：{{item.lampCategoryName}}<span class="space">x</span>{{item.lampQuantity}}</div>
            <div>订单编号：{{item.id}}</div>
            <div>创建时间：{{item.createAt}}</div>
            <div class="price">订单金额：{{item.amount}}元
              <span class="button" v-if="item.status === 'pending' && item.orderTimeStatus === 'on'" @click.stop="goPay(item.id,item.amount)">付款</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="noHave" v-if="!show">
      <div>
        <img src="../../assets/images/c_kx.png" alt="">
        <p>您还没有记录呢，快去逛逛吧</p>
      </div>
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
        // code: '',
        // startLightAt: '',
        // endLightAt: '',
        // orderList: [],
        orderList: [],
        // 超时时间
        timeOut:'',
        timer:null,
        show:true,
        orderTimeData: {
          currentTime: '',
          formatCreateTime: ''
        },
        orderTimeShow:'on',
        roCallTime: ''
      }
    },
    methods: {
      // 返回上一级
      onClickLeft() {
        this.$router.go(-1);
      },
      // 前往付款页面
      goPay(id,money) {
        this.$router.push({path:'/pay',query:{orderId:id,money:money}});
      },
      isClick(item) {
        // 如果当前订单状态是待填写，则跳转到填写祈福信息页面，否则跳转到订单详情页面
        if(item.status === 'paid'){
          this.$router.push({path:'/blessMessage',query:{orderId:item.id}});
        }else {
          this.$router.push({path:'/orderDetail',query:{orderId:item.id}});
        }
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
        let st = data.currentTime.replace(/-/g, "/"),//当前服务器时间
          ct = data.formatCreateTime.replace(/-/g, "/");//创建订单时间
        let ts = new Date(st).getTime(),
          tc = new Date(ct).getTime();
        let cm = 15 * 60 * 1000 - (ts - tc);
        //console.log(cm)
        this.runBack(cm);
      },
      runBack(cm) {
        if (cm > 0) {
          // console.log(this.orderTimeShow)
          // this.orderTimeShow = 'on'
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
          this.orderTimeShow = 'off'

        }
      },
    },
    mounted() {
      let currentTime = new Date().getTime();
      // 超时时间设置
      this.timeOut = 15 * 60 * 1000;
      console.log(currentTime);
      let userId = JSON.parse(window.localStorage.getItem('userMsg')).id;
      // console.log(userId);
      // 根据用户id查询订单记录
      post('api/order/findByUserIdOrderByCreateAtDesc',{},res => {
        this.orderList = res.data.data;
        console.log(this.orderList);
        let len = this.orderList.length
        console.log(len)
        for (let i = 0 ; i <= len-1; i++) {
          // this.orderTimeData.currentTime = this.formatDateTime(new Date())
          // this.orderTimeData.formatCreateTime = JSON.stringify(this.orderDetail.updateAt)
          // this.ComputerTime(this.orderTimeData)
          // console.log(this.orderList[i].createAt)
          this.orderTimeData.currentTime = this.formatDateTime(new Date())
          this.orderTimeData.formatCreateTime = this.orderList[i].createAt
          this.ComputerTime(this.orderTimeData)
          this.orderList[i].orderTimeStatus = this.orderTimeShow
          console.log(this.orderList[i].orderTimeStatus)
        }
        if(this.orderList.length === 0){
          this.show = false;
        }
        console.log(this.orderList);
        // 筛选出已关闭的订单
        // let closeOrderList = [];
        // for(let i=0;i<=this.orderList.length - 1 ;i++){
        //   if(this.orderList[i].status === '已关闭'){
        //     closeOrderList.push(this.orderList[i]);
        //   }
        // }
        // // 筛选出未关闭的订单
        // let otherOrderList = [];
        // for(let i=0;i<=this.orderList.length - 1 ;i++){
        //   if(this.orderList[i].status !== '已关闭'){
        //     otherOrderList.push(this.orderList[i]);
        //   }
        // }
        // console.log(closeOrderList);
        // console.log(otherOrderList);
        // // 将已关闭的订单放到页面的最后显示
        // this.orderList =[];
        // this.orderList=otherOrderList;
        // for(let i =0 ;i<=closeOrderList.length -1;i++){
        //   this.orderList.push(closeOrderList[i]);
        // }
        // console.log(this.orderList);
        // this.orderList.forEach((item,index) => {
        //   // console.log(item);
        //   let beforeTime = new Date(item.createAt).getTime();
        //   // console.log(beforeTime);
        //   // 如果订单已超时，关闭当前订单
        //   if(item.status === '待付款' && currentTime - beforeTime >= this.timeOut){
        //     // console.log(1);
        //     post('api/order/clossOrder',{id:item.id},res => {
        //       console.log(res);
        //       location.reload();
        //     })
        //   }
        // })
      });
      console.log(this.timeOut);
    },
    destroyed() {
      // clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="less">
  .index {
    /*padding: 10px 10px 0 10px;*/
    /*height: 100vh;*/
    /*background-color: #F5F5F5;*/
    /*overflow: auto;*/
    /*.van-nav-bar {*/
    /*  position: fixed;*/
    /*  top: 0;*/
    /*  left: 0;*/
    /*  width: 100%;*/
    /*}*/

    .have {
      overflow: auto;
      height: calc(100vh - 46px);
      background-color: #F5F5F5;
      .lightDes {
        position: relative;
        left: 50%;
        top: 0.32rem;
        transform: translateX(-50%);
        width: 90%;
        margin-bottom: 0.4rem;
        background-color: white;
        box-sizing: border-box;
        padding: 0.4rem 0 0 0;
        border-radius: 0.4rem;

        .title {
          display: flex;
          justify-content: space-between;
          padding-left: 0.2rem;
          padding-right: 0.6rem;
          font-family: PingFangSC-Light;
          font-size: 0.48rem;
          font-weight: lighter;
          border-left: 0.12rem solid #BF6C29FF;

          .status {
            display: inline-block;
            height: 0.8rem;
            line-height: 0.8rem;
          }

          span {
            color: #885022FF;
          }
        }

        .content {
          display: flex;
          flex-direction: row;
          align-items: center;

          box-sizing: border-box;

          .img {
            width: 6.4rem;
            height: 4.8rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url("../../assets/images/c_icn_picturebox.png");
          }
        }

        .content img {
          display: block;
          width: 4.6rem;
          height: 3.36rem;
          margin: 0.72rem auto;
        }

        .des {
          flex: 5;
          display: flex;
          flex-direction: column;
          color: #666666;
          div {
            font-family: PingFangSC-Light;
            font-size: 0.44rem;
            font-weight: lighter;
            margin-bottom: 0.2rem;
            .space {
              margin: 0 0.2rem;
            }
          }

          .price {

            .button {
              float: right;
              padding: 0.08rem 0.32rem;
              margin: 0.4rem 0.4rem 0 0;
              border: 1px solid #885022FF;
              color: #885022FF;
              border-radius: 0.16rem;
            }

          }

          /*.des-title{*/
          /*  font-family: PingFangSC-Medium;*/
          /*  font-weight: bold;*/
          /*  font-size: 15px;*/
          /*  margin-bottom: 5px;*/
          /*}*/
          /*.des-content{*/
          /*  margin-top: 3px;*/
          /*  font-family: PingFangSC-Light;*/
          /*  font-size: 11px;*/
          /*  font-weight: lighter;*/
          /*  display: flex;*/
          /*  flex-direction: column;*/
          /*}*/
        }

        /*}*/

      }

    }

    .noHave {
      img {
        position: absolute;
        top: 3.36rem;
        left: 50%;
        transform: translateX(-50%);
        width: 7.84rem;
        height: 7.12rem;
      }
      p {
        font-size: 0.56rem;
        color: #999999;
        position: absolute;
        top: 13.92rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

</style>
