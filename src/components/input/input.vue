<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'el-input--suffix': clearable || showPassword,
      'el-input--prefix': $slots.prefix || prefixIcon,
      'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        class="el-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
        :tabindex="tabindex"
      />
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="el-input__suffix"
        v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="$slots.suffix || suffixIcon">
            <slot name="suffix"></slot>
            <i class="el-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <!-- @mousedown.prevent 用于阻止输入框失去焦点 -->
          <i v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <!-- 校验结果反馈图标 -->
        <i class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="el-input__count">{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script>
import calcTextareaHeight from './calcTextareaHeight';
import emitter from '../../utils/mixins/emitter';

export default {
  name: 'ElInput',

  componentName: 'ElInput',
  
  mixins: [emitter],
  
  inheritAttrs: false,
  
  // inject 去接收 Form 组件和 Form-Item 组件传过来的数据
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  
  data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false, // 是否处于拼音输入状态
      passwordVisible: false
    }
  },
  
  props: {
    value: [String, Number],
    size: String,
    resize: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    // 输入时是否触发表单的校验
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    label: String,
    tabindex: String
  },
  
  computed: {
    // 获取 Form-Item 组件的 elFormItemSize 变量
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    // 接收 Form-Item 组件传过来的表单项验证状态 validateState
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },
    // 接收 Form 组件传过来的是否显示校验结果反馈图标 statusIcon 属性
    needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false;
    },
    // 根据 validateState 判断显示的图标
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState];
    },
    textareaStyle() {
      return Object.assign({}, this.textareaCalcStyle, { resize: this.resize });
    },
    // Input 的 size
    inputSize() {
      // 优先级：组件本身的 size > Form-Item 的 size
      return this.size || this._elFormItemSize;
    },
    // Input 的 disabled
    inputDisabled() {
      // 优先级：组件本身的 disabled > Form 的 disabled
      return this.disabled || (this.elForm || {}).disabled;
    },
    // 监听 value 值的变化，如果 value 为 null 或者 undefined，则返回空，否则返回 value 转化为字符串后的值
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value);
    },
    // 显示可清空图标
    showClear() {
      // 在可清空属性设置为 true ，且 input 有值且不为禁用或只读状态，且鼠标移入输入框内部或输入框聚焦，则展示可清空图标
      return this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering);
    },
    // 判断密码图表在哪种情况下显示
    showPwdVisible() {
      // 当显示密码图标属性被设置为 true 时，且输入框不属于禁用、只读状态，且输入框有值或者输入框在聚焦的情况下，显示密码图标
      return this.showPassword &&
        !this.inputDisabled &&
        !this.readonly &&
        (!!this.nativeInputValue || this.focused);
    },
    // 判断字数统计属性在何种情况下显示
    isWordLimitVisible() {
      // 当showWordLimit属性为true，且有最大字数限制，且类型为 text 或 textarea，且不为禁用、只读、密码的状态时，显示字数统计
      return this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword;
    },
    // 设置计算属性 upperLimit 来获取 maxlength 的值
    upperLimit() {
      return this.$attrs.maxlength;
    },
    // 获取 value 值的长度
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }

      return (this.value || '').length;
    },
    // 判断字数是否超出限制
    inputExceed() {
      // 如果显示字数统计且字数超限，则说明字数超出限制
      return this.isWordLimitVisible &&
        (this.textLength > this.upperLimit);
    }
  },
  
  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);
      // 如果输入时触发表单的校验，则在 value 值的改变时即向上派发 el.form.change 事件
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }
    },
    // 监听 value 值的变化，给 input 赋值
    nativeInputValue() {
      this.setNativeInputValue();
    },
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
      });
    }
  },
  
  methods: {
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      // 解构出来 autosize 和 type 属性
      const { autosize, type } = this;
      // 如果不是 textarea 则不继续向下执行
      if (type !== 'textarea') return;
      // 如果没有 autosize 则直接计算出最小高度
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      // 如果有 autosize 需要自适应高度，则根据传入的 minRows 和 maxRows 计算出最小高度和自适应的高度
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;
      // 将计算后的结果赋值给 textareaCalcStyle 变量
      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    // 获取 input
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    // 设置 input 元素的值
    setNativeInputValue() {
      // 获取到 input 元素
      const input = this.getInput();
      if (!input) return;
      // 如果 input 之前的 value 值与改变后的值相同，则 return
      if (input.value === this.nativeInputValue) return;
      // 将 input 的值赋值为最新的值
      input.value = this.nativeInputValue;
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      // 如果输入时触发表单的校验，则在输入框 blur 时即向上派发 el.form.blur 事件
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
      }
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    // 输入法编辑器开始新的输入合成时（开始输入拼音时）触发
    handleCompositionStart(event) {
      // 触发父级的 compositionstart 事件
      this.$emit('compositionstart', event);
      // 将 isComposing 设置为 true，说明处于拼音输入的状态
      this.isComposing = true;
    },
    // 组合输入更新时（每输入一下拼音时）都会触发
    handleCompositionUpdate(event) {
      // 触发父级的 compositionupdate 事件
      this.$emit('compositionupdate', event);
      // 将 isComposing 设置为 true，说明处于拼音输入的状态
      this.isComposing = true;
    },
    // 组合输入结束时（拼音输入结束，关闭中文输入法时）触发
    handleCompositionEnd(event) {
      // 触发父级的 compositionend 事件
      this.$emit('compositionend', event);
      if (this.isComposing) {
        // 将 isComposing 设置为 false，说明此时已经不是拼音输入的状态
        this.isComposing = false;
        // 触发 handleInput 方法，给 input 赋值
        this.handleInput(event);
      }
    },
    // 触发 input 事件
    handleInput(event) {
      // 如果正在输入拼音，直接 return
      if (this.isComposing) return;
      // 解决 IE 浏览器中 Input 初始化自动执行的问题
      if (event.target.value === this.nativeInputValue) return;
      // 触发父级的 input 事件
      this.$emit('input', event.target.value);
      // 给 input 重新赋值
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    calcIconOffset(place) {
      // 获取到 class 为 el-input__prefix 或 el-input__suffix
      let elList = [].slice.call(this.$el.querySelectorAll(`.el-input__${place}`) || []);
      if (!elList.length) return;
      // 设置变量 el
      let el = null;
      for (let i = 0; i < elList.length; i++) {
        // 如果获取到的 el-input__prefix 或 el-input__suffix 的父级元素就是该组件的根元素
        if (elList[i].parentNode === this.$el) {
          // 则将 el-input__prefix 或 el-input__suffix 赋值给 el 变量
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      };
      
      const pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        // 如果存在前置元素或后置元素，则获取前置元素或后置元素的 offsetWidth，将 el 向右或向左移动对应的宽度
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)`;
      } else {
        // 如果不存在则 el 移除 style 属性
        el.removeAttribute('style');
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix');
      this.calcIconOffset('suffix');
    },
    // 清空操作
    clear() {
      // 触发父级的 input 事件，并且将值传为空，由于父级用 v-model 语法糖绑定值，则可清空组件的值
      this.$emit('input', '');
      // 触发父级的 change 事件
      this.$emit('change', '');
      // 触发父级的 clear 事件
      this.$emit('clear');
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(() => {
        this.focus();
      });
    },
    // 判断后置内容区域是否显示
    getSuffixVisible() {
      return this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear|| 
        this.showPassword || 
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon);;
    }
  },
  
  mounted() {
    // 设置 input 元素的值
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },
  
  updated() {
    this.$nextTick(this.updateIconOffset);
  }
}
</script>