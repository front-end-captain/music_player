import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'

import 'common/stylus/index.styl'

// 引入 fastclick 解决移动端点击事件的 300ms 延时问题
FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
