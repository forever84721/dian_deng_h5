<template>
    <div class="order-remarks">
      <van-cell-group>
        <van-field
          v-model="message"
          label="订单备注"
          type="textarea"
          placeholder="请输入"
          rows="1"
          autosize
        />
      </van-cell-group>
    </div>
</template>

<script>
    export default {
        name: "orderRemarks",
        data(){
            return{
                message:''
            }
        }
    }
</script>

<style lang="less" scoped>
.order-remarks{

}
  .order-remarks /deep/.van-field__label{
    width: 70px;
  }
</style>
