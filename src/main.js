// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入 elemennt-ui 中的 CSS
import 'element-theme-chalk/lib/index.css'

Vue.config.productionTip = false

import Radio from './components/radio/radio';
import RadioGroup from './components/radio/radio-group';
import RadioButton from './components/radio/radio-button';
import Checkbox from './components/checkbox/checkbox';
import CheckboxGroup from './components/checkbox/checkbox-group';
import CheckboxButton from './components/checkbox/checkbox-button';
import Input from './components/input/input';
import InputNumber from './components/input-number/input-number';
import Form from './components/form/form';
import FormItem from './components/form/form-item';

const components = [
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Input,
  InputNumber,
  Form,
  FormItem
]

components.forEach(component => {
  Vue.component(component.name, component);
});


// 全局混入
Vue.mixin({
  created() {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

