<template>
  <div>
    <van-cell :title="lightDetail.lampHolderName" :label="'时间规格：'+lightDetail.name"/>
    <div class="area">
      <!--      <select >-->
      <!--        <option v-for="item in items"-->
      <!--                :value ="item.area"-->
      <!--        >{{item.area}}</option>-->
      <!--      </select>-->
      <div style="

        width: 100%;
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #999999;
        font-size: 14px;
        "
           @click="showPicker=true;"
      >
        已选择 : {{area}}
        <van-icon name="arrow-down"/>
      </div>
      <div class="content">
        <!--          <div class="column">-->
        <!--           <p v-for="(item,index) in seatList">-->
        <!--           {{index+1}}-->
        <!--         </p>-->
        <!--          </div>-->
        <div :style="{'display':'flex','flex-direction': 'column','position': 'absolute','top': top,'left':'0'}" ref="lampNum">
          <span class="row_num" v-for="(item,index) in seatList">{{index+1}}</span>
        </div>
        <div class="chooseArea">

          <div class="seat_col" v-for="(item,index) in seatList">
            <!--            <div style="width: 40px;float: left;position: absolute;">-->
            <!--              <span class="row_num" >{{index+1}}</span>-->
            <!--            </div>-->
            <img ref="imgbox" :src="rowItem.statue === '待点亮' ? darkUrl : rowItem.statue === '已点亮'||rowItem.statue ==='正常' || rowItem.statue === '维修中' || rowItem.statue === '异常' ? purchaseUrl : lightUrl "
                 v-for="(rowItem,rowIndex) in item"
                 style="width: 30px;height: 30px;flex-shrink: 0"
                 @click="chooseSeat(rowItem,index,rowIndex)"
            >
          </div>
        </div>
      </div>

    </div>

    <div class="footer">
      <div>
        <ul class="purchase_list">
          <li v-for="(item,index) in purchaseList">
                <span class="s5">
                  <span class="s3">{{item.location}}</span>
                  <span class="s4">{{price}}元</span>
                </span>
            <img src="../../assets/images/c_btn_close.png" alt="" width="20" height="20"
                 @click="deleteSeat(index,item.col,item.row)">
          </li>
        </ul>
      </div>
      <div class="submit" @click="handleSubmit">
        <span v-if="purchaseList.length>0">{{this.price*purchaseList.length}}元</span> 确认选择
      </div>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="areaItems"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>

  </div>
</template>

