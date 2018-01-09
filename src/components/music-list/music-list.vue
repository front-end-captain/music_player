<template>
  <div class="music-list">

    <!-- 顶部回退按钮以及歌曲标题 开始 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <!-- 顶部回退按钮以及歌曲标题 结束 -->


    <!-- 背景图 开始 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length > 0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 背景图 结束 -->


    <!-- 歌曲列表 开始 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      class="list"
      ref="list"
      :probeType="probeType"
      :listenScroll="isListenScroll"
      @scroll="scroll"
      >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length > 0">
        <loading></loading>
      </div>
    </scroll>
    <!-- 歌曲列表 结束 -->

  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list.vue'
import Loading from 'base/loading/loading.vue'
import { mapActions } from 'vuex'

const TITLE_HEIGHT = 40;

export default {
  name: 'music-list',

  props: {
    bgImg: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      default: String,
      default: ''
    }
  },

  data() {
    return {
      scrollY: 0
    }
  },

  // 开启监听 scroll 事件
  created() {
    this.probeType = 3;
    this.isListenScroll = true;
  },

  mounted() {

    // 背景图片高度
    this.imageHeight = this.$refs.bgImage.clientHeight;

    // 歌曲列表向上卷去的最大距离
    this.minTranslateY = -this.imageHeight + TITLE_HEIGHT;

    // 歌曲列表距离顶部的 top 值为背景图片高度
    this.$refs.list.$el.style.top = this.imageHeight + 'px'
  },

  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`
    }
  },

  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),

    // 回退
    back() {
      this.$router.back();
    },

    // scroll 事件监听程序
    scroll( position ) {
      this.scrollY = position.y;
    },

    // 随机播放全部
    random() {
      this.randomPlay({
        list: this.songs
      })
    },

    // 选择即播放
    // currentIndex = index
    // playList = this.songs
    // sequenceList = this.songs
    // fullScreen = true
    // playing = true
    selectItem( song, index ) {
      this.selectPlay( {
        list: this.songs,
        index: index
      })
    }
  },

  watch: {
    scrollY( newScrollY ) {

      let translateY = Math.max( this.minTranslateY, newScrollY );
      let zIndex = 0;
      let scale  = 1;

      // 图片放大比例
      let parcent = Math.abs( newScrollY / this.imageHeight );

      // 下拉  背景图片放大
      if ( newScrollY > 0 ) {
        scale  = 1 + parcent;
        zIndex = 10;
      }

      // 上拉 遮盖背景图片
      this.$refs.layer.style.transform = `translateY(${translateY}px)`;
      this.$refs.layer.style.transform = `-webkit-translateY(${translateY}px)`;
      if ( newScrollY < this.minTranslateY ) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = TITLE_HEIGHT + 'px';
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style.transform = `scale(${scale})`
    }
  },

  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
