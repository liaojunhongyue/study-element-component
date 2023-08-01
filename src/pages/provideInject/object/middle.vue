<template>
  <div class="box">
    父组件
    <inner></inner>
  </div>
</template>
<script>
import inner from './inner';
export default {
  components: {
    inner
  }
}
</script>
<style scoped>
.box {
  margin: 10px;
  padding: 20px;
  border: solid 1px #666;
}
</style>