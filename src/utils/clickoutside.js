// 引入 vue
import Vue from 'vue';

// Vue.prototype.$isServer 去获取是否是服务端渲染，如果是服务端渲染，则不执行点击事件
const isServer = Vue.prototype.$isServer;

// 定义 nodeList 变量为数组，存放所有绑定 clickoutside 指令的元素
const nodeList = [];

// 应用 el[ctx]，给被绑定元素定义 @@clickoutsideContext 属性，将绑定的事件等信息挂载在 el[ctx] 上面
const ctx = '@@clickoutsideContext';

// startClick 变量记录开始点击的事件对象
let startClick;
// seed 变量创建唯一的 ID
let seed = 0;

// 封装监听事件（处理IE浏览器兼容性问题）
const on = (function() {
  if (!isServer && document.addEventListener) {
    // 判断 document.addEventListener 是否存在，
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    // 不存在，使用 attachEvent 兼容IE浏览器
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

// 鼠标按下时，将事件对象赋值给 startClick 变量
!isServer && on(document, 'mousedown', e => (startClick = e));

// 鼠标抬起时，遍历 nodeList，调用每个 node 的 documentHandler 方法，并且将鼠标抬起的事件对象和开始点击的事件对象传入
!isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

// 判断是否点击在绑定元素之外，如果点击发生在元素之外，则执行绑定的方法
function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    // 判断vnode和vnode.context是否存在
    // 判断鼠标的按下以及抬起时的元素是否存在
    // 判断鼠标的按下或者鼠标的抬起元素是否包含在被绑定元素的内部
    // 判断抬起鼠标的元素与被绑定的元素是否是同一元素
    // 如果有一处符合的话则 return 掉，不继续执行
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target) return;
    
    // 如果全部都不符合，则证明点击的是被绑定元素的外部，执行绑定的方法
    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  // 指令第一次绑定到元素时
  bind(el, binding, vnode) {
    // 将被绑定的元素 push 到 nodeList 数组中
    nodeList.push(el);
    // 创建一个唯一的 ID
    const id = seed++;
    // 被绑定元素挂载 @@clickoutsideContext 属性。将id，元素事件，字符串形式的指令表达式，绑定的值挂载到 @@clickoutsideContext 属性中。
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },
  // 被绑定元素所在的模板更新时
  update(el, binding, vnode) {
    // 更新除了ID外的其他属性，也就是绑定的方法等
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
  // 指令与元素解绑时调用
  unbind(el) {
    let len = nodeList.length;
    // 遍历 nodeList 数组，如果 nodeList 数组中元素的 ID 与 解绑的元素的 ID 相同，则将该元素从 nodeList 数组中移除
    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};

