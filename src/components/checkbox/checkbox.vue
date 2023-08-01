<template>
  <!-- checkbox 整体用 label 标签包裹 -->
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
    :tabindex="indeterminate ? 0 : false"
    :role="indeterminate ? 'checkbox' : false"
    :aria-checked="indeterminate ? 'mixed' : false"
  >
    <!-- checkbox 左侧的点击按钮，用 span 做样式，将 input type=checkbox 放置在 span 标签的下方 -->
    <span
      class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
    >
      <span class="el-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
      <input
        v-else
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :value="label"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <!-- checkbox 右侧的描述 -->
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import Emitter from '../../utils/mixins/emitter';

export default {
  name: 'ElCheckbox',
  
  mixins: [Emitter],
  
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
    
  componentName: 'ElCheckbox',
  
  data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    }
  },
  
  computed: {
    model: {
      get() {
        return this.isGroup
          ? this.store : this.value !== undefined
            ? this.value : this.selfModel;
      },
      set(val) {
        if (this.isGroup) {
          (this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (this.isLimitExceeded = true));

          (this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (this.isLimitExceeded = true));

          this.isLimitExceeded === false &&
          this.dispatch('ElCheckboxGroup', 'input', [val]);
        } else {
          this.$emit('input', val);
          this.selfModel = val;
        }
      }
    },
    
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },
    
    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElCheckboxGroup') {
          parent = parent.$parent;
        } else {
          this._checkboxGroup = parent;
          return true;
        }
      }
      return false;
    },
    
    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    },
    
    isLimitDisabled() {
      const { max, min } = this._checkboxGroup;
      return !!(max || min) &&
        (this.model.length >= max && !this.isChecked) ||
        (this.model.length <= min && this.isChecked);
    },
    // disabled 计算
    isDisabled() {
      // 复选框组优先级：group > 组件内部disabled > Form > 可选数量限制disabled
      // 复选框优先级：组件内部disabled > Form
      return this.isGroup
        ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled  || this.isLimitDisabled
        : this.disabled || (this.elForm || {}).disabled;
    },
    // 获取 Form-Item 组件的 elFormItemSize 变量
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    // Checkbox 的尺寸计算
    checkboxSize() {
      // 设置变量 temCheckboxSize，优先获取组件内部的 size，再获取 Form-Item 组件的 elFormItemSize
      const temCheckboxSize = this.size || this._elFormItemSize
      // 复选框组优先级：group-size > 组件内部size > Form-Item > Form
      // 复选框优先级：组件内部size > Form-Item > Form
      return this.isGroup
        ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
        : temCheckboxSize;
    }
  },
  
  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String,
    controls: String,
    border: Boolean,
    size: String
  },
  
  methods: {
    addToStore() {
      if (
        Array.isArray(this.model) &&
        this.model.indexOf(this.label) === -1
      ) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return;
      let value;
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit('change', value, ev);
      this.$nextTick(() => {
        if (this.isGroup) {
          this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
        }
      });
    }
  },
  
  created() {
    this.checked && this.addToStore();
  },
  
  mounted() {
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls);
    }
  },
  
  watch: {
    value(value) {
      // 监听 value 值的变化，当 value 值改变时，向 Form-Item 组件派发 el.form.change 自定义事件
      this.dispatch('ElFormItem', 'el.form.change', value);
    }
  }
}
</script>