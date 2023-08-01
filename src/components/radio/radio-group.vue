<template>
  <component
    :is="_elTag"
    class="el-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<script>
import Emitter from '../../utils/mixins/emitter';

const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
});

export default {
  name: 'ElRadioGroup',
  
  mixins: [Emitter],
  
  inject: {
    elFormItem: {
      default: ''
    }
  },
  
  componentName: 'ElRadioGroup',
  
  props: {
    value: {},
    size: String,
    disabled: Boolean
  },
  
  computed: {
    _elTag() {
      let tag = (this.$vnode.data || {}).tag;
      if (!tag || tag === 'component') tag = 'div';
      return tag;
    },
    // 获取 Form-Item 组件的 elFormItemSize 变量
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    // Radio-Group 组件的尺寸计算
    radioGroupSize() {
      // 优先级：group-size > Form-Item > Form
      return this.size || this._elFormItemSize;
    }
  },
  
  created() {
    this.$on('handleChange', value => {
      this.$emit('change', value);
    });
  },
  
  mounted() {
    console.log('mounted')
    const radios = this.$el.querySelectorAll('[type=radio]');
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
    if (![].some.call(radios, radio => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0;
    }
  },
  
  methods: {
    handleKeydown(e) {
      const target = e.target;
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
      const radios = this.$el.querySelectorAll(className);
      const length = radios.length;
      const index = [].indexOf.call(radios, target);
      const roleRadios = this.$el.querySelectorAll('[role=radio]');
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation();
          e.preventDefault();
          if (index === 0) {
            roleRadios[length - 1].click();
            roleRadios[length - 1].focus();
          } else {
            roleRadios[index - 1].click();
            roleRadios[index - 1].focus();
          }
          break;
        case keyCode.RIGHT:
        case keyCode.DOWN:
          if (index === (length - 1)) {
            e.stopPropagation();
            e.preventDefault();
            roleRadios[0].click();
            roleRadios[0].focus();
          } else {
            roleRadios[index + 1].click();
            roleRadios[index + 1].focus();
          }
          break;
        default:
          break;
      }
    }
  },
  watch: {
    value(value) {
      // 监听 value 值的变化，当 value 值改变时，向 Form-Item 组件派发 el.form.change 自定义事件
      this.dispatch('ElFormItem', 'el.form.change', [value]);
    }
  }
}
</script>