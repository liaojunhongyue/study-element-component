<template>
  <div class="box">
    BoxB
    <box-c></box-c>
  </div>
</template>
<script>
import BoxC from './boxC';

export default {
  componentName: 'BoxB',
  components: {
    BoxC
  }
}
</script>
<style scoped>
.box {
  margin: 10px;
  padding: 30px;
  border: solid 1px #999;
}
</style>