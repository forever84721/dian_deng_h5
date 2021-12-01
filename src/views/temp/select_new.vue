<template>
  <div>
    <header class="header">
      <div class="header-title">寺廟</div>
    </header>
    <main>
      <div class="page-root">
        <div class="temple-search-container">
          <div class="search-input-container">
            <input type="text" class="search-input" v-model="searchWord" />
            <div
              v-if="!searchWord"
              style="position: absolute;user-select: none;pointer-events: none;display: flex;align-items: center;justify-content: center;width: 350px;bottom:5px;"
            >
              <img
                src="@/assets/new_images/magnifier.png"
                alt="magnifier"
                style="width: 24px;"
              />
              <span
                style="color: #adadad;font-size: 24px;margin-left: 15px;word-spacing: 15px;"
                >請 輸 入 寺 廟 名 稱</span
              >
            </div>
          </div>
          <div
            style="height: 100px;display: flex;justify-content: center;align-items: center;font-weight: bold;font-size: 24px;"
          >
            <span>地　區</span>
          </div>
          <div style="padding: 30px 0;;height: 300px;display:flex;">
            <div
              style="width: 100%;margin:0 20px;font-weight: bold;font-size: 24px;overflow-y:auto;"
            >
              <div
                class="region1"
                v-for="(area, index) in firstArea"
                :key="area.id"
                @click="selectFirstArea(area, index)"
                :class="{ selected: index === selectIndex }"
              >
                {{ area.name }}
              </div>
            </div>
            <div style="border:black 1px solid;width: 0px;"></div>
            <div
              style="width: 100%;margin:0 20px;font-weight: bold;font-size: 24px;overflow-y:auto;"
            >
              <div
                class="region2"
                v-for="area in secondArea"
                :key="area.id"
                @click="selectSecondArea(area)"
              >
                {{ area.name }}
              </div>
            </div>
          </div>

          <!-- <div class="showList" :style="'height:' + showListHeight + 'px'">
            <div v-if="templeData.length !== 0">
              <div
                v-for="(item, index) in templeData"
                :key="index"
                class="showTemp"
                @click="goTempPage(item.id)"
              >
                <div class="showImg">
                  <img
                    :src="
                      'https://wenxuanguangmingdeng.com/attachment/' +
                        item.cover.split(',')[0]
                    "
                    alt=""
                  />
                </div>
                <p>{{ item.name }}</p>
              </div>
            </div>

            <div class="noResult" v-if="resultShow">
              <div class="bgImg">
                <img src="../../assets/images/c_kx.png" alt="" />
              </div>
              <p>暂无寺庙信息</p>
            </div>
          </div> -->

          <div style="text-align: center;">
            <button class="back-button cp" @click="$router.go(-1)">
              回上一頁
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// import "@/assets/css/topNav.css";
import { post } from "@/utils/request/index";

