<template>
    <div class="submit-order-component">
      <van-submit-bar
        :price="price"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
</template>

<script>
    export default {
        name: "submitOrderComponent",
        props:{
          total:{
              type:Number,
              default:0
          }
        },
        data(){
            return{
                price:0
            }
        },
        watch:{
          total(val){
              this.price=val*100
            }
        },
        methods:{
            onSubmit(){

            }
        }
    }
</script>

<style lang="less" scoped>
.submit-order-component{

}
  .van-submit-bar__text{
    text-align: left;
    padding-left: 12px;

    .van-submit-bar__price{
      color: #FFBB1F;
    }
  }
  .van-button--danger{
    background-color: #00B1E4;
    border: 1px solid #00B1E4;
  }
</style>
