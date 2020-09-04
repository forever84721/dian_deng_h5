<template>
  <div id="app">
    <router-view/>
    <my-loading v-if="loading"/>
    <van-tabbar active-color="BD7030" inactive-color="#999999"
                v-if="pathUrl === '/temp' || pathUrl === '/myBrightLamp' || pathUrl === '/activeCenter' || pathUrl === '/personal' || this.$route.query.tempId "
                v-model="active" route>
      <van-tabbar-item to="/temp">
        <span>{{$t('m.footerNav.temp')}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.temp : icon.intemp"
          style="width: 1.2rem;height: 1.2rem"
        >
      </van-tabbar-item>
      <van-tabbar-item icon="search" to="/myBrightLamp">
        <span>{{$t('m.footerNav.myLamp')}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.myLamp : icon.inmyLamp"
          style="width: 1.2rem;height: 1.2rem"
        >
      </van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/activeCenter">
        <span>{{$t('m.footerNav.activeInfo')}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.activeInfo : icon.inactiveInfo"
          style="width: 1.2rem;height: 1.2rem"
        >
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/personal">
        <span>{{$t('m.footerNav.personalCenter')}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.personalCenter : icon.inpersonalCenter"
          style="width: 1.2rem;height: 1.2rem"
        >
      </van-tabbar-item>
    </van-tabbar>

    <div class="space"
         v-if="pathUrl === '/temp' || pathUrl === '/myBrightLamp' || pathUrl === '/activeCenter' || pathUrl === '/personal' || this.$route.query.tempId "
         v-model="active" route>
    </div>
  </div>
</template>

<script>
  import myLoading from './components/loading/loading.vue'

  export default {
    name: 'App',
    data() {
      return {
        active: 0,
        pathUrl: '',
        icon: {
          temp: require('@/assets/images/b_b_1_1.png'),
          intemp: require('@/assets/images/b_b_1.png'),
          myLamp: require('@/assets/images/b_b_2.png'),
          inmyLamp: require('@/assets/images/b_b_2_2.png'),
          activeInfo: require('@/assets/images/b_b_3_3.png'),
          inactiveInfo: require('@/assets/images/b_b_3.png'),
          personalCenter: require('@/assets/images/b_b_4_4.png'),
          inpersonalCenter: require('@/assets/images/b_b_4.png')
        }
      }
    },
    components: {
      myLoading
    },
    computed: {
      loading() {
        return this.$store.state.loading
      }
    },
    mounted() {
      this.getPagePath();
      let ls = localStorage.getItem('userMsg');
      console.log(ls);
      // if(this.$route.query){
      //   console.log(this.$route.query);
      //   console.log(location.hash.split('#')[1].split('?')[0]);
      // }else {
      //   console.log(1)
      // }
      // if (ls) {
      //   console.log(JSON.parse(ls));
      //   this.$router.push({path: '/chooseLamp'});
      // }
    },
    updated() {
      this.getPagePath();
      if( this.pathUrl !== '/home' && this.pathUrl !== '/chooseSeat'){
        if (window.localStorage.getItem('seatInfo')) {
          window.localStorage.removeItem('seatInfo');
        }
        if (window.localStorage.getItem('ifSelectNum')) {
          window.localStorage.removeItem('ifSelectNum');
        }
      }
    },
    methods: {
      getPagePath() {
        this.pathUrl = location.hash.split('#')[1].split('?')[0];
        // console.log(this.$route.query.tempId);
        // console.log(this.pathUrl);
      }
    }
  }
</script>

<style lang="less">
  /*@import "./assets/css/media.css";*/
  @num: 15px;
  * {
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 25px;
  }

  @media screen and (min-width: 320px) {
    html {
      font-size: 320/@num;
    }

  }

  @media screen and (min-width: 375px) {
    html {
      font-size: 375/@num;
    }
  }

  @media screen and (min-width: 414px) {
    html {
      font-size: 414/@num;
    }
  }

  .van-tabbar-item__icon {
    height: 1.2rem;
    width: 1.2rem;
  }

  .space {
    height: 50px;
  }

  .shadow {
    box-shadow: 0.08rem 0.4rem 0.16rem rgba(0, 0, 0, .2);
  }

  #app {
    min-height: 100vh;
    background-color: #ffffff;
    overflow: auto;
  }

  /*.submit {*/
  /*  width: 100%;*/
  /*  height: 4.44rem;*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*  background-size: 100% 3.76rem;*/
  /*  line-height: 3.76rem;*/
  /*  text-align: center;*/
  /*  background-repeat: no-repeat;*/
  /*  color: #885022;*/
  /*  font-size: 0.72rem;*/
  /*}*/

</style>
