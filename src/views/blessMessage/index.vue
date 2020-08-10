<template>
  <div class="blessMessage">
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
      :title="$t('m.blessMessage.writeMessage')"
    />
    <div class="content">
      <div class="card" v-for="(item,index) in seatList" :key="index">
        <van-cell class="topTitle">
          <template slot="title">
            <div class="top">
              <p class="top_1">{{item.lampHolderName}}</p>
              <p class="top_2"><span>编号:</span><span>{{item.lamp.number}}</span><span>灯位:</span><span>{{item.lamp.seat}}</span>
              </p>
            </div>
          </template>
        </van-cell>
        <div class="main">
          <p class="num"><span class="sp1">祈福者{{seatList.length === 1? '': index+1}}</span> <span class="sp2">(* 为必填资料)</span> <span class="sp3"
                                                                                                          v-if="index !== 0"
                                                                                                          @click="cloneBeforeInfo(index,item.id)">复用上表信息</span>
          </p>
        </div>
        <van-field
          v-model="item.realName"
          required
          input-align="right"
          label="姓名:"
          placeholder="请输入"
          is-link
          :error-message="errorMessageName"
          error-message-align="right"
          @input="validData('姓名',item.realName)"
        />
        <van-field
          v-model="item.cellphone"
          required
          input-align="right"
          label="手机号码:"
          placeholder="此为本地供地寻灯号码请务必填写"
          is-link
          :error-message="errorMessagePhone"
          error-message-align="right"
          @input="validData('手机号码',item.cellphone)"
        />
        <van-cell
          title="性别:"
          is-link
          :value="item.gender"
          @click="popShow('性别',index)"
        />
        <van-cell
          title="出生日期:"
          is-link
          :value="item.birthday"
          @click="popShow('出生日期',index)"
        />
        <van-cell
          title="年龄:"
          is-link
          :value="item.age"
        />
        <van-cell
          title="时辰:"
          is-link
          :value="item.birthHour"
          @click="popShow('时辰',index)"
        />
        <van-field
          v-model="item.telephone"
          input-align="right"
          label="固定电话:"
          placeholder="请输入"
          type="tel"
          is-link
          :error-message="errorMessageCellPhone"
          error-message-align="right"
          @input="validData('固定号码',item.telephone)"
        />
        <van-field label="居住地址:" placeholder="请输入" v-model="item.address" input-align="right" is-link/>
      </div>
    </div>

    <div class="submit" @click="next">提交</div>
    <van-popup
      v-model="show"
      position="bottom"
    >
      <van-datetime-picker
        v-if="popupType=='出生日期'"
        v-model="birthTime"
        type="date"
        @confirm="onConfirm"
        @cancel="onCancel"
        :max-date="currentDate"
        :min-date="new Date(1900,1, 1)"
      />
      <van-picker
        v-else-if="popupType=='时辰'"
        show-toolbar
        :columns="hourColumn"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
      <van-picker
        v-else-if="popupType=='性别'"
        show-toolbar
        :columns="genderColumn"
        @cancel="onCancel"
        @confirm="onConfirm"
      />


    </van-popup>

  </div>
</template>

