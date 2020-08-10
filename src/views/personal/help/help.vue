<template>
  <div class="about">
    <van-nav-bar
      :title="$t('m.personal.help')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div>
      <van-cell v-for="(item,index) in helpList" :key="index" :title="item.title" is-link @click="goHelpDetail(item.id)"/>
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {post} from "../../../utils/request";

  export default {
    name:'help',
    data() {
      return{
        helpList:[]
      }
    },
    methods:{
      onClickLeft() {
        this.$router.go(-1);
      },
      goHelpDetail(id) {
        this.$router.push({path:'/helpDetail',query:{helpId:id}});
      }
    },
    mounted() {
      post('api/page/findByLabel',{label:'HELP'},res => {
        console.log(res);
        if(res.data.code === 200){
          this.helpList = res.data.data;
          console.log(this.helpList);
        }
      });
      // post('api/page/get',{id:1},res => {
      //   console.log(res);
      // })
    }
  }
</script>

<style lang="less" scoped>

</style>
