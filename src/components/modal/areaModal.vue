<template>
    <div class="area">
      <van-popup
        v-model="show"
        position="bottom"
        :close-on-click-overlay ='cancel'
        :style="{ height: '41%' }"
      >
        <van-area :area-list="areaList" :columns-num="2" title="所在地"  @confirm="confirmAction" @cancel="cancelAction" />
      </van-popup>
    </div>
</template>

<script>
    import area from '@/assets/area/area.js'
    export default {
        name: "areaModal",
        props:{
          visible:{
              type:Boolean,
              default (){
                  return false
              }
          }
        },
        data(){
            return{
                areaList:area,
                show:false,
                cancel:false
            }
        },
        watch:{
            visible(val){
                this.show=val
            }
        },
        methods:{
            confirmAction(e){
                this.show=false
                let address = {
                    name:'',
                    visible:this.show
                }
                address.name = e[0].name + e[1].name;

                this.$emit('change-address',address)
            },
            cancelAction(){
                this.show=false;
                this.$emit('area-cancel',this.show)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
