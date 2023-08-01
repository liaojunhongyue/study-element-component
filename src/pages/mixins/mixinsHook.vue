<template>
  <div>混入中的选项合并：同名钩子函数将被合并为一个数组，都将被调用，混入对象的钩子在组件自身的钩子之前调用。</div>
</template>
<script>
var hookMixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}
export default {
  mixins: [hookMixin],
  created: function () {
    console.log('组件钩子被调用')
  }
}
// => "混入对象的钩子被调用"
// => "组件钩子被调用"
</script>