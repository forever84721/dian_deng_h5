<template>
    <div class="time-picker">
      <van-popup
        v-model="show"
        position="bottom"
        :close-on-click-overlay ='cancel'
        :style="{ height: '41%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          @confirm="confirmAction"
          @cancel="cancelAction"
        />
      </van-popup>
    </div>
</template>

<script>
    export default {
        name: "pickTime",
        props:{
          visible:{
              type:Boolean,
              default (){
                  return false
              }
          }
        },
        watch:{
          visible(val){
              this.show=val
          }
        },
        data(){
            return{
                show:false,
                currentDate:new Date(),
                minDate:new Date(1949,1,1),
                cancel:false
            }
        },
        methods:{
            confirmAction(value){
                let date = value.toLocaleDateString()
                this.show =false;
                this.$emit('change-pickTime',date,this.show)
            },
            cancelAction(){
                this.show =false;
                this.$emit('pickTime-cancel',this.show)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
