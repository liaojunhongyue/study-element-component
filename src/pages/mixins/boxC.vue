<template>
  <div class="box">
    <button @click="dispatchA()">BoxC组件向BoxA传输</button>
    <div>BoxC</div>
  </div>
</template>
<script>
import emitter from '../../utils/mixins/emitter';

export default {
  componentName: 'BoxC',
  mixins: [emitter],
  mounted() {
    // 监听当前实例的自定义事件
    this.$on('broadcast-tips', this.broadcastTips);
  },
  methods: {
    dispatchA() {
      this.dispatch('BoxA', 'dispatch-tips', '逐级向上查找对应父组件派发事件');
    },
    broadcastTips(value) {
      alert('提示：' + value)
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