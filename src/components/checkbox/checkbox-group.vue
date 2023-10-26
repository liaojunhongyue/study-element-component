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
    value: {}, // checkbox-group 的 value 值
    disabled: Boolean,
    min: Number, // 最小限制数量
    max: Number, // 最大限制数量
    size: String,
    fill: String, // checkbox-button 组件样式用到的 fill 填充
    textColor: String // checkbox-button 组件样式用到的 textColor 文字颜色
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

