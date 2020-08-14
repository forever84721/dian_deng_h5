<template>
  <div class="personal">
    <!--      <header-top :title="title"></header-top>-->
    <!--      <div class="finish" @click="finish">完成</div>-->
    <van-nav-bar
      :title="$t('m.footerNav.personalCenter')"
    />
    <van-cell-group>
      <van-cell :title="$t('m.personal.message')"
                is-link
                icon=""
                to="/person-detail"
      >
      <template slot="icon">
        <div class="iconSet">
          <img src="../../assets/images/e_ic_g_5.png" alt="">
        </div>
      </template>
      </van-cell>
      <van-cell :title="$t('m.personal.consumePower')" is-link
                icon=""
                to="/sort"
      >
        <template slot="icon">
          <div class="iconSet">
            <img src="../../assets/images/e_ic_g_1.png" alt="">
          </div>
        </template>
      </van-cell>
      <van-cell :title="$t('m.personal.serviceLog')"
                is-link
                :value="$t('m.personal.checkOrder')"
                to="/order"
      >
        <template slot="icon">
          <div class="iconSet">
            <img src="../../assets/images/e_ic_g_2.png" alt="">
          </div>
        </template>
      </van-cell>
      <van-cell :title="$t('m.personal.language.languageManage')" is-link
                to="/language"
      >
        <template slot="icon">
          <div class="iconSet">
            <img src="../../assets/images/e_ic_g_3.png" alt="">
          </div>
        </template>
      </van-cell>
      <van-cell :title="$t('m.personal.setting')" is-link
                to="/set"
      >
        <template slot="icon">
          <div class="iconSet">
            <img src="../../assets/images/e_ic_g_4.png" alt="">
          </div>
        </template>
      </van-cell>

    </van-cell-group>
  </div>
</template>

<script>
  export default {
    name: "personal",
    data() {
      return {
        show: false,
        icon:{
          // icon1:require('@/src/assets/images/e_ic_g_5.png')
          // icon1:''
        }
      }
    },
    components: {},
    methods: {
    // 进入排行榜页面
     goSortPage() {
      this.$router.push('/sort')
     },
     onClickLeft() {
       this.$router.go(-1);
     }
    },
    created() {
      console.log(this.$route.meta.title)
    }
  }
</script>

<style lang="less" scoped>

  .iconSet {
    width: 1.2rem;
    height: 1rem;
  }
</style>
