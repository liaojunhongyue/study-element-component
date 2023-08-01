import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index';
// 自定义指令
import autoFocus from '../pages/directives/autoFocus';
import directiveHooks from '../pages/directives/directiveHooks';
import clickOutside from '../pages/directives/clickOutside';
import repeatClick from '../pages/directives/repeatClick';
// 混入
import mixinsBasic from '../pages/mixins/mixinsBasic';
import mixinsData from '../pages/mixins/mixinsData';
import mixinsHook from '../pages/mixins/mixinsHook';
import mixinsObject from '../pages/mixins/mixinsObject';
import globalMixins from '../pages/mixins/globalMixins';
import mixinsEmitter from '../pages/mixins/boxA';
// provide/inject
import provideValue from '../pages/provideInject/value/outer';
import provideObject from '../pages/provideInject/object/outer';
import provideFunction from '../pages/provideInject/function/outer';
// Radio 组件案例
import radio from '../pages/radio/radio';
import radioGroup from '../pages/radio/radioGroup';
import radioButton from '../pages/radio/radioButton';
// Checkbox 组件案例
import checkbox from '../pages/checkbox/checkbox';
import checkboxGroup from '../pages/checkbox/checkboxGroup';
import checkboxButton from '../pages/checkbox/checkboxButton';
// Input 组件案例
import input from '../pages/input/input';
// Input-Number 组件案例
import inputNumber from '../pages/input-number/inputNumber';
// Form 组件案例
import form from '../pages/form/form';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    // 自定义指令
    {
      path: '/directives/autoFocus',
      name: 'autoFocus',
      component: autoFocus
    },
    {
      path: '/directives/directiveHooks',
      name: 'directiveHooks',
      component: directiveHooks
    },
    {
      path: '/directives/clickOutside',
      name: 'clickOutside',
      component: clickOutside
    },
    {
      path: '/directives/repeatClick',
      name: 'repeatClick',
      component: repeatClick
    },
    // 混入
    {
      path: '/mixins/mixinsBasic',
      name: 'mixinsBasic',
      component: mixinsBasic
    },
    {
      path: '/mixins/mixinsData',
      name: 'mixinsData',
      component: mixinsData
    },
    {
      path: '/mixins/mixinsHook',
      name: 'mixinsHook',
      component: mixinsHook
    },
    {
      path: '/mixins/mixinsObject',
      name: 'mixinsObject',
      component: mixinsObject
    },
    {
      path: '/mixins/globalMixins',
      name: 'globalMixins',
      component: globalMixins
    },
    {
      path: '/mixins/emitter',
      name: 'mixinsEmitter',
      component: mixinsEmitter
    },
    // provide/inject
    {
      path: '/provide/value',
      name: 'provideValue',
      component: provideValue
    },
    {
      path: '/provide/object',
      name: 'provideObject',
      component: provideObject
    },
    {
      path: '/provide/function',
      name: 'provideFunction',
      component: provideFunction
    },
    // Radio
    {
      path: '/page/radio',
      name: 'radio',
      component: radio
    },
    {
      path: '/page/radioGroup',
      name: 'radioGroup',
      component: radioGroup
    },
    {
      path: '/page/radioButton',
      name: 'radioButton',
      component: radioButton
    },
    // Checkbox
    {
      path: '/page/checkbox',
      name: 'checkbox',
      component: checkbox
    },
    {
      path: '/page/checkboxGroup',
      name: 'checkboxGroup',
      component: checkboxGroup
    },
    {
      path: '/page/checkboxButton',
      name: 'checkboxButton',
      component: checkboxButton
    },
    // Input
    {
      path: '/page/input',
      name: 'input',
      component: input
    },
    // Input-Number
    {
      path: '/page/inputNumber',
      name: 'inputNumber',
      component: inputNumber
    },
    // Form
    {
      path: '/page/form',
      name: 'form',
      component: form
    },
  ]
})
