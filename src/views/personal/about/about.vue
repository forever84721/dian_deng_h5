<template>
  <div class="about">
    <van-nav-bar
      :title="$t('m.personal.reGrad')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="ql-editor" v-html="info[0].content" >
<!--      {{info.content}}-->
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {post} from "../../../utils/request";

  export default {
    name:'about',
    data() {
      return{
        info:[]
      }
    },
    methods:{
      onClickLeft() {
        this.$router.go(-1);
      }
    },
    mounted() {
      post('api/page/search',{"page": {
          "title": "关于我们"
        },
        "pageable": {
          "page": 1,
          "size": 10,
          "sort": {
            "desc": [
              "id"
            ]
          }
        }},res => {
        console.log(res);
        if(res.data.code === 200){
          this.info = res.data.data;
          console.log(this.info, "11")
        }
      })
    }
  }
</script>

<style lang="less" scoped>

</style>
