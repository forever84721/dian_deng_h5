<template>
  <div>
    <van-popup
      v-model="isShow"
      :style="{height:'150px',width:'80%'}"
      @close="closed()"
      round
    >
      <div class="field">
        <div class="title">请填写{{title}}</div>
        <input type="text"
               autofocus
               v-model="content"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
    export default {
        name: "person-popup",
        props:{
          isShow:{
          type:Boolean,
          default:false,
        },
          title:{
            type:String,
            default:'',
          },
          content:{
            type:String,
            default:''
          }
      },
      data() {
        return {

        }
      },

      methods:{

        closed(){

         this.$root.$emit('showStatus',{text:this.content,title:this.title})
        }
      }
      }


</script>

<style scoped lang="less">
  .field{
    display: flex;
    flex-direction: column;
    padding: 20px;

  }
  .field input{
    border:none;
    border-bottom:1px solid #f2f2f2;
    margin-top: 40px;
  }
</style>
