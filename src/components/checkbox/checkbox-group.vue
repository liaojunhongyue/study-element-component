<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
import Emitter from '../../utils/mixins/emitter';

export default {
  name: 'ElCheckboxGroup',
  
  mixins: [Emitter],
  
  inject: {
    elFormItem: {
      default: ''
    }
  },

  componentName: 'ElCheckboxGroup',
  
  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String
  },
  
  computed: {
    // 获取 Form-Item 组件的 elFormItemSize 变量
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    // Checkbox-Group 组件的尺寸计算
    checkboxGroupSize() {
      // 优先级：group-size > Form-Item > Form
      return this.size || this._elFormItemSize;
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

