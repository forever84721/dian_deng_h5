<template>
  <div class="setPW">
    <van-nav-bar
      :title="$t('m.setPsd')"
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
      完成
    </div>
  </div>
</template>

<script>
  import iconBefore from '@/assets/images/a_btn_yanjing_s.png'
  import iconAfter from '@/assets/images/a_icn_yanjing_n.png'
  import headerTop from "@/components/header-top/header-top.vue"
  import {post} from "@/utils/request/index"
  import {Toast} from 'vant'
  import '../../../assets/css/topNav.css'

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
        phone: this.$route.query.phone

      }
    },
    methods: {
      // 返回上一级
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
          this.$toast('密码不能为空!');
          return
        } else if (password !== nPassword) {
          this.$toast('两次密码输入不一致！');
          return
        } else if (!reg.test(password)) {
          this.$toast('密码必须为6-16位！');
          return;
        }
        post("api/user/updatePassword", {
          "cellphone": this.phone,
          "password": this.password
        }, res => {
          // console.log(res);
          if (res.data.code == 200) {
            Toast("修改密码成功");
            this.$router.push({name: "login"});
          } else {
            Toast(res.data.message);
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
          var _this = this.$refs.secondIcon;
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

      }
    },
    components: {
      headerTop
    },
    created() {
      // console.log(this.phone);
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
    background-image: url("../../../assets/images/b_btn_pay.png");
    background-size: cover;
    width: 13.08rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    color: #885022;
    font-size: 0.72rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: 0.92rem;
  }

</style>
