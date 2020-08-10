import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

//定义路由规则
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/login.vue')
  },
  {
    path: '/register',
    meta: {
      title: '注册'
    },
    component: () => import('@/views/register/index.vue'),
    children: [
      {
        path: '',
        meta: {
          title: '注册',
        },
        component: () => import('@/views/register/cahe/register.vue')
      },
      {
        name: 'set-password',
        path: 'set-password',
        meta: {
          title: '设置密码',

        },
        component: () => import('@/views/register/cahe/set-password.vue')

      }
    ]
  },
  {
    path: '/forget',
    meta: {
      title: '忘记密码'
    },
    component: () => import('@/views/forget/index.vue'),
    children: [
      {
        path: '',
        meta: {
          title: '忘记密码'
        },
        component: () => import('@/views/forget/cache/forget.vue')
      },
      {
        name: 'resetpassword',
        path: 'resetpassword',
        meta: {
          title: '新密码'
        },
        component: () => import('@/views/forget/cache/reset-password.vue')
      }
    ]
  },
  {
    path: '/numberRegister',
    name: 'numberRegister',
    meta: {
      title: '注册'
    },
    component: () => import('@/views/register/cahe/numberRegister.vue')
  },
  {
    name: 'temp',
    path: '/temp',
    meta: {
      title: '寺庙'
    },
    component: () => import('@/views/temp/temp.vue'),
  },
  {
    name: 'selectTemp',
    path: '/selectTemp',
    meta: {
      title: '选择寺庙'
    },
    component: () => import('@/views/temp/select.vue'),
  },
  {
    name: 'activeCenter',
    path: '/activeCenter',
    meta: {
      title: '活动中心'
    },
    component: () => import('@/views/activeCenter/activeCenter.vue'),
  },
  {
    name: 'personal',
    path: '/personal',
    meta: {
      title: '个人中心'
    },
    component: () => import('@/views/personal/personal.vue'),
  },
  {
    path: '/set',
    meta: {
      title: '设定'
    },
    component: () => import('@/views/personal/cache/set.vue'),
  },
  {
    name: 'person-detail',
    path: '/person-detail',
    meta: {
      title: '个人信息'
    },
    component: () => import('@/views/personal/cache/person-detail.vue'),
  },
  {
    name: 'language',
    path: '/language',
    meta: {
      title: '语言切换'
    },
    component: () => import('@/views/personal/cache/language.vue'),
  },
  {
    name: 'home',
    path: '/home',
    meta: {
      title: '灯位菜单',
    },
    component: () => import('@/views/home/index.vue')
  },
  {
    name: 'chooseSeat',
    path: '/chooseSeat',
    meta: {
      title: '自主选位'
    },
    component: () => import('@/views/chooseSeat')
  },

  {
    path: '/order',
    meta: {
      title: '服务记录'
    },
    component: () => import('@/views/order')
  },
  {
    name: 'orderDetail',
    path: '/orderDetail',
    meta: {
      title: '订单详情'
    },
    component: () => import('@/views/order/orderDetail')
  },
  {
    name: 'blessMessage',
    path: '/blessMessage',
    meta: {
      title: '填写资料'
    },
    component: () => import('@/views/blessMessage/')
  },

  {
    name: 'success',
    path: '/success',
    meta: {
      title: '点灯成功'
    },
    component: () => import('@/views/blessMessage/cache/success')
  },
  {
    path: '/thanks',
    meta: {
      title: '感谢状'
    },
    component: () => import('@/views/blessMessage/cache/thanks')
  },
  {
    path: '/bindAccount',
    meta: {
      title: '绑定账号'
    },
    component: () => import('@/views/register/cahe/bindAccount.vue')
  },
  {
    path: '/lightDetail',
    name: 'lightDetail',
    meta: {
      title: '明灯详情'
    },
    component: () => import('@/views/lightDetail')
  },
  {
    name: 'myBrightLamp',
    path: '/myBrightLamp',
    meta: {
      title: '我的明灯'
    },
    component: () => import('@/views/myBrightLamp')
  },
  {
    name: 'chooseLamp',
    path: '/chooseLamp',
    meta: {
      title: '线上点灯',
    },
    component: () => import('@/views/chooseLamp/index')
  },
  {
    name: 'lampDetail',
    path: '/lampDetail',
    meta: {
      title: '灯种详情',
    },
    component: () => import('@/views/chooseLamp/lampDetail.vue')
  },
  {
    name: 'pay',
    path: '/pay',
    meta: {
      title: '支付',
    },
    component: () => import('@/views/pay/pay.vue')
  },
  {
    name: 'safe',
    path: '/safe',
    meta: {
      title: '账号与安全',
    },
    component: () => import('@/views/personal/safe/index.vue')
  },
  {
    name: 'safeVerify',
    path: '/safeVerify',
    meta: {
      title: '验证手机号',
    },
    component: () => import('@/views/personal/safe/safe.vue')
  },
  {
    name: 'about',
    path: '/about',
    meta: {
      title: '关于我们',
    },
    component: () => import('@/views/personal/about/about.vue')
  },
  {
    name: 'help',
    path: '/help',
    meta: {
      title: '帮助中心',
    },
    component: () => import('@/views/personal/help/help.vue')
  },
  {
    name: 'helpDetail',
    path: '/helpDetail',
    meta: {
      title: '帮助详情',
    },
    component: () => import('@/views/personal/help/helpDetail.vue')
  },
  {
    name: 'advice',
    path: '/advice',
    meta: {
      title: '意见反馈',
    },
    component: () => import('@/views/personal/advice/advice.vue')
  },
  {
    name: 'sort',
    path: '/sort',
    meta: {
      title: '排行榜',
    },
    component: () => import('@/views/personal/sort/sort.vue')
  },
  {
    name: 'sortSetting',
    path: '/sortSetting',
    meta: {
      title: '排行设置',
    },
    component: () => import('@/views/personal/sort/sortSetting.vue')
  }, {
    name: 'donate',
    path: '/donate',
    meta: {
      title: '捐赠香油钱',
    },
    component: () => import('@/views/donate/donate.vue')
  }, {
    name: 'donateSuccess',
    path: '/donateSuccess',
    meta: {
      title: '捐赠成功',
    },
    component: () => import('@/views/donate/donateSuccess.vue')
  }, {
    name: 'chooseAreaCode',
    path: '/chooseAreaCode',
    meta: {
      title: '选择区号',
    },
    component: () => import('@/views/chooseAreaCode/index.vue')
  },{
    name: 'serviceAndPrivacy',
    path: '/serviceAndPrivacy',
    meta: {
      title: '服务和隐私',
    },
    component: () => import('@/views/register/cahe/serviceAndPrivacy.vue')
  },{
    name: 'activeDetail',
    path: '/activeDetail',
    meta: {
      title: '活动详情',
    },
    component: () => import('@/views/activeCenter/activeDetail.vue')
  },

]

const router = new Router({
  routes
})

// 路由前置导航守卫
router.beforeEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
  // 根据路由元信息设置文档标题
  window.document.title = to.meta.title || "线上点灯"
  let ls = localStorage.getItem('userMsg');
  if (!ls && to.path !== '/' && to.path.indexOf('login') === -1  && to.path !== '/forget' && to.path.indexOf('register') === -1 && to.path.indexOf('forget') === -1 && to.path !== '/person-detail' && to.path !== '/chooseAreaCode' && to.path !== '/serviceAndPrivacy' && to.path !== '/bindAccount') {
    next({
      name: 'login'
    });
  } else {
    next()
  }

});

export default router

