<template>
  <main style="padding-bottom:0;">
    <div class="page-root">
      <div style="position: relative;padding-top: 25px;">
        <img src="@/assets/new_images/logo.png" alt="logo" class="logo" />
        <img
          src="@/assets/new_images/logo-cloud.png"
          alt="logo-cloud"
          class="logo-cloud"
        />
      </div>

      <div class="input-group" style="padding-top: 20px;">
        <div style="width: 120px;text-align: center;">
          <div class="custom-select" @blur="open = false">
            <div class="selected" :class="{ open: open }" @click="open = !open">
              {{ selected.text }}
            </div>
            <div class="items" :class="{ selectHide: !open }">
              <div
                v-for="(option, i) of options"
                :key="i"
                @click="
                  selected = option;
                  areaCode = option.value;
                  open = false;
                "
              >
                {{ option.text }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <input type="text" v-model="formValidate.phone" />
        </div>
      </div>

      <div class="input-group">
        <div style="width: 120px;text-align: center;">
          <label for="">密碼</label>
        </div>
        <div>
          <input type="password" v-model="formValidate.password" />
        </div>
      </div>

      <div style="padding-top: 20px;text-align: center;">
        <button class="login-button" @click="onSubmit(formValidate)">
          登錄
        </button>
      </div>

      <div
        style="display: flex;width: 280px;font-weight: bold;padding-top: 5px;"
      >
        <span class="cp" @click="onForget">忘記密碼</span>
        <span class="cp" style="margin-left: auto;" @click="onRegister"
          >免費註冊</span
        >
      </div>
      <div class="dividing-container">
        <div class="dividing-line"></div>
        <span class="dividing-text">其他登錄方式</span>
        <div class="dividing-line"></div>
      </div>

      <div class="login-method-group">
        <div
          class="cp"
          style="width: 105px;text-align: center;"
          @click="otherLogin('微信')"
        >
          <img src="@/assets/new_images/wechat.png" alt="wechat" />
        </div>
        <div
          class="cp"
          style="width: 105px;text-align: center;"
          @click="otherLogin('LINE')"
        >
          <img src="@/assets/new_images/line.png" alt="line" />
        </div>
        <div
          class="cp"
          style="width: 105px;text-align: center;"
          @click="otherLogin('Facebook')"
        >
          <img src="@/assets/new_images/fb.png" alt="fb" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { post } from "@/utils/request/index";
import service from "@/utils/request/service";
import { Toast } from "vant";
import "../assets/css/topNav.css";

export default {
  name: "login",
  data() {
    return {
      title: "登录",
      formValidate: {
        errors: [],
        phone: "",
        password: ""
      },
      // arrow: "arrow-down",
      areaCode: "86",
      // 用户授权码
      userCode: "",
      info: {},
      loginCount: 1,
      area: "中国",
      lineId: {},
      // radio:'1'
      options: [
        { text: "+86 中國", value: "86" },
        { text: "+886 台灣", value: "886" }
      ],
      selected: { text: "+86 中國", value: "86" },
      open: false
    };
  },
  mounted() {
    // console.log("11");
    // console.log(location.search);
    // console.log(window.location.search.replace("?", ""));
    this.userCode = this.getvar(location.href, "code");
    console.log(this.userCode);
    if (this.$route.query.templeId) {
      window.localStorage.setItem(
        "templeId",
        JSON.stringify(this.$route.query.templeId)
      );
    }
    if (window.sessionStorage.getItem("loginCount")) {
      this.loginCount = JSON.parse(window.sessionStorage.getItem("loginCount"));
    }
    let ls = localStorage.getItem("userMsg");
    // if (ls) {
    //   this.$router.push({ path: '/temp' });
    // }
    if (window.sessionStorage.getItem("paySuccess")) {
      window.sessionStorage.removeItem("paySuccess");
    }
    //console.log('22222')
    if (window.sessionStorage.getItem("writeSuccess")) {
      window.sessionStorage.removeItem("writeSuccess");
    }
    if (this.$route.query.areaCode) {
      this.areaCode = this.$route.query.areaCode + "";
      console.log(this.areaCode);
      if (this.areaCode === "86") {
        this.area = "中国";
      }
      if (this.areaCode === "886") {
        this.area = "台湾";
      }
    }
    // console.log('准备code')

    if (location.href.indexOf("abc236565sd") !== -1) {
      // line登录
      if (location.href.indexOf("code") !== -1) {
        this.userCode = this.getvar(location.href, "code");

        let codeParam = {
          code: this.userCode
        };
        const formData = new FormData();
        Object.keys(codeParam).forEach(key => {
          formData.append(key, codeParam[key]);
        });
        // console.log('===========formData'+formData)
        console.log("line");

        service({
          method: "post",
          url: "/line/user/getLineOpenIdAndAccessToken",
          data: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            // console.log('+++++++++++++successlog===================')
            // if(res.data.code === 200) {
            // let idToken = res.data["id_token"];
            // let id = idToken.indexOf('.')
            // let tokenString = idToken.substring(0, id)
            console.log(res);
            let lineData = res.data;
            console.log(lineData);
            let accessToken = lineData["access_token"];
            console.log("access");
            console.log(accessToken);
            post(
              "line/user/getUserInfo",
              { accessToken: accessToken },
              res1 => {
                console.log("getUser");
                console.log(res1.data);
                let userId = res1.data.userId;
                this.lineName = res1.data.displayName;
                window.sessionStorage.setItem("userId", userId);
                post("api/user/loginByLine", { lineId: userId }, res2 => {
                  console.log("loginLine");
                  console.log(res2.data);
                  if (res2.data.code === 200) {
                    console.log("成功");
                    this.loginCount = 2;
                    window.sessionStorage.setItem(
                      "loginCount",
                      JSON.stringify(this.loginCount)
                    );
                    let user = {};
                    user.id = res2.data.data.id;
                    user.token = res2.data.data.token;
                    this.$store.commit("SELECT_SHOP", {
                      user: user
                    });
                    console.log(user);
                    localStorage.setItem("userMsg", JSON.stringify(user));
                    setTimeout(() => {
                      this.$router.push({ path: "/temp" });
                    }, 1000);
                  } else if (res2.data.code === 400) {
                    this.loginCount = 2;

                    this.$router.push({
                      path: "/person-detail",
                      query: {
                        origin: "line",
                        name: this.lineName
                      }
                      // query:{origin:'line',access_token:accessTokenString,lineId:tokenString}
                    });

                    // this.$router.push('/person-detail')
                    window.sessionStorage.setItem(
                      "loginCount",
                      JSON.stringify(this.loginCount)
                    );
                  }
                });
              }
            );
            // let param = {
            //   lineId: tokenString
            // }
            // let accessToken = res.data["access_token"];
            // let access = accessToken.indexOf('.')
            // let accessTokenString = accessToken.substring(0, access)
            // sessionStorage.setItem("lineId", tokenString);
            // sessionStorage.setItem("accessToken", accessTokenString)
            // console.log(param)
            // console.log(res)
            //
            // }
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      //微信登录
      // console.log(location.href)
      if (
        location.href.indexOf("code") !== -1 &&
        location.href.indexOf("state") !== -1
      ) {
        this.userCode = this.getvar(location.href, "code");
        post(
          "api/user/getWechatOpenId",
          {
            code: this.userCode
          },
          res1 => {
            //Toast('res1')
            // console.log(res1.data.data);
            if (res1.data.code === 200) {
              post(
                "api/user/loginWithOpenId",
                { openId: JSON.parse(res1.data.data).openid },
                res2 => {
                  // this.info = res2;
                  //Toast('res2')
                  if (res2.data.code === 200) {
                    // this.$router.push({path:'bindAccount',query:{openId:res1.data.data}});
                    Toast("登录成功");
                    this.loginCount = 2;
                    window.sessionStorage.setItem(
                      "loginCount",
                      JSON.stringify(this.loginCount)
                    );
                    let user = {};
                    user.id = res2.data.data.id;
                    user.token = res2.data.data.token;
                    this.$store.commit("SELECT_SHOP", {
                      user: user
                    });
                    console.log(user);
                    localStorage.setItem("userMsg", JSON.stringify(user));
                    // localStorage.setItem('userToken',user.token);
                    setTimeout(() => {
                      this.$router.push({ path: "/temp" });
                    }, 1000);
                  } else if (
                    res2.data.code === 400 &&
                    res2.data.message === "该微信号未注册"
                  ) {
                    this.loginCount = 2;
                    // this.$toast(JSON.parse(res1.data.data).access_token);
                    window.sessionStorage.setItem(
                      "loginCount",
                      JSON.stringify(this.loginCount)
                    );
                    this.$router.push({
                      path: "/person-detail",
                      query: {
                        origin: "weiXin",
                        access_token: JSON.parse(res1.data.data).access_token,
                        openid: JSON.parse(res1.data.data).openid
                      }
                    });
                  } else {
                    Toast(res2.data.message);
                  }
                }
              );
            } else {
              this.$toast("登录失败");
            }
          }
        );
      } else {
        if (location.href.indexOf("code") !== -1) {
          this.userCode = this.getvarFb(location.href, "code");
          post("line/user/getFacebookInfo", { code: this.userCode }, res => {
            console.log(res, "獲取id");
            window.sessionStorage.setItem("userId", res.data.id);
            if (res.data.id) {
              post(
                "api/user/loginByFacebook",
                { facebookId: res.data.id },
                res2 => {
                  if (res2.data.code === 200) {
                    // this.$router.push({path:'bindAccount',query:{openId:res1.data.data}});
                    Toast("登录成功");
                    this.loginCount = 2;
                    window.sessionStorage.setItem(
                      "loginCount",
                      JSON.stringify(this.loginCount)
                    );
                    let user = {};
                    user.id = res2.data.data.id;
                    user.token = res2.data.data.token;
                    this.$store.commit("SELECT_SHOP", {
                      user: user
                    });
                    console.log(user);
                    localStorage.setItem("userMsg", JSON.stringify(user));
                    // localStorage.setItem('userToken',user.token);
                    setTimeout(() => {
                      this.$router.push({ path: "/temp" });
                    }, 1000);
                  } else if (res2.data.code === 400) {
                    this.loginCount = 2;
                    // this.$toast(JSON.parse(res1.data.data).access_token);
                    window.sessionStorage.setItem(
                      "loginCount",
                      JSON.stringify(this.loginCount)
                    );
                    this.$router.push({
                      path: "/person-detail",
                      query: {
                        origin: "facebook",
                        name: res.data.name
                      }
                    });
                  } else {
                    Toast(res2.data.message);
                  }
                }
              );
            } else {
              this.$toast("登录失败");
            }
          });
          console.log("facebook", "code");
        }
      }
    }

    localStorage.removeItem("userMsg");
  },
  methods: {
    getvar(url, par) {
      if (url.indexOf("?") !== -1) {
        let urlsearch = url.split("?");
        console.log(urlsearch, "urlsearch");
        let pstr = urlsearch[1].split("&");
        for (let i = pstr.length - 1; i >= 0; i--) {
          let tep = pstr[i].split("=");
          if (tep[0] === par) {
            return tep[1];
          }
        }
        return -1;
      }
    },
    getvarFb(url, par) {
      let urlsearch = url.split("?");
      console.log(urlsearch, "urlsearch");
      let pstr = urlsearch[1].split("#");
      for (let i = pstr.length - 1; i >= 0; i--) {
        let tep = pstr[i].split("=");
        if (tep[0] === par) {
          return tep[1];
        }
      }
      return -1;
    },
    // 选择区号
    selectAreaCode() {
      // console.log(1);
      this.$router.push({
        path: "/chooseAreaCode",
        query: { origin: "login" }
      });
      // console.log(2);
      // this.$router.go(-1)
    },
    onSubmit(formValidate) {
      let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      let regExpTw = /^09\d{8}$/;
      if (formValidate.phone === "") {
        this.$toast("手机号不能为空！");
        return false;
      }
      if (this.areaCode === "86") {
        if (!regExpChina.test(formValidate.phone)) {
          this.$toast("输入的手机号码有误！");
          return false;
        }
      }
      if (this.areaCode === "886") {
        if (!regExpTw.test(formValidate.phone)) {
          this.$toast("输入的手机号码有误！");
          return false;
        }
      }
      if (formValidate.password === "") {
        this.$toast("密码不能为空！");
        return false;
      } else {
        // this.$router.push({path:'/home'});
        this.login();
      }
    },
    onRegister() {
      this.$router.push({ path: "/register" });
    },
    onForget() {
      // let regExpChina = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      // let regExpTw = /^09\d{8}$/;
      // if(this.formValidate.phone.trim().length === 0){
      //   this.$toast('请先输入您的手机号');
      //   return false;
      // }
      // if(this.areaCode === '86'){
      //   if(!regExpChina.test(this.formValidate.phone)){
      //     this.$toast('您输入的手机号有误！');
      //     return false;
      //   }
      // }
      // if(this.areaCode === '886'){
      //   if(!regExpTw.test(this.formValidate.phone)){
      //     this.$toast('您输入的手机号有误！');
      //     return false;
      //   }
      // }
      this.$router.push({
        path: "/forget",
        query: { phone: this.formValidate.phone }
      });
    },
    login() {
      post(
        "api/user/loginWithPhoneAndPassword",
        {
          cellphone: this.formValidate.phone,
          password: this.formValidate.password
        },
        res => {
          console.log(res);
          if (res.data.code == "200") {
            Toast("登录成功");
            console.log(res, "login");
            console.log(res);
            let user = {};
            user.id = res.data.data.id;
            user.token = res.data.data.token;
            this.$store.commit("SELECT_SHOP", {
              user: user
            });
            console.log(user);
            localStorage.setItem("userMsg", JSON.stringify(user));
            // localStorage.setItem('userToken',user.token);
            setTimeout(() => {
              this.$router.push({ path: "/temp" });
            }, 1000);
          } else {
            Toast(res.data.message);
          }
        }
      );
    },
    // 其他登录方式
    otherLogin(type) {
      if (type === "微信") {
        let browserInfo = navigator.userAgent.toLowerCase();
        console.log(browserInfo);

        // 在微信浏览器中打开
        if (browserInfo.match(/MicroMessenger/i) == "micromessenger") {
          // this.$toast('weixin');
          this.loginCount = 1;
          window.sessionStorage.setItem(
            "loginCount",
            JSON.stringify(this.loginCount)
          );
          location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Flogin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        } else {
          this.$toast("您使用的浏览器暂不支持微信登录，请前往微信内打开");
        }
      } else if (type === "LINE") {
        // let browserInfo = navigator.userAgent.toLowerCase();
        // console.log(browserInfo);
        console.log("line");
        this.loginCount = 1;
        window.sessionStorage.setItem(
          "loginCount",
          JSON.stringify(this.loginCount)
        );
        location.href =
          // "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1572304925&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Flogin&scope=openid%20profile";
          "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1654169181&state=abc236565sd&redirect_uri=http%3A%2F%2F8.210.210.214%2Fh5&scope=openid%20profile";
        // ' https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1654169181&redirect_uri=http%3A%2F%2F8.210.210.214%2Fh5&scope=openid%20profile'
        console.log("line2");
      } else if (type === "Facebook") {
        console.log("Facebook");
        this.loginCount = 1;
        window.sessionStorage.setItem(
          "loginCount",
          JSON.stringify(this.loginCount)
        );
        location.href =
          "https://www.facebook.com/v2.8/dialog/oauth?client_id=607524293212055&redirect_uri=https%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Flogin";
        console.log("facebook2");
      } else {
        this.$toast("暂未开放该登录方式，敬请期待");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.page-root {
  background-image: url("../assets/new_images/left-bottom-cloud.png"),
    url("../assets/new_images/right-bottom-cloud.png"),
    url("../assets/new_images/left-top-flower.png"),
    url("../assets/new_images/left-flower.png"),
    url("../assets/new_images/right-flower.png"),
    url("../assets/new_images/right-bottom-flower.png"),
    url("../assets/new_images/left-bird.png");
  background-attachment: fixed, fixed, fixed, fixed, fixed, fixed, fixed;
  background-position: left bottom, right bottom, left 50px, 100px 500px,
    right 300px, right 100px bottom, 200px 200px;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat,
    no-repeat, no-repeat;
  background-size: 30vw, 30vw, 100px, 100px, 80px, 100px, 150px;
}

.logo {
  max-width: 350px;
}

.logo-cloud {
  position: absolute;
  right: -85px;
  top: 0;
  width: 200px;
}

.input-group {
  display: flex;
  align-items: center;
  height: 35px;
  font-weight: bold;
}

.input-group input {
  border: none;
  background-color: #ffeede;
  font-size: 18px;
  width: 200px;
  padding: 5px;
}

.input-group input:focus-visible {
  outline: none;
}

.login-button {
  border: none;
  background: url("../assets/new_images/login-button.png");
  background-size: 280px 60px;
  width: 280px;
  height: 60px;
  color: #e9c26e;
  font-size: 28px;
  cursor: pointer;
}

.dividing-container {
  padding-top: 15px;
  display: flex;
  align-items: center;
  width: 360px;
}

.dividing-line {
  border: 1px solid #000000;
  opacity: 1;
  width: 33%;
  /* flex-basis: 0; */
  flex-grow: 1;
  /* max-width: 100%; */
}

.dividing-text {
  font-weight: bold;
  text-align: center;
  letter-spacing: 0px;
  padding: 0 10px;
}

.login-method-group {
  padding-top: 20px;
  width: 360px;
  display: flex;
  justify-content: space-around;
}

.login-method-group > img {
  width: 50px;
}

.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 47px;
  line-height: 47px;
}

.custom-select .selected {
  /* background-color: none; */
  /* border-radius: 6px; */
  /* border: 1px solid #666666; */
  color: #000000;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.custom-select .selected.open {
  /* border: 1px solid #ad8225; */
  border-radius: 6px 6px 0px 0px;
}

.custom-select .selected:after {
  position: absolute;
  content: "";
  top: 22px;
  right: 1em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: #000000 transparent transparent transparent;
}

.custom-select .items {
  color: #000000;
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  /* border-right: 1px solid #ad8225;
      border-left: 1px solid #ad8225;
      border-bottom: 1px solid #ad8225; */
  position: absolute;
  background-color: #913d02;
  left: 0;
  right: 0;
  z-index: 1;
}

.custom-select .items div {
  color: #000000;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.custom-select .items div:hover {
  background-color: #ad8225;
}

.selectHide {
  display: none;
}

@media (max-width: 575.98px) {
  .page-root {
    background-image: url("../assets/new_images/left-top-flower.png"),
      url("../assets/new_images/left-flower.png"),
      url("../assets/new_images/right-flower.png"),
      url("../assets/new_images/right-bottom-flower.png"),
      url("../assets/new_images/left-bird.png");
    background-attachment: fixed, fixed, fixed, fixed;
    background-position: left 50px, 100px 500px, right 300px, right 100px bottom,
      10px 380px;
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 100px, 100px, 80px, 100px, 60px;
  }

  .logo {
    max-width: 350px;
  }

  .logo-cloud {
    position: absolute;
    right: -30px;
    top: 20px;
    width: 140px;
  }

  .login-button {
    background-size: 280px 50px;
    width: 280px;
    height: 50px;
    color: #e9c26e;
    font-size: 24px;
  }
}
</style>
