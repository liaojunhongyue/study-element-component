import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

// 用于绑定监听事件，兼容 IE 浏览器
export const on = (function() {
  if (!isServer && document.addEventListener) {
    // 判断 document.addEventListener 是否存在，
    return function(element, event, handler) {
      // 如果元素、事件、回调方法都存在则绑定监听事件
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

// 用于取消事件监听，兼容 IE 浏览器
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    // 判断 document.removeEventListener 是否存在
    return function(element, event, handler) {
      // 如果元素、事件存在，则取消监听的绑定事件
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    // 不存在，使用 detachEvent 兼容IE浏览器
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

// 用于监听绑定事件后，回调函数只触发一次
export const once = function(el, event, fn) {
  var listener = function() {
    // 如果传入了回调函数，则执行该函数
    if (fn) {
      fn.apply(this, arguments);
    }
    // 取消事件监听
    off(el, event, listener);
  };
  // 绑定事件监听
  on(el, event, listener);
};



