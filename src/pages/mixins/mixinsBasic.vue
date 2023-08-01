<template>
  <div>基本介绍</div>
</template>
<script>
// 定义一个混入对象
var basicMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

export default {
  mixins: [basicMixin]
}
</script>