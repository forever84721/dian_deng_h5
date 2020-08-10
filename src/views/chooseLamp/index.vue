<template>
  <div class="lampList">
    <van-nav-bar
      :title="$t('m.lampDetail.onlineLamp')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="lampBox">
      <div class="lamp" v-for="(item,index) in lampList" :key="index" @click="nextTo(item.id,item.lampHolderId)">
        <div class="lampImg">
          <img :src="'https://wenxuanguangmingdeng.com/attachment/'+item.image" alt="">
        </div>
        <div class="lampContain">
          <p class="title">{{item.name}}</p>
          <p class="text nowrap_4">{{item.description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {post} from "@/utils/request";
  import {Toast} from 'vant'
  // import homeNav from "@/views/home/cache/homeNav"
  import '../../assets/css/topNav.css'

  export default {
    name: "index",
    data() {
      return {
        lampList: []
      }
    },
    methods: {
      // 返回上一级
      onClickLeft() {
        this.$router.go(-1);
      },
      nextTo(lampCategoryId,lampHolderId) {
        this.$router.push({path:'/lampDetail',query:{tempId:this.$route.query.tempId,lampCategoryId:lampCategoryId,lampHolderId:lampHolderId}});
      }
    },
    mounted() {
      post('api/lampCategory/findWithTempleId', {templeId: this.$route.query.tempId}, res => {
        console.log(res);
        this.lampList = res.data.data;
        console.log(this.lampList);
        // this.showHeight = document.body.clientHeight - 50;
      })
    }
  }
</script>

<style scoped lang="less">

  .lampList {
    .lampBox {
      background-color: #F5F5F5;
      overflow: auto;
      height: calc(100vh - 96px);
      .lamp {
        width: 14rem;
        height: 4.8rem;
        background-color: #FFFFFF;
        border-radius: 0.4rem;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.32rem;
        .lampImg {
          height: 3.84rem;
          width: 5.08rem;
          background-image: url("../../assets/images/c_icn_picturebox_2.png");
          background-size: cover;
          float: left;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 0.6rem;
          img {
            width: 4.4rem;
            height: 3.1rem;
            margin-top: 0.35rem;
            margin-left: 0.35rem;
          }
        }
        .lampContain {
          float: left;
          height: 3.84rem;
          position: relative;
          overflow: hidden;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 0.56rem;
          .title {
            font-size: 0.6rem;
            font-weight: bold;

          }
          .text {
            margin-top: 0.32rem;
            font-size: 0.44rem;
            width: 7.04rem;

          }
        }
      }
    }
  }

</style>
