<template>
  <div class="box">
    <div class="list" style="background: blue" v-clickoutside="giveTips">元素</div>
  </div>
</template>
<script>
import Clickoutside from '../../utils/clickoutside';

export default {
  directives: {
    Clickoutside
  },
  methods: {
    giveTips(num) {
      alert('点击的是元素的外面');
    },
  }
}
</script>
<style scoped>
.list {
  margin: 30px 0;
  color: #fff;
}
</style>