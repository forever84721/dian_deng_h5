<template>
  <div>
    <header class="header">
      <div class="header-title">寺廟</div>
    </header>
    <main id="app">
      <div class="root">
        <div class="temple-container">
          <div class="dividing-container">
            <div class="dividing-line" style="margin-right: 15px;"></div>
            <img
              src="@/assets/new_images/left.png"
              alt="left"
              style="cursor: pointer;"
            />
            <span class="dividing-text">{{ tempData.name }}</span>
            <img
              src="@/assets/new_images/right.png"
              alt="right"
              style="cursor: pointer;"
            />
            <div class="dividing-line" style="margin-left: 15px;"></div>
          </div>

          <div class="carousel-container">
            <div style="padding: 0 10px;cursor: pointer;">
              <img src="@/assets/new_images/left.png" alt="left" />
            </div>
            <div
              style="width: 100%;height: 100%;background-position: center center;background-size: cover;"
              :style="{
                backgroundImage: currentImageUrl
              }"
            ></div>
            <div style="padding: 0 10px;cursor: pointer;">
              <img src="@/assets/new_images/right.png" alt="right" />
            </div>
          </div>

          <div style="display: flex;padding: 5px 0;">
            <div
              style="font-weight: bold;font-size: 18px;padding: 0 10px;min-width: 75px;"
            >
              初步地址
            </div>
            <div style="font-weight: bold;font-size: 18px;padding: 0 10px;">
              {{ tempData.address }}
            </div>
          </div>

          <div style="display: flex;padding: 5px 0;">
            <div
              style="font-weight: bold;font-size: 18px;padding: 0 10px;margin-top: 5px;min-width: 75px;"
            >
              點燈服務
            </div>
            <div style="display: flex;flex-wrap: wrap;">
              <div v-for="lamp in lampList" :key="lamp.id" class="light">
                {{ lamp.name }}
              </div>
            </div>
          </div>

          <div style="font-weight: bold;font-size: 14px;padding: 10px 10px;">
            {{ tempData.description }}
          </div>

          <div class="button-group">
            <button class="login-button">在線點燈</button>
            <button class="login-button">捐贈香油錢</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { post } from "@/utils/request/index";

export default {
  name: "temp",
  data() {
    return {
      show: false,
      // 选择的寺庙Id
      selectedTempId: "",
      // 寺庙数据
      tempData: {},
      // 盒子高度
      boxHeight: 0,
      // 寺庙展示区域主体高度
      mainBoxHeight: 0,
      // 按钮区域主体高度
      btnSpaceHeight: 0,
      lampList: [],
      userCode: "",
      maxName: 0,
      // 屏幕可用主体区域高度
      // showHeight: 0,
      images: [
        "https://img.yzcdn.cn/vant/apple-1.jpg",
        "https://img.yzcdn.cn/vant/apple-2.jpg"
      ],
      url: [],
      index: 0
    };
  },
  methods: {
    goDonate() {
      this.$router.push("/donate");
    },
    // 实现返回上一级
    onClickLeft() {
      this.$router.go(-1);
    },
    // 前往点灯列表页面
    clickLamp() {
      // let browserInfo = navigator.userAgent.toLowerCase();
      // if (browserInfo.match(/MicroMessenger/i) == 'micromessenger') {
      //   post('api/user/getLoginType', {}, res => {
      //     if (res.data.code === 200) {
      //       if (res.data.data === "phone") {
      //         if(!window.localStorage.getItem('wxPhoneOpenId')&&(JSON.parse(window.localStorage.getItem('wxPhoneOpenId')).id = JSON.parse(window.localStorage.getItem('userMsg')).id)){
      //           location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7cda5610536583c&redirect_uri=http%3A%2F%2Fwenxuanguangmingdeng.com%2Fh5%2F%23%2Ftemp&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
      //         }else {
      //           this.$router.push({path: '/chooseLamp', query: {tempId: this.tempData.id}});
      //         }
      //       }
      //     }
      //   });
      // }else {
      //   this.$router.push({path: '/chooseLamp', query: {tempId: this.tempData.id}});
      // }
      // post('api/cameraControl/getLiveBroadcastAddress', {
      //   "deviceSerial": "D82674077",
      //   "channelNo": "1",
      //   "expireTime": "300"
      // }, res => {
      //   console.log(res)
      //   // let url = res
      //   // this.movieUrl = url
      // })
      this.$router.push({
        path: "/chooseLamp",
        query: { tempId: this.tempData.id }
      });
    },
    // 前往选择寺庙页面
    goToSelectTemp() {
      this.$router.push({ path: "/selectTemp" });
    },
    //获取轮播图片地址
    getUrl() {
      //轮播土图片URL
      this.url = [];
      this.url = this.tempData.cover.split(",");
      // for(let i =0; i<this.urlArr.length; i++){
      //   this.url[i] = this.urlArr[i]
      //   return this.url
      // }
      console.log(this.url);
    }
  },
  computed: {
    currentImageUrl() {
      return (
        "url('https://wenxuanguangmingdeng.com/attachment/" +
        this.url[this.index] +
        "')"
      );
    }
  },
  created() {
    setInterval(() => {
      if (this.url) {
        if (this.index < this.url.length - 1) {
          this.index++;
        } else if (this.index === this.url.length - 1) {
          this.index = 0;
        }
        this.$forceUpdate();
      }
    }, 3000);
  },
  mounted() {
    // if(window.sessionStorage.getItem('payCount')){
    //   window.sessionStorage.setItem('payCount');
    // }
    // if(window.sessionStorage.getItem('payCount1')){
    //   window.sessionStorage.setItem('payCount1');
    // }
    // if(window.sessionStorage.getItem('payCount2')){
    //   window.sessionStorage.setItem('payCount2');
    // }
    // if (location.href.indexOf('code') !== -1) {
    //   this.userCode = this.getvar(location.href, 'code');
    //   let browserInfo = navigator.userAgent.toLowerCase();
    //   if (browserInfo.match(/MicroMessenger/i) == 'micromessenger') {
    //     post('api/user/getLoginType', {}, res => {
    //       if (res.data.code === 200) {
    //         if (res.data.data === "phone") {
    //           post('api/user/getWechatOpenId',
    //             {
    //               code: this.userCode,
    //             },
    //             res1 => {
    //              if(res1.data.code === 200){
    //                 let obj = {
    //                   id:JSON.parse(window.localStorage.getItem('userMsg')).id,
    //                   openId:JSON.parse(res1.data.data).openid
    //                 };
    //                 window.localStorage.setItem('wxPhoneOpenId',JSON.stringify(obj));
    //              }
    //             })
    //         }
    //       }
    //     });
    //   }
    // }
    // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    // 设置屏幕可用区域高度
    // 删除当前账号信息，用于测试
    // post('api/user/deleteUser',{id:58},res => {
    //   console.log(res);
    // });
    // 初始化页面布局，动态分配元素高度

    // setTimeout(()=>{
    // this.boxHeight = window.innerHeight - 96;
    // this.mainBoxHeight = this.boxHeight * (8.5 / 10);
    // this.btnSpaceHeight = this.boxHeight * (1.5 / 10);
    // },100);
    // console.log(this.boxHeight, this.mainBoxHeight, this.btnSpaceHeight);
    // window.addEventListener("touchend", e => {
    //   // let timer = setTimeout(()=>{
    //   this.boxHeight = window.innerHeight - 96;
    //   this.mainBoxHeight = this.boxHeight * (8.5 / 10);
    //   this.btnSpaceHeight = this.boxHeight * (1.5 / 10);
    //   // clearTimeout(timer);
    //   // },1000);
    // });

    // this.boxOtherHeight =  document.body.clientHeight - 50;
    // 如果有重新选择寺庙，获取寺庙信息
    if (this.$route.query.tempId) {
      this.selectedTempId = this.$route.query.tempId;
      console.log(this.selectedTempId);
      post("api/temple/findById", { id: this.selectedTempId }, res => {
        this.tempData = res.data.data;
        console.log(this.tempData);
        this.getUrl();
        console.log(this.url);
        console.log(this.tempData.cover.split(","));
        post(
          "api/lampCategory/findWithTempleId",
          { templeId: this.tempData.id },
          res => {
            console.log(res);
            this.lampList = res.data.data;
            console.log("lampList", this.lampList);
            //判断name的长度动态改变li的class
            // this.maxName = Math.max.apply(
            //   Math,
            //   this.lampList.map(item => {
            //     return item.name.length;
            //   })
            // );
            // console.log(this.maxName, "789");
            // this.showHeight = document.body.clientHeight - 50;
          }
        );
        this.tempData.userId = JSON.parse(
          window.localStorage.getItem("userMsg")
        ).id;
        window.localStorage.setItem(
          "selectTempData",
          JSON.stringify(this.tempData)
        );
        this.show = true;
        this.tempData = JSON.parse(
          window.localStorage.getItem("selectTempData")
        );
        console.log(this.tempData);
      });
    } else {
      if (window.localStorage.getItem("templeId")) {
        this.selectedTempId = JSON.parse(
          window.localStorage.getItem("templeId")
        );
        // 判断当前寺庙是否还存在在数据库
        post("api/temple/isExist", { id: this.selectedTempId }, res => {
          if (res.data.code === 200) {
            if (res.data.data === false) {
              window.localStorage.removeItem("selectTempData");
              window.localStorage.removeItem("templeId");
            } else {
              post("api/temple/findById", { id: this.selectedTempId }, res => {
                console.log(res.data.data.enable, "enable0");
                if (res.data.data.enable) {
                  console.log(res.data.data.enable, "enable");
                  this.tempData = res.data.data;

                  this.getUrl();
                  post(
                    "api/lampCategory/findWithTempleId",
                    { templeId: this.tempData.id },
                    res => {
                      console.log(res);
                      this.lampList = res.data.data;
                      console.log("lampList", this.lampList);
                      // this.showHeight = document.body.clientHeight - 50;
                    }
                  );
                  this.tempData.userId = JSON.parse(
                    window.localStorage.getItem("userMsg")
                  ).id;
                  window.localStorage.setItem(
                    "selectTempData",
                    JSON.stringify(this.tempData)
                  );
                  this.show = true;
                  this.tempData = JSON.parse(
                    window.localStorage.getItem("selectTempData")
                  );
                  console.log(this.tempData);
                } else {
                  this.show = false;
                }
              });
            }
          }
        });
      } else {
        // 如果本地存储有寺庙信息,并且对应当前账户就从本地读取
        if (
          window.localStorage.getItem("selectTempData") &&
          JSON.parse(window.localStorage.getItem("selectTempData")).userId ===
            JSON.parse(window.localStorage.getItem("userMsg")).id
        ) {
          post(
            "api/temple/isExist",
            {
              id: JSON.parse(window.localStorage.getItem("selectTempData")).id
            },
            res => {
              if (res.data.code === 200) {
                if (res.data.data === false) {
                  window.localStorage.removeItem("selectTempData");
                  this.getUrl();
                } else {
                  post(
                    "api/temple/findById",
                    {
                      id: JSON.parse(
                        window.localStorage.getItem("selectTempData")
                      ).id
                    },
                    res => {
                      console.log(res.data.data.enable, "enable2");
                      if (res.data.data.enable) {
                        console.log(res.data.data.enable, "enable3");
                        this.tempData = res.data.data;
                        this.getUrl();
                        post(
                          "api/lampCategory/findWithTempleId",
                          { templeId: this.tempData.id },
                          res => {
                            console.log(res);
                            this.lampList = res.data.data;
                            console.log("lampList", this.lampList);
                            // this.showHeight = document.body.clientHeight - 50;
                          }
                        );
                        this.tempData.userId = JSON.parse(
                          window.localStorage.getItem("userMsg")
                        ).id;
                        window.localStorage.setItem(
                          "selectTempData",
                          JSON.stringify(this.tempData)
                        );
                        this.show = true;
                        this.tempData = JSON.parse(
                          window.localStorage.getItem("selectTempData")
                        );
                        console.log(this.tempData);
                      }
                    }
                  );
                  // this.show = true;
                  // this.tempData = JSON.parse(window.localStorage.getItem('selectTempData'));
                  // console.log(this.tempData);
                  // post('api/lampCategory/findWithTempleId', {templeId: this.tempData.id}, res => {
                  //   console.log(res);
                  //   this.lampList = res.data.data;
                  //   console.log(this.lampList);
                  //   this.getUrl()
                  // this.showHeight = document.body.clientHeight - 50;
                  // });
                }
              }
            }
          );
        }
      }
    }
  },
  beforeDestroy() {
    if (window.localStorage.getItem("templeId")) {
      window.localStorage.removeItem("templeId");
    }
  }
};
</script>

<style scoped lang="less">
.root {
  position: relative;
  background-image: url("~@/assets/new_images/left-top-flower.png"),
    url("~@/assets/new_images/left-flower.png"),
    url("~@/assets/new_images/right-flower.png"),
    url("~@/assets/new_images/right-bottom-flower.png");
  background-attachment: fixed, fixed, fixed, fixed;
  background-position: left 50px, 100px 500px, right 300px, right 100px bottom;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
  background-size: 100px, 100px, 80px, 100px;

  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  /* min-height: calc(100vh - 104px); */
  overflow-x: hidden;
}

.temple-container {
  max-width: 1000px;
  width: 100%;
  margin: 0 30px;
}

.dividing-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  max-width: 1000px;
}

.dividing-line {
  border: 1px solid #000000;
  opacity: 1;
  /* width: 33%; */
  /* flex-basis: 0; */
  flex-grow: 1;
  /* max-width: 100%; */
}

.dividing-text {
  font-weight: bold;
  text-align: center;
  letter-spacing: 0px;
  padding: 0 30px;
  font-size: 36px;
}

.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px -30px;
  height: 400px;
}

.login-button {
  border: none;
  background: url("~@/assets/new_images/login-button.png");
  background-size: 280px 60px;
  width: 280px;
  height: 60px;
  color: #e9c26e;
  font-size: 28px;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
.light {
  font-weight: bold;
  font-size: 18px;
  color: #ad6c53;
  padding: 2px 15px;
  margin: 5px 5px;
  background-image: url("~@/assets/new_images/title-border.png");
  background-size: 100% 100%;
}
@media (max-width: 575.98px) {
  .root {
    position: relative;
    background-image: url("~@/assets/new_images/left-top-flower.png"),
      url("~@/assets/new_images/left-flower.png"),
      url("~@/assets/new_images/right-flower.png"),
      url("~@/assets/new_images/right-bottom-flower.png");
    background-attachment: fixed, fixed, fixed, fixed;
    background-position: left 50px, 100px 500px, right 300px, right 100px bottom;
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 100px, 100px, 80px, 100px;
  }

  .temple-container {
    margin: 0 10px;
  }

  .dividing-text {
    padding: 0 10px;
  }

  .carousel-container {
    margin: 0px -40px;
    height: 250px;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .dividing-container {
    margin: 10px 0;
  }

  .login-button {
    margin: 10px;
  }
}
</style>
