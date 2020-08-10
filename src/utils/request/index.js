import service from "./service";
import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Vant from 'vant'
Vue.use(Router);
Vue.use(Vant)

/**
 * 分页参数: page=4&size=20&sort=id,desc
 * @param {*} url
 * @param {*} param
 * @param {*} callback
 */
export const post = (url, param, callback) => {
  store.commit('showLoading');
  service.post(url, param).then(res => {
    callback(res);
    store.commit('hideLoading')
  });
};
