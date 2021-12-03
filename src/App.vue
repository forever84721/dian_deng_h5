<template>
  <div id="app">
    <header class="header">
      <div class="header-title">{{ title }}</div>
      <!-- $t("m.footerNav.temp") -->
    </header>
    <router-view />
    <my-loading v-if="loading" />

    <footer
      class="footer-menu-container"
      v-if="
        pathUrl === '/temp' ||
          pathUrl === '/myBrightLamp' ||
          pathUrl === '/activeCenter' ||
          pathUrl === '/personal' ||
          pathUrl === '/selectTemp' ||
          this.$route.query.tempId
      "
    >
      <div class="footer-menu">
        <router-link class="footer-menu-item" to="/temp">
          <img
            src="@/assets/new_images/寺廟介紹.png"
            :alt="$t('m.footerNav.temp')"
            class="footer-menu-img1"
          />
          <span>{{ $t("m.footerNav.temp") }}</span>
        </router-link>
        <router-link class="footer-menu-item" to="/myBrightLamp">
          <img
            src="@/assets/new_images/我的明燈.png"
            :alt="$t('m.footerNav.myLamp')"
            class="footer-menu-img1"
          />
          <span>{{ $t("m.footerNav.myLamp") }}</span>
        </router-link>
        <router-link class="footer-menu-item" to="/activeCenter">
          <img
            src="@/assets/new_images/活動信息.png"
            :alt="$t('m.footerNav.activeInfo')"
            class="footer-menu-img2"
          />
          <span>{{ $t("m.footerNav.activeInfo") }}</span>
        </router-link>
        <router-link class="footer-menu-item" to="/personal">
          <img
            src="@/assets/new_images/會員專區.png"
            :alt="$t('m.footerNav.personalCenter')"
            class="footer-menu-img2"
          />
          <span>{{ $t("m.footerNav.personalCenter") }}</span>
        </router-link>
      </div>
    </footer>
    <!-- <van-tabbar
      active-color="BD7030"
      inactive-color="#999999"
      v-if="
        pathUrl === '/temp' ||
          pathUrl === '/myBrightLamp' ||
          pathUrl === '/activeCenter' ||
          pathUrl === '/personal' ||
          this.$route.query.tempId
      "
      v-model="active"
      route
    >
      <van-tabbar-item to="/temp">
        <span>{{ $t("m.footerNav.temp") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.temp : icon.intemp"
          style="width: 1.2rem;height: 1.2rem"
        />
      </van-tabbar-item>
      <van-tabbar-item icon="search" to="/myBrightLamp">
        <span>{{ $t("m.footerNav.myLamp") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.myLamp : icon.inmyLamp"
          style="width: 1.2rem;height: 1.2rem"
        />
      </van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/activeCenter">
        <span>{{ $t("m.footerNav.activeInfo") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.activeInfo : icon.inactiveInfo"
          style="width: 1.2rem;height: 1.2rem"
        />
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/personal">
        <span>{{ $t("m.footerNav.personalCenter") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.personalCenter : icon.inpersonalCenter"
          style="width: 1.2rem;height: 1.2rem"
        />
      </van-tabbar-item>
    </van-tabbar> -->

    <!-- <div
      class="space"
      v-if="
        pathUrl === '/temp' ||
          pathUrl === '/myBrightLamp' ||
          pathUrl === '/activeCenter' ||
          pathUrl === '/personal' ||
          this.$route.query.tempId
      "
      v-model="active"
      route
    ></div> -->
  </div>
</template>

<script>
import myLoading from "./components/loading/loading.vue";

export default {
  name: "App",
  data() {
    return {
      active: 0,
      pathUrl: "",
      icon: {
        temp: require("@/assets/images/b_b_1_1.png"),
        intemp: require("@/assets/images/b_b_1.png"),
        myLamp: require("@/assets/images/b_b_2.png"),
        inmyLamp: require("@/assets/images/b_b_2_2.png"),
        activeInfo: require("@/assets/images/b_b_3_3.png"),
        inactiveInfo: require("@/assets/images/b_b_3.png"),
        personalCenter: require("@/assets/images/b_b_4_4.png"),
        inpersonalCenter: require("@/assets/images/b_b_4.png")
      }
    };
  },
  components: {
    myLoading
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    title() {
      return this.$route.meta.title;
    }
  },
  mounted() {
    this.getPagePath();
    let ls = localStorage.getItem("userMsg");
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
    if (this.pathUrl !== "/home" && this.pathUrl !== "/chooseSeat") {
      if (window.localStorage.getItem("seatInfo")) {
        window.localStorage.removeItem("seatInfo");
      }
      if (window.localStorage.getItem("ifSelectNum")) {
        window.localStorage.removeItem("ifSelectNum");
      }
    }
  },
  methods: {
    getPagePath() {
      this.pathUrl = location.hash.split("#")[1].split("?")[0];
      // console.log(this.$route.query.tempId);
      // console.log(this.pathUrl);
    }
  }
};
</script>

<style lang="less">
*::selection {
  background-color: #913d02;
}

body {
  margin: 0;
  height: 100vh;
  background-color: #e9e3db;
}
.cp {
  cursor: pointer;
}
main {
  flex-basis: 100%;
  padding-bottom: 65px;
}
.header + * {
  padding-top: 104px;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 104px;
  background-image: url("~@/assets/new_images/bar.png");
  background-repeat: repeat;
  z-index: 1000;
}

.header-title {
  height: 80px;
  color: #f2efe4;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-root {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-height: calc(100vh - 104px);
  overflow-x: hidden;
}
.footer-menu-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 65px;
}

.footer-menu {
  display: flex;
  justify-content: center;
  max-width: 1000px;
  width: 100%;
}

.footer-menu-item {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9e3db;
  color: #603812;
  font-weight: bold;
  font-size: 20px;
  border-top: #000000 1px solid;
  border-left: #000000 1px solid;
  cursor: pointer;
  /* border-right: #000000 0.5px solid; */
}

.footer-menu > :last-child {
  border-right: #000000 1px solid;
}

.footer-menu-img1 {
  width: 60px;
}

.footer-menu-img2 {
  width: 40px;
}

.footer-menu-item > span {
  margin-left: 10px;
}
@media (max-width: 575.98px) {
  .footer-menu-item {
    flex-direction: column;
    font-size: 14px;
  }

  .footer-menu-img1 {
    height: 25px;
    width: auto;
  }

  .footer-menu-img2 {
    /* width: 30px; */
    height: 25px;
    width: auto;
  }

  .footer-menu-item > span {
    margin-top: 5px;
    margin-left: 0;
  }
}
</style>
