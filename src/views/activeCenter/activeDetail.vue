<template>
  <div class="activeDetail">
    <van-nav-bar
      :title="$t('m.activeDetail')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div v-html="activeDetail.content">
    </div>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  import iconBefore from '@/assets/images/a_btn_yanjing_s.png'
  import iconAfter from '@/assets/images/a_icn_yanjing_n.png'
  import {post} from "@/utils/request/index"
  import {Toast} from 'vant'

  export default {
    name: "activeDetail",
    data() {
      return {
        activeDetail:{}
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      }
    },
    mounted() {
      post('api/message/get',{
        id: this.$route.query.id
      },res => {
        console.log(res);
        if(res.data.code ===200){
          this.activeDetail = res.data.data;
        }
      });
    }
  }
</script>

<style lang="less" scoped>

</style>
