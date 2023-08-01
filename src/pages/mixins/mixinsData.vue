<template>
  <div>混入中的选项合并：data 会在内部进行递归合并，发生冲突时以组件的数据优先。</div>
</template>
<script>
var dataMixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}
export default {
  mixins: [dataMixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
}
</script>