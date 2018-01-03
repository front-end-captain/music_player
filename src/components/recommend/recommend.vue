<template>
  <div class="recommend">
    <div class="recommend-content">
      <div v-if="sliders.length > 0" class="slider-wrapper">
        <slider v-bind:swiperSliders="sliders"></slider>
      </div>
    </div>
  </div>
</template>

<script>

import getRecommendData from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import Slider from 'base/slider/slider.vue'

export default {
  name: 'recommend',
  data () {
    return {

      // 轮播图数据 length = 5
      // {
      //  id: 13680
      //  linkUrl: "http://y.qq.com/w/album.html?albummid=004HhaNX4FCTJT"
      //  picUrl: "http://y.gtimg.cn/music/photo_new/T003R720x288M000001o5FzB1wx40X.jpg"
      // }
      // ....
      sliders: [],
      dislist: []
    }
  },
  components: {
    Slider
  },
  created () {
    this._getRecommendData()
  },
  methods: {
    _getRecommendData () {
      getRecommendData().then( ( response ) => {
        console.log( response )
        if ( response.code === ERR_OK ) {
          this.sliders = response.data.slider;
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
</style>
