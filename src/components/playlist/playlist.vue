<template>
  <transition name="list-fade">

    <!-- 播放列表 开始 -->
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>

        <!-- 列表头部 开始 -->
        <div class="list-header">
          <h1 class="title">
            <i :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <!-- 列表头部 结束 -->

        <!-- 列表内容 -->
        <scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li
              :key="item.id"
              class="item"
              ref="listItem"
              v-for="(item, i) in sequenceList"
              @click="selectItem(item, i)"
            >
              <i class="current" :class="getCurrentIcon( item )"></i>
              <span class="text">{{ item.name }} - {{ item.singer }}</span>
              <span class="like" @click.stop="toggleFavoriteIcon(item)">
                <i :class="getFavoriteIcon(item)" ></i>
              </span>
              <span class="delete" @click.stop="deleteOne( item )">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <!-- 列表内容 结束 -->

        <!-- 底部添加歌曲按钮 开始 -->
        <div class="list-operate">
          <div class="add" @click="showAddSongPage">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到播放列表</span>
          </div>
        </div>
        <!-- 底部添加播放歌曲按钮 结束 -->

        <!-- 关闭播放列表按钮 开始 -->
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
        <!-- 关闭播放列表按钮 结束 -->

      </div>

      <confirm
        ref="confirm"
        text="是否清空播放列表"
        confirmBtn="清空"
        @confirm="confirmClear"
      ></confirm>

      <add-song ref="addSong"></add-song>
    </div>
    <!-- 播放列表 结束 -->

  </transition>
</template>


<script>

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playmode } from 'common/js/config.js'
import { playerMixin } from 'common/js/mixin.js'
import Scroll from 'base/scroll/scroll.vue'
import Confirm from 'base/confirm/confirm.vue'
import AddSong from 'components/add-song/add-song.vue'

export default {
  name: 'play-list',

  mixins: [playerMixin],

  components: {
    Scroll,
    Confirm,
    AddSong
  },


  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },

  computed: {
    modeText() {
      return this.mode === playmode.sequence
        ? '顺序播放'
        : this.mode === playmode.loop
          ? '循环播放'
          : '随机播放'
    }
  },

  methods: {

    ...mapActions([
      'deleteSong',
      'clearPlayList'
    ]),

    show() {
      this.showFlag = true;
      setTimeout( () => {
        this.$refs.listContent.refresh();
        this.scrollToCurrentSong( this.currentSong );
      }, 20)
    },

    hide() {
      this.showFlag = false;
    },

    getCurrentIcon( item ) {
      return this.currentSong.id === item.id ? "icon-play" : '';
    },

    selectItem( item, index ) {
      if ( this.mode === playmode.random ) {
        index = this.playList.findIndex( song => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex( index );
      this.setPlayState( true );
    },

    scrollToCurrentSong( current ) {
      let index = this.sequenceList.findIndex( item => {
        return item.id === current.id;
      });
      this.$refs.listContent.scrollToElement( this.$refs.listItem[index], 300 );
    },

    deleteOne( item ) {
      this.deleteSong( item );
      if ( this.playList.length === 0 ) {
        this.hide();
      }
    },

    showConfirm() {
      this.$refs.confirm.show();
    },

    confirmClear() {
      this.clearPlayList();
      this.hide();
    },

    showAddSongPage() {
      this.$refs.addSong.show();
    }
  },

  watch: {
    currentSong( newSong, oldSong ) {
      if ( !this.showFlag || newSong.id === newSong.id ) {
        return;
      }
      this.scrollToCurrentSong( newSong )
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: rgba(150, 147, 147, 0.7)
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: rgba(51, 51, 51, 0.64)
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-white
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
            text-indent $font-size-medium
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-theme-white
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-white
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color:$color-theme-white
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme-white
            .icon-favorite
              color: $color-theme-white
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme-white
      .list-operate
        width: 45%
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          justify-content: center
          padding: 12px 16px
          border-radius: 100px
          color: $color-theme-white
          background-color $color-background-aqua
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background-aqua
        font-size: $font-size-large-x
        color: $color-theme-white
</style>
