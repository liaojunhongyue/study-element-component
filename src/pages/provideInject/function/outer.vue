<template>
  <section>
    <h2>provide/inject 传入一个函数</h2>
    <div class="box">
      <div>祖先组件提供的数据：{{ message }}</div>
      <div>改变祖先组件数据：
        <button @click="changeMessage">改变</button>
      </div>
      <middle></middle>
    </div>
  </section>
</template>
<script>
import middle from './middle';
export default {
  data() {
    return {
      message: 'outer的数据'
    }
  },
  components: {
    middle
  },
  provide() {
    return {
      getMessage: () => this.message
    }
  },
  methods: {
    changeMessage() {
      this.message = '祖先组件的数据被改变'
    }
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