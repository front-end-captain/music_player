<template>
  <div class="player" v-show="playList.length > 0">

    <!-- 正常播放器 开始 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
      >
      <div class="normal-player" v-show="fullScreen">

        <!-- 播放器背景 开始 -->
        <div class="background">
          <img :src="currentSong.img" width="100%" height="100%">
        </div>
        <!-- 播放器背景 结束 -->


        <!-- 顶部标题和返回按钮 开始 -->
        <div class="top">
          <div class="back" @click="close">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 顶部标题和返回按钮 结束 -->


        <!-- 唱片区域和歌词 开始 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper" >
              <div class="cd" :class="cdClassName">
                <img :src="currentSong.img" class="image">
              </div>
            </div>
          </div>
        </div>
        <!-- 唱片区域和歌词 结束 -->


        <!-- 底部操作区域 开始 -->
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ foramtTime( currentTime ) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percent="onPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{ foramtTime( currentSong.duration ) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" @click="togglePlayState">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
        <!-- 底部操作区域 结束 -->

      </div>
    </transition>
    <!-- 正常播放器 结束 -->


    <!-- 底部迷你播放器 开始 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.img" width="40" height="40" :class="cdClassName">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlayState"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 底部迷你播放器 结束 -->

    <!-- 音频播放 -->
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"></audio>
  </div>
</template>


<script>
import { mapGetters, mapMutations } from 'vuex'

// https://github.com/HenrikJoreteg/create-keyframe-animation
import animations from 'create-keyframe-animation'

import ProgressBar from 'base/progress-bar/progress-bar.vue'
import ProgressCircle  from 'base/progress-circle/progress-circle.vue'
import { playmode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'

export default {
  name: 'player',
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32
    }
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-play' : 'icon-pause'
    },
    miniIcon() {
      return this.playing ? 'icon-play-mini' : 'icon-pause-mini'
    },
    iconMode () {
      return this.mode === playmode.sequence
        ? 'icon-sequence'
        : this.mode === playmode.loop
          ? 'icon-loop'
          : 'icon-random';
    },
    cdClassName() {
      return this.playing ? 'play' : 'play-pause'
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },

  methods: {
     ...mapMutations({
      shiftFullScreen: 'SET_FULLSCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),

    // 该函数执行表示歌曲资源已经准备好 从而可以进行切歌操作
    ready() {
      this.songReady = true;

    },
    // 关闭全屏播放
    close() {
      this.shiftFullScreen( false );
    },

    // 打开全屏播放
    open() {
      this.shiftFullScreen( true );
    },

    // 切换播放 暂停
    togglePlayState() {
      this.setPlayState( !this.playing )
    },

    // 上一首歌曲
    prevSong() {
      if ( !this.songReady ) {
        return;
      }
      if ( this.currentIndex === 0 || this.currentIndex < 0 ) {
        return
      }
      let index = this.currentIndex;
      this.setCurrentIndex( index - 1 )
      if ( !this.playing ) {
        this.togglePlayState();
        this.songReady = true;
      }
    },

    // 下一首歌曲
    nextSong() {
      if ( !this.songReady ) {
        return;
      }
      if ( this.currentIndex > this.playList.length - 1 || this.currentIndex === this.playList.length - 1 ) {
        return
      }
      let index = this.currentIndex;
      this.setCurrentIndex( index + 1 )
      if ( !this.playing ) {
        this.togglePlayState();
        this.songReady = true;
      }
    },

    // 音频播放错误事件处理程序
    error() {
      this.songReady = false;
    },

    // audio 元素 timeUpdate 事件处理程序
    updateTime( event ) {
      this.currentTime = event.target.currentTime;
    },

    // 播放进度改变
    onPercentChange( newPercent ) {
      this.$refs.audio.currentTime = newPercent * this.currentSong.duration;
      this.currentTime = newPercent * this.currentSong.duration;
    },

    // 改变播放模式 随机 / 循环 / 顺序
    changeMode() {
      let currentMode = (this.mode + 1) % 3;
      this.setPlayMode( currentMode );
      let list = null;
      if ( this.playmode === playmode.random ) {
        list = shuffle( this.sequenceList );
      } else {
        list = this.sequenceList;
      }

      this._resetCurrentIndex( list )
      this.setPlayList( list );
    },

    end( event ) {
      if ( this.mode === playmode.loop ) {
        this.loop();
      } else {
        this.nextSong()
      }
    },

    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.setPlayState( true );
    },
    _resetCurrentIndex( list ) {
      let index = list.findIndex( ( item ) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex( index );
    },

    // 入场动画
    enter( element, done ) {
      const { x, y, scale } = this.getInitPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 600,
          easing: 'linear'
        }
      })

      animations.runAnimation( this.$refs.cdWrapper, 'move', done )
    },
    // 入场之后动画
    afterEnter( element ) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    // 退场动画
    leave( element, done ) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s';
      const { x, y, scale } = this.getInitPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener( 'transitionend', done );
    },
    // 退场之后动画
    afterLeave( element ) {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style.transform = '';
    },

    // 获取歌曲图片初始位置以及缩放比例
    getInitPosAndScale() {
      let targetWidth = 40;
      let paddingLeft = 40;
      let paddingBottom = 30;
      let paddingTop = 80;
      let width = window.innerWidth * 0.8
      let scale = targetWidth / width;
      let x = -(window.innerWidth / 2 - paddingLeft );
      let y = ( window.innerHeight - paddingTop - width / 2 -paddingTop )
      return { x, y, scale }
    },

    // 格式化播放时间
    foramtTime ( interval ) {
      // | 0 相当于 Math.floor
      interval = interval | 0;
      let minute = interval / 60 | 0;
      let second = interval % 60;
      second = second < 10 ? '0' + second : second;
      return `${minute}:${second}`;
    }
  },

  // watch 当前播放歌曲的变化以及播放状态的变化
  watch: {
    currentSong( nextSong, prevSong ) {
      if ( nextSong.id === prevSong.id ) {
        return;
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing( flag ) {
      this.$nextTick( ()=> {
        let audio = this.$refs.audio;
        flag ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme

      /* 播放器显示和隐藏动画 */
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0


  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>


