<template>
  <div class="setPW">
    <van-nav-bar
      :title="$t('m.setPwd')"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-field
        v-model="password"
        label="设置密码"
        :type="passwordType1"
        placeholder="6-16位数字、英文或下划线"
        @input="validite(password)"
        :error-message="error"
        ref="firstInput"
        @click-right-icon="iChange('firstIcon',)"
      >
        <template slot="right-icon">
          <img ref="firstIcon" :src="iconUrl" width="23px" height="19px">
        </template>
      </van-field>

      <van-field
        v-model="nPassword"
        :type="passwordType2"
        label="设置密码"
        placeholder="请再次输入密码"
        ref="secondInput"
        @click-right-icon="iChange('secondIcon',)"
      >
        <template slot="right-icon">
          <img ref="secondIcon" :src="iconUrl" width="23px" height="19px">
        </template>
      </van-field>
    </van-cell-group>
    <div class="submit" @click="nextStep(password,nPassword)">
      {{$t('m.complete')}}
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import iconBefore from '@/assets/images/a_btn_yanjing_s.png'
  import iconAfter from '@/assets/images/a_icn_yanjing_n.png'
  import {post} from "@/utils/request/index"
  import {Toast} from 'vant'

  export default {
    name: "set-password",
    data() {
      return {
        title: '设置密码',
        password: '',
        nPassword: '',
        error: '',
        iconUrl: iconBefore,
        iconChange: iconAfter,
        passwordType1: "password",
        passwordType2: "password",
        phone: '',
        openId:''
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      validite(password) {
        let reg = /^[a-zA-Z_0-9]{6,16}$/i
        if (!reg.test(password)) {
          this.error = '密码必须为6-16位数字、英文或下划线'
        } else {
          this.error = ''
        }
      },
      nextStep(password, nPassword) {
        let reg = /^[a-zA-Z_0-9]{6,16}$/i
        if (password == '' || nPassword == '') {
          this.$toast('密码不能为空!')
          return
        } else if (password !== nPassword) {
          this.$toast('两次密码输入不一致！')
          return
        } else if (!reg.test(password)) {
          this.$toast('密码必须为6-16位！')
          return;
        }
        post("api/user/save", {
          "user": {
            "cellphone": this.phone,
            "password": this.password
          },
          "openId":this.openId
        }, res => {
          console.log(res);
          if (res.data.code === 400) {
            Toast(res.data.message);
          } else if (res.data.code === 200) {
            post('api/user/loginWithPhoneAndPassword', {
              cellphone: this.phone,
              password: this.password
            }, res => {
              if (res.data.code === 200) {
                let user = {
                  token: res.data.data.token,
                  id: res.data.data.id
                };
                this.$store.commit('SELECT_SHOP', {
                  user: {
                    token: res.data.data.token,
                    id: res.data.data.id
                  }
                });
                localStorage.setItem('userMsg', JSON.stringify(user));
                this.$router.push({name: "person-detail"});
              }
            })


          }
        })
      },
      iChange(select) {
        // console.log(select);
        if (select === 'firstIcon') {
          let _this = this.$refs.firstIcon;
          if (this.$refs.firstIcon.src === this.iconUrl) {
            // console.log(_this.parentElement);
            _this.src = this.iconChange;
            // console.log(this.$refs.firstInput.type);
            this.passwordType1 = 'text'
          } else {
            _this.src = this.iconUrl;
            this.passwordType1 = "password";
          }
        } else {
          let _this = this.$refs.secondIcon;
          if (this.$refs.secondIcon.src === this.iconUrl) {
            // console.log(111111);
            _this.src = this.iconChange;
            this.passwordType2 = "text";
          } else {
            // console.log(_this)
            _this.src = this.iconUrl;
            this.passwordType2 = "password";
          }
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
      }
    },
    mounted() {
      // this.$toast(1,this.openId);
      this.phone = this.$route.query.phone;
      console.log(this.phone);
      if(this.$route.query.openId){
        this.openId = this.$route.query.openId;
        // this.$toast(this.openId);
      }
    }
  }
</script>

<style lang="less" scoped>
  .setPW {
    height: 100vh;
    background-color: #F5F5F5;
    overflow: hidden;
  }

  .submit {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: 0.92rem;
    background-image: url("../../../assets/images/b_btn_thankmylamp.png");
    background-size: cover;
    border-radius: 0.2rem;
    width: 13.08rem;
    height: 2rem;
    font-size: 0.72rem;
    color: #885022;
    text-align: center;
    line-height: 2rem;
  }

  /*.van-button--large{*/
  /*  height: 45px;*/
  /*  line-height: 45px;*/
  /*  border-radius: 5px;*/
  /*}*/
</style>
