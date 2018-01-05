import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import FastClick from 'fastclick'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'
import 'swiper/dist/css/swiper.css'

// 引入 fastclick 解决移动端点击事件的 300ms 延时问题
FastClick.attach(document.body)

Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('common/images/logo.default.png'),
  loading: require('common/images/logo.default.png'),
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
