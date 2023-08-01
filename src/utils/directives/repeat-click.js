import { once, on } from '../dom';
import { isMac } from '../util';

export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;
    // 每隔多长时间执行一次方法
    const maxIntervals = isMac() ? 100 : 200;
    // 绑定的方法
    const handler = () => vnode.context[binding.expression].apply();
    const clear = () => {
      // 小于间隔时间，则执行方法
      if (Date.now() - startTime < maxIntervals) {
        handler();
      }
      // 并且在鼠标抬起时清除计时器
      clearInterval(interval);
      interval = null;
    }
    on(el, 'mousedown', (e) => {
      // 如果点击的不是鼠标左键，则直接 return 
      if (e.button !== 0) return;
      // 变量 startTime 记录当前鼠标 mousedown 的时间
      startTime = Date.now();
      // 绑定鼠标 mouseup 事件
      once(document, 'mouseup', clear);
      clearInterval(interval);
      // 每隔 maxIntervals 时间执行一次方法
      interval = setInterval(handler, maxIntervals);
    })
  }
}