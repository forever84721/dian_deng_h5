<template>
    <div class="integral-button-modal">
      <van-cell-group>
        <van-cell title="积分" :label="label" >
          <van-switch v-model="checked" size="22px" @change="fn" />
        </van-cell>

      </van-cell-group>
    </div>
</template>

<script>
    export default {
        name: "integralButtonModal",
        props:{
          integral:{
              type:Number,
              default:0
          }
        },
        data(){
            return{
                checked:false,
            }
        },
        computed:{
            label(){
                let integralPrice ='￥'+ (this.integral/20).toFixed(2)
                let labelText = '共'+ this.integral+'分，可用'+this.integral+'分，抵扣'+ integralPrice
                return this.integral?  labelText:'暂无积分'
            }
        },
        methods:{
            fn(chick){
                if(chick){
                    let integralPrice =this.integral/20
                    this.$emit('getIntegralPrice',integralPrice)
                }else{
                    this.$emit('getIntegralPrice',0)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.integral-button-modal{

}
  .van-cell-group{
    .van-cell{
      .van-cell__title{
        display: flex;
        span{
          width: 42px;
        }
        .van-cell__label{
          width: 230px;
        }
      }
      .van-cell__value{
        .van-switch{
          position: absolute;
          right: 0;
        }
      }
    }
  }
</style>
