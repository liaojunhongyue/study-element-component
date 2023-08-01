<template>
  <div
    :class="[
      'el-input-number',
      inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]"
  >
    <span
      class="el-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{'is-disabled': minDisabled}"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="el-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{'is-disabled': maxDisabled}"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <el-input
      ref="input"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange"
    ></el-input>
  </div>
</template>
<script>
import RepeatClick from '../../utils/directives/repeat-click';

export default {
  name: 'ElInputNumber',
  
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  
  directives: {
    repeatClick: RepeatClick
  },
  
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      }
    }
  },
  
  data() {
    return {
      currentValue: 0,
      userInput: null
    };
  },
  
  watch: {
    value: {
      immediate: true,
      handler(value) {
        let newVal = value === undefined ? value : Number(value);
        if (newVal !== undefined) {
          // 如果传入的值不是数字，则直接 return
          if (isNaN(newVal)) {
            return;
          }
          // 如果传入了严格步长
          if (this.stepStrictly) {
            // 计算转换成整数计算需要的倍数
            const stepPrecision = this.getPrecision(this.step);
            const precisionFactor = Math.pow(10, stepPrecision);
            // 用传入的值除以步长，获取到四舍五入的整数值，然后再乘以步长（计算过程中采用转换成整数的方式处理精度问题）
            newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor;
          }   
          // 如果传入了精度，则做四舍五入处理
          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision);
          }     
        }
        // 是否超出最大、最小边界，如果超出边界，取最大、最小值
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        // 将存储传入计数器的值的变量存储为 newVal
        this.currentValue = newVal;
        // 将存储用户输入的变量的值设置为 null
        this.userInput = null;
        this.$emit('input', newVal);
      }
    }
  },
  
  computed: {
    // 递减禁用
    minDisabled() {
      // 计算下一次递减之后会不会小于最小值
      return this._decrease(this.value, this.step) < this.min;
    },
    // 递增禁用
    maxDisabled() {
      // 计算下一次递增之后会不会大于最大值
      return this._increase(this.value, this.step) > this.max;
    },
    // 计数器的小数位数
    numPrecision() {
      const { value, step, precision } = this;
      // 获取步长的小数位数
      const stepPrecision = this.getPrecision(step);
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn('[input-number]中保留的精度位数应该大于或等于步长的位数')
        }
        return precision;
      } else {
        // 获取值和步长的小数位数中的较大值
        return Math.max(this.getPrecision(value), stepPrecision);
      }
    },
    controlsAtRight() {
      return this.controls && this.controlsPosition === 'right';
    },
    // 获取 Form-Item 组件的 elFormItemSize 变量
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    // 优先级：组件本身的 size > Form-Item 的 size
    inputNumberSize() {
      return this.size || this._elFormItemSize;
    },
    // disabled 计算，优先级：组件内部disabled > Form 的 disabled
    inputNumberDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    displayValue() {
      // 如果存在用户输入的值，则直接返回用户输入的值
      if (this.userInput !== null) {
        return this.userInput;
      }
      let currentValue = this.currentValue;
      if (typeof currentValue === 'number') {
        // 如果传入了严格步长
        if (this.stepStrictly) {
          // 计算转换成整数计算需要的倍数
          const stepPrecision = this.getPrecision(this.step);
          const precisionFactor = Math.pow(10, stepPrecision);
          // 用传入的值除以步长，获取到四舍五入的整数值，然后再乘以步长（计算过程中采用转换成整数的方式处理精度问题）
          currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor;
        }
        // 处理精度，补全缺失的0，由于之前已经处理过四舍五入了，这一步主要补齐精度后面的0
        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision);
        }
      }
      // 否则返回 currentValue
      return currentValue;
    }
  },
  methods: {
    handleBlur(event) {
      this.$emit('blur', event);
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    // 四舍五入的方法
    toPrecision(num, precision) {
      // 如果没有传入精度则采用 numPrecision 计算出的精度
      if (precision === undefined) precision = this.numPrecision;
      // 源代码中四舍五入的方法（该方法负数会有些问题）
      // return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
      // 可以稍作修改，兼容负数
      if (num < 0) {
        const posNum = -num;
        return -parseFloat(Math.round(posNum * Math.pow(10, precision)) / Math.pow(10, precision));
      }
      return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
    },
    // 获取一个数的小数位数
    getPrecision(value) {
      if (value === undefined) return 0;
      // 转换成字符串
      const valueString = value.toString();
      // 获取 . 的位置
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      // 如果存在小数
      if (dotPosition !== -1) {
        // 计算小数的位数
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    // 给计数器设置新的值
    setCurrentValue(newVal) {
      // 存储原先计数器的值
      const oldVal = this.currentValue;
      // 设置了精度时做四舍五入的处理
      if (typeof newVal === 'number' && this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision);
      }
      // 是否超出最大、最小边界，如果超出边界，取最大、最小值
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      if (oldVal === newVal) return;
      // 如果新旧值不相等，则重新设置值，并且将用户输入过程中的变量置为空
      this.userInput = null;
      this.$emit('input', newVal);
      this.$emit('change', newVal, oldVal);
      this.currentValue = newVal;
    },
    // 递增方法
    _increase(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;
      // 根据获取到的小数位数计算转换为整数需要乘以多少，如果是1位小数需要乘以10，两位小数需要乘以100
      // 取10的 numPrecision 次幂
      const precisionFactor = Math.pow(10, this.numPrecision);
      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },
    // 点击递增按钮
    increase() {
      if (this.maxDisabled) return;
      const value = this.value || 0;
      const newVal = this._increase(value, this.step);
      this.setCurrentValue(newVal);
    },
    // 递减方法
    _decrease(val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue;
      // 根据获取到的小数位数计算转换为整数需要乘以多少，如果是1位小数需要乘以10，两位小数需要乘以100
      // 取10的 numPrecision 次幂
      const precisionFactor = Math.pow(10, this.numPrecision);
      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },
    // 点击递减按钮
    decrease() {
      if (this.minDisabled) return;
      const value = this.value || 0;
      // 根据步长递减
      const newVal = this._decrease(value, this.step);
      this.setCurrentValue(newVal);
    },
    handleInput(value) {
      // 变量 userInput 记录用户输入过程中的值
      this.userInput = value;
    },
    handleInputChange(value) {
      const newVal = value === '' ? undefined : Number(value);
      // 用户输入完成后，判断用户输入值是否为数字或者是空字符串
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal);
      }
      // 将用户输入过程中的变量设置为 null
      this.userInput = null;
    },
    focus() {
      this.$refs.input.focus();
    },
    select() {
      this.$refs.input.select();
    }
  },
  mounted() {
    let innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('role', 'spinbutton');
    innerInput.setAttribute('aria-valuemax', this.max);
    innerInput.setAttribute('aria-valuemin', this.min);
    innerInput.setAttribute('aria-valuenow', this.currentValue);
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
  },
  updated() {
    if (!this.$refs || !this.$refs.input) return;
    const innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('aria-valuenow', this.currentValue);
  }
}
</script>