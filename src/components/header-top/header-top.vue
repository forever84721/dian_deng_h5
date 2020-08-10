<template>
  <div class="header-top">
    <van-icon class="back" name="arrow-left" size="30px" color="red" @click="back" />
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
    export default {
        name: "header-top",
        props:['title'],
      methods:{
        back(){
          this.$router.go(-1)
        },
      }
    }
</script>

<style lang="less" scoped>
.header-top{
    width: 100%;
    height: 55px;
    background-color: #f2f2f2;
    text-align: center;
    /*border-bottom: 1px solid #cccccc;*/
}
  .back{
    float:left;
    margin: 10px 0 0 10px;
    vertical-align: center;
  }
  .title{
    padding-top: 10px;
    margin-right: 30px;
    vertical-align: center;
  }
</style>
