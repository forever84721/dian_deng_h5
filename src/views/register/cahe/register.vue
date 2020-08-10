<template>
  <div class="register">
    <van-nav-bar
      :title="$t('m.register')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="logo">
      <img src="../../../assets/images/bless.jpg" alt="">
    </div>
    <div class="form">
      <van-cell-group>
        <van-field
          v-model="phone"
          clearable
          placeholder="请输入手机号"
          type="tel"
        >
          <template slot="left-icon">
            <div class="tip spec">
              <span>+{{areaCode+area}}</span>
              <van-icon name="arrow-down"/>
            </div>
          </template>
          <van-button slot="button" size="small" @click="sendCode" :disabled="disable">{{btntxt}}</van-button>
        </van-field>
        <van-field
          v-model="phoneCode"
          type="number"
          placeholder="请输入验证码"
        >
          <template slot="left-icon">
            <div class="tip">
              <span>验证码</span>
            </div>
          </template>
        </van-field>
      </van-cell-group>
      <div class="select" @click="selectAreaCode">
      </div>
    </div>
    <div class="submit" @click="register">注册</div>

    <div class="agreement">
      <div class="center">
        <van-checkbox icon-size="14px" v-model="checked" @click="isChoose"></van-checkbox>
        <p class="content">注册即代表同意 <span style="color:#ff5100;" @click="checkServiceAndPrivacy">《服务和隐私条例》</span></p>
      </div>
    </div>

  </div>

</template>

<script>
  // import headerTop from "@/components/header-top/header-top.vue"
  import {post} from '@/utils/request/index'
  import {Toast} from 'vant'
  import '../../../assets/css/topNav.css'

  export default {
    name: "register",
    data() {
      return {
        //title:'注册',
        phone: '',
        phoneCode: '',
        inviteCode: '',
        time: 0,
        disable: false,
        btntxt: '发送验证码',
        checked: false,
        // value1: 0,
        // option1: [
        //   {text: '86', value: 0},
        //   {text: '886', value: 1},
        //   {text: '852', value: 2}
        // ],
        areaCode: '86',
        area: '中国'
      }
    },
    mounted() {
      if (this.$route.query.areaCode) {
        this.areaCode = this.$route.query.areaCode + '';
        console.log(this.areaCode)
        if (this.areaCode === '86') {
          this.area = '中国';
        }
        if (this.areaCode === '886') {
          this.area = '台湾';
        }
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      // 查看隐私和服务协议
      checkServiceAndPrivacy() {
        this.$router.push({path: '/serviceAndPrivacy'});
      },
      selectAreaCode() {
        this.$router.push({path: '/chooseAreaCode', query: {origin: 'register'}});
      },
      //验证码的倒计时
      timer() {
        if (this.time > 0) {
          this.time--;
          this.btntxt = this.time + "s";
          setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.btntxt = "获取验证码";
          this.disable = false;
        }
      },
      //发送验证码
      sendCode() {
        let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        let regExpTw = /^09\d{8}$/;
        if (this.phone.trim().length ===0) {
          this.$toast('手机号不能为空！');
          return false;
        }
        if(this.areaCode === '86'){
          if(!regExpChina.test(this.phone)){
            this.$toast('手机号格式不正确！');
            return false;
          }
        }
        if(this.areaCode === '886'){
          if(!regExpTw.test(this.phone)){
            this.$toast('手机号格式不正确！');
            return false;
          }
        }
        //验证码的时间设置 可有可无
        post('api/user/sendRegisterationCaptcha', {
          'type': this.areaCode,
          'cellphone': this.phone
        }, res => {
          console.log(res);
          if (res.data.code == 200) {
            this.time = 60;
            this.disable = true;
            this.timer();
            Toast('发送验证码成功')
          } else {
            Toast(res.data.message);
          }
        })
      },
      isChoose() {
        this.checked = !this.checked
      },
      register() {
        if (this.phone == '') {
          this.$toast('手机号不能为空！')
          return false;
        } else if (this.value1 == 0 && !/^1(3|4|5|7|8|9)\d{9}$/.test(this.phone)) {
          this.$toast('手机号格式不正确！')
          return false;
        } else if (this.value1 == 1 && !/^([0][9])\d{8}$/.test(this.phone)) {
          this.$toast('手机号格式不正确！')
          return false;
        } else if (this.value1 == 2 && !/^([6|9])\d{7}$/.test(this.phone)) {
          this.$toast('手机号格式不正确！')
          return false;
        } else if (this.phoneCode === '') {
          this.$toast('验证码不能为空!')
        } else if (!this.checked) {
          this.$toast('请勾选服务和隐私条例')
        } else {
          post('api/user/checkCaptcha', {
            "cellphone": this.phone,
            "captcha": this.phoneCode,
          }, res => {
            console.log(res);
            if (res.data.code == 200) {
              this.$router.push({name: "set-password", query: {phone: this.phone}});
            } else {
              this.$toast(res.data.message);
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .logo {
    margin-bottom: 0.5rem;
    width: 100%;
    height: 8rem;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .form {
    padding: 0 0.8rem;
    position: relative;

    .select {
      position: absolute;
      top: 0;
      width: 4rem;
      height: 44px;
      background-color: transparent;
    }

    .tip {
      width: 4rem;
    }

    .spec {
      margin-top: 0.12rem;
    }

    .van-icon {
      display: inline-block;
      vertical-align: bottom;
    }
  }

  .submit {
    background-image: url("../../../assets/images/b_btn_thankmylamp.png");
    background-size: cover;
    width: 13.08rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    font-size: 0.72rem;
    color: #885022;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: 0.72rem;
    border-radius: 0.2rem;
  }

  .agreement {
    width: 13.08rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: 1.52rem;
    border-radius: 0.2rem;

    .center {
      width: 8.68rem;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }

    .van-checkbox {
      float: left;
      margin-right: 0.2rem;
      margin-top: 0.04rem;
    }

    p {
      float: left;
      font-size: 0.48rem;
    }
  }


</style>