export default {
  name: "selectTemp",
  data() {
    return {
      // 搜索关键字
      searchWord: "",
      // 控制箭头方向以及城市列表区域和遮罩的显示与隐藏
      arrowShow: true,
      // 屏幕高度
      screenHight: 0,
      // 遮罩高度
      shadeHeight: 0,
      // 一级地区列表
      firstArea: [],
      // 二级地区列表
      secondArea: [],
      // 一级地区选中索引
      selectIndex: 0,
      // 显示的地区名字
      showAreaName: "地区",
      // 寺庙数据
      templeData: [],
      showListHeight: 0,
      resultShow: false
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    // 点击选择地区城市
    selectCity() {
      this.arrowShow = !this.arrowShow;
    },
    // 选择一级地区
    selectFirstArea(item, index) {
      // console.log(e)
      this.selectIndex = index;
      const id = item.id;
      post("api/region/findByParentId", { parentId: id }, res => {
        console.log(res);
        this.secondArea = res.data.data;
      });
    },
    // 选择二级地区
    selectSecondArea(item) {
      this.searchWord = "";
      console.log(item);
      this.showAreaName = item.name;
      this.arrowShow = true;
      post("api/temple/findByRegionId", { regionId: item.id }, res => {
        this.templeData = res.data.data;
        //console.log(this.templeData);
        if (this.templeData.length !== 0) {
          this.resultShow = false;
        } else {
          this.resultShow = true;
        }
      });
    },
    // 搜索寺庙
    searchTemp() {
      if (this.searchWord.trim().length === 0) {
        return false;
      }
      // console.log(1);
      console.log(this.searchWord);
      post(
        "api/temple/search",
        {
          temple: {
            name: this.searchWord,
            enable: true
          }
        },
        res => {
          console.log(res);
          this.templeData = res.data.data;
          if (this.templeData.length !== 0) {
            this.resultShow = false;
          } else {
            this.resultShow = true;
          }
        }
      );
      this.showAreaName = "地区";
    },
    // 前往寺庙首页
    goTempPage(id) {
      console.log(id);
      this.$router.push({
        path: "/temp",
        query: {
          tempId: id
        }
      });
    }
  },
  mounted() {
    //原生获取屏幕高度
    // this.screenHight = document.body.clientHeight;
    // console.log(this.screenHight);
    // 设置遮罩高度
    // this.shadeHeight =
    //   this.screenHight -
    //   window.document.getElementById("area").clientHeight -
    //   window.document.getElementById("nav").clientHeight;
    // 设置搜索列表高度
    // this.showListHeight =
    //   this.screenHight -
    //   window.document.getElementById("search").clientHeight -
    //   window.document.getElementById("nav").clientHeight;
    // console.log(this.shadeHeight);
    // window.onresize=function () {
    //   window.location.reload();
    // };
    // 查询配置项
    let param = {
      size: 10,
      page: 1
    };
    // 获取一级地区信息
    post("api/region/search", { pageable: param }, res => {
      console.log(res);
      this.firstArea = res.data.data;
      // 默认获取第一个一级地区的二级地区信息
      post(
        "api/region/findByParentId",
        { parentId: this.firstArea[0].id },
        res => {
          console.log(res);
          this.secondArea = res.data.data;
        }
      );
    });
    // this.showAreaName = '广州';
    // // 默认显示广州地区的寺庙信息
    // post('api/temple/findByRegionId',{regionId:8},res => {
    //   console.log(res);
    //   this.templeData = res.data.data;
    //   console.log(this.templeData);
    // })
  }
};
</script>

<style lang="less" scoped>
.page-root {
  position: relative;
  background-image: url("~@/assets/new_images/left-bottom-cloud.png"),
    url("~@/assets/new_images/right-bottom-cloud.png"),
    url("~@/assets/new_images/left-top-flower.png"),
    url("~@/assets/new_images/left-flower.png"),
    url("~@/assets/new_images/right-flower.png"),
    url("~@/assets/new_images/right-bottom-flower.png");
  background-attachment: fixed, fixed, fixed, fixed, fixed, fixed;
  background-position: left bottom, right bottom, left 50px, 100px 500px,
    right 300px, right 100px bottom;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat,
    no-repeat;
  background-size: 30vw, 30vw, 100px, 100px, 80px, 100px;

  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-height: calc(100vh - 104px);
  overflow-x: hidden;
}

.temple-search-container {
  width: 350px;
}

.search-input-container {
  padding-top: 40px;
  border: none;
  border-bottom: #943f01 1px solid;
  padding-bottom: 2px;
  /* display: flex; */
  position: relative;
}

.search-input {
  width: 100%;
  border: none;
  border-bottom: #943f01 2px solid;
  background: none;
  padding: 0;
  font-size: 24px;
}

.search-input:focus-visible {
  outline: none;
}

.region1 {
  text-align: center;
  letter-spacing: 5px;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.region1:hover {
  background-color: #862400;
  color: #dcad5f;
}
.region1.selected {
  background-color: #862400;
  color: #dcad5f;
}

.region2 {
  text-align: center;
  letter-spacing: 5px;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.region2:hover {
  background-color: #862400;
  color: #dcad5f;
}

.region2.selected {
  background-color: #862400;
  color: #dcad5f;
}

.back-button {
  border: none;
  font-size: 18px;
  background: url("~@/assets/new_images/title-border.png") no-repeat;
  background-size: 100% 100%;
  /* width: auto; */
  color: #8d310f;
  font-weight: bold;
  padding: 5px 30px;
}

@media (max-width: 575.98px) {
  .page-root {
    position: relative;
    background-image: url("~@/assets/new_images/left-top-flower.png"),
      url("~@/assets/new_images/left-flower.png"),
      url("~@/assets/new_images/right-flower.png"),
      url("~@/assets/new_images/right-bottom-flower.png");
    background-attachment: fixed, fixed, fixed, fixed;
    background-position: left 50px, 100px 500px, right 300px, right 100px bottom;
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 100px, 100px, 80px, 100px;
  }
}
</style>
