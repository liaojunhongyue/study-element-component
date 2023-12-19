import Vue from 'vue';

export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  // 将中括号属性转换为 .
  path = path.replace(/\[(\w+)\]/g, '.$1');
  // 将属性前面的 . 去掉 比如：.into.name 转换为 into.name
  path = path.replace(/^\./, '');
  // 用 . 来分割
  let keyArr = path.split('.');
  // 一层一层的来找到对应的属性
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj, // 属性所在对象
    k: keyArr[i], // 属性的 key
    v: tempObj ? tempObj[keyArr[i]] : null // 属性的值
  };
};

export const isMac = function() {
  return !Vue.prototype.$isServer && /macintosh|mac os x/i.test(navigator.userAgent);
};

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};