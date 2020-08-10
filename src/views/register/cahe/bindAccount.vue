<template>
  <div class="forget">
    <van-nav-bar
      :title="$t('m.bindAccount')"
      left-arrow
      @click-left="onClickLeft"
    />
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
              <span>+{{areaCode}}中国</span>
              <van-icon name="arrow-down"/>
            </div>
          </template>
          <van-button slot="button"  size="small"  @click="sendCode" :disabled="disable" >{{btntxt}}</van-button>
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
        <div class="select" @click="selectAreaCode">
        </div>
      </van-cell-group>
      <div class="submit" @click="nextStep">
        完成
      </div>
    </div>
  </div>
</template>

<script>
  import headerTop from '@/components/header-top/header-top.vue'
  import {post} from '@/utils/request/index.js'
  import {Toast} from 'vant'
  import  '../../../assets/css/topNav.css'

  export default {
    name: "forget",
    data() {
      return {
        // title:'忘记密码',
        phone: '',
        phoneCode: '',
        time: 0,
        disable: false,
        btntxt: '发送验证码',
        areaCode:'86'
        // areaCode:''
        // value1: 0,
        // option1: [
        //   {text: '86', value: 0},
        //   {text: '886', value: 1},
        //   {text: '852', value: 2}
        // ],
      }
    },
    components: {
      headerTop
    },
    methods: {
      selectAreaCode(){
        console.log(1);
        this.$router.push({path:'/chooseAreaCode',query:{origin:'bind',openId:this.$route.query.openId}});
      },
      // 返回上一级
      onClickLeft() {
        this.$router.go(-1);
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
        if (this.phone == '') {
          this.$toast('手机号不能为空！');
          return
        } else if (this.value1 == 0 && !/^1(3|4|5|7|8)\d{9}$/.test(this.phone)) {
          this.$toast('手机号格式不正确！');
          return;
        } else if (this.value1 == 1 && !/^([0][9])\d{8}$/.test(this.phone)) {
          this.$toast('手机号格式不正确！');
          return;
        } else if (this.value1 == 2 && !/^([6|9])\d{7}$/.test(this.phone)) {
          this.$toast('手机号格式不正确！');
          return;
        } else {
          this.time = 60;
          this.disable = true;
          //验证码的时间设置 可有可无
          this.timer();
          post('api/user/sendBindWechatCaptcha', {
            'type': this.areaCode,
            'cellphone': this.phone,
            "openId": this.$route.query.openId
          }, res => {
            console.log(res);
            if (res.data.code === 200) {
              Toast('发送验证码成功')
            }else if(res.data.code === 400 && res.data.message === "该手机号已绑定其他微信号"){
              Toast('该手机号已绑定其他微信号')
            }else if(res.data.code === 400 && res.data.message === "验证码发送失败，请重新发送"){
              Toast('验证码发送失败，请重新发送')
            }
          })
        }
      },
      nextStep() {
        post('api/user/bindPhoneWechat', {
          "phone": this.phone,
          "captcha": this.phoneCode,
          "openId": this.$route.query.openId
        }, res => {
          // console.log(res);
          if (res.data.code === 200) {
            // this.$router.push({name: "resetpassword", params: {phone: this.phone}});
            Toast('绑定成功!');
            let user = {};
            user.id = res.data.data.id;
            user.token = res.data.data.token;
            this.$store.commit('SELECT_SHOP', {
              user: user,
            });
            console.log(user);
            localStorage.setItem('userMsg', JSON.stringify(user));
            this.$router.push({path:'temp'});
          } else if(res.data.code === 400 && (res.data.message === '验证码错误' || res.data.message === '未发送验证码' )) {
            Toast('您输入的验证码有误!');
          } else if(res.data.code === 400 && res.data.message === 'newAccount'){
            Toast('该手机号未注册，正在前往设置初始密码!');
            this.$router.push({name: "set-password", query: {phone: this.phone,openId:this.$route.query.openId}});
          }
        })
      }
    },
    mounted() {
      window.sessionStorage.setItem('loginCount',JSON.stringify(2));
      if(this.$route.query.areaCode){
        this.areaCode = this.$route.query.areaCode;
      }
    }
  }
</script>

<style lang="less" scoped>

  .form {
    /*.van-button--default {*/
    /*  color: #885022;*/
    /*  font-size: 14px;*/
    /*}*/
    .tip {
      width: 4rem;
    }
    .select {
      position: absolute;
      top: 0;
      width: 4rem;
      height: 44px;
      background-color: transparent;
    }
    .van-icon {
      display: inline-block;
      vertical-align: bottom;
    }
    .submit {
      background-image: url("../../../assets/images/b_btn_pay.png");
      background-size: cover;
      width: 13.08rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      font-size: 0.72rem;
      color: #885022;
      border-radius: 0.2rem;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      top: 0.92rem;
    }
  }

  .forget {
    height: 100vh;
    background-color: #F5F5F5;
  }

  .van-cell {
    line-height: 1.28rem;
  }

  /*.next{
    float: right;
    margin-top: -35px;
    margin-right: 10px;
    color: red;
  }*/

  /*.van-button--default {*/
  /*  color: red;*/
  /*  border: none;*/
  /*}*/

  /*.submit {*/
  /*  background-image: url("../../../assets/images/b_btn_chooselamp.png");*/
  /*}*/

  /*.van-button--large {*/
  /*  height: 45px;*/
  /*  line-height: 45px;*/
  /*  border-radius: 5px;*/
  /*}*/

  /*.van-dropdown-menu {*/
  /*  width: 52px;*/
  /*}*/
</style>
