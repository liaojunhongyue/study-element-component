<template>
  <div class="box">
    <button @click="broadcastC()">BoxA组件向BoxC组件传输</button>
    <div>BoxA</div>
    <box-b></box-b>
  </div>
</template>
<script>
import emitter from '../../utils/mixins/emitter';
import BoxB from './boxB';

export default {
  componentName: 'BoxA',
  mixins: [emitter],
  components: {
    BoxB
  },
  mounted() {
    // 监听当前实例的自定义事件
    this.$on('dispatch-tips', this.dispatchTips);
  },
  methods: {
    dispatchTips(value) {
      alert('提示：' + value)
    },
    broadcastC() {
      this.broadcast('BoxC', 'broadcast-tips', '递归遍历子组件找到所需组件广播事件');
    }
    
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