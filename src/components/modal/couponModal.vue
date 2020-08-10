<template>
    <div class="coupon-modal">
      <van-coupon-cell
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        @click="showList = true"
      />
      <van-popup v-model="showList" position="bottom">
        <van-coupon-list
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          currency="$"
          :show-exchange-bar="showExchangeBar"
          @change="onChange"
        />
      </van-popup>
    </div>
</template>

<script>
    export default {
        name: "couponModal",
        props:{
          coupon:{
              type:Array,
              default:[]
          }
        },
        data(){
            return{
                showList:false,
                showExchangeBar:false,
                chosenCoupon: -1,

            }
        },
        computed:{
            coupons(){
                return  this.coupon

            }
        },
        methods: {
            onChange(index) {
                if(index !== -1){
                    this.showList = false;
                    //优惠卷减掉的价
                    let concessionalPrice = this.coupons[index].value/100
                    this.chosenCoupon = index;
                    this.$emit('getConcessionalPrice',concessionalPrice)
                }else{
                    this.showList = false;
                    this.chosenCoupon = index;
                    this.$emit('getConcessionalPrice',0)
                }

            },
        },
    }
</script>

<style lang="less" scoped>
.coupon-modal{

}
.coupon-modal /deep/ .van-coupon{
    h2{
      height: 28px;
      font-size: 16px;
      color: #FFB400;
    }
    .van-coupon__content{
      display: block;
      padding-top: 6px;
      height: 80px;
      .van-coupon__head{

      }
      .van-coupon__body{
        .van-coupon__name{
          display: none;
        }
        .van-coupon__corner{
          top:-23px
        }
      }
    }
}
</style>
