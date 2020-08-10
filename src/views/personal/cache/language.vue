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
      },
      //切换为中文简体
      changeZh() {
        this.$i18n.locale = 'zh';
        window.localStorage.setItem('languageSet','zh')
      }
    }
  }
</script>

<style scoped lang="less">
  .van-nav-bar .van-icon {
    color: gray;
  }
</style>