<script>
  import checkIcon from '../../assets/images/b_icn_choice.png'
  import uncheckIcon from '../../assets/images/b_ic_more.png'
  import {post} from '@/utils/request/index'
  import {Toast} from 'vant'
  export default {
    name: "index",
    data() {
      return {
        areaItems: [],
        showPicker: false,
        checked: true,
        list: ['a', 'b', 'c', 'd'],
        result: [],
        checked: true,
        icon: {
          active: checkIcon,
          inactive: uncheckIcon,
        },
        gkList: [],
        seatList: [],
        seatWidth: '',
        seatHeight: '',
        darkUrl: require('../../assets/images/yumin.png'),
        lightUrl: require('../../assets/images/b_btn_chooselamp_s.png'),
        purchaseUrl: require('../../assets/images/b_btn_wick_s.png'),
        purchaseList: [],
        area:'',
        lightList:[],
        lampStandId:'',
        lampNumList:[],
        lightDetail:{},
        price:'',
        location:'',
        top:0,
      }
    },
    methods:{
      handleSubmit() {

      },
      onConfirm() {

      }
    }
    created() {
      this.getList();
      this.price=this.$route.query.price;
    },
    methods: {
      getList() {
        post('api/specification/findByLampHolderId', {"lampHolderId":this.$route.query.lampHolderId}, res => {
          // console.log(res);
          if (res.data.code == '200') {
            let id = this.$route.params.id;
            this.gkList = res.data.data;
            this.gkList.map(s=>{
              if (s.id == id) {
                this.lightDetail = s;
              }
            })
          }
        })
      },
      getSeatList() {
        post(
          'api/lampStand/findByLampStandId',
          {
            "lampStandId": this.lampStandId
          },
          res => {
            if (res.data.code == '200') {
              // let imgHeight = document.getElementsByClassName('imgbox')[0];
              // let imgWidth = document.getElementsByClassName('imgbox')[0];
              this.seatList = res.data.data;
              this.location=res.data.data[0][0].location.substring(0,4);
              console.log(this.purchaseList)
              this.purchaseList.map(s=>{
                if (s.area == this.area) {
                  this.seatList[s.col][s.row] = '已选购'
                }
              })
              console.log(this.location);
              // console.log("seatList",res.data.data);
            }
          }
        )
      },
      chooseSeat(rowItem, col, row) {
        let obj = {}
        let type = rowItem.statue;
        if (type == '待点亮') {
          this.seatList[col][row].statue = '已选购';
          obj.location = this.seatList[col][row].location;
          obj.col = col;
          obj.row = row;
          obj.area = this.area;
          // console.log(this.$refs.imgbox[rowItem].src);

          this.purchaseList.push(obj);
          this.lightList.push(rowItem);
          // console.log(this.area);
        } else if (type == '已选购') {
          this.seatList[col][row].statue = '待点亮'
          this.purchaseList.map((item, index) => {
            if (item.col == col && item.row == row) {
              this.purchaseList.splice(index, 1);
              this.lightList.splice(index,1);
            }
          })
        }
        // console.log(this.lightList)
      },
      deleteSeat(index, col, row) {
        this.seatList[col][row].statue = '待点亮'
        this.purchaseList.splice(index, 1);//
        this.lightList.splice(index,1)
      },
      onConfirm(e) {
        this.showPicker = false;
        this.area = e;//将灯柱显示在页面上
        this.lampNumList.map(s=>{

          if (s.number == e) {
            this.lampStandId = s.id;
            this.getSeatList();
          }
        })
      },
      handleSubmit(){
        // this.$root.$emit('on-chooseSeat',{ purchaseList:this.purchaseList,lightList:this.lightList });
        // this.$router.go(-1);
        // console.log(this.lightList);
        console.log(this.lightList)
        let idList = []
        this.lightList.map(s=>{
          let obj = {};
          obj.id = s.id
          idList.push(obj);
        })
        if (this.purchaseList.length>0) {
          post('api/lamp/saveLamps',{
            "lampList":idList,
          },res=>{
            if (res.data.code === 200) {
              this.$router.push(
                {  name:'home',
                  params:{
                    purchaseList:this.purchaseList,
                    lightList:this.lightList,
                    typeId:this.$route.params.id
                  },
                  query:{
                    lampHolderId:this.$route.query.lampHolderId,
                    list:res.data.data
                  } })
            } else {
              this.$toast(res.data.message);
            }
          })

        } else {
          Toast('请选择座位');
        }

      },
      handleScroll(e){
        console.log('滚动');
        console.log(e.target.scrollTop);
        this.$nextTick(()=>{
          this.top = -e.target.scrollTop+'px';
        })
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll, true)
      post("api/lampStand/findByLampHolderId", {
        "lampHolderId": this.$route.query.lampHolderId
      }, res => {
        if(res.data.code==200){
          let areas =res.data.data;
          this.lampNumList = res.data.data;
          for(let i=0;i<areas.length;i++){
            this.areaItems.push(areas[i].number);
          }
          this.area = this.areaItems[0];//将灯柱显示在页面
          this.lampStandId = res.data.data[0].id;
          this.getSeatList();
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .area {
    width: 100%;
    /*display: flex;*/
    /*align-items: center;*/
    /*flex-direction: column;*/

    .content {
      width: 100%;
      height: 60vh;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      position: relative;
      overflow: hidden;
      .column {
        display: flex;
        flex-direction: column;
        width: 0.8rem;
        border-radius: 0.2rem;
        background-color: #d5d5d5;
        font-size: 0.48rem;
        color: #666666;
        text-align: center;
        justify-content: space-around;
      }
      .row_num {
        flex-shrink: 0;
        text-align: center;
        font-size: 0.48rem;
        width: 0.8rem;
        background: #D5D5D5;
        display: inline-block;
        height: 1.2rem;
        line-height: 1.2rem;
        color: #666666;
      }
      .chooseArea {
        width: 85vw;
        height: 60vh;
        display: flex;
        flex-direction: column;
        overflow: auto;
        position: relative;
        img {
          width: 0.8rem;
          height:0.8rem;

        }

        .seat_col {
          display: flex;
          flex-shrink: 0;



          span {
            margin-right:0.8rem;
          }

          &:first-child {
            span:first-child {
              border-top-right-radius: 0.32rem;
              border-top-left-radius: 0.32rem;
            }
          }

          &:last-child {
            span:first-child {
              border-bottom-right-radius: 0.32rem;
              border-bottom-left-radius: 0.32rem;
            }

          }
        }
      }
    }

  }

  .purchase_list {
    display: flex;
    overflow-x: auto;
    margin-top: 0.56rem;

    li {
      position: relative;
      font-size: 0.44rem;
      list-style: none;
      width: 4.6rem;
      height: 2rem;
      border: 1px solid rgba(153, 153, 153, 1);
      border-radius: 5px;
      color: #9D3024;
      margin-right: 0.2rem;
      flex-shrink: 0;
    }

    span {
      display: inline-block;
    }

    .s3, .s4 {
      text-align: center;
      width: 3.8rem;
    }

    .s3 {
      margin-bottom: 0.2rem;
    }

    .s5 {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    img {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  /*@media screen and (min-width: 330px) {*/
  /*  .footer {*/
  /*    !*margin-top: 30px;*!*/
  /*    width: 100%;*/
  /*    position: fixed;*/
  /*    bottom: 0;*/
  /*    background-color: #fff;*/
  /*    .purchase_list {*/
  /*      display: flex;*/
  /*      text-align: left;*/
  /*      padding: 0.4rem 0.4rem 0;*/
  /*      overflow-x: auto;*/

  /*      > li {*/
  /*        width: 4.2rem;*/
  /*        height: 2rem;*/
  /*        font-size: 0.36rem;*/
  /*        border: 1px solid #666666;*/
  /*        border-radius: 0.4rem;*/
  /*        margin-left: 0.4rem;*/
  /*        padding: 0.2rem;*/
  /*        position: relative;*/
  /*        flex-shrink: 0;*/

  /*        > img {*/
  /*          position: absolute;*/
  /*          right: 0;*/
  /*          top: 50%;*/
  /*          transform: translate(0,-50%);*/
  /*        }*/
  /*        span{*/
  /*          &:last-of-type{*/
  /*            text-align: center;*/
  /*            display: inline-block;*/
  /*            width: 89%;*/
  /*            color: #885022;*/
  /*            padding-top: 0.2rem;*/
  /*          }*/

  /*        }*/
  /*      }*/

  /*    }*/

  /*  }*/
  /*}*/
  /*@media screen and (max-width: 330px) {*/
  /*  .footer {*/
  /*    !*margin-top: 30px;*!*/
  /*    width: 100%;*/
  /*    position: fixed;*/
  /*    bottom: 0;*/
  /*    background-color: #fff;*/
  /*    .purchase_list {*/
  /*      display: flex;*/
  /*      text-align: left;*/
  /*      padding: 0.4rem 0.4rem 0;*/
  /*      overflow-x: auto;*/

  /*      > li {*/
  /*        width: 4rem;*/
  /*        height: 1.6rem;*/
  /*        font-size:0.36rem;*/
  /*        border: 1px solid #666666;*/
  /*        border-radius: 0.4rem;*/
  /*        margin-left: 0.4rem;*/
  /*        padding: 0.2rem;*/
  /*        position: relative;*/
  /*        flex-shrink: 0;*/

  /*        > img {*/
  /*          position: absolute;*/
  /*          right: 0;*/
  /*          top: 50%;*/
  /*          transform: translate(0,-50%);*/
  /*        }*/
  /*        span{*/
  /*          &:last-of-type{*/
  /*            text-align: center;*/
  /*            display: inline-block;*/
  /*            width: 89%;*/
  /*            color: #885022;*/
  /*            !*padding-top: 5px;*!*/
  /*          }*/

  /*        }*/
  /*      }*/

  /*    }*/

  /*  }*/
  /*}*/
  .seat_row {
    width: 0.76rem;
    height: 0.76rem;
    border: 1px solid #999999;
    background: url("../../assets/images/none.png");
    border-radius: 0.2rem;
  }

  .submit {
    font-size: 0.72rem;
    color: #885022;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0.96rem;
    background-image: url("../../assets/images/b_btn_pay.png");
    width: 13.08rem;
    background-size: 100% 100%;
    height: 2rem;
    line-height: 2rem;
  }
</style>
