<template>
  <div
    class="el-form-item"
    :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
    <!-- label-wrap 组件 -->
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'"
    >
      <label
        class="el-form-item__label"
        v-if="label || $slots.label"
        :style="labelStyle"
      >
        <slot name="label">{{label + form.labelSuffix}}</slot>
      </label>
    </label-wrap>
    <!-- 表单项控件 -->
    <div class="el-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <!-- 展示验证失败的提示信息 -->
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div
            class="el-form-item__error"
            :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
            }"
          >
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import LabelWrap from './label-wrap';
import emitter from '../../utils/mixins/emitter';
import { getPropByPath } from '../../utils/util';

export default {
  name: 'ElFormItem',
  
  componentName: 'ElFormItem',
  
  mixins: [emitter],
  
  provide() {
    return {
      elFormItem: this
    };
  },
  
  inject: ['elForm'],
  
  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: String,
    showMessage: {
      type: Boolean,
      default: true
    },
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    // 用于控制该表单域下组件的尺寸
    size: String
  },
  
  components: {
    LabelWrap
  },
  
  watch: {
    error: {
      immediate: true, // 首次传值就触发监听
      handler(value) {
        // 将校验错误信息设置为 error 传过来的值
        this.validateMessage = value;
        // 判断 error 是否有值，如果有值将校验状态设置为 error
        this.validateState = value ? 'error' : '';
      }
    },
    rules(value) {
      // 如果不存在验证规则且不是必填，则清空验证
      if ((!value || value.length === 0) && this.required === undefined) {
        this.clearValidate();
      }
    }
  },
  
  computed: {
    labelStyle() {
      // 设置 ret 变量为一个空对象
      const ret = {};
      // 如果 labelPosition 设置为 top 则直接返回
      if (this.form.labelPosition === 'top') return ret;
      // 如果设置了 label-width 优先取 form-item 的，再取 form 的
      const labelWidth = this.labelWidth || this.form.labelWidth;
      // 如果 labelWidth 存在，返回设置的 labelWidth
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const label = this.label;
      // 如果 labelPosition 设置为 top，或者是行内表单，则直接返回
      if (this.form.labelPosition === 'top' || this.form.inline) return ret;
      // 如果不存在 label 属性，也不存在 label-width 属性，则直接返回
      if (!label && !this.labelWidth) return ret;
      const labelWidth = this.labelWidth || this.form.labelWidth;
      // 如果设置的宽度包含 auto
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          // 如果是表单项设置的 auto 宽度，则将 margin-left 设置为计算的表单项的 label 宽度
          ret.marginLeft = this.computedLabelWidth;
        } else if (this.form.labelWidth === 'auto') {
          // 如果 Form 组件的 label-width 是 auto，则将计算的所有 Form-Item 的最大值赋值给 margin-left
          ret.marginLeft = this.elForm.autoLabelWidth;
        }
      } else {
        // 如果设置的宽度均为固定宽度，则把右侧控件的 margin-left 设置为 labelWidth 的值
        ret.marginLeft = labelWidth;
      }
      return ret;
    },
    form() {
      // 获取该组件的父级
      let parent = this.$parent;
      let parentName = parent.$options.componentName;
      // 如果父级不是 ElForm 则继续向上获取，直到获取到 ElForm
      while (parentName !== 'ElForm') {
        parent = parent.$parent;
        parentName = parent.$options.componentName;
      }
      // 返回父级
      return parent;
    },
    fieldValue() {
      // 获取到 form 组建的 model 属性
      const model = this.form.model;
      // 如果 model 或者 prop 任意一个不存在，则直接 return
      if (!model || !this.prop) { return; }
      // 将 prop 属性的值作为在 model 对象寻找值的 path
      let path = this.prop;
      // 如果 prop 属性的值存在:则替换成.（作为属性下的属性）
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      // 在 model 下寻找对应属性的值
      return getPropByPath(model, path, true).v;
    },
    isRequired() {
      // 获取规则
      let rules = this.getRules();
      // 设置初始值 isRequired 为 false
      let isRequired = false;
      // 根据 rules，寻找是否存在 required 属性，找到将 isRequired 设置为 true
      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      // 返回 isRequired
      return isRequired;
    },
    // 监听 Form 组件的 size
    _formSize() {
      return this.elForm.size;
    },
    // Form-Item 组件的 size
    elFormItemSize() {
      // 组件内部的 size 属性优先级较高，如果组件内部没有传入 size，就使用 Form 组件传入的 size
      return this.size || this._formSize;
    },
    // 根据 elFormItemSize 变量，去设置组件 size 相关的 class
    sizeClass() {
      return this.elFormItemSize;
    }
  },
  
  data() {
    return {
      validateState: '', // 校验的状态（success or error）
      validateMessage: '', // 校验失败的提示信息
      validateDisabled: false, // 是否禁止校验
      computedLabelWidth: '' // 计算的 label 宽度
    }
  },
  
  methods: {
    validate(trigger, callback = () => {}) {
      // 将 validateDisabled 设置为 false，表示可以验证
      this.validateDisabled = false;
      // 使用 getFilteredRule 获取验证规则，根据 trigger 来筛选
      const rules = this.getFilteredRule(trigger);
      // 如果没有验证规则，并且也没有传入 required 属性，则直接返回 true
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback();
        return true;
      }
      // 将验证状态设置为 validating，表示验证中
      this.validateState = 'validating';

      // 整理传入校验器的数据的格式
      const descriptor = {};
      // 将 rules 规则中的 trigger 删除，避免传入多余的字段
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;
      // 创建校验器
      const validator = new AsyncValidator(descriptor);
      const model = {};

      model[this.prop] = this.fieldValue;
      // 使用 validate 方法：model 是校验的数据；firstFields 表示指定的第一个校验规则生成错误时调用回调；
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        // 将校验状态存储到 validateState 变量中
        this.validateState = !errors ? 'success' : 'error';
        // 将错误信息存储到 validateMessage 变量中
        this.validateMessage = errors ? errors[0].message : '';
        // 回调函数：第一个参数是校验的错误信息，第二个参数是错误的字段及未通过的规则
        callback(this.validateMessage, invalidFields);
        // 使用 Form 组件时可以监听到 validate 事件
        this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
      });
    },
    // 清空校验
    clearValidate() {
      // 将校验状态和错误信息置为空，将是否禁用校验置为 false
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    },
    getRules() {
      // 获取 Form 组件传入的 rules
      let formRules = this.form.rules;
      // 获取 Form-Item 组件本身的 rules
      const selfRules = this.rules;
      // 判断是否传入了 required，如果传入了 required 将其转换为布尔值
      const requiredRule = this.required !== undefined ? { required: !!this.required } : [];
      // 获取到表单项对应 prop 的规则的值
      const prop = getPropByPath(formRules, this.prop || '');
      formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];
      // 将规则整理成数组形式（增加 required 传参的影响）
      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    // 根据 trigger 去筛选对应的规则
    getFilteredRule(trigger) {
      const rules = this.getRules();
      // 循环所有规则
      return rules.filter(rule => {
        if (!rule.trigger || trigger === '') return true;
        // 筛选包含传入的 trigger 的规则
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1;
        } else {
          return rule.trigger === trigger;
        }
      }).map(rule => Object.assign({}, rule));
    },
    resetField() {
      // 重置验证状态和验证信息
      this.validateState = '';
      this.validateMessage = '';
      
      let model = this.form.model;
      let value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      // 通过 getPropByPath 方法获取到表单项属性所在对象、属性的 key、以及属性的值
      let prop = getPropByPath(model, path, true);
      // 先禁用验证，因为之后需要重置表单项，触发 change 方法
      this.validateDisabled = true;
      // 将属性的值重置为初始值
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }
      // 重置字段后，再将是否禁用验证重置为 false，表示目前可以验证
      this.$nextTick(() => {
        this.validateDisabled = false;
      });
    },
    // 当组件中的控件 blur 时
    onFieldBlur() {
      // 验证触发方式为 blur 的规则
      this.validate('blur');
    },
    // 当组件中的控件 change 时
    onFieldChange() {
      // 如果不是 validateDisabled 为 true 时（重置表单时）
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      // 则验证触发方式为 change 的规则
      this.validate('change');
    },
    // 更新 label 为 auto 时，计算出来的 label 宽度
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },
    // 增加自定义事件监听
    addValidateEvents() {
      const rules = this.getRules();
      // 当存在校验规则，或者传入了 required 属性时，监听自定义事件
      if (rules.length || this.required !== undefined) {
        this.$on('el.form.blur', this.onFieldBlur);
        this.$on('el.form.change', this.onFieldChange);
      }
    },
    // 移除事件监听
    removeValidateEvents() {
      this.$off();
    }
  },
  
  mounted() {
    if (this.prop) {
      // 触发父组件的自定义方法 addField
      this.dispatch('ElForm', 'el.form.addField', [this]);
      
      // 获取表单项的值作为初始值
      let initialValue = this.fieldValue;
      // 兼容数组类型
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue);
      }
      // 将初始值绑定在 this 上
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      });
      // 增加自定义事件监听
      this.addValidateEvents();
    }
  },
  
  beforeDestroy() {
    // 触发 Form 组件的 el.form.removeField 方法
    this.dispatch('ElForm', 'el.form.removeField', [this]);
  }
}
</script>