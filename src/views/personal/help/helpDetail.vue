<template>
  <div class="about">
    <van-nav-bar
      :title="$t('m.personal.help')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="ql-editor" v-html="helpDetail.content">
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import '../../../assets/css/quill.core.css'
  import {post} from "../../../utils/request";

  export default {
    name:'help',
    data() {
      return{
        helpDetail:{}
      }
    },
    methods:{
      onClickLeft() {
        this.$router.go(-1);
      }
    },
    mounted() {
      post('api/page/get',{id:this.$route.query.helpId},res => {
        console.log(res);
        if(res.data.code ===200) {
          this.helpDetail = res.data.data;
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .about {
    display: block;
  }
  .content {
    width: 100vw;
    overflow: hidden;
    padding: 2vw;
    box-sizing: border-box;
  }
</style>
