<template>
  <div>
    推荐页
  </div>
</template>

<script>
import getRecommendData from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
export default {
  name: 'recommend',
  data () {
    return {

      // 轮播图数据
      // {
      //  id:13680
      //  linkUrl:"http://y.qq.com/w/album.html?albummid=004HhaNX4FCTJT"
      //  picUrl:"http://y.gtimg.cn/music/photo_new/T003R720x288M000001o5FzB1wx40X.jpg"
      // }
      recommends: [],
      dislist: []
    }
  },
  created () {
    this._getRecommendData()
  },
  methods: {
    _getRecommendData () {
      getRecommendData().then( ( response ) => {
        console.log( response )
        if ( response.code === ERR_OK ) {
          this.recommends = response.data.slider;
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
