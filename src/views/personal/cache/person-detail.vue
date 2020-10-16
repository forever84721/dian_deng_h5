<template>
  <div class="person_detail">
    <van-nav-bar
      :title="$t('m.personal.editMessage')"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-cell title="姓名" :value="cellValue.realName" @click="showPopup('姓名',cellValue.realName)"/>
    </van-cell-group>
    <van-cell-group v-if="!this.$route.query.origin">
      <van-cell :title="$t('m.personal.personalDetail.mobile')" :value="cellValue.cellphone"
      />
    </van-cell-group>
    <van-field
      v-model="userCellphone"
      required
      input-align="right"
      label="手机号码:"
      placeholder="此为本地供地寻灯号码请务必填写"
      is-link
      :error-message="errorMessagePhone"
      error-message-align="right"
      @blur="validDataPhone(userCellphone)"
      v-if="this.$route.query.origin"
    />
    <van-cell-group>
      <van-cell :title="$t('m.personal.personalDetail.sex')" is-link :value="cellValue.gender" @click="popShow('性别')"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="出生日期" is-link :value="cellValue.birthday" @click="popShow('出生日期')"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell :title="$t('m.personal.personalDetail.old')" :value="cellValue.old"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="生肖" :value="cellValue.zodiac"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell :title="$t('m.personal.personalDetail.birthHours')" is-link :value="cellValue.birthHour"
                @click="popShow('出生时辰')"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell :title="$t('m.personal.personalDetail.fixedPhone')" :value="cellValue.telephone"
                @click="showPopup('固定电话',cellValue.telephone)"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell :title="$t('m.personal.personalDetail.liveAddress')" :value="cellValue.address"
                @click="showPopup('居住地址',cellValue.address)"/>
    </van-cell-group>

    <div class="submit" @click="next">保存</div>
    <van-popup v-model="popupShow" position="bottom">
      <div v-if="type=='出生日期'">
        <van-picker
          :columns="yearColumn"
        />
        <van-datetime-picker
          title="你的生日"
          v-model="currentDate"
          type="date"
          :min-date='minDate'
          :max-date="maxDate"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </div>
      <van-picker
        v-else-if="type=='生肖'"
        show-toolbar
        :columns="zodiacColumns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
      <van-picker
        v-else-if="type=='出生时辰'"
        show-toolbar
        :columns="hourColumn"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
      <van-picker
        v-else-if="type=='性别'"
        show-toolbar
        :columns="genderColumn"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>

    <!-- 修改姓名、固定电话、地址信息 弹窗  -->
    <van-popup v-model="isShow" :class="[errorMessage === '' ? 'fixMessage1' : 'fixMessage2']"
               >
      <div class="title">请填写{{propTitle}}</div>
      <!--      <input type="text" v-model="propText" autofocus @input="changeInfo">-->
      <van-cell-group>
        <van-field v-model="propText" :placeholder="'请输入' + propTitle" input-align="center" autofocus
                  @blur="validData(propTitle,propText)"  :error-message="errorMessage" error-message-align="center"/>
      </van-cell-group>
      <div class="MessageStatus">
        <div class="MessageStatusBtn">
          <div class="confirm" @click="confirmPopup(propTitle,propText ) ">确认</div>
          <div class="cancel" @click="closeProp(propTitle,propText)">取消</div>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
  // import personPopup from "@/views/personal/cache/person-popup"
  import {Toast} from "vant"
  import {post} from "@/utils/request/index.js"
  import '../../../assets/css/topNav.css'

  export default {

    name: "person-detail",
    data() {
      return {
        errorMessagePhone:'',
        userCellphone:'',
        isShow: false, // 控制修改姓名、固定电话、地址信息弹窗的显示与隐藏
        propTitle: '', // 修改信息弹窗的标题
        propText: '',  // 修改信息弹窗的内容
        cellValue: {
          realName: '', // 姓名
          zodiac: '', // 生肖
          cellphone: '', // 联系电话
          telephone: '', // 固定电话
          address: '', // 居住地址
          birthday: '', // 出生日期
          birthHour: '', // 出生时辰
          gender: '', // 性别
          old: '' // 年龄
        },
        type: '',
        popupShow: false,
        zodiacColumns: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
        currentDate: new Date(),
        minDate: new Date(1950, 1, 1),
        maxDate: new Date(),
        yearColumn: ['公历', '农历'],
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
        genderColumn: [
          "男",
          "女"
        ],
        list: [],
        errorMessage: '', // 检验错误提示信息
        powerCount: 1,
        userCode:'',
        loginType:'',
        url: 'on'//判断是从那个地址进来的
      }
    },
    mounted() {
      this.$toast.setDefaultOptions({ duration: 2000 });
      // 获取当前登录方式
      post('api/user/getLoginType', {}, res => {
        if (res.data.code === 200) {
          this.loginType = res.data.data;
        }
      });
      if(window.sessionStorage.getItem('powerCount')){
        this.powerCount = JSON.parse(window.sessionStorage.getItem('powerCount'));
      }
      if (this.$route.query.origin === 'weiXin'&& this.powerCount === 1){
        this.$toast('您当前为第一次使用微信登录,请点击下方的保存按钮');
        post('api/user/getUserInfo',{
          "openId": this.$route.query.openid,
          "accessToken": this.$route.query.access_token
        },res => {
          console.log(res);
          if(res.data.code === 200) {
            this.cellValue.realName = JSON.parse(res.data.data).nickname;
            if(JSON.parse(res.data.data).sex === 0) {
              this.cellValue.gender = '请选择'
            }else if(JSON.parse(res.data.data).sex === 1){
              this.cellValue.gender = '男'
            }else  if(JSON.parse(res.data.data).sex === 2){
              this.cellValue.gender = '女'
            }
            this.cellValue.birthday = '请选择';
            this.cellValue.birthHour = '请选择';
            // let age = Number(this.list.birthday.slice(0, 4)) - 1984;
            // let i = age % 12;
            // this.cellValue.zodiac = this.zodiacColumns[i];
            // this.cellValue.zodiac = this.list.zodiac;
            this.cellValue.address = '';
            this.cellValue.telephone = '请填写';
            // this.getOld(this.cellValue.birthday);
          }
        });
        // location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=http%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Fperson-detail%3Forigin%3DweiXin%26powerCount%3D2&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
      }else if (this.$route.query.origin === 'line'&& this.powerCount === 1) {
        this.$toast('您当前为第一次使用line登录,请点击下方的保存按钮');
        this.cellValue.realName = this.$route.query.name;
        this.cellValue.birthday = '请选择';
        this.cellValue.birthHour = '请选择';
        this.cellValue.address = '';
        this.cellValue.telephone = '请填写';
      } else if (this.$route.query.origin === 'facebook'&& this.powerCount === 1) {
        this.$toast('您当前为第一次使用facebook登录,请点击下方的保存按钮');
        this.cellValue.realName = this.$route.query.name;
        this.cellValue.birthday = '请选择';
        this.cellValue.birthHour = '请选择';
        this.cellValue.address = '';
        this.cellValue.telephone = '请填写';
      }
      // if (location.href.indexOf('code') !== -1 && this.powerCount === 1) {
      //   this.userCode = this.getvar(location.href, 'code');
      //   this.$toast(this.userCode);
      //   this.powerCount = 2;
      //   window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
      //   post('api/user/getUserInfo',{code: this.userCode},res => {
      //     console.log(res);
      //     this.$toast(res)
      //   })
      // }
      let ls = localStorage.getItem('userMsg');
      if (ls) {
        post('api/user/get', {}, res => {
          console.log(res);
          this.list = res.data.data;
          // console.log(res.data);
          console.log(this.list);
          // return false;
          // 初始化相关信息
          if (!this.list.realName || this.list.realName === "") {
            this.list.realName = '大德';
          }
          // if (!this.list.telephone || this.list.telephone === "") {
          //   this.list.cellphone = '请填写'
          // }
          //
          if (!this.list.address || this.list.address === "") {
            this.list.address = '请填写'
          }

          if (!this.list.gender || this.list.gender === '') {
            this.list.gender = '请选择'
          }
          //
          if (!this.list.birthday || this.list.birthday === '') {
            this.list.birthday = '请选择';
          }
          if (!this.list.birthHour || this.list.birthHour === '') {
            this.list.birthHour = '请选择';
          }
          if (!this.list.telephone || this.list.telephone === '') {
            this.list.telephone = '请填写';
          }
          this.cellValue.cellphone = this.list.cellphone;
          this.cellValue.realName = this.list.realName;
          this.cellValue.gender = this.list.gender;
          this.cellValue.birthday = this.list.birthday;
          this.getOld(this.list.birthday);
          this.cellValue.birthHour = this.list.birthHour;
          let age = Number(this.list.birthday.slice(0, 4)) - 1984;
          let i = age % 12;
          this.cellValue.zodiac = this.zodiacColumns[i];
          // this.cellValue.zodiac = this.list.zodiac;
          this.cellValue.address = this.list.address;
          this.cellValue.telephone = this.list.telephone;

          // else {
          //   this.cellValue.birthday = this.list.birthday;
          //   this.getOld(this.list.birthday);
          //   console.log(this.list.birthday, this.getOld(this.list.birthday));
          // }
          // this.cellValue.realName = this.list.realName;
          // this.cellValue.cellphone = this.list.cellphone;
          // if (this.list.zodiac) {
          //   this.cellValue.zodiac = this.list.zodiac;
          // } else {
          //   this.cellValue.zodiac = "";
          // }
          // this.cellValue.gender = this.list.gender;
          // if (this.list.birthHour) {
          //   this.cellValue.birthHour = this.list.birthHour;
          // }
          // // console.log(this.list.birthday)
          // this.cellValue.address = this.list.address;
          // this.cellValue.telephone = this.list.telephone;
          // console.log(this.teleValue);
        });
      }
      //else {
      //   this.cellValue.id = this.$store.state.user.id;
      // }
    },
    methods: {
      validDataPhone(value){
        let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        let regExpTw = /^09\d{8}$/;
        if(value.trim().length === 0){
          this.errorMessagePhone = ''
        }else {
          if(!(regExpChina.test(value) || regExpTw.test(value))){
            this.errorMessagePhone = '请输入正确的手机号码';
            return false;
          }else {
            this.errorMessagePhone = ''
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
      },
      // 根据出生日期计算当前年龄
      getOld(birthday) {
        // 根据出生日期计算年龄
        if (this.cellValue.birthday && this.cellValue.birthday !== '请选择') {
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
            this.cellValue.old = 0 + '   岁';
          } else {
            if (nowMonth < beforeMonth) {
              this.cellValue.old = (nowYear - beforeYear) + '   岁';
            } else if (nowMonth === beforeMonth) {
              if (nowDay >= beforeDay) {
                this.cellValue.old = (nowYear - beforeYear) + '   岁';
              } else {
                this.cellValue.old = (nowYear - beforeYear - 1) + '   岁';
              }
            } else {
              this.cellValue.old = (nowYear - beforeYear) + '   岁';
            }
          }
        }
      }
      ,
      onClickLeft() {
        // this.$router.go(-1)
        // this.$router.push('/login')
        if(this.$route.query.urlStatus === 'on') {
          this.$router.go(-1)
        } else{
          location.href = 'https://wenxuanguangmingdeng.com/h5/#/login'
          // this.$router.push('/login')
        }

      }
      ,
      // 修改姓名、固定电话、地址
      showPopup(title, text) {
        this.isShow = true;
        this.propTitle = title;
        if(text === '请填写') {
          this.propText = ''
        }else{
          this.propText = text;
        }
      }
      ,
      confirmPopup(title,) {
        this.isShow= false;
        this.errorMessage ='';
        if (title === '姓名') {
          if(this.propText.trim().length !== 0){
            this.cellValue.realName = this.propText;
          }
        } else if (title === '固定电话') {
          if(this.propText.trim().length !== 0){
            this.cellValue.telephone = this.propText;
          }
        } else if (title === '居住地址') {
          if(this.propText.trim().length !== 0){
            this.cellValue.address = this.propText;
          }
        }
      },
      // 当关闭修改信息弹窗时
      closeProp(title,text) {
        this.errorMessage = '';
        this.isShow = false;

      }
      ,
      onConfirm(value) {
        switch (this.type) {
          case '生肖':
            this.cellValue.zodiac = value;
            break;
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
            value = y + '-' + m + '-' + d;
            this.cellValue.birthday = value;
            let age = y - 1984;
            let i = age % 12;
            // console.log(age);
            console.log(i)
            console.log(this.zodiacColumns[i]);
            this.cellValue.zodiac = this.zodiacColumns[i];
            this.cellValue.birthHour = '吉時';
            break;
          case '出生时辰':
            this.cellValue.birthHour = value;
            break;
          case '性别':
            this.cellValue.gender = value;
            break;
        }
        this.popupShow = false;
        this.getOld(this.cellValue.birthday);
        console.log(this.cellValue);
      }
      ,
      onCancel() {
        this.popupShow = false;
      }
      ,
      popShow(type) {
        this.popupShow = true;
        this.type = type;
      }
      ,
      // 检验数据格式
      validData(propTitle, propText) {
        this.errorMessage = ''
        // 纯中文名、纯英文名、或者中间以“·”间隔，但是不能以“·”开头或者结尾
        let nameRex_1 = /^[A-Za-z]{1,16}$|^[A-Za-z]{1,16}(?:·[A-Za-z]{1,16})+$|^[\u4E00-\u9FA5]{1,16}$|^[\u4E00-\u9FA5]{1,16}(?:·[\u4E00-\u9FA5]{1,16})+$/;
        if (propTitle === '姓名') {
          if (propText.trim().length < 1 || propText.trim().length >= 16) {
            this.errorMessage = '姓名长度需控制在1-16之间';
            return false;
          } else {
            this.errorMessage = ''
          }
          // } else if (!nameRex_1.test(propText)) {
          //   this.errorMessage = '纯中文或纯英文名、或中间以“·”间隔，但是不能以“·”开头或者结尾';
          //   return  false;
          // }else {
          //   this.errorMessage = ''
          // }
        }
        if (propTitle === '固定电话') {
          console.log(1);
          // let checkRex = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
          let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
          let regExpTw = /^09\d{8}$/;
          if (!(regExpChina.test(propText)||regExpTw.test(propText))) {
            this.errorMessage = '请输入正确的手机号码';
            return false;
          } else {
            this.errorMessage = ''
          }
        }
      },
      next() {
        if(this.$route.query.origin){
          if(this.userCellphone.trim().length ===0){
            this.$toast('请输入您的手机号');
            return false;
          }
          this.validDataPhone(this.userCellphone);
        }
        let obj = {};
        console.log(this.$route.query.origin, "origin")
        if(this.$route.query.origin){
          obj.cellphone = this.userCellphone
          console.log(obj.cellphone, "cellphoneObj")
        }
        obj.realName = this.cellValue.realName;
        obj.zodiac = this.cellValue.zodiac;
        if (this.cellValue.telephone !== '请填写') {
          obj.telephone = this.cellValue.telephone;
        } else {
          obj.telephone = '';
        }
        if (this.cellValue.address !== '请填写') {
          obj.address = this.cellValue.address;
        } else {
          obj.address = '';
        }
        if (this.cellValue.birthday !== '请选择') {
          obj.birthday = this.cellValue.birthday;
        } else {
          obj.birthday = null;
        }
        obj.birthHour = this.cellValue.birthHour;
        if (this.cellValue.gender !== '请选择') {
          obj.gender = this.cellValue.gender;
        } else {
          obj.gender = '';
        }
        console.log(obj);
        if(this.$route.query.origin === 'weiXin') {
          post("api/user/save", {
            "user": obj,
            "openId":this.$route.query.openid || ""
          }, res1 => {
            if(res1.data.code === 200){
              post('api/user/loginWithOpenId',{openId:this.$route.query.openid},res => {
                if(res.data.code === 200){
                  // this.$router.push({path:'bindAccount',query:{openId:res1.data.data}});
                  Toast('登录成功');
                  if(localStorage.getItem("selectTempData")) {
                    localStorage.removeItem("selectTempData")
                  }
                  this.powerCount = 2;
                  window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
                  let user = {};
                  user.id = res.data.data.id;
                  user.token = res.data.data.token;
                  this.$store.commit('SELECT_SHOP', {
                    user: user
                  });
                  console.log(user);
                  localStorage.setItem('userMsg', JSON.stringify(user));
                  // localStorage.setItem('userToken',user.token);
                  this.$router.push({ path: '/temp' });
                }else {
                  this.powerCount = 2;
                  window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
                  this.$toast('登录失败');
                  this.$router.push({ path: '/login' });
                }
              })
            }else {
              this.$toast(res1.data.message);
            }
          });
        }else if (this.$route.query.origin === 'line'){
          post('api/user/saveWithLine', {
            "user": obj,
            "lineId": sessionStorage.getItem('userId')
          }, res2 => {
            if(res2.data.code === 200) {
              post('api/user/loginByLine',{lineId:sessionStorage.getItem('userId')},res => {
                if(res.data.code === 200){
                  // this.$router.push({path:'bindAccount',query:{openId:res1.data.data}});
                  Toast('登录成功');
                  if(localStorage.getItem("selectTempData")) {
                    localStorage.removeItem("selectTempData")
                  }
                  this.powerCount = 2;
                  window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
                  let user = {};
                  user.id = res.data.data.id;
                  user.token = res.data.data.token;
                  this.$store.commit('SELECT_SHOP', {
                    user: user
                  });
                  console.log(user);
                  localStorage.setItem('userMsg', JSON.stringify(user));
                  // localStorage.setItem('userToken',user.token);
                  this.$router.push({ path: '/temp' });
                }else {
                  this.powerCount = 2;
                  window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
                  this.$toast('登录失败');
                  this.$router.push({ path: '/login' });
                }
              })
            }else {
              this.$toast(res2.data.message);
            }
          });
        }else if(this.$route.query.origin === 'facebook') {
          post('api/user/saveWithFacebook', {
            "user": obj,
            "facebookId": sessionStorage.getItem('userId')
          }, res => {
            if(res.data.code === 200) {
              post('api/user/loginByFacebook',{"facebookId":sessionStorage.getItem('userId')},res => {
                if(res.data.code === 200){
                  // this.$router.push({path:'bindAccount',query:{openId:res1.data.data}});
                  Toast('登录成功');
                  if(localStorage.getItem("selectTempData")) {
                    localStorage.removeItem("selectTempData")
                  }
                  this.powerCount = 2;
                  window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
                  let user = {};
                  user.id = res.data.data.id;
                  user.token = res.data.data.token;
                  this.$store.commit('SELECT_SHOP', {
                    user: user
                  });
                  console.log(user);
                  localStorage.setItem('userMsg', JSON.stringify(user));
                  // localStorage.setItem('userToken',user.token);
                  this.$router.push({ path: '/temp' });
                }else {
                  this.powerCount = 2;
                  window.sessionStorage.setItem('powerCount',JSON.stringify(this.powerCount));
                  this.$toast('登录失败');
                  this.$router.push({ path: '/login' });
                }
              })
            }else {
              this.$toast(res.data.message);
            }
          })
        }else {
          post('api/user/update', {
            user: obj
          }, res => {
            console.log(res);
            if (res.data.code == '200') {
              Toast("信息保存");
              this.$router.push({path: '/temp'})
            } else {
              Toast(res.data.message);
            }
          })
        }
      }
    },

    beforeRouteEnter(to, from, next) {
      console.log(from.path)
      if (from.path === '/personal') {
        to.query.urlStatus = 'on'
        console.log(to)
      }
      next()
    }
  }
</script>

<style scoped lang="less">
  .person_detail {
    height: 100vh;
    background-color: #F5F5F5;
  }

  .van-picker /deep/ .van-picker__toolbar /deep/ .van-picker__cancel, .van-picker /deep/ .van-picker__toolbar /deep/ .van-picker__confirm {
    padding: 0 16px;
    color: #885022;
    font-size: 14px;
  }

  .submit {
    background-image: url("../../../assets/images/b_btn_pay.png");
    width: 13.08rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    background-size: cover;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: 5rem;
    border-radius: 0.2rem;
    font-size: 0.72rem;
    color: #885022;
  }

  .fixMessage1 {
    width: 12rem;
    height: 7rem;
    border-radius: 0.4rem;
    padding: 0.4rem;
    box-sizing: border-box;

    .title {
      font-size: 0.82rem;
      margin-bottom: 0.8rem;
    }
  }

  .fixMessage2 {
    width: 12rem;
    height: 8.2rem;
    border-radius: 0.4rem;
    padding: 0.4rem;
    box-sizing: border-box;

    .title {
      font-size: 0.82rem;
      margin-bottom: 1rem;
    }
  }
  .MessageStatus {
    width:11.2rem;
    height: 2rem;
    padding-top: 0.2rem;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    .MessageStatusBtn {
      width:10rem;
      height: 1.2rem;
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      .confirm {
        background-color: #ef9950;
        width: 2rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        background-size: cover;
        border-radius: 0.2rem;
        font-size: 0.5rem;
        color: #885022;
        display: inline-block;
      }
      .cancel {
        background-color:#ef9950;
        width: 2rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        background-size: cover;
        border-radius: 0.2rem;
        font-size: 0.5rem;
        color: #885022;
        display: inline-block;
      }
    }

  }
</style>
