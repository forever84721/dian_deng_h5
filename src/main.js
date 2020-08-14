// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import Vant from 'vant'
import Vconsole from 'vconsole'
// let vConsole = new Vconsole();
var VueBetterScroll = require('vue2-better-scroll')

import './assets/css/common.css'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('languageSet') || 'zh',    // 从localStorage中获取语言设置，如果没有默认为中文简体
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': require('./i18n/lang/zh'),   // 中文简体语言包
    'tw': require('./i18n/lang/tw')    // 中文繁体语言包
  }
})

// 判断运行环境并存储到localStorage中
// 判断运行环境（安卓, ios, 微信）
let u = navigator.userAgent
let ua = window.navigator.userAgent.toLowerCase()
let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1
let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
if (isAndroid) {
  localStorage.setItem('environment', 'android')
} else if (isIOS) {
  localStorage.setItem('environment', 'ios')
}
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  localStorage.setItem('environment', 'weixin')
} else {
  // console.log('非微信')
}

import {Lazyload,Swipe,SwipeItem,Dialog} from "vant";
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Dialog)
Vue.use(VueBetterScroll)
Vue.config.productionTip = false

//引入实时视频插件video.js

import videojs from "video.js"
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'

// Vue.prototype.$video = Video

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
