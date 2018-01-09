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
        <div
          class="middle"
          @touchstart="onMiddleTouchStart"
          @touchmove="onMiddleTouchMove"
          @touchend="onMiddleTouchEnd"
        >
          <div class="middle-l" ref="middleLeft">
            <div class="cd-wrapper" ref="cdWrapper" >
              <div class="cd" :class="cdClassName">
                <img :src="currentSong.img" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="text"
                  :class="{'current': currentLyricLineNum === index}"
                  ref="lyricLine"
                  v-for="(line, index) in currentLyric.lines"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 唱片区域和歌词 结束 -->


        <!-- 底部操作区域 开始 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ 'active' : currentShow === 'cd' }"></span>
            <span class="dot" :class="{ 'active' : currentShow === 'lyric' }"></span>
          </div>
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
      @ended="end"
    >
    </audio>
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
import LyricParser from 'lyric-parser'
import Scroll from 'base/scroll/scroll.vue'

export default {
  name: 'player',

  data() {
    return {
      songReady: false,            // 歌曲资源是否已经准备好
      currentTime: 0,              // 当前播放歌曲的已经播放时间
      radius: 32,                  // 迷你播放器暂停 播放的按钮半径
      currentLyric: null,          // 当前正在播放歌曲的歌词
      currentLyricLineNum: 0,      // 正在播放的某一条歌词的行数
      playingLyric: '',            // 当前正在播放的某一条歌词
      currentShow: 'cd'            // 播放器中显示的歌曲图片还是歌词 cd 表示歌曲图片；lyric 表示歌词
    }
  },

  // 挂载 touch 对象，保存 touch 相关事件的坐标信息和初始化信息等
  created() {
    this.touch = {}
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

    // 切换播放 暂停 同时歌词暂停或者开始滚动
    togglePlayState() {
      this.setPlayState( !this.playing )
      this.playing ? this.currentLyric.play() : this.currentLyric.stop()
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
      if ( this.currentLyric ) {
        this.currentLyric.seek( this.currentTime * 1000 );
      }
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
      this.$refs.cdWrapper.style.transform  = '';
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
    },

    // 创建歌曲歌词
    getLyric() {
      this.currentSong.createLyric()
      .then( lyric => {
        this.currentLyric = new LyricParser( lyric, this.handleLyric );
        if ( this.playing ) {
          this.currentLyric.play()
        }
      })
      .catch( () => {
        this.currentLyric = null;
        this.playingLyric = '';
        this.currentLyricLineNum = 0;
      })
    },

    // 歌曲歌词实时滚动处理
    handleLyric( { lineNum, txt } ) {
      this.currentLyricLineNum = lineNum;
      if ( lineNum > 5 ) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement( lineEl, 1000 );
      } else {
        this.$refs.lyricList.scrollTo( 0, 0, 1000 );
      }
      this.playingLyric = txt;
    },


    /**
     * onMiddleTouchStart onMiddleTouchMove onMiddleTouchEnd
     * 播放器歌曲图片和歌词的切换处理
     */
    onMiddleTouchStart( event ) {
      this.touch.init = true;
      this.touch.isFirstTouch = false;
      this.touch.startX = event.touches[0].pageX;
      this.touch.startY = event.touches[0].pageY;
    },

    onMiddleTouchMove( event ) {
      if ( !this.touch.init ) {
        return;
      }
      if ( !this.touch.isFirstTouch ) {
        this.touch.isFirstTouch = true;
      }

      // x y 向的位移
      let deltaX = event.touches[0].pageX - this.touch.startX;
      let deltaY = event.touches[0].pageY - this.touch.startY;

      // 竖向滑动无效（不进行切换）
      if ( Math.abs(deltaY) > Math.abs(deltaX) ) {
        return;
      }


      let left = this.currentShow === 'cd' ? 0 : - window.innerWidth;

      // 左滑和右滑的偏移量
      let offsetWidth = Math.min( 0, Math.max( - window.innerWidth, left + deltaX ) );

      // 滑动百分比
      this.touch.movePercent = Math.abs( offsetWidth / window.innerWidth );

      // 只改变歌词显示区域的位置 而歌曲图片只是隐藏
      this.$refs.lyricList.$el.style.transform = `translateX(${offsetWidth}px)`;
      this.$refs.lyricList.$el.style.transitionDuration = 0;
      this.$refs.middleLeft.style.transitionDuration = 0;

      // 歌曲图片以及歌词的渐隐 / 渐显
      this.$refs.lyricList.$el.style.opacity = this.touch.movePercent;
      this.$refs.middleLeft.style.opacity = 1 - this.touch.movePercent;
    },

    onMiddleTouchEnd( event ) {
      if ( !this.touch.isFirstTouch ) {
        return;
      }

      // 0 or window.innerWidth
      let offsetWidth = 0;

      // 0 or 1
      let opacity = 0;

      // 从右往左滑动的临界值 以及从左往右滑动的临界值
      let criticalValue = 0.1;

      if ( this.currentShow === 'cd' ) {
        if ( this.touch.movePercent > criticalValue ) {
          offsetWidth = - window.innerWidth;
          opacity = 0;
          this.currentShow = 'lyric';
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if ( this.touch.movePercent < ( 1 - criticalValue ) ) {
          offsetWidth = 0;
          this.currentShow = 'cd';
          opacity = 1;
        } else {
          offsetWidth = - window.innerWidth;
          opacity = 0;
        }
      }

      const time = 300;
      this.$refs.lyricList.$el.style.transform = `translateX(${offsetWidth}px)`;
      this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`;
      this.$refs.middleLeft.style.opacity = opacity;
      this.$refs.middleLeft.style.transitionDuration = `${time}ms`;
      this.touch.init = false;
    }
  },

  // watch 当前播放歌曲的变化以及播放状态的变化
  watch: {
    currentSong( nextSong, prevSong ) {
      if ( nextSong.id === prevSong.id ) {
        return;
      }
      if ( this.currentLyric ) {
        this.currentLyric.stop();
        this.currentTime = 0;
        this.playingLyric = '';
        this.currentLyricLineNum = 0;
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric();
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
    ProgressCircle,
    Scroll
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


