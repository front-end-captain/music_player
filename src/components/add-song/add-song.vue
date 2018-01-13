<template>
  <transition name="slider">
    <div class="add-song" v-show="showFlag" @click.stop>

      <div class="header">
        <h1 class="title">添加歌曲到播放列表</h1>
        <div class="close" @click.stop="hide">
          <i class="icon-close"></i>
        </div>
      </div>

      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="search" ref="searchBox"></search-box>
      </div>

      <div class="shortcut" v-show="!query">
        <switches
          :switches="switches"
          :currentIndex="currentIndex"
          @switch="onSwitchChange"
        ></switches>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" :data="playHistory" class="list-scroll" ref="songList">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex === 1" ref="searchList" :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>

      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @select="selectItem"
          @listScoll="listScroll"
        ></suggest>
      </div>

      <tip ref="tip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">添加成功!</span>
        </div>
      </tip>
    </div>
  </transition>
</template>


<script>

import SearchBox from 'base/search-box/search-box.vue'
import Suggest from 'components/suggest/suggest.vue'
import Switches from 'base/switches/switches.vue'
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list.vue'
import SearchList from 'base/search-list/search-list.vue'
import Tip from 'base/tip/tip.vue'
import { searchMixin } from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import { Song } from 'api/song.js'



export default {
  name: 'add-song',

  mixins: [ searchMixin ],

  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },

  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Tip
  },

  methods: {
    ...mapActions({
      insertSong: 'insertSong'
    }),

    show() {
      this.showFlag = true;
      setTimeout( () => {
        if ( this.currentIndex === 0 ) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, )
    },

    hide() {
      this.showFlag = false;
    },

    search( query ) {
      this.query = query;
    },

    selectItem() {
      this.saveSearch();
      this.showTip();
    },

    showTip() {
      this.$refs.tip.show();
    },

    onSwitchChange( index ) {
      this.currentIndex = index
    },

    selectSong( song, index ) {
      if ( index !== 0 ) {
        this.insertSong( new Song( song ) );
      }
      this.showTip();
    }
  }
}
</script>



<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: #5a5a5a
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.6s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-theme-white
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme-white

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium-x
        color: $color-theme
        margin-right: 8px
      .text
        font-size: $font-size-medium-x
        color: $color-text
</style>

