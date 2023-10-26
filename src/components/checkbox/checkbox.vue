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
      selfModel: false, // 组件内部的值
      focus: false, // focus 状态
      isLimitExceeded: false // 是否超出可选数量限制
    }
  },
  
  computed: {
    model: {
      get() {
        // 判断是否是按钮组，如果是按钮组，则获取按钮组的值，否则获取 value，如果 value 是 undefined，则获取组件内部的 selfModel 值
        return this.isGroup
          ? this.store : this.value !== undefined
            ? this.value : this.selfModel;
      },
      set(val) {
        // 先来判断是否是按钮组
        if (this.isGroup) {
          // 是按钮组的情况下
          // 如果当前选中的数量小于最小的限制数量，则将 isLimitExceeded 设置为 true，表示已选数量与限制数量不符
          (this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (this.isLimitExceeded = true));
          // 如果当前选中的数量大于最大的限制数量，则将 isLimitExceeded 设置为 true，表示已选数量与限制数量不符
          (this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (this.isLimitExceeded = true));
          // 如果 isLimitExceeded 为 false，则出发 checkbox-grouo 的 input 事件
          this.isLimitExceeded === false &&
          this.dispatch('ElCheckboxGroup', 'input', [val]);
        } else {
          // 不是按钮组的情况，触发父组件的 input 事件，并且将组件内部的 selfModel 变量设置为当前的 value 值
          this.$emit('input', val);
          this.selfModel = val;
        }
      }
    },
    // 是否选中
    isChecked() {
      // 判断 model 值的类型，根据类型判断是否选中
      if ({}.toString.call(this.model) === '[object model]') {
        // 如果是布尔类型，则直接返回 model 的值用来判断是否选中
        return this.model;
      } else if (Array.isArray(this.model)) {
        // 如果是数组，则判断当前 model 数组是否包含当前 label 的值，如果包含，则选中
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        // 如果不是布尔类型，也不是数组类型，且 model 不为 null 和 undefined
        // 则判断 model 与 trueLabel（trueLabel是选中时显示的值）是否相等，如果相等，则选中
        return this.model === this.trueLabel;
      }
    },
    // 判断是否被包含在了按钮组里面，如果外层有 checkbox-group 组件，则说明被包含在按钮组里面
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
      // 如果是按钮组，则返回按钮组的 value，否则返回组件的 value
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    },
    // 判断是否由于不符合可选数量造成禁用
    isLimitDisabled() {
      const { max, min } = this._checkboxGroup;
      // 当已选数量大于等于最大限制数量时，禁用按钮组中没选中的 checkbox
      // 当已选数量小于等于最小限制数量时，禁用按钮组中已选中的 checkbox
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
    // 如果最开始是选中状态，则将值存储到 model 变量中
    addToStore() {
      if (
        Array.isArray(this.model) &&
        this.model.indexOf(this.label) === -1
      ) {
        // model 为数组，并且 model 不包含 label 的值，则将 label 的值 push 到 model 数组中
        this.model.push(this.label);
      } else {
        // model 不是数组，如果有 true-label，则设置为 true-label 的值，否则设置为 true
        this.model = this.trueLabel || true;
      }
    },
    // 触发 change 事件
    handleChange(ev) {
      // 如果不符合可选的数量限制，则直接 return
      if (this.isLimitExceeded) return;
      let value;
      if (ev.target.checked) {
        // 如果选中了，存在 true-label 则设置为 true-label，否则设置为 true
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        // 如果没有选中，存在 false-label 则设置为 false-label，否则设置为 false
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      // 触发父组件的 change 事件
      this.$emit('change', value, ev);
      this.$nextTick(() => {
        if (this.isGroup) {
          // 如果被包含在按钮组里面，则触发按钮组的 change 事件
          this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
        }
      });
    }
  },
  
  created() {
    // 如果最开始是选中状态，则将值存储到 model 变量中
    this.checked && this.addToStore();
  },
  
  mounted() {
    if (this.indeterminate) {
      // 屏幕阅读器的处理，如果是半选状态，则增加 aria-controls 属性
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