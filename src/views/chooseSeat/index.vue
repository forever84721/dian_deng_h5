<template>
  <div class="chooseSeat">
    <van-nav-bar
      :title="$t('m.lampMenu.selfSelect')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="top">
      <p class="p1">{{lampName}}</p>
      <p class="p2">
        <span style="margin-right: 0.32rem">{{$t('m.timeSelect')}}:</span><span
        style="margin-right: 0.32rem">{{days}} 天</span><span>(今天 {{currentTime}} ~ {{afterTime}})</span>
      </p>
    </div>
    <div class="main">
      <div class="select" @click="selectStandard">
        {{selectStandardName}}
        <van-icon :name="arrow"/>
      </div>
      <div class="explain">
        <div class="explain_son">
          <span style="margin-right: 0.28rem" class="spec_1"></span>
          <span style="margin-right: 0.28rem" class="spec_1">
            VIP
          </span>
          任选
          <span style="margin-left: 1.2rem;" class="spec_2">
          </span>
          <span style="margin:0 0.25rem" class="spec_2"></span>
          已售
        </div>
      </div>
<!--      <div class="seatList_top">-->
<!--        <ul>-->
<!--          <li v-for="(item,index) in seatDetailList" :key="index"-->
<!--              :class="[index !== seatDetailList.length - 1 ? 'li_style' : '']" >{{index+1}}-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
      <div class="seatList">

        <div class="seatList_left">
          <ul>
            <li v-for="(item,index) in seatDetailList" :key="index"
                :class="[index !== seatDetailList.length - 1 ? 'li_style' : '']" >{{index+1}}
            </li>
          </ul>
        </div>
        <div class="seatList_right">
          <div class="seatList_top">
            <ul>
              <li v-for="(item,index) in seatDetailList" :key="index"
                  :class="[index !== seatDetailList.length - 1 ? 'li_style' : '']" >{{index+1}}
              </li>
            </ul>
          </div>
          <div v-for="(item1,index1) in seatDetailList" :key="index1"
               :class="[index1 !== seatDetailList.length - 1 ? 'li_style' : '','row_style']">
            <ul>
              <li id="seat" :data-id="item2.number" v-for="(item2,index2) in item1" :key="index2"
                  @click="selectSeat(item2,$event)" class='seatDemo' :class="{'isBlock': item2.ignore, 'seatStatus': item2.serviceStatus === 'servicing'}">
                {{item2.important+'' === 'true' ? 'VIP' : '' }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!--      <div class="seatDetail" v-for="(item,index) in chooseSeatList" :key="index">-->
      <!--        <p style="margin: 0.44rem 0 0.1rem 0">{{item.location}}</p>-->
      <!--        <p>{{$route.query.price}} 元</p>-->
      <!--      </div>-->
      <ul class="choose_list">
        <li v-for="(item,index) in chooseSeatList" :key="index">
                <span class="s5">
                  <span class="s3">{{item.number}}</span>
                  <span class="s4">{{item.price}}元</span>
                </span>
          <img src="../../assets/images/b_g_h_d.png" alt="" width="20" height="20"
               @click="deleteSeat(item,index)">
        </li>
      </ul>
    </div>
    <div class="submit" @click="nextTo">
      {{btnText}}
    </div>

    <!-- 选择柱面   -->
    <van-popup v-model="showPicker" position="bottom" @close="changeArrow">
      <van-picker
        show-toolbar
        title="请选择柱"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
  import checkIcon from '../../assets/images/b_icn_choice.png'
  import uncheckIcon from '../../assets/images/b_ic_more.png'
  import {post} from '@/utils/request/index'
  import {Toast} from 'vant'
  import '../../assets/css/topNav.css'

  export default {
    name: "index",
    data() {
      return {
        btnText: '请选灯位',
        lampName: '',
        // 天数
        days: '',
        // 当前时间
        currrentTime: '',
        // 到期时间
        afterTime: '',
        // 选择柱的名字
        selectStandardName: '',
        arrow: 'arrow-down',
        // 选择柱面的picker选择器配置项
        columns: [],
        showPicker: false,
        standardList: [],
        // 当前灯柱信息
        currentStandard: {},
        // 行数
        rowArr: [],
        // 列数
        colArr: [],
        // 座位表详细数据
        seatDetailList: [],
        // 选择的座位列表
        chooseSeatList: []
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      // 选择柱面
      selectStandard() {
        this.showPicker = true;
        this.arrow = 'arrow-up'
      },
      // 取消选择灯柱
      onCancel() {
        this.showPicker = false;
        this.arrow = 'arrow-down'
      },
      // 确认选择灯柱
      onConfirm(value, index) {
        // 切换灯柱，显示不同灯座的座位信息
        this.seatDetailList = [];
        this.showPicker = false;
        this.selectStandardName = value;
        console.log(value, index);
        this.currentStandard = this.standardList[index];
        console.log(this.currentStandard);
        for (let i = 1; i <= this.currentStandard.verticalSize; i++) {
          let nullArr = [];
          this.seatDetailList.push(nullArr);
        }
        console.log(this.currentStandard);
        post('api/lamp/findByLampStandId', {lampStandId: this.standardList[index].id}, res => {
          console.log(res);
          this.seatDetailList = res.data.data;
          console.log(this.seatDetailList);
          let timer = setTimeout(() => {
            this.currentStandardSeat(this.chooseSeatList,timer,index);
          }, 0);
        });
      },
      // 改变箭头方向
      changeArrow() {
        this.arrow = 'arrow-down'
      },
      // 从底部已选择的座位列表中删除数据
      deleteSeat(item, index) {
        this.chooseSeatList.splice(index, 1);
        if (this.chooseSeatList.length === 0) {
          this.btnText = '请选灯位'
        } else {
          let totalPrice = 0;
          this.chooseSeatList.forEach((item,index)=> {
            totalPrice = item.price + totalPrice;
          });
          this.btnText = totalPrice + '元确认选择';
        }
        // 取消座位列表中对应的样式
        for (let i = 0; i <= document.querySelectorAll('#seat').length - 1; i++) {
          if (item.number === document.querySelectorAll('#seat')[i].getAttribute('data-id')) {
            // console.log(1);
            document.querySelectorAll('#seat')[i].classList.remove('selectStatus');
            break;
          }
        }
      },
      // 选择座位
      selectSeat(item, e) {
        let obj = {
          id:'',
          number: '',
          price: ''
        };
        console.log(item);
        console.log(e.currentTarget);
        if (item.serviceStatus === 'servicing') {
          this.$toast('该灯位已被占用,请选择其他灯位');
          return false;
        }
        // 如果之前已经选择，再次点击，取消选择
        if (e.currentTarget.classList.contains('selectStatus')) {
          e.currentTarget.classList.remove('selectStatus');
          // console.log(e.currentTarget.getAttribute('data-id'));
          this.chooseSeatList.some((item, index) => {
            // 从已选择的座位数据列表中删除对应数据
            if (item.number === e.currentTarget.getAttribute('data-id')) {
              this.chooseSeatList.splice(index, 1);
              // 改变相应的文字提示信息
              if (this.chooseSeatList.length === 0) {
                this.btnText = '请选灯位'
              } else {
                let totalPrice = 0;
                this.chooseSeatList.forEach((item,index)=> {
                  totalPrice = parseInt(item.price) + totalPrice;
                });
                this.btnText = totalPrice + '元确认选择';
              }
              return true;
            }
          });
          console.log(this.chooseSeatList);
        } else {
          e.currentTarget.classList.add('selectStatus');
          // obj.standardId = this.currentStandard.id;
          obj.id = item.id;
          obj.number = item.number;
          if(!item.important){
            obj.price = this.$route.query.standardPrice;
          }else {
            obj.price = this.$route.query.vipPrice;
          }
          this.chooseSeatList.push(obj);
          let totalPrice = 0;
          this.chooseSeatList.forEach((item,index)=> {
            totalPrice = parseInt(item.price) + totalPrice;
          });
          console.log(totalPrice);
          this.btnText = totalPrice + '元确认选择';
          console.log(this.chooseSeatList);
        }
      },
      // 渲染当前柱面已选择的座位数据
      currentStandardSeat(chooseData,timer,Index){
        if (chooseData.length === 0) {
          this.btnText = '请选灯位'
        } else {
          let totalPrice = 0;
          chooseData.forEach((item,index)=> {
            totalPrice = parseInt(item.price) + totalPrice;
          });
          this.btnText = totalPrice + '元确认选择';
        }
        // this.btnText = chooseData.length * this.$route.query.price + '元确认选择';
        // let count = this.chooseSeatList.length;
        // 计数器
        let count = 0;
        let allow = false;
        chooseData.forEach((item, index) => {
          console.log(item.number.split('柱')[0].split('座')[1],this.standardList[0].standNumber);
          if (item.number.split('柱')[0].split('座')[1] === this.standardList[Index].standNumber) {
            count++;
            allow = true;
          }
        });
        console.log(count);
        if(count === 0){
          clearInterval(timer);
        }
        console.log(document.querySelectorAll('#seat'));
        // 如果当前柱没有已经选择的座位，则不渲染
        console.log(allow);
        if (allow) {
          chooseData.some((item, index) => {
            // console.log(document.querySelectorAll('#seat')[index+1].getAttribute('data-id'));
            for (let i = 0; i <= document.querySelectorAll('#seat').length - 1; i++) {
              if (item.number === document.querySelectorAll('#seat')[i].getAttribute('data-id')) {
                console.log(1);
                document.querySelectorAll('#seat')[i].classList.add('selectStatus');
                count--;
                break;
              }
            }
            // 当已选择座位全部重新渲染之后，清除定时器
            if (count === 0) {
              clearInterval(timer);
              return true;
            }
          });
        }
      },
      // 确认选择
      nextTo() {
        // 如果当前没有选择座位，清除之前的相关信息
        if (this.chooseSeatList.length === 0) {
          if (window.localStorage.getItem('seatInfo')) {
            window.localStorage.removeItem('seatInfo');
          }
          if (window.localStorage.getItem('ifSelectNum')) {
            window.localStorage.removeItem('ifSelectNum');
          }
        } else {
          window.localStorage.setItem('seatInfo', JSON.stringify(this.chooseSeatList));
        }
        // this.$router.push({path:'/home',lampCategoryId:this.$route.query.lampCategoryId});
        this.$router.go(-1);
      }
    },
    mounted() {
      // 对时间格式的处理
      let currentMonth = new Date().getMonth();
      let currentDays = new Date().getDate();
      console.log(currentDays);
      this.currentTime = (currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : currentMonth + 1) + '-' + (currentDays < 10 ? '0' + currentDays : currentDays);
      this.days = this.$route.query.days;
      let newTime = new Date(new Date().getTime() + this.days * 24 * 60 * 60 * 1000);
      console.log(newTime);
      // 计算到期时间
      this.afterTime = (new Date(newTime).getMonth() + 1 < 10 ? '0' + (new Date(newTime).getMonth() + 1) : new Date(newTime).getMonth() + 1) + '-' + (new Date(newTime).getDate() < 10 ? '0' + new Date(newTime).getDate() : new Date(newTime).getDate());
      // 获取灯种信息
      post('api/lampCategory/findById', {id: this.$route.query.lampCategoryId}, res => {
        this.lampName = res.data.data.lampCategory.name;
        console.log(this.lampName);
      });
      // 获取柱面信息
      post('api/lampStand/findBySupplyType', {supplyType:'online',lampHolderId: this.$route.query.lampHolderId}, res => {
        console.log(res);
        this.standardList = res.data.data;
        this.currentStandard = this.standardList[0];
        console.log(this.currentStandard);
        // 设置行相关的数据
        for (let i = 1; i <= this.currentStandard.verticalSize; i++) {
          let nullArr = [];
          this.seatDetailList.push(nullArr);
        }
        // console.log(this.seatDetailList);
        // 获取初始化座位信息
        post('api/lamp/findByLampStandId', {lampStandId: this.standardList[0].id}, res => {
          this.seatDetailList = res.data.data;
          console.log(this.seatDetailList);
          // 确保页面已经渲染完毕
          let timer = setTimeout(() => {
            // 如果用户还没提交订单再次进入选座
            if (window.localStorage.getItem('seatInfo')) {
              this.chooseSeatList = JSON.parse(window.localStorage.getItem('seatInfo'));
              console.log(this.chooseSeatList);
              this.currentStandardSeat(this.chooseSeatList,timer,0);
            }
          }, 0);
        });
        console.log(this.standardList);
        // 柱面配置项
        this.standardList.forEach((item, index) => {
          this.columns.push(item.standNumber + '柱');
        });
        this.selectStandardName = this.columns[0];
      });
    }
  }
</script>

<style scoped lang="less">
  .chooseSeat {
    .top {
      width: 100%;
      height: 2rem;
      background-color: #FFFFFF;
      padding-left: 0.96rem;
      box-sizing: border-box;
      overflow: hidden;

      .p1 {
        font-size: 0.6rem;
        color: #666666;
        font-weight: bold;
        margin-top: 0.32rem;
        margin-bottom: 0.16rem;
      }

      .p2 {
        color: #999999;
        font-size: 0.44rem;
      }
    }

    .main {
      width: 100%;
      height: 15.84rem;
      background-color: #f5f5f5;
      font-size: 0.48rem;
      color: #666666;
      overflow: hidden;

      .select {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.72rem;
        width: 3.2rem;
        height: 0.92rem;
        background-color: #FFFFFF;
        line-height: 0.92rem;
        padding: 0 0.4rem;
        box-sizing: border-box;
        border-radius: 0.1rem;
        border-color: #999999;

        .van-icon {
          position: absolute;
          top: 0.24rem;
          right: 0.4rem;
        }
      }

      .explain {
        margin-top: 0.48rem;
        width: 100%;
        height: 0.8rem;

        .explain_son {
          width: 8rem;
          height: 0.8rem;
          line-height: 0.8rem;
          /*background-color: #00B1E4;*/
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.4rem;
          color: #666666;

          .spec_1 {
            display: inline-block;
            height: 0.8rem;
            line-height: 0.8rem;
            text-align: center;
            width: 0.8rem;
            border: 1px solid #999999;
            box-sizing: border-box;
            border-radius: 0.2rem;
            vertical-align: bottom;
          }

          .spec_2 {
            display: inline-block;
            height: 0.8rem;
            width: 0.8rem;
            vertical-align: bottom;
            box-sizing: border-box;
            border-radius: 0.2rem;
            border: 1px solid #999999;
            background-image: url("../../assets/images/b_btn_wick_s.png");
            background-size: cover;
          }
        }
      }
      .seatList_top {
        margin-top: 0.52rem;
        background-color: #D5D5D5;
        width: 84%;
        height: 0.56rem;
        border-radius: 0.2rem;
        margin-left: 0.56rem;
        box-sizing: border-box;

        ul {
          width: 100%;
          li {
            float: left;
            text-align: center;
            height: 0.56rem;
            width:1.2rem ;
            line-height: 0.56rem;
          }
        }
      }
      .seatList {
        width: 100%;
        height: 12.92rem;
        /*background-color: #5ac55a;*/
        overflow-y: auto;

        .seatList_left {
          float: left;
          background-color: #D5D5D5;
          width: 0.56rem;
          border-radius: 0.2rem;
          margin-left: 0.52rem;
          padding: 0.6rem 0;
          box-sizing: border-box;

          ul {
            li {
              text-align: center;
              height: 0.8rem;
              line-height: 0.8rem;
            }
          }
        }

        .seatList_right {

          /*float: left;*/
          width: 84%;
          padding: 0.6rem 0;
          box-sizing: border-box;
          /*background-color: pink;*/
          margin-left: 0.64rem;
          overflow-x: auto;

          .row_style {
            height: 0.8rem;
            line-height: 0.8rem;
            /*background-color: gold;*/
          }

          ul {
            display: flex;
            flex-wrap: nowrap;

            li {
              height: 0.8rem;
              width: 0.8rem;
              border: 1px solid #999999;
              box-sizing: border-box;
              float: left;
              text-align: center;
              line-height: 0.8rem;
              margin-right: 0.36rem;
              border-radius: 0.2rem;
              flex-shrink: 0;
              font-size: 0.4rem;
              color: #666666;
            }
          }
        }
      }
    }

    .footer {
      box-sizing: border-box;
      padding: 0.48rem;
      height: 2.96rem;
      width: 100%;

      .choose_list {
        display: flex;
        overflow-x: auto;
        flex-wrap: nowrap;

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

      /*.seatDetail {*/
      /*  float: left;*/
      /*  height: 2rem;*/
      /*  width: 4.2rem;*/
      /*  border: 1px solid #9D3024;*/
      /*  box-sizing: border-box;*/
      /*  flex-shrink: 0;*/
      /*  margin-right: 0.2rem;*/
      /*  border-radius: 0.2rem;*/
      /*  p {*/
      /*    font-size: 0.44rem;*/
      /*    color: #9D3024;*/
      /*    text-align: center;*/
      /*  }*/
      /*}*/
    }

    .submit {
      font-size: 0.72rem;
      color: #885022;
      text-align: center;
      /*position: fixed;*/
      /*left: 50%;*/
      /*transform: translateX(-50%);*/
      /*bottom: 0.96rem;*/
      margin: auto;
      margin-top: 1rem;
      background-image: url("../../assets/images/b_btn_pay.png");
      width: 13.08rem;
      background-size: 100% 100%;
      height: 2rem;
      line-height: 2rem;
    }

    .van-picker /deep/ .van-picker__cancel {
      color: #999999;
    }

    .van-picker /deep/ .van-picker__confirm {
      color: #885022;
    }

    .li_style {
      margin-bottom: 0.32rem;
    }

    .seatDemo {
      &.seatStatus {
        background-image: url("../../assets/images/b_btn_wick_s.png");
        background-size: cover;
      }
      &.selectStatus {
        background-image: url("../../assets/images/b_btn_chooselamp_s.png");
        background-size: cover;
      }
      &.isBlock {
        visibility: hidden;
      }
    }
    .visibilityStatus {
      visibility: hidden;
    }
  }
</style>
