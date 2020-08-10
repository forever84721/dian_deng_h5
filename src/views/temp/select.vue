<template>
  <div class="selectTemp">
    <van-nav-bar
      :title="$t('m.footerNav.temp')"
      left-arrow
      @click-left="onClickLeft"
      id="nav"
    />
    <div class="area" id="area">
      <div class="city">
        <span>{{showAreaName}}</span>
        <van-icon name="arrow-down" v-if="arrowShow" @click="selectCity"/>
        <van-icon name="arrow-up" v-if="!arrowShow" @click="selectCity"/>
      </div>
      <div class="search" id="search">
        <van-search placeholder="请输入寺庙名称" v-model="searchWord" @blur="searchTemp" clearable/>
      </div>
    </div>
    <!--  城市列表区域  -->
    <div class="cityList" v-if="!arrowShow">
      <div class="firstCity">
        <ul>
          <li v-for="(item,index) in firstArea" :key="index"  :class="{selected:index === selectIndex}" @click="selectFirstArea(item,index)">{{item.name}}</li>
        </ul>
      </div>
      <div class="secondCity">
        <ul>
          <li v-for="(item,index) in secondArea" :key="index" @click="selectSecondArea(item)">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!--  遮罩层  -->
    <div class="shade" v-if="!arrowShow" :style="{height:shadeHeight+'px'}" @click="selectCity">

    </div>

    <div class="showList" :style="'height:'+showListHeight + 'px'">
      <div v-for="(item,index) in templeData" :key="index" class="showTemp" @click="goTempPage(item.id)" v-if="templeData.length !==0">
        <div class="showImg">
          <img :src="'https://wenxuanguangmingdeng.com/attachment/'+item.cover" alt="">
        </div>
        <p>{{item.name}}</p>
      </div>
      <div class="noResult" v-if="resultShow">
          <div class="bgImg">
            <img src="../../assets/images/c_kx.png" alt="">
          </div>
         <p>暂无寺庙信息</p>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../assets/css/topNav.css'
  import {post} from '@/utils/request/index';

  export default {
    name: 'selectTemp',
    data() {
      return {
        // 搜索关键字
        searchWord: '',
        // 控制箭头方向以及城市列表区域和遮罩的显示与隐藏
        arrowShow: true,
        // 屏幕高度
        screenHight: 0,
        // 遮罩高度
        shadeHeight: 0,
        // 一级地区列表
        firstArea:[],
        // 二级地区列表
        secondArea:[],
        // 一级地区选中索引
        selectIndex:0,
        // 显示的地区名字
        showAreaName:'地区',
        // 寺庙数据
        templeData:[],
        showListHeight:0,
        resultShow:false
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      // 点击选择地区城市
      selectCity() {
        this.arrowShow = !this.arrowShow
      },
      // 选择一级地区
      selectFirstArea(item,index) {
        // console.log(e)
        this.selectIndex = index;
        const id = item.id;
        post('api/region/findByParentId',{parentId:id},res => {
          console.log(res);
          this.secondArea = res.data.data;
        })
      },
      // 选择二级地区
      selectSecondArea(item) {
        this.searchWord = '';
        console.log(item);
        this.showAreaName = item.name;
        this.arrowShow = true;
        post('api/temple/findByRegionId',{regionId:item.id},res => {
          this.templeData = res.data.data;
          //console.log(this.templeData);
          if(this.templeData.length !==0){
            this.resultShow = false;
          }else {
            this.resultShow = true;
          }
        });
      },
      // 搜索寺庙
      searchTemp() {
        if(this.searchWord.trim().length === 0){
          return false;
        }
        // console.log(1);
        console.log(this.searchWord);
        post('api/temple/search',{temple:{
            name:this.searchWord
          }},res => {
          console.log(res);
          this.templeData = res.data.data;
          if(this.templeData.length !==0){
            this.resultShow = false;
          }else {
            this.resultShow = true;
          }
        });
        this.showAreaName = '地区';
      },
      // 前往寺庙首页
      goTempPage(id) {
        console.log(id);
        this.$router.push({path:'/temp',query:{
          tempId:id
          }})
      }
    },
    mounted() {
      //原生获取屏幕高度
      this.screenHight = document.body.clientHeight;
      console.log(this.screenHight);
      // 设置遮罩高度
      this.shadeHeight = this.screenHight - window.document.getElementById('area').clientHeight - window.document.getElementById('nav').clientHeight;
      // 设置搜索列表高度
      this.showListHeight = this.screenHight - window.document.getElementById('search').clientHeight - window.document.getElementById('nav').clientHeight;
      console.log(this.shadeHeight);
      // window.onresize=function () {
      //   window.location.reload();
      // };
      // 查询配置项
      let param = {
          size:10,
          page:1,
      };
      // 获取一级地区信息
      post('api/region/search',{pageable:param},res => {
        console.log(res);
        this.firstArea = res.data.data;
        // 默认获取第一个一级地区的二级地区信息
         post('api/region/findByParentId',{parentId:this.firstArea[0].id},res => {
           console.log(res);
           this.secondArea = res.data.data;
         });
      });
      // this.showAreaName = '广州';
      // // 默认显示广州地区的寺庙信息
      // post('api/temple/findByRegionId',{regionId:8},res => {
      //   console.log(res);
      //   this.templeData = res.data.data;
      //   console.log(this.templeData);
      // })
    }
  }
</script>

<style lang="less" scoped>
  .selectTemp {
    .area {
      height: 1.76rem;
      width: 100%;
      /*background-color: #00B1E4;*/

      .city {
        float: left;
        width: 16%;
        height: 1.76rem;
        /*background-color: #965b26;*/
        font-size: 0.48rem;
        text-align: center;
        line-height: 1.76rem;

        .van-icon {
          vertical-align: middle;
        }
      }

      .search {
        float: left;
        width: 84%;
        height: 1.76rem;
        .van-search {
          height: 1.12rem;
          width: 99%;
          margin-top: 0.32rem;
        }

        .van-search /deep/ .van-field__control {
          font-size: 0.52rem;
        }
      }
    }

    .cityList {
      height: 12rem;
      width: 100%;
      /*background-color: palegreen;*/
      background-color: white;
      position: absolute;
      z-index: 99;
      ul li {
        height: 2rem;
        width: 100%;
        text-align: center;
        line-height: 2rem;
        border-bottom: 1px solid rgba(235,235,235,1);
        font-size: 0.56rem;
      }
      .firstCity {
        box-sizing: border-box;
        float: left;
        width: 50%;
        height: 12rem;
        border-top: 1px solid #EBEBEB;
        border-right: 1px solid #EBEBEB;
        overflow: auto;
        .selected {
          background:linear-gradient(93deg,rgba(228,164,111,1),rgba(205,134,75,1));
        }
      }
      .secondCity {
        box-sizing: border-box;
        float: left;
        width: 50%;
        height: 12rem;
        border-top: 1px solid #EBEBEB;
        overflow: auto;
      }
    }

    .shade {
      position: absolute;
      width: 100%;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .showList {
      width: 100%;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      overflow: auto;
      background-color: #f5f5f5;
      .showTemp {
        float: left;
        width: 6.8rem;
        height: 6.3rem;
        background-color: white;
        margin-top: 0.4rem;
        margin-left: 0.48rem;
        overflow: hidden;
        /*background-color: pink;*/
        border-radius: 0.28rem;
        .showImg {
          background-image: url("../../assets/images/b_ic_ci_c.png");
          width: 5.88rem;
          height: 4.48rem;
          background-size: cover;
          margin: 0.48rem 0.48rem 0.32rem 0.48rem;
          text-align: center;
          img {
            width: 5.35rem;
            height: 3.9rem;
            margin-left: 1px;
            margin-top: 8px;
          }
        }
        p {
          font-size: 0.52rem;
          text-align: center;
        }
      }
      .noResult {
        margin-top: 3.2rem;
        text-align: center;
        .bgImg {
          margin-bottom: 0.96rem;
          img {
            height: 7.12rem;
            width: 7.12rem;
          }
        }
        p {
          font-size:0.56rem;
          font-family:PingFang SC;
          /*font-weight:300;*/
          color:rgba(153,153,153,1);
          line-height:1rem;
          text-align: center;
        }
      }
    }
  }
</style>