<script>
  import {post} from "@/utils/request/index.js"
  import '../../assets/css/topNav.css'

  export default {
    name: "index",
    data() {
      return {
        seatList: [], //初始化订单座位信息表
        globalIndex: '', // 全局索引，用于记录当前是第几条的祈福个人信息
        birthTime: new Date(), // 出生日期picker选择器中绑定的值
        // list: [],  // 当前登录者的信息
        // fullName: '',
        // cellPhone: '',
        show: false,  // 控制底部弹出框的显示与隐藏
        currentDate: new Date(), // 当前日期
        minDate: new Date(1900, 1, 1),
        popupType: '', // picker选择器的类型
        // 时辰选择器配置项
        hourColumn: [
          '吉時',
          '午夜 12:00-上午 1:00 子時',
          '上午 1:00-上午 3:00 丑時',
          '上午 3:00-上午 5:00 寅時',
          '上午 5:00-上午 7:00 卯時',
          '上午 7:00-上午 9:00 辰時',
          '上午 11:00-上午 1:00 巳時',
          '下午 1:00-下午 3:00 午時',
          '下午 3:00-下午 5:00 未時',
          '下午 5:00-下午 7:00 申時',
          '下午 7:00-下午 9:00 酉時',
          '下午 9:00-下午 11:00 戌時',
          '下午 11:00-午夜 12:00 亥時',
        ],
        // 性别选择器配置项
        genderColumn: [
          "男",
          "女"
        ],
        orderId: '', // 当前订单Id
        // 提交的表单数组
        pilgrimList: [],
        errorMessageName: '', // 姓名错误提示信息
        errorMessagePhone: '', // 手机号码错误提示信息
        errorMessageCellPhone: '', // 固定号码错误提示信息
      }
    },
    methods: {
      onClickLeft(){
        this.$router.go(-1);
        // this.$router.push('/login')
      },
      // 点击显示底部弹窗
      popShow(type, index) {
        this.show = true;
        this.popupType = type;
        this.globalIndex = index;
        /*console.log(this.popupType)*/
        console.log(this.globalIndex)
      },
      // 根据出生日期计算当前年龄
      getOld(birthday) {
        // 根据出生日期计算年龄
        let age = '';
        if (birthday && birthday !== '请选择') {
          let beforeYear = Number(birthday.split('-')[0]);
          let beforeMonth = Number(birthday.split('-')[1]);
          let beforeDay = Number(birthday.split('-')[2]);
          console.log(beforeYear, beforeMonth, beforeDay)
          let date = new Date();
          let nowYear = date.getFullYear();
          let nowMonth = date.getMonth() + 1;
          let nowDay = date.getDate();
          console.log(nowYear, nowMonth, nowDay)
          if (nowYear === beforeYear) {
            age = 0 + '   岁';
          } else {
            if (nowMonth < beforeMonth) {
              age = (nowYear - beforeYear) + '岁';
            } else if (nowMonth === beforeMonth) {
              if (nowDay >= beforeDay) {
                age = (nowYear - beforeYear) + '岁';
              } else {
                age = (nowYear - beforeYear - 1) + '岁';
              }
            } else {
              age = (nowYear - beforeYear) + '岁';
            }
          }
        }
        return age;
      },
      // 当点击picker选择器的确认时触发
      onConfirm(value) {
        switch (this.popupType) {
          case '出生日期':
            let y = value.getFullYear();
            let m = value.getMonth() + 1;
            let d = value.getDate();
            if (m < 10) {
              m = '0' + m;
            }
            if (d < 10) {
              d = '0' + d;
            }
            this.seatList[this.globalIndex].birthday = y + '-' + m + '-' + d;
            let currentDate = new Date();
            this.seatList[this.globalIndex].age = currentDate.getFullYear() - value.getFullYear()+'岁';
            this.seatList[this.globalIndex].birthHour = '吉時';
            break;
          case '时辰':
            this.seatList[this.globalIndex].birthHour = value;
            break;
          case '性别':
            this.seatList[this.globalIndex].gender = value;
            break;
        }
        this.show = false;
      },
      // 点击隐藏底部弹窗
      onCancel() {
        this.show = false;
      },
      // 复用上表信息
      cloneBeforeInfo(index, id) {
        console.log(this.seatList[index - 1]);
        console.log(this.seatList[index]);
        let obj = {
          id: this.seatList[index].id,
          realName: this.seatList[index - 1].realName,
          telephone: this.seatList[index - 1].telephone,
          gender: this.seatList[index - 1].gender,
          birthday: this.seatList[index - 1].birthday,
          age: this.seatList[index - 1].age,
          birthHour: this.seatList[index - 1].birthHour,
          cellphone: this.seatList[index - 1].cellphone,
          address: this.seatList[index - 1].address,
          lamp:this.seatList[index].lamp
        };
        this.$set(this.seatList, index, obj);
        console.log(this.seatList);
      },
      // 检查数据格式要求
      validData(type, value) {
        let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        let regExpTw = /^09\d{8}$/;
        // console.log(type);
        if (type === '姓名') {
          if (value.trim().length < 1 || value.trim().length >= 16) {
            this.errorMessageName = '姓名的长度请控制在1-16之间';
            return false;
          }else {
            this.errorMessageName = '';
          }
        }
        if(type === '手机号码'){
          // let checkRex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
          if(!(regExpChina.test(value) || regExpTw.test(value))){
            this.errorMessagePhone = '请输入正确的手机号码';
            return false;
          }else {
            this.errorMessagePhone = ''
          }
        }
        if(type === '固定号码'){
          // let checkRex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
          if(!(regExpChina.test(value) || regExpTw.test(value))){
            this.errorMessageCellPhone = '请输入正确的手机号码';
            return false;
          }else {
            this.errorMessageCellPhone = ''
          }
        }
      },
      // 提交确认祈福信息
      next() {
        console.log(this.seatList);
        let isFinish = true;
        this.seatList.map((item, index) => {
          if (!item.realName) {
            this.$toast('祈福者姓名不能为空');
            isFinish = false;
            return false;
          } else if (!item.cellphone) {
            this.$toast('祈福者手机不能为空');
            isFinish = false;
            return false;
          }
        });
        if (isFinish) {
          console.log(this.seatList);
          // 整理提交香客的信息
          this.seatList.forEach((item, index) => {
            let obj = {
              id: '',
              realName: "",
              cellphone: "",
              telephone: "",
              gender: "",
              birthday: "",
              birthHour: "",
              address: ""
            };
            obj.id = item.id;
            obj.realName = item.realName;
            obj.cellphone = item.cellphone;
            if (item.gender) {
              obj.gender = item.gender;
            } else {
              obj.gender = '';
            }
            if (item.birthday) {
              obj.birthday = item.birthday;
            } else {
              obj.birthday = null;
            }
            if (item.birthHour) {
              obj.birthHour = item.birthHour;
            } else {
              obj.birthHour = '';
            }
            if (item.telephone) {
              obj.telephone = item.telephone;
            } else {
              obj.telephone = '';
            }
            if (item.address) {
              obj.address = item.address;
            } else {
              obj.address = '';
            }
            this.pilgrimList.push(obj);
            // console.log(obj);
          });
          console.log(this.pilgrimList);
          // console.log(this.seatList);
          // return false;
          post('api/pilgrim/batchUpdate', {pilgrimList: this.pilgrimList}, res => {
            console.log(res);
            if (res.data.code === 200) {
              this.$toast('香客信息提交成功');
              // 成功填写祈福信息，新增判断标识
              window.sessionStorage.setItem('writeSuccess', this.$route.query.orderId);
              console.log(window.sessionStorage.getItem('writeSuccess'), String(this.$route.query.orderId), window.sessionStorage.getItem('writeSuccess') !== String(this.$route.query.orderId));
              // return false;
              this.$router.push({path: '/success', query: {orderId: this.$route.query.orderId}});
              this.isWriteInfo = true;
            } else {
              this.$toast('香客信息提交失败');
            }
          })
        }
      }
    },
    mounted() {
      // 根据订单id查询香客信息
      post('api/pilgrim/findByOrderId', {orderId: this.$route.query.orderId,templeId:JSON.parse(localStorage.getItem('selectTempData')).id}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.seatList = res.data.data;
          console.log(this.seatList);
          if(!this.seatList[0].realName || this.seatList[0].realName === ''){
            this.seatList[0].realName = '大德';
          }
          this.seatList.forEach((item,index)=>{
            item.age = this.getOld(item.birthday);
          });
        } else {
          this.$toast('获取信息失败');
        }
      })
    },
    beforeDestroy() {
      // 如果没有填写成功祈福信息则跳转到服务记录页面
      if (!window.sessionStorage.getItem('writeSuccess') || window.sessionStorage.getItem('writeSuccess') !== String(this.$route.query.orderId)) {
        console.log(1);
        // return false;
        this.$router.push({path: '/order'});
      }
    }
  }
