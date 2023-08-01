<template>
  <div class="box">
    <div>子组件收到的数据是：{{ message }}</div>
  </div>
</template>
<script>
export default {
  inject: ['message'],
}
</script>
<style scoped>
.box {
  margin: 10px;
  padding: 20px;
  border: solid 1px #666;
}
</style>