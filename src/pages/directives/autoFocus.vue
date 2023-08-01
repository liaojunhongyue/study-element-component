<template>
  <div class="box">
    <p class="title">自定义指令实现一个打开页面之后输入框就自动聚焦的功能：</p>
    <input v-focus>
  </div>
</template>
<script>
export default {
  directives: {
    focus: {
      // 在被绑定元素插入父节点时调用
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>