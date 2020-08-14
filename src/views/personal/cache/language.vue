<template>
  <div class="language">
    <van-nav-bar
      :title="$t('m.personal.language.languageManage')"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-cell :title="$t('m.personal.language.language_1')" @click="changeZh" is-link />
      <van-cell :title="$t('m.personal.language.language_2')" @click="changeTw" is-link />
    </van-cell-group>
  </div>
</template>

<script>
  // import VueI18n from 'vue-i18n'
  // Vue.use(VueI18n)
  // const i18n = new VueI18n({
  //   locale: localStorage.getItem('languageSet') || 'zh',    // 从localStorage中获取语言设置，如果没有默认为中文简体
  //   //this.$i18n.locale // 通过切换locale的值来实现语言切换
  //   messages: {
  //     'zh': require('../i18n/lang/zh'),   // 中文简体语言包
  //     'tw': require('../i18n/lang/tw')    // 中文繁体语言包
  //   }
  // })
  export default {
    name: "language",
    data() {
      return {}
    },
    methods: {
      // 返回上一级页面
      onClickLeft() {
        this.$router.go(-1);
      },
      //切换为中文繁体
      changeTw() {
        this.$i18n.locale = 'tw';
        window.localStorage.setItem('languageSet','tw')
        this.$router.push('personal')
        // this.$router.go(0)
        window.location.reload()
      },
      //切换为中文简体
      changeZh() {
        this.$i18n.locale = 'zh';
        window.localStorage.setItem('languageSet','zh')
        this.$router.push('personal')
        // this.$router.go(0)
        window.location.reload()
      }
    },
    beforeRouteLeave(to, from, next) {
      console.log(to.path)
      console.log(from.path)
      if (from.path === '/language') {
        console.log(to.meta.title)
      }
      next()
    }
  }
</script>

<style scoped lang="less">
  .van-nav-bar .van-icon {
    color: gray;
  }
</style>
