<template>
  <div class="box">
    <button class="toggle" @click="toggleShow()">切换显示/隐藏</button>
    <button class="toggle" @click="toggleText()">切换文字</button>
    <div v-if="isShow" v-color>{{text}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: '是',
      isShow: true
    }
  },
  directives: {
    color: {
      bind: function (el, bindings) {
        console.log('bind')
        el.style.color = 'blue';
      },
      inserted: function (el, bindings) {
        console.log('inserted')
      },
      update: function (el, bindings, vnode, oldVnode) {
        console.log('update')
        console.log(el.innerHTML);
      },
      componentUpdated: function (el, bindings, vnode, oldVnode) {
        console.log('componentUpdated')
        console.log(el.innerHTML);
      },
      unbind: function(el, bindings) {
        console.log('unbind')
      }
    }
  },
  methods: {
    toggleShow() {
      this.isShow = !this.isShow;
    },
    toggleText() {
      this.text = this.text === '是' ? '否' : '是';
    }
  }
}
</script>