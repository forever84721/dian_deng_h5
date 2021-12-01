import Vue from "vue";
import Router from "vue-router";

import VueI18n from "vue-i18n";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.getItem("languageSet") || "zh", // 从localStorage中获取语言设置，如果没有默认为中文简体
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    zh: require("../i18n/lang/zh"), // 中文简体语言包
    tw: require("../i18n/lang/tw") // 中文繁体语言包
  }
});

Vue.use(Router);

//定义路由规则
const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: i18n.t("m.login")
      // title: '登录',
    },
    component: () => import("@/views/login_new.vue")
  },
  {
    path: "/register",
    meta: {
      title: i18n.t("m.register")
      // title: '注册',
    },
    component: () => import("@/views/register/index.vue"),
    children: [
      {
        path: "",
        meta: {
          title: i18n.t("m.register")
          // title: '注册',
        },
        component: () => import("@/views/register/cahe/register.vue")
      },
      {
        name: "set-password",
        path: "set-password",
        meta: {
          title: i18n.t("m.setPsd")
          // title: '设置密码',
        },
        component: () => import("@/views/register/cahe/set-password.vue")
      }
    ]
  },
  {
    path: "/forget",
    meta: {
      title: i18n.t("m.forgetPsd")
      // title: '忘记密码',
    },
    component: () => import("@/views/forget/index.vue"),
    children: [
      {
        path: "",
        meta: {
          title: i18n.t("m.forgetPsd")
          // title: '忘记密码',
        },
        component: () => import("@/views/forget/cache/forget.vue")
      },
      {
        name: "resetpassword",
        path: "/resetpassword",
        meta: {
          title: i18n.t("m.newPsd")
          // title: '新密码',
        },
        component: () => import("@/views/forget/cache/reset-password.vue")
      }
    ]
  },
  {
    path: "/numberRegister",
    name: "numberRegister",
    meta: {
      title: i18n.t("m.register")
      // title: '注册',
    },
    component: () => import("@/views/register/cahe/numberRegister.vue")
  },
  {
    name: "temp",
    path: "/temp",
    meta: {
      title: i18n.t("m.footerNav.temp")
      // title: '寺庙',
    },
    component: () => import("@/views/temp/temp.vue")
  },
  {
    name: "selectTemp",
    path: "/selectTemp",
    meta: {
      title: i18n.t("m.temp.selectTemp")
      // title: '选择寺庙',
    },
    component: () => import("@/views/temp/select_new.vue")
  },
  {
    name: "activeCenter",
    path: "/activeCenter",
    meta: {
      title: i18n.t("m.activeCenter.activeCenter")
      // title: '活动中心',
    },
    component: () => import("@/views/activeCenter/activeCenter.vue")
  },
  {
    name: "personal",
    path: "/personal",
    meta: {
      title: i18n.t("m.footerNav.personalCenter")
      // title: '个人中心',
    },
    component: () => import("@/views/personal/personal.vue")
  },
  {
    path: "/set",
    meta: {
      title: i18n.t("m.setting")
      // title: '设定',
    },
    component: () => import("@/views/personal/cache/set.vue")
  },
  {
    name: "person-detail",
    path: "/person-detail",
    meta: {
      title: i18n.t("m.personal.message")
      // title: '个人信息',
    },
    component: () => import("@/views/personal/cache/person-detail.vue")
  },
  {
    name: "language",
    path: "/language",
    meta: {
      title: i18n.t("m.personal.language.languageManage")
      // title: '语言设定',
    },
    component: () => import("@/views/personal/cache/language.vue")
  },
  {
    name: "home",
    path: "/home",
    meta: {
      // title: '灯位菜单',
      title: i18n.t("m.lampMenu.lampMenu")
    },
    component: () => import("@/views/home/index.vue")
  },
  {
    name: "chooseSeat",
    path: "/chooseSeat",
    meta: {
      // title: '自主选位'
      title: i18n.t("m.lampMenu.selfSelect")
    },
    component: () => import("@/views/chooseSeat")
  },

  {
    path: "/order",
    meta: {
      // title: '服务记录'
      title: i18n.t("m.personal.serviceLog")
    },
    component: () => import("@/views/order")
  },
  {
    name: "orderDetail",
    path: "/orderDetail",
    meta: {
      // title: '订单详情'
      title: i18n.t("m.orderMsg")
    },
    component: () => import("@/views/order/orderDetail")
  },
  {
    name: "blessMessage",
    path: "/blessMessage",
    meta: {
      // title: '填写资料'
      title: i18n.t("m.blessMessage.writeMessage")
    },
    component: () => import("@/views/blessMessage/")
  },

  {
    name: "success",
    path: "/success",
    meta: {
      // title: '点灯成功'
      title: i18n.t("m.lampSuccess")
    },
    component: () => import("@/views/blessMessage/cache/success")
  },
  {
    path: "/thanks",
    meta: {
      // title: '感谢状'
      title: i18n.t("m.thanks")
    },
    component: () => import("@/views/blessMessage/cache/thanks")
  },
  {
    path: "/bindAccount",
    meta: {
      // title: '绑定账号'
      title: i18n.t("m.bindAccount")
    },
    component: () => import("@/views/register/cahe/bindAccount.vue")
  },
  {
    path: "/lightDetail",
    name: "lightDetail",
    meta: {
      // title: '明灯详情'
      title: i18n.t("m.brightLampDetail")
    },
    component: () => import("@/views/lightDetail")
  },
  {
    name: "myBrightLamp",
    path: "/myBrightLamp",
    meta: {
      // title: '我的明灯'
      title: i18n.t("m.footerNav.myLamp")
    },
    component: () => import("@/views/myBrightLamp")
  },
  {
    name: "chooseLamp",
    path: "/chooseLamp",
    meta: {
      // title: '线上点灯',
      title: i18n.t("m.lampDetail.onlineLamp")
    },
    component: () => import("@/views/chooseLamp/index")
  },
  {
    name: "lampDetail",
    path: "/lampDetail",
    meta: {
      // title: '灯种详情',
      title: i18n.t("m.lampDetail.lampDetail")
    },
    component: () => import("@/views/chooseLamp/lampDetail.vue")
  },
  {
    name: "pay",
    path: "/pay",
    meta: {
      // title: '支付',
      title: i18n.t("m.personal.pay")
    },
    component: () => import("@/views/pay/pay.vue")
  },
  {
    name: "safe",
    path: "/safe",
    meta: {
      // title: '账号与安全',
      title: i18n.t("m.personal.safe")
    },
    component: () => import("@/views/personal/safe/index.vue")
  },
  {
    name: "safeVerify",
    path: "/safeVerify",
    meta: {
      // title: '验证手机号',
      title: i18n.t("m.personal.verify")
    },
    component: () => import("@/views/personal/safe/safe.vue")
  },
  {
    name: "about",
    path: "/about",
    meta: {
      // title: '关于我们',
      title: i18n.t("m.personal.reGrad")
    },
    component: () => import("@/views/personal/about/about.vue")
  },
  {
    name: "help",
    path: "/help",
    meta: {
      // title: '帮助中心',
      title: i18n.t("m.personal.help")
    },
    component: () => import("@/views/personal/help/help.vue")
  },
  {
    name: "helpDetail",
    path: "/helpDetail",
    meta: {
      // title: '帮助详情',
      title: i18n.t("m.personal.helpMsg")
    },
    component: () => import("@/views/personal/help/helpDetail.vue")
  },
  {
    name: "advice",
    path: "/advice",
    meta: {
      // title: '意见反馈',
      title: i18n.t("m.personal.advice")
    },
    component: () => import("@/views/personal/advice/advice.vue")
  },
  {
    name: "sort",
    path: "/sort",
    meta: {
      // title: '排行榜',
      title: i18n.t("m.personal.consumePower")
    },
    component: () => import("@/views/personal/sort/sort.vue")
  },
  {
    name: "sortSetting",
    path: "/sortSetting",
    meta: {
      // title: '排行设置',
      title: i18n.t("m.personal.consumeSetting")
    },
    component: () => import("@/views/personal/sort/sortSetting.vue")
  },
  {
    name: "donate",
    path: "/donate",
    meta: {
      title: i18n.t("m.donateMoney")
      // title: '捐赠香油钱',
    },
    component: () => import("@/views/donate/donate.vue")
  },
  {
    name: "donateSuccess",
    path: "/donateSuccess",
    meta: {
      title: i18n.t("m.donateSuccess")
      // title: '捐赠成功',
    },
    component: () => import("@/views/donate/donateSuccess.vue")
  },
  {
    name: "chooseAreaCode",
    path: "/chooseAreaCode",
    meta: {
      title: i18n.t("m.chooseAreaCode")
      // title: '选择区号',
    },
    component: () => import("@/views/chooseAreaCode/index.vue")
  },
  {
    name: "serviceAndPrivacy",
    path: "/serviceAndPrivacy",
    meta: {
      title: i18n.t("m.serviceAndPrivacy")
      // title: '服务和隐私',
    },
    component: () => import("@/views/register/cahe/serviceAndPrivacy.vue")
  },
  {
    name: "activeDetail",
    path: "/activeDetail",
    meta: {
      title: i18n.t("m.activeDetail")
      // title: '活动详情'
    },
    component: () => import("@/views/activeCenter/activeDetail.vue")
  }
];

const router = new Router({
  routes
});

// 路由前置导航守卫
router.beforeEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0;
  // firefox
  document.documentElement.scrollTop = 0;
  // safari
  window.pageYOffset = 0;
  // 根据路由元信息设置文档标题
  window.document.title = to.meta.title || "线上点灯";

  let ls = localStorage.getItem("userMsg");
  console.log(to.path);
  if (
    !ls &&
    to.path !== "/" &&
    to.path.indexOf("login") === -1 &&
    to.path !== "/forget" &&
    to.path.indexOf("register") === -1 &&
    to.path.indexOf("forget") === -1 &&
    to.path !== "/person-detail" &&
    to.path !== "/chooseAreaCode" &&
    to.path !== "/serviceAndPrivacy" &&
    to.path !== "/bindAccount" &&
    to.path !== "/pay" &&
    to.path !== "/orderDetail" &&
    to.path !== "/blessMessage"
  ) {
    next({
      name: "login"
    });
    console.log("成3");
  } else {
    //绿界跳转监听
    if (to.path.indexOf("login") !== -1 && localStorage.getItem("ecPayItem")) {
      next({
        name: "pay"
      });
      console.log("成1");
    } else if (
      to.path.indexOf("login") !== -1 &&
      localStorage.getItem("ecPayRenewItem")
    ) {
      next({
        name: "myBrightLamp"
      });
      console.log("成2");
    } else if (
      to.path.indexOf("login") !== -1 &&
      localStorage.getItem("ecPayDonateItem")
    ) {
      next({
        name: "donate"
      });
      console.log("成3");
    } else if (
      to.path.indexOf("login") !== -1 &&
      localStorage.getItem("ecPayRenewOrderItem")
    ) {
      next({
        name: "orderDetail",
        query: {
          orderId: JSON.parse(localStorage.getItem("ecPayRenewOrderItem"))
            .orderId
        }
      });
      console.log(
        JSON.parse(localStorage.getItem("ecPayRenewOrderItem")).orderId
      );
      console.log("成3");
    } else {
      next();
      console.log("cheng4");
    }
    // next()
  }
});

export default router;