</script>

<style lang="less" scoped>
  .blessMessage {
    background-color: #F5F5F5;
    height: 100vh;
    overflow: auto;
    /*position: relative;*/

    .van-cell {
      padding: 0 0 0.3rem 0;
      border-bottom: 1px solid #eeeeee;
      margin-bottom: 0.48rem;
      font-size: 0.56rem;
    }

    .topTitle {
      padding: 0;
    }

    .content {
      .card {
        padding-left: 0.52rem;
        padding-top: 0.48rem;
        padding-right: 0.96rem;
        box-sizing: border-box;
        background-color: #FFFFFF;

        .top {
          .top_1 {
            font-size: 0.6rem;
            color: #885022;
            text-align: center;
            margin-bottom: 0.3rem;
          }

          .top_2 {
            font-size: 0.44rem;
            color: #999999;

            span {
              margin-right: 0.2rem;
            }
          }
        }

        .main {
          .num {
            height: 1.28rem;
            margin-top: 0.48rem;
            margin-bottom: 0.5rem;
            position: relative;

            .sp1 {
              font-size: 0.56rem;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }

            .sp3 {
              padding: 0.08rem;
              border: 0.04rem solid #cccccc;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              font-size: 0.56rem;
            }

            .sp2 {
              font-size: 0.44rem;
              color: #999999;
              margin-left: 0.38rem;
              position: absolute;
              left: 1.92rem;
              top: 50%;
              transform: translateY(-50%);
            }
          }

        }
      }
    }

    .submit {
      height: 2rem;
      width: 13.08rem;
      background-image: url("../../assets/images/b_btn_pay.png");
      background-size: cover;
      border-radius: 0.2rem;
      /*position: absolute;*/
      /*left: 50%;*/
      /*bottom: 1.12rem;*/
      /*transform: translateX(-50%);*/
      margin: 3rem auto 0.92rem;
      font-size: 0.72rem;
      text-align: center;
      line-height: 2rem;
      color: #885022;
    }
  }

  .van-cell--required::before {
    position: absolute;
    left: -10px;
    color: #f44;
    font-size: 14px;
    content: '*';
  }
</style>
