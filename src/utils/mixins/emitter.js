function broadcast(componentName, eventName, params) {
  // 遍历当前节点下所有子组件
  this.$children.forEach(child => {
    // 用变量 name 记录子组件名称
    var name = child.$options.componentName;

    if (name === componentName) {
      // 如果找到对应的子组件则用emit触发事件
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // 没找到则递归遍历更深层次的子组件
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // 向上找到父组件，并调用某方法
    dispatch(componentName, eventName, params) {
      
      // 获取当前元素的父组件，或者是根组件
      var parent = this.$parent || this.$root;
      // 用变量 name 记录当前元素父组件的组件名称
      var name = parent.$options.componentName;
      
      // 如果存在父组件，父组件的组件名称不存在，或者父组件的组件名称与传入的组件名称不一致，则继续向上查找
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        // 继续记录父组件名称
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      console.log(parent)
      if (parent) {
        // 找到后调用emit触发事件
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    // 向下找到子组件，调用某方法
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
