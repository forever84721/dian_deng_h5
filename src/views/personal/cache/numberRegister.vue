<template>
   <div>
     <van-cell-group>
       <van-field
         value="{{ username }}"
         required
         clearable
         label="用户名"
         icon="question-o"
         placeholder="请输入用户名"
         bind:click-icon="onClickIcon"
       />

       <van-field
         value="{{ password }}"
         type="password"
         label="密码"
         placeholder="请输入密码"
         required
         border="{{ false }}"
       />
     </van-cell-group>
   </div>
</template>

<script>
    export default {
        name: "numberRegister",
      data(){
          return{
            username:'',
            password:'',
          }
      },
      methods:{
        onClickIcon(e){
          console.log(e)
        }
      }
    }
</script>

<style scoped lang="less">

</style>
