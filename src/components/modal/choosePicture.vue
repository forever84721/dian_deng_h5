<template>
    <div class="choosePic">
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        :round='round'
        @cancel="cancelAction"
      />
    </div>
</template>

<script>
    export default {
        name: "choosePicture",
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
            return {
                show:false,
                round:true,
                actions:[
                    {
                        name:'系统头像',
                        color:'#2A9AEB'
                    },
                    {
                        name:'自定义头像（需审核）',
                        color:'#2A9AEB'
                    }
                ]
            }
        },
        methods:{
            cancelAction(){
                this.show=false;
                this.$emit('picture-cancel',this.show)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
