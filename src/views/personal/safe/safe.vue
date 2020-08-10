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
          <van-button slot="button" size="small" @click="getMessageNum">{{$t('m.personal.messageNum')}}</van-button>
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
          :label="$t('m.personal.newTel')"
          :placeholder="$t('m.personal.pleaseTel')"
        >
          <van-button slot="button" size="small" @click="getMessageNum">{{$t('m.personal.messageNum')}}</van-button>
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
        <p>已成功更换手机号</p>
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
        userInfo: {}
      }
    },
    mounted() {
      post('api/user/get', {}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.userInfo = res.data.data;
        }
      });
    },
    methods: {
      // 获取短信验证码
      getMessageNum() {
        if (this.show1) {
          if (this.oldPhone.trim().length === 0) {
            Toast('请先输入您的手机号码');
            return false;
          }
          if (this.oldPhone !== this.userInfo.cellphone) {
            Toast('您输入的手机号有误，请重新输入!');
            return false;
          }
          post('api/user/sendUpdatePasswordCaptcha', {type: '86', cellphone: this.oldPhone}, res => {
            if (res.data.code === 200) {
              Toast('验证码发送成功')
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
          if (!(regExpChina.test(this.newPhone)||regExpTw.test(this.newPhone))) {
            this.errorMessage = '该手机号未注册';
            return false;
          }
          post('api/user/sendUpdatePasswordCaptcha', {type: '86', cellphone: this.newPhone}, res => {
            if (res.data.code === 200) {
              Toast('验证码发送成功')
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
      next() {
        // Toast('1');
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
              this.show3 = true;
              this.show2 = false;
            } else {
              Toast('您输入的手机号或者验证码有误');
            }
          });
        }
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

  .thirdly {
    font-size: 0.8rem;
    text-align: center;
    color: #965b26;

    img {
      margin-top: 2.84rem;
    }
  }
</style>
