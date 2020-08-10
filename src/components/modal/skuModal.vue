<template>
    <div class="sku-modal">
      <van-cell title="选择" is-link :value="valueText" @click="choose" />
      <van-sku
        ref="a"
        v-model="show"
        :sku="sku"
        :goods="goods_info"
        :goods-id="goods.goods_id"
        :hide-stock="hideStock"
        :quota="goods.quota"
        :show-add-cart-btn="showAddCartBtn"
        @buy-clicked="onBuyClicked"
        @sku-selected="skuSelected"
      >
        <!--<template slot="sku-header" slot-scope="props">
          <div class="van-sku__goods-price">
            <span class="van-sku__price-symbol">￥</span><span class="van-sku__price-num">{{ props.price }}</span>
          </div>
        </template>-->

        <template slot="sku-actions" slot-scope="props">
          <div class="van-sku-actions">
            <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
            <van-button
              square
              size="large"
              type="danger"
              @click="props.skuEventBus.$emit('sku:buy')"
            >
              确定
            </van-button>
          </div>
        </template>
      </van-sku>

    </div>
</template>

<script>
    export default {
        name: "skuModal",
        props:{
            value:{
                type:String,
                default:''
            },
            goods:{
                type:Object,
                default: {}
            },
            showBase:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                show:false,
                overlay:false,
                hideStock:true,
                showAddCartBtn:false,
                valueText:this.value
            }
        },
        watch:{
            showBase(val){
                this.show=val
            },
            show(val){
                this.$emit('update_showBase',val)
            },
            value(val){
                this.valueText=val
            }
        },
        computed:{
            sku(){
                return {
                    tree:this.goods.category.map(cate=>{
                        return {
                            k:cate.categoryName,
                            k_id:cate.k_id,
                            k_s:cate.k_s,
                            v:cate.list.map(item=>{
                                return {
                                    id:item.id,
                                    name:item.name
                                }
                            })
                        }
                    }),
                    list: this.goods.goodsLists.map(item=>{
                        return {
                            id:item.id,
                            price:item.price*100,
                            s1:item.s1,
                            s2:item.s2||'0',
                            stock_num: 10,
                            goodsId:this.goods.goods_id
                        }
                    }),
                    price: '98.00-198.00',
                    stock_num:999999,
                    none_sku: false,  // 是否无规格商品
                }
            },

            goods_info(){
                return{
                    title: '测试商品A',
                    picture:  'https://img.yzcdn.cn/vant/cat.jpeg'
                }

            }
        },
        methods:{
            choose(){
                this.show=true
            },
            onBuyClicked(data){
                this.show=false
                let text = document.querySelector('.van-sku-header-item').innerText
                this.valueText=text
                //this.$router.push({name:'settlement-order',params:{price: data.selectedSkuComb.price }})
            },
            skuSelected(data){
                //this.valueText=text
            }
        },
        updated() {
            //console.log(this.sku.tree);
        }
    }
</script>

<style lang="less" scoped>
.sku-modal{

}
  .van-cell{
    margin: 10px 15px 28px 15px;
    border-radius: 10px;
    width: auto;
  }
    .van-cell__title{
      span{
        font-size: 14px;
        color: #B1B1B1;
      }
    }
    .van-cell__value{
      span{
        color: #414141;
      }

    }
.sku-modal /deep/.van-sku-header__img-wrap{
  img{
    width:100px;
    height: 100px;
    border-radius: 7px;
  }
}
.sku-modal /deep/.van-sku__goods-price{
  span{
    color: #F6950A;
  }
}
.sku-modal /deep/.van-sku-row__item--active{
  background-color:#E9F9FE ;
  color: #54C8EC;
}
.sku-modal /deep/.van-sku-actions .van-button--danger{
  background: #00B1E4;
}
.sku-modal /deep/.van-sku-header{

  .van-sku-header__img-wrap{
    float:none;
    width: auto;
    height: 135px;
    margin-right: 17px;
    margin-bottom: 0;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .van-sku-header__goods-info{
    min-height: 24px;
    display: flex;
    .van-sku__goods-price{
      .van-sku__price-symbol{
        font-size: 13px;
      }
      .van-sku__price-num{
        font-size: 16px;
      }

    }
    .van-sku-header-item{
      margin-top: 0;
      margin-left: 8px;
      line-height: 24px;
    }
  }
}
</style>
