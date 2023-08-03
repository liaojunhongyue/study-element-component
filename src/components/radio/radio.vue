<template>
  <!-- 整体用 label 标签包裹 -->
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label },
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <!-- radio 左侧的点击按钮，用 span 做样式，将 input type=radio 放置在 span 标签的下方 -->
    <span class="el-radio__input"
      :class="[
        { 'is-disabled': isDisabled },
        { 'is-checked': model === label }
      ]"
    >
      <span class="el-radio__inner"></span>
      <input
        ref="radio"
        class="el-radio__original"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :value="label"
        :disabled="isDisabled"
        tabindex="-1"
        autocomplete="off"
      />
    </span>
    <!-- radio 右侧的描述 -->
    <span class="el-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import Emitter from '../../utils/mixins/emitter';

export default {
  name: 'ElRadio',
  
  mixins: [Emitter],
  
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  
  componentName: 'ElRadio',
  
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },
  
  data() {
    return {
      focus: false
    };
  },
  
  computed: {
    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElRadioGroup') {
          parent = parent.$parent;
        } else {
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    },
    model: {
      get() {
        return this.isGroup ? this._radioGroup.value : this.value;
      },
      set(val) {
        if (this.isGroup) {
          this.dispatch('ElRadioGroup', 'input', [val]);
        } else {
          this.$emit('input', val);
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label);
      }
    },
    // 获取 Form-Item 组件的 elFormItemSize 变量
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    // Radio 的尺寸计算
    radioSize() {
      // 设置变量 temRadioSize，优先获取组件内部的 size，再获取 Form-Item 组件的 elFormItemSize
      const temRadioSize = this.size || this._elFormItemSize;
      // 按钮组优先级：group-size > 组件内部size > Form-Item > Form
      // 按钮优先级：组件内部size > Form-Item > Form
      return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize;
    },
    // disabled 计算
    isDisabled() {
      // 按钮组优先级：group > 组件内部 disabled > Form
      // 按钮优先级：组件内部 disabled > Form
      return this.isGroup
        ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
        : this.disabled || (this.elForm || {}).disabled;;
    },
    tabIndex() {
      console.log('tabIbdex')
      return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0;
    }
  },
  
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.$emit('change', this.model);
        this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model);
      })
    }
  }
}
</script>