<template>
  <div class="serviceAndPrivacy">
    <van-nav-bar
      :title="$t('m.serviceAndPrivacy')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div v-html="content" class="content">

    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import iconBefore from '@/assets/images/a_btn_yanjing_s.png'
  import iconAfter from '@/assets/images/a_icn_yanjing_n.png'
  import {post} from "@/utils/request/index"
  import {Toast} from 'vant'

  export default {
    name: "serviceAndPrivacy",
    data() {
      return {
        content:''
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      }
    },
    mounted() {
      post('api/other/findByTitle',{
        "title": "隱私政策"
      },res => {
        console.log(res);
        if(res.data.code === 200){
          this.content = res.data.data.content;
        }
      });
    }
  }
</script>

<style lang="less" scoped>
  .content {
    width: 100vw;
    /*overflow: hidden;*/
  }
</style>
