import { on, off } from '../../../utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },

  render(h) {
    const { size, move, bar } = this;

    return (
      <div
        class={ ['el-scrollbar__bar', 'is-' + bar.key] }
        onMousedown={ this.clickTrackHandler }
      >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>
    );
  },

  methods: {
    clickThumbHandler(e) {
      // 如果按下了 ctrl 键，或者按下的是鼠标的右键，则直接 return
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      // 处理拖拽
      this.startDrag(e);
      // 更新滚动条的 axis 属性，对应的是 Y 或者 X
      // 这里计算的是点击的位置距离滚动条底部（或者右侧）的距离
      // this[this.bar.axis] = 滚动条的高度（宽度）- （鼠标距离页面可视区域的位置 - 滚动条距离页面顶端或者左侧的位置）
      // 鼠标距离页面可视区域的位置 - 滚动条距离页面顶端或者左侧的位置 = 鼠标距离滚动条顶部（或者左侧的距离）
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
      console.log(this[this.bar.axis])
    },

    clickTrackHandler(e) {
      // 计算出的是鼠标距离滚动轨道最上方（或者最左侧）的距离
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      // 计算出滚动条的一半的距离
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      // 以鼠标的位置作为滚动条的中心，计算出滚动条距离滚动轨道最上方的百分比
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);
      // 计算出需要滚动的距离 = 滚动条距离滚动轨道最上方的百分比 * 元素的实际高度（content + padding + 滚动部分） / 100 => 得到实际需要滚动的距离
      // 给 wrap 的 scrollTop 设置成需要滚动的距离，从而触发拖拽滚动的效果
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    // 开始拖拽
    startDrag(e) {
      // 阻止事件冒泡并且阻止该元素上同事件类型的监听器被触发
      e.stopImmediatePropagation();
      // 用 cursorDown 变量记录鼠标被按下
      this.cursorDown = true;
      // 监听鼠标移动事件
      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      // 监听鼠标抬起事件
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      // 禁止选中
      document.onselectstart = () => false;
    },
    // 鼠标移动事件的处理
    mouseMoveDocumentHandler(e) {
      // 如果没有监听到鼠标按下，则直接 return
      if (this.cursorDown === false) return;
      // 这里是计算出来的点击的位置距离滚动条底部（或者右侧）的距离
      const prevPage = this[this.bar.axis];
      // 不存在 prevPage 则直接 return
      if (!prevPage) return;
      // 计算出的是鼠标距离滚动轨道最上方（或者最左侧）的距离
      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      // 鼠标距离滚动条最上方的位置
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      // 计算出滚动条距离滚动轨道最上方的百分比
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);
      // 计算出需要滚动的距离 = 滚动条距离滚动轨道最上方的百分比 * 元素的实际高度（content + padding + 滚动部分） / 100 => 得到实际需要滚动的距离
      // 给 wrap 的 scrollTop 设置成需要滚动的距离，从而触发拖拽滚动的效果
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },
    // 鼠标抬起事件的处理
    mouseUpDocumentHandler() {
      // 将 cursorDown 重置为 false
      this.cursorDown = false;
      // 将 this[this.bar.axis] 重置为 0
      this[this.bar.axis] = 0;
      // 取消监听 mousemove
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      // 取消禁止选中
      document.onselectstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};
