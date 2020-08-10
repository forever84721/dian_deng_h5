<template>
  <div class="sortSetting">
    <van-nav-bar
      :title="$t('m.setting')"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-switch-cell v-model="checked" title="是否上排行榜" @change="changeStatus"/>
    </van-cell-group>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {post} from '@/utils/request/index'

  export default {
    name: 'help',
    data() {
      return {
        checked: '',
        screenHight: 0
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      changeStatus() {
        console.log(this.checked);
        post('api/user/updateInvisible',
          {
            "status": this.checked
          }, res => {
            console.log(res);
            if(res.data.code === 200){
              this.$toast('设置成功');
            }
          })
      }
    },
    created() {
      //原生获取屏幕高度
      this.screenHight = document.body.clientHeight
      console.log(this.screenHight)
    },
    mounted() {
      this.$toast.setDefaultOptions({ duration: 2000 });
      window.onresize = function () {
        //原生获取屏幕高度
        this.screenHight = document.body.clientHeight
        console.log(this.screenHight)
        window.location.reload();
      }
      // 获取当前用户是否上榜信息
      post('api/user/getInvisible', {}, res => {
        console.log(res);
        if (res.data.code === 200) {
          this.checked = res.data.data;
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .van-cell__title {
    span {
      font-size: 0.56rem;
    }
  }

  .sortSetting {
    background-color: #F5F5F5;
    height: 100vh;
  }
</style>
