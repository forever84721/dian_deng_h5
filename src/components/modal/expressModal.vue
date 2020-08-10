<template>
    <div class="express-modal">
      <van-cell title="配送方式" is-link :value="value"  @click="showFn"></van-cell>
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '90%' }"
      >
        <van-cell title="配送方式" class="title"></van-cell>
        <van-radio-group v-model="radio">
          <van-cell-group >
            <van-cell  clickable v-for="(item,index) in expressList" :key="index" @click="checkRadio(item)">
              {{item.name}} ￥{{item.price.toFixed(2)}}
              <van-radio slot="right-icon" :name="index+1" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-button color="#7232dd" size="large" @click="close">关闭</van-button>
      </van-popup>

    </div>
</template>

<script>
    export default {
        name: "expressModal",
        data(){
            return{
                radio:'0',
                show:false,
                value:'选择 配送方式',
                expressList:[
                    {
                        name:'百世快递',
                        price:10
                    },
                    {
                        name:'申通快递',
                        price:12
                    }
                ]
            }
        },
        methods:{
            showFn(){
                this.show=true
            },
            checkRadio(item){
                //this.radio= index + 1
                let text = item.name + ' ￥' +item.price.toFixed(2)
                this.value=text
                this.show=false
                this.$emit('expressFee',item.price)
            },
            close(){
                this.show=false
            }
        }
    }
</script>

<style lang="less" scoped>
.express-modal{
  .title{
    text-align: center;
    font-size: 16px;
    height: 50px;
    line-height: 25px;
    font-weight: 500;
  }
  .van-button--large{
    position: fixed;
    bottom: 0;
    color: #ffffff;
    background-color: #00B1E4;
  }
}
</style>
