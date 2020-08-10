<template>
  <div class="chooseCode">
    <van-nav-bar
      :title="$t('m.chooseAreaCode')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div>
      <van-cell-group>
        <van-cell title="中国" value="+86" @click="getCode(86)"/>
        <van-cell title="台湾地区" value="+886"  @click="getCode(886)"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'

  export default {
    name: "chooseCode",
    data() {
      return {}
    },
    methods: {
      // 返回上一级
      onClickLeft() {
        this.$router.go(-1);
      },
      getCode(code){
        if(this.$route.query.origin === 'login'){
          this.$router.push({path:'/login',query:{areaCode:code}});
        }else if(this.$route.query.origin === 'register'){
          this.$router.push({path:'/register',query:{areaCode:code}});
        }else if(this.$route.query.origin === 'forget'){
          this.$router.push({path:'/forget',query:{areaCode:code}});
        }else if(this.$route.query.origin === 'bind'){
          this.$router.push({path:'/bindAccount',query:{areaCode:code,openId:this.$route.query.openId}});
        }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
