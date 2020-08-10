<template>
  <div class="thanks">
    <van-nav-bar
      :title="$t('m.thanks')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="thankImg">
      <p class="p1">{{$t('m.thanks')}}</p>
      <div class="content">
        兹感谢
        <span class="espec" v-for="item in userList">{{item.pilgrimName}}</span> <span class="espec" v-if="isOver">...</span> 于公元<span style="letter-spacing: 0.08rem;margin-left: 0.08rem">{{bigDate}}</span> 参与<span
        class="espec">{{temple}}</span>的
        <span class="espec">{{lampCategoryName}}</span>线上点灯
        <p>同结善缘 功德无量</p>
      </div>
      <p class="p2">{{$t('m.thankMessage')}}</p>
      <img :src="'https://wenxuanguangmingdeng.com/attachment/'+this.tempSealImg" alt="" class="tempSeal">
      <p class="p3">公元{{bigDate}}</p>
    </div>
    <div class="footer">
      <div>
        <span class="myLamp" @click="next">{{$t('m.footerNav.myLamp')}}</span>
      </div>
      <div>
        <span class="donate" @click="goDonate">{{$t('m.donateMoney')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../../assets/css/topNav.css'
  import {post} from "@/utils/request/index.js"

  export default {
    name: "thanks",
    data() {
      return {
        userList: [],
        temple: '',
        bigDate: '',
        tempSealImg:'',
        // 香客是过多
        isOver:false,
        lampCategoryName:''
      }
    },
    mounted() {
      // post('api/temple/findByOrderId', {orderId: this.$route.query.orderId}, res => {
      //   this.temple = res.data.data.name;
      // });
      post('/api/order/findThanksById', {orderId: this.$route.query.orderId}, res => {
        console.log(res);
        this.userList = res.data.data;
        this.temple = res.data.data[0].templeName;
        this.tempSealImg = res.data.data[0].templeStamp;
        this.lampCategoryName = res.data.data[0].lampCategoryName
        // res.data.data.forEach((item,index)=> {
        //   this.userList.push(item.pilgrimName);
        // });
        // if(this.userList.length >= 10){
        //   this.userList = this.userList.slice(0,9);
        //   this.isOver = true;
        // }
        this.userList.forEach((item,index)=>{
          if(item.pilgrimName.length>6){
            item.pilgrimName = item.pilgrimName.slice(0,2);
          }
        });
        let userListLength = 0;
        this.userList.forEach((item,index)=>{
          console.log(111111);
          userListLength = userListLength + item.pilgrimName.length;
        });
        console.log(2);
        if(userListLength>18){
            this.userList = this.userList.slice(0,3);
            this.isOver = true;
        }
        console.log(this.userList);
        this.bigDate = this.userList[0].startLightAt;
        console.log(this.bigDate);
        // 将获取到的日期转换为文字形式
        console.log(this.bigDate.split('-').join(''));
        let dateStr = this.bigDate.split('-').join('');
        let bigTextArr = [
          "〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"
        ];
        let dateArr = dateStr.split('');
        console.log(dateArr);
        let newArr = [];
        dateArr.forEach((item,index) => {
          newArr.push(parseInt(item));
        });
        console.log(newArr);
        let newBigArr = [];
        newArr.forEach((item,index) => {
          newBigArr.push(bigTextArr[item]);
        })
        console.log(newBigArr);
        if(newBigArr[4] !== "〇"){
          if(newBigArr[6] !== "〇"){
            this.bigDate = newBigArr[0]+newBigArr[1]+newBigArr[2]+newBigArr[3] + '年' + newBigArr[4]+newBigArr[5] + '月' + newBigArr[6] + newBigArr[7] + '日';
          }else {
            this.bigDate = newBigArr[0]+newBigArr[1]+newBigArr[2]+newBigArr[3] + '年' + newBigArr[4]+newBigArr[5] + '月'  + newBigArr[7] + '日';
          }
        }else {
          if(newBigArr[6] !== "〇"){
            this.bigDate = newBigArr[0]+newBigArr[1]+newBigArr[2]+newBigArr[3] + '年' + newBigArr[5] + '月' + newBigArr[6] + newBigArr[7] + '日';
          }else {
            this.bigDate = newBigArr[0]+newBigArr[1]+newBigArr[2]+newBigArr[3] + '年' + newBigArr[5] + '月'  + newBigArr[7] + '日';
          }
        }
      });
    },
    methods: {
      goDonate() {
        this.$router.push('/donate');
      },
      onClickLeft() {
        this.$router.go(-1);
      },
      next() {
        this.$router.push('/myBrightLamp')
      }
    }
  }
</script>

<style scoped lang="less">
  .thankImg {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    width: 15rem;
    height: 21.44rem;
    background-image: url("../../../assets/images/b_bg_thank.png");
    background-size: cover;
    padding: 0 2.08rem;
    box-sizing: border-box;

    .p1 {
      text-align: center;
      margin-top: 2.96rem;
      margin-bottom: 2.4rem;
      font-size: 0.96rem;
      font-weight: 700;
    }

    .content {
      font-size: 0.72rem;
      line-height: 1.24rem;

      .espec {
        font-size: 0.88rem;
        color: #885022;
        margin: 0 0.2rem;
      }

      p {
        margin: 0;
        font-size: 0.72rem;
        text-indent: 0.3rem;
      }
    }

    .p2 {
      text-align: center;
      margin-top: 1.14rem;
      font-size: 0.76rem;
      font-weight: 700;
    }

    .tempSeal {
      position: absolute;
      bottom: 3.5rem;
      right: 2.8rem;
      width: 2.3rem;
      height: 2.3rem;
    }

    .p3 {
      position: absolute;
      bottom: 2.08rem;
      left: 2.88rem;
      text-align: center;
      font-size: 0.6rem;
      letter-spacing:0.2rem
    }
  }

  .footer {
    /*position: fixed;*/
    /*bottom: 0.76rem;*/
    box-sizing: border-box;
    font-size: 0;
    width: 100%;
    div {
      float: left;
      width: 50%;
    }

    span {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      display: inline-block;
      background-image: url("../../../assets/images/b_btn_lamp_1.png");
      background-size: cover;
      border-radius: 0.2rem;
      line-height: 2rem;
      text-align: center;
      width: 6rem;
      height: 2rem;
      font-size: 0.72rem;
      color: #885022;
    }
  }
</style>
