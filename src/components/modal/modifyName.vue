<template>
  <van-dialog
    v-model="show"
    title="昵称"
    show-cancel-button
    @confirm="confirmAction"
    @cancel="cancelAction"
  >
    <input class="nickname" type="text" :value="nickname" @change="onChange" >
    <p class="content">请设置您的昵称</p>
  </van-dialog>
</template>

<script>
    export default {
        name: "modifyName",
        props:{
            visible:{
                type:Boolean,
                default(){
                    return false
                }
            },
            nickname:{
                type:String,
                default:''
            }
        },
        data(){
          return{
              show:false,
              name:''
          }
        },
        watch:{
            visible(val){
                this.show = val
            },
            nickname(val){
                this.name=val
            }
        },
        methods:{
            confirmAction(){
                this.show=false
                this.$emit('change-nickname',this.name,this.show)
            },
            cancelAction(){
                this.show =false
                this.$emit('dialog-cancel',this.show)
            },
            onChange(e){
                this.name=e.target.value
            },

        }
    }
</script>

<style lang="less" scoped>
.nickname{
    border: none;
    border-bottom: 1px solid #cccccc;
    width: 260px;
    margin: 0 20px;
    font-size: 14px;
  }
.content{
  text-align: center;
  font-size: 12px;
  color: #999999;
}
</style>
