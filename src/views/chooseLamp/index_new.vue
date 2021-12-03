<template>
  <!-- <header class="header">
      <div class="header-title">{{ $t("m.lampDetail.onlineLamp") }}</div>
    </header> -->
  <main>
    <div class="page-root">
      <div class="light-card-container">
        <div class="light-card" v-for="(item, index) in lampList" :key="index">
          <div class="light-card-image">
            <img
              src="@/assets/new_images/image-border.png"
              alt="image-border"
              style="width: 100%; background-size: contain;border-radius: 20px;"
              :style="{
                backgroundImage: getImageUrl(item.image)
              }"
            />
          </div>
          <div class="light-card-info">
            <div class="light-card-info-title">
              <span>{{ item.name }}</span>
            </div>
            <div class="light-card-info-detail">
              {{ item.description }}
            </div>
            <div style="margin-top:auto;text-align: right;">
              <button
                class="go-light-up cp"
                @click="nextTo(item.id, item.lampHolderId)"
              >
                {{ $t("m.lampDetail.goLamp") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { post } from "@/utils/request";
import { Toast } from "vant";
// import homeNav from "@/views/home/cache/homeNav"
import "../../assets/css/topNav.css";

export default {
  name: "index",
  data() {
    return {
      lampList: []
    };
  },
  methods: {
    // 返回上一级
    onClickLeft() {
      this.$router.go(-1);
    },
    nextTo(lampCategoryId, lampHolderId) {
      this.$router.push({
        path: "/lampDetail",
        query: {
          tempId: this.$route.query.tempId,
          lampCategoryId: lampCategoryId,
          lampHolderId: lampHolderId
        }
      });
    },
    getImageUrl(path) {
      return "url('https://wenxuanguangmingdeng.com/attachment/" + path + "')";
    }
  },
  mounted() {
    post(
      "api/lampCategory/findWithTempleId",
      { templeId: this.$route.query.tempId },
      res => {
        console.log(res);
        this.lampList = res.data.data;
        console.log(this.lampList);
        // this.showHeight = document.body.clientHeight - 50;
      }
    );
  }
};
</script>

<style scoped lang="less">
.page-root {
  background-image: url("~@/assets/new_images/left-bottom-cloud.png"),
    url("~@/assets/new_images/left-top-flower.png"),
    url("~@/assets/new_images/left-flower.png"),
    url("~@/assets/new_images/right-flower.png"),
    url("~@/assets/new_images/right-bottom-flower.png"),
    url("~@/assets/new_images/charm.png");
  background-attachment: fixed, fixed, fixed, fixed, fixed;
  background-position: left bottom, left 50px, 100px 500px, right 300px,
    right 100px bottom, right 50px top;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat,
    no-repeat;
  background-size: 20vw, 100px, 100px, 80px, 100px, auto 90vh;
}

.light-card-container {
  width: 800px;
  max-width: 90vw;
}

.light-card {
  /* width: 800px; */
  padding: 20px;
  display: flex;
}

.light-card-image {
  width: 40%;
}

.light-card-info {
  display: flex;
  flex-direction: column;
  width: 60%;
  padding-left: 20px;
}

.light-card-info-title > span {
  font-size: 18px;
  background: url("~@/assets/new_images/title-border.png") no-repeat;
  background-size: 100% 100%;
  width: auto;
  height: 24px;
  color: #8d310f;
  font-weight: bold;
  padding: 5px 10px;
}

.light-card-info-detail {
  padding-top: 10px;
  font-size: 16px;
}

.go-light-up {
  border: none;
  background: url("~@/assets/new_images/go-light-up-button.png") no-repeat;
  background-size: 128px 36px;
  width: 128px;
  height: 36px;
  color: #e9c26e;
  font-size: 18px;
}

@media (max-width: 575.98px) {
  .page-root {
    background-image: url("~@/assets/new_images/left-top-flower.png"),
      url("~@/assets/new_images/left-flower.png"),
      url("~@/assets/new_images/right-flower.png"),
      url("~@/assets/new_images/right-bottom-flower.png");
    background-attachment: fixed, fixed, fixed, fixed;
    background-position: left 50px, 100px 500px, right 300px, right 100px bottom;
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 100px, 100px, 80px, 100px;
  }

  .light-card-container {
    max-width: 100vw;
  }

  .light-card {
    padding: 10px;
  }

  .light-card-info {
    padding-left: 10px;
  }

  .light-card-info-title > span {
    font-size: 14px;
  }

  .light-card-info-detail {
    padding-top: 5px;
    font-size: 12px;
    /* overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical; */
  }

  .go-light-up {
    background-size: 75px 24px;
    width: 75px;
    height: 24px;
    color: #e9c26e;
    font-size: 14px;
  }
}
</style>
