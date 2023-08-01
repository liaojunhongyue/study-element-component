<template>
  <div class="main">
    <section>
      <p class="title">自定义指令：</p>
      <div class="list">
        <div class="item" @click="goPage('/directives/autoFocus')">1. 自定义指令实现一个打开页面之后输入框就自动聚焦的功能</div>
        <div class="item" @click="goPage('/directives/directiveHooks')">2. 钩子函数</div>
        <div class="item" @click="goPage('/directives/clickOutside')">3. 点击元素外触发事件的自定义指令</div>
        <div class="item" @click="goPage('/directives/repeatClick')">4. 鼠标长按 repeat-click 指令</div>
      </div>
    </section>
    <section>
      <p class="title">混入：</p>
      <div class="list">
        <div class="item" @click="goPage('/mixins/mixinsBasic')">1. 基本介绍</div>
        <div class="item" @click="goPage('/mixins/mixinsData')">2. 混入中的选项合并 —— data</div>
        <div class="item" @click="goPage('/mixins/mixinsHook')">3. 混入中的选项合并 —— 同名钩子函数</div>
        <div class="item" @click="goPage('/mixins/mixinsObject')">4. 混入中的选项合并 —— 值为对象的选项</div>
        <div class="item" @click="goPage('/mixins/globalMixins')">5. 全局混入</div>
        <div class="item" @click="goPage('/mixins/emitter')">6. element-ui 中的 emitter</div>
      </div>
    </section>
    <section>
      <p class="title">provide/inject：</p>
      <div class="list">
        <div class="item" @click="goPage('/provide/value')">1. 传输值类型</div>
        <div class="item" @click="goPage('/provide/object')">2. 传输对象</div>
        <div class="item" @click="goPage('/provide/function')">3. 传输方法</div>
      </div>
    </section>
    <section>
      <p class="title">Radio：</p>
      <div class="list">
        <div class="item" @click="goPage('/page/radio')">1. Radio 组件案例</div>
        <div class="item" @click="goPage('/page/radioGroup')">2. Radio-group 组件案例</div>
        <div class="item" @click="goPage('/page/radioButton')">3. Radio-button 组件案例</div>
      </div>
    </section>
    <section>
      <p class="title">Checkbox：</p>
      <div class="list">
        <div class="item" @click="goPage('/page/checkbox')">1. Checkbox 组件案例</div>
        <div class="item" @click="goPage('/page/checkboxGroup')">2. Checkbox-group 组件案例</div>
        <div class="item" @click="goPage('/page/checkboxButton')">3. Checkbox-button 组件案例</div>
      </div>
    </section>
    <section>
      <p class="title">Input：</p>
      <div class="list">
        <div class="item" @click="goPage('/page/input')">1. Input 组件案例</div>
      </div>
    </section>
    <section>
      <p class="title">InputNumber：</p>
      <div class="list">
        <div class="item" @click="goPage('/page/inputNumber')">1. InputNumber 组件案例</div>
      </div>
    </section>
    <section>
      <p class="title">Form：</p>
      <div class="list">
        <div class="item" @click="goPage('/page/form')">1. Form 组件案例</div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  methods: {
    goPage(url) {
      this.$router.push(url);
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 700;
}
.item {
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
}
</style>
