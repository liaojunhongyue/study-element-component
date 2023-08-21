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
    // 计算包裹 radio-group 组件的标签
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
    // 如果 radio-group 按钮组没有默认的选项时，将第一个 radio 的 tabIndex 设置为0。代表元素是可聚焦的
    const radios = this.$el.querySelectorAll('[type=radio]');
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
    if (![].some.call(radios, radio => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0;
    }
  },
  
  methods: {
    handleKeydown(e) {
      // 用 target 变量保存事件触发的元素
      const target = e.target;
      // 判断当前触发的是 input 元素还是 label 元素
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
      // 获取到当前组件模板根标签下的所有同类型元素
      // this.$el 指向当前组件模板的根标签
      const radios = this.$el.querySelectorAll(className);
      const length = radios.length;
      // 获取触发的元素的索引值
      const index = [].indexOf.call(radios, target);
      // 获取到当前组件模板根标签下的全部 role=radio 的元素
      const roleRadios = this.$el.querySelectorAll('[role=radio]');
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation();
          e.preventDefault();
          // 按下左或上，则让前一个元素点击并聚焦，如果当前是第一个元素，则让最后一个元素点击并聚焦
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
          // 按下右或下，则让下一个元素点击并聚焦，如果当前是最后一个元素，则让第一个元素点击并聚焦
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