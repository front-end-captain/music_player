<template>
  <swiper v-bind:options='swiperOption'>
    <swiper-slide v-for='(slider, index) in swiperSliders' v-bind:key='index'>
      <a v-bind:href="slider.linkUrl">
        <img v-bind:src='slider.picUrl' @load="loadImg">
      </a>
    </swiper-slide>
    <div class='swiper-pagination' slot='pagination'></div>
  </swiper>
</template>
<script>
export default {
  // name 属性不能使用 swiper 否则抛出栈溢出异常
  // name 属性会允许组件模版递归的调用自己
  name: 'carrousel',

  data: function() {
    return {
      swiperOption: {
        autoplay: 3500,
        setWrapperSize: true,
        pagination: { el: '.swiper-pagination' },
        observeParents: true,
        loop: true,
        autoplayDisableOnInteraction: false
      }
    };
  },
  props: {
    swiperSliders: {
      type: Array,
      default: []
    },
    loadImg: {
      type: Function,
      default: null
    }
  }
};
</script>

<style lang="stylus" scoped>
  img
    display block
    width 100%
</style>
