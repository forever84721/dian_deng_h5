import Vue from "vue";
import axios from "axios";
import store from "@/store";
import vant from "vant";
import router from "@/router";

Vue.use(vant);

// 创建axios实例
let service;

if (process.env.NODE_ENV === "development") {
  service = axios.create({
    baseURL: "/api" // api的base_url
  });
} else {
  // 生产环境下
  service = axios.create({
    baseURL: "https://wenxuanguangmingdeng.com" // api的base_url
  });
}

service.defaults.timeout = 50000; // 请求超时时间

// request拦截器 axios的一些配置
service.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上Access-Token
    // console.log(store.state.user)
    if (store.state.user.token) {
      config.headers["Access-Token"] = store.state.user.token;
    } else {
      let user = localStorage.getItem("userMsg");
      if (user) {
        // console.log(user);
        config.headers["Access-Token"] = JSON.parse(user).token;
      }

      // let result = store.dispatch("GET_USER_EXIST");
      // result.then( (flag) => {
      //   if (flag) {
      //     store.dispatch("GET_USER_CACHE");
      //     if (store.state.user.token) {
      //       config.headers['Access-Token'] = store.state.user.token;
      //
      //     }
      //   }
      // })
    }
    // if(localStorage.getItem('userMsg')){
    //   config.headers['Access-Token'] = JSON.parse(localStorage.getItem('userMsg')).token;
    // }
    return config;
  },
  error => {
    // Do something with request error
    store.commit("hideLoading");
  }
);

service.interceptors.response.use(
  response => {
    store.commit("hideLoading");
    if (response.data) {
      switch (response.data.code) {
        case 403:
          // localStorage.removeItem('userMsg');
          // router.replace({path:'/login'});
          break;
        case 407:
          // this.$toast('登录失效，请重新登录');
          router.replace({ path: "/login" });
          break;
      }
    }
    return response;
  },
  error => {
    store.commit("hideLoading");
    if (error.data) {
      switch (error.data.code) {
        case 407:
          // this.$toast('登录失效，请重新登录');
          router.replace({ path: "/login" });
          break;
        case 403:
          // localStorage.removeItem('userMsg');
          // router.replace({path:'/login'});
          break;
      }
    }
  }
);

export default service;
