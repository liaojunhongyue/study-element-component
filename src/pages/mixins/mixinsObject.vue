<template>
  <div>混入中的选项合并：值为对象的选项，例如 methods 、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。</div>
</template>
<script>
var objectMixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}
export default {
  mixins: [objectMixin],
  mounted() {
    this.foo();
    this.bar();
    this.conflicting();
  },
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
}
</script>