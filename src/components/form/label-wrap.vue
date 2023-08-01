<script>
export default {
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean
  },
  
  inject: ['elForm', 'elFormItem'],
  
  render() {
    const slots = this.$slots.default;
    if (!slots) return null;
    if (this.isAutoWidth) {
      // 获取 Form 组件的 autoLabelWidth
      const autoLabelWidth = this.elForm.autoLabelWidth;
      const style = {};
      // 如果 form 组件计算出了 autoLabelWidth，并且其 label-position 设置的不是 left，则计算其 margin-left 用于右对齐
      if (autoLabelWidth && this.elForm.labelPosition !== 'left') {
        // 用 Form 组件计算出的最大的 label 宽度，减去该项 label 本身占的宽度，取整后则为 label 的 margin-left
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth;
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px';
        }
      }
      // 如果 width 是 auto，则用一个 div 包裹，用于计算这个包裹元素的宽度
      return (<div class="el-form-item__label-wrap" style={style}>
        { slots }
      </div>);
    } else {
      return slots[0];
    }
  },
  
  methods: {
    // 获取元素的宽度
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        // 使用 window.getComputedStyle 获取元素的宽度
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width;
        // 使用 Math.ceil 将获取到的宽度向上取整
        return Math.ceil(parseFloat(computedWidth));
      } else {
        return 0;
      }
    },
    // 更新元素的宽度
    updateLabelWidth(action = 'update') {
      // 如果宽度设置的是 auto，并且获取到了组件根元素的第一个子元素
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        // action 是 update 去获取 label 的宽度
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth();
        } else if (action === 'remove') {
          // update 为 remove 时，从数组中删除该 label 的宽度
          this.elForm.deregisterLabelWidth(this.computedWidth);
        }
      }
    }
  },
  watch: {
    computedWidth(val, oldVal) {
      if (this.updateAll) {
        // 调用 Form 组件的 registerLabelWidth 去记录每一个 label 的宽度
        this.elForm.registerLabelWidth(val, oldVal);
        // 调用 Form-Item 组件的 updateComputedLabelWidth 去更新当前 label 的宽度
        this.elFormItem.updateComputedLabelWidth(val);
      }
    }
  },
  data() {
    return {
      computedWidth: 0 // label 的实时宽度计算
    };
  },
  mounted() {
    // 在 mounted 钩子里面获取 label 的宽度
    this.updateLabelWidth('update');
  },

  updated() {
    // 在组件发生更新之后的 updated 钩子里面获取 label 的宽度
    this.updateLabelWidth('update');
  },
  
  beforeDestroy() {
    // 在组件触发 beforeDestroy 钩子时，去将宽度删除
    this.updateLabelWidth('remove');
  }
}
</script>
