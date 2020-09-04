<template>
  <div class="safe">
    <div class="first" v-if="show1">
      <van-nav-bar
        :title="$t('m.personal.verify')"
        left-arrow
        @click-left="onClickLeft"
      />
      <van-cell-group>
        <van-field
          v-model="oldPhone"
          center
          clearable
          :label="$t('m.personal.oldTel')"
          :placeholder="$t('m.personal.pleaseTel')"
        >
          <van-button slot="button" size="small" @click="getMessageNum">{{time === 0? $t('m.personal.messageNum'): btnTxt}}</van-button>
        </van-field>
        <van-field
          v-model="oldMessageNum"
          center
          clearable
          :label="$t('m.personal.checkNum')"
          :placeholder="$t('m.personal.pleaseNum')"
        >
        </van-field>
      </van-cell-group>
      <div class="next" @click="next">
        {{$t('m.personal.next')}}
      </div>
    </div>

    <div class="second" v-if="show2">
      <van-nav-bar
        :title="$t('m.personal.bindNewTel')"
        left-arrow
        @click-left="onClickLeft"
      />
      <van-cell-group>
        <van-field
          v-model="newPhone"
          center
          clearable

          :placeholder="$t('m.personal.pleaseTel')"
        >
          <template slot="left-icon">
            <div class="tip">
              <span>+{{areaCode+area}}</span>
              <van-icon class="icon" :name="arrow" />
            </div>
          </template>
          <van-button slot="button" size="small" @click="getMessageNum">{{time === 0? $t('m.personal.messageNum'): btnTxt}}</van-button>
        </van-field>
        <van-field
          v-model="newMessageNum"
          center
          clearable
          :label="$t('m.personal.checkNum')"
          :placeholder="$t('m.personal.pleaseNum')"
        >
        </van-field>
      </van-cell-group>
      <div class="select" @click="selectAreaCode"></div>
      <div class="next" @click="next">
        {{$t('m.personal.bind')}}
      </div>
    </div>

    <div class="thirdly" v-if="show3">
      <van-nav-bar
        :title="$t('m.personal.changeTel')"
        left-arrow
        @click-left="onClickLeft"
      />
      <div>
        <img src="../../../assets/images/b_icn_success.png" alt="">
        <div class="btn" @click="handleClick">已成功更换手机号</div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {Toast} from 'vant'
  import {post} from "../../../utils/request";

  export default {
    name: 'safe',
    data() {
      return {
        // 旧手机号码
        oldPhone: '',
        // 旧手机验证码
        oldMessageNum: '',
        // 新手机号码
        newPhone: '',
        // 新手机验证码
        newMessageNum: '',
        show1: true,
        show2: false,
        show3: false,
        userInfo: {},
        arrow: 'arrow-down',
        areaCode: '86',
        area:'中国',
        time: 0,
        btnTxt: "",
        timeOut: '',
      }
    },
    mounted() {
      if (this.$route.query.areaCode) {
        this.areaCode = this.$route.query.areaCode + '';
        console.log(this.areaCode);
        if(this.areaCode === '86'){
          this.area = '中国';
        }
        if(this.areaCode === '886'){
          this.area = '台湾';
        }
      }
      if(location.href.indexOf('show2' )!== -1) {
        this.show2= true;
        this.show1= false;
      }
      post('api/user/get', {}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.userInfo = res.data.data;
        }
      });
    },
    methods: {
      //验证码的倒计时
      timer() {
        console.log("timer")
        if (this.time > 0) {
          this.time--;
          this.btnTxt = this.time + "s";
          this.timeOut = setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.disable = false;
        }
      },
      // 获取短信验证码
      getMessageNum() {
        if (this.show1) {
          if (this.oldPhone.trim().length === 0) {
            Toast('请先输入您的手机号码');
            return false;
          }
          if (this.oldPhone !== this.userInfo.cellphone) {
            // Toast('您输入的手机号有误，请重新输入!');
            Toast('该手机号未注册')
            return false;
          }
          post('api/user/sendUpdatePasswordCaptcha', {type: '86', cellphone: this.oldPhone}, res => {
            if (res.data.code === 200) {
              this.time = 60;
              this.timer()
              Toast('验证码发送成功')
            }else {
              Toast(res.data.message)
            }
            console.log(res);
          })
        } else if (this.show2) {
          let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
          let regExpTw = /^09\d{8}$/;
          if (this.newPhone.trim().length === 0) {
            Toast('请先输入您的手机号码');
            return false;
          }
          if (this.areaCode === '86') {
            if (!regExpChina.test(this.newPhone)) {
              Toast('请输入正确的手机号');
              return false;
            }
          }
          if (this.areaCode === '886') {
            if (!regExpTw.test(this.newPhone)) {
              Toast('请输入正确的手机号');
              return false;
            }
          }
          // if (!(regExpChina.test(this.newPhone)||regExpTw.test(this.newPhone))) {
          //   this.errorMessage = '该手机号未注册';
          //   Toast('请输入正确的手机号');
          //   return false;
          // }
          post('api/user/sendRegisterationCaptcha', {type: this.areaCode, cellphone: this.newPhone}, res => {
            if (res.data.code === 200) {
              this.time = 60;
              this.timer()
              Toast('验证码发送成功')
            } else {
              Toast(res.data.message)
            }
            console.log(res);
          })
        }
      },
      // 实现返回上一级
      onClickLeft() {
        if (this.show2) {
          this.show2 = false;
          this.show1 = true;
        } else {
          this.$router.go(-1);
        }
      },
      //选择区号
      selectAreaCode() {
        // console.log(1);
        this.$router.push({
          path: '/chooseAreaCode',
          query: {origin: 'safe'},
        });
      },
      next() {
        // Toast('1');
        this.time = 0;
        clearTimeout(this.timeOut)
        if (this.show1) {
          if (this.oldPhone.trim().length === 0) {
            Toast('请先输入您的手机号码');
            return false;
          }
          if (this.oldPhone !== this.userInfo.cellphone) {
            Toast('您输入的手机号有误，请重新输入!');
            return false;
          }
          if (this.oldMessageNum.trim().length === 0) {
            Toast('请输入验证码');
            return false;
          }
          post('api/user/checkCaptcha', {cellphone: this.oldPhone, captcha: this.oldMessageNum}, res => {
            if (res.data.code === 200) {
              this.show2 = true;
              this.show1 = false;
            } else {
              Toast('验证码错误');
            }
          })
        } else if (this.show2) {
          if (this.newPhone.trim().length === 0) {
            Toast('请先输入您的手机号码');
            return false;
          } else if (this.newMessageNum.trim().length === 0) {
            Toast('请输入验证码');
            return false;
          }
          post('api/user/checkCaptcha', {cellphone: this.newPhone, captcha: this.newMessageNum}, res => {
            if (res.data.code === 200) {
              post('api/user/update', {user: {
                  id : JSON.parse(localStorage.getItem('userMsg')).id,
                  cellphone:this.newPhone
                }}, res => {
                console.log(res, "show3")
              })
              this.show3 = true;
              this.show2 = false;
            } else {
              Toast('您输入的手机号或者验证码有误');
            }
          });
        }
      },
      handleClick() {
        this.$router.push('safe')
      }
    }
  }
</script>

<style lang="less" scoped>

  .next {
    width: 10.04rem;
    height: 2rem;
    background-image: url("../../../assets/images/b_btn_search.png");
    background-size: 100%;
    line-height: 2rem;
    text-align: center;
    font-size: 0.72rem;
    color: #885022;
    margin-top: 0.92rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .second {
    position: relative;
  }
  .tip {
    width: 4.5rem;
    z-index: 999;
  }
  .icon {
    display: inline-block;
    vertical-align: bottom;
  }
  .select {
    background-color: yellow;
    width: 4rem;
    height: 44px;
    background-color: transparent;
    position: absolute;
    top: 50px;
  }
  .thirdly {
    font-size: 0.8rem;
    text-align: center;
    color: #965b26;

    img {
      margin-top: 2.84rem;
    }
  }
  .btn {
    width: 13.08rem;
    height: 2rem;
    background-image: url("../../../assets/images/b_btn_pay.png");
    background-size: cover;
    border-radius: 0.2rem;
    line-height: 2rem;
    text-align: center;
    color: #885022;
    font-size: 0.72rem;
    position: relative;
    left: 50%;
    top: 0.68rem;
    transform: translateX(-50%);
  }
</style>
