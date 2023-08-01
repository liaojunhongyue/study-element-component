<template>
  <form
    class="el-form"
    :class="[
      labelPosition ? 'el-form--label-' + labelPosition : '',
      { 'el-form--inline': inline }
    ]"
  >
    <slot></slot>
  </form>
</template>
<script>
export default {
  name: 'ElForm',
  
  componentName: 'ElForm',
  
  provide() {
    return {
      elForm: this
    };
  },
  
  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    // 	用于控制该表单内组件的尺寸
    size: String,
    // 是否禁用该表单内的所有组件
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rules() {
      // 当规则改变时，重新绑定自定义事件的监听
      this.fields.forEach(field => {
        field.removeValidateEvents();
        field.addValidateEvents();
      });
      // 如果 validateOnRuleChange 传值为 true，则每次监听到规则改变时就执行 validate 方法
      if (this.validateOnRuleChange) {
        this.validate(() => {});
      }
    },
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) return 0;
      // 找到 potentialLabelWidthArr 数组中的最大值
      const max = Math.max(...this.potentialLabelWidthArr);
      return max ? `${max}px` : '';
    }
  },
  data() {
    return {
      fields: [], // 设置 fields 变量用于存储表单项
      potentialLabelWidthArr: [], // 设置 potentialLabelWidthArr 用于存储所有计算的 label 的 width
    }
  },
  
  created() {
    this.$on('el.form.addField', (field) => {
      if (field) {
        // 将每一个表单项都推入到 fields 数组中
        this.fields.push(field);
      }
    })
    // 监听 el.form.removeField 方法
    this.$on('el.form.removeField', (field) => {
      if (field.prop) {
        // 找到对应的字段从 fields 数组中删除
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    });
  },
  methods: {
    resetFields() {
      // 循环表单项，依次调用每一个表单项的 resetField 方法
      this.fields.forEach(field => {
        field.resetField();
      });
    },
    // 清除表单校验
    clearValidate(props = []) {
      // 筛选传入的字段（兼容字符串）
      const fields = props.length
        ? (typeof props === 'string'
          ? this.fields.filter(field => props === field.prop)
          : this.fields.filter(field => props.indexOf(field.prop) > -1)
        ) : this.fields;
      // 依次调用每一个表单项的 clearValidate 方法
      fields.forEach(field => {
        field.clearValidate();
      });
    },
    // 校验整个表单
    validate(callback) {
      // 如果没有传 model，返回一个警告信息
      if (!this.model) {
        console.warn('[Element Warn][Form]验证方法需要 model 参数');
        return;
      }

      let promise;
      // 如果没有 callback，则返回 promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function(valid, invalidFields) {
            // 如果 valid 为 true，则 resolve，否则 reject（用户既可以传入callback，也可以用 .then、.catch）
            valid ? resolve(valid) : reject(invalidFields);
          };
        });
      }

      let valid = true; // 校验状态，初始值为true
      let count = 0; // 校验次数，初始值为0
      // 如果 fields 为空，则立即返回 true
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      let invalidFields = {}; // 存入错误的字段
      this.fields.forEach(field => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false;
          }
          invalidFields = Object.assign({}, invalidFields, field);
          // 如果 callback 是 function，并且全部字段都校验了
          if (typeof callback === 'function' && ++count === this.fields.length) {
            // 则把校验状态和错误的字段返回
            callback(valid, invalidFields);
          }
        });
      });
      // 如果用户没传入 callback，则返回 promise
      if (promise) {
        return promise;
      }
    },
    // 验证传入的部分字段
    validateField(props, cb) {
      props = [].concat(props);
      // 从全部字段中筛选传入的字段
      const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1);
      // 如果没有传入字段则抛出警告
      if (!fields.length) {
        console.warn('[Element Warn]需要传入该表单的字段字段!');
        return;
      }
      // 依次调用表单项的 validate 方法
      fields.forEach(field => {
        field.validate('', cb);
      });
    }, 
    // 找到对应 label-width 的索引
    getLabelWidthIndex(width) {
      const index = this.potentialLabelWidthArr.indexOf(width);
      if (index === -1) {
        throw new Error('[ElementForm]unpected width ', width);
      }
      return index;
    },
    // 在数组 potentialLabelWidthArr 中存储 label 的 width
    registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        // 更新宽度，找到旧宽度的索引，将新宽度更新上去
        const index = this.getLabelWidthIndex(oldVal);
        this.potentialLabelWidthArr.splice(index, 1, val);
      } else if (val) {
        // 新增宽度，直接 push 到 potentialLabelWidthArr 数组中
        this.potentialLabelWidthArr.push(val);
      }
    },
    // 从 potentialLabelWidthArr 数组中删除对应宽度
    deregisterLabelWidth(val) {
      const index = this.getLabelWidthIndex(val);
      this.potentialLabelWidthArr.splice(index, 1);
    }
  }
}
</script>