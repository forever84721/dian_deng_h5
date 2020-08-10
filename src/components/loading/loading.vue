<template>
    <div class="loading">
        <van-loading />
    </div>
</template>

<script>

    export default {
        name: "loading",

    }
</script>

<style scoped>
  .loading{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
</style>
