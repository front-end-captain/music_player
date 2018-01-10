<template>
  <scroll class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script>

import Scroll from 'base/scroll/scroll.vue'
import { getSearchResult } from 'api/search.js';
import { createSong } from 'common/js/song.js'

const TYPE_SINGER = 'singer';

export default {
  name: 'suggest',

  data() {
    return {
      result: [],
      pageNum: 1
    }
  },

  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Scroll
  },
  methods: {

    // 发起请求 获取搜索结果数据
    _getSearchResult( newQuery ) {
      getSearchResult( newQuery, this.pageNum, this.showSinger ).then( res => {
        if ( res.code === 0 ) {
          this.handleResult( res.data ).then( ret => {
            this.result = ret;
          })
        }
      })
    },

    // 对搜索结果进行处理
    async handleResult( data ) {
      let ret = [];
      if ( data.zhida && data.zhida.albummid ) {
        ret.push( { ...data.zhida, ...{ type: TYPE_SINGER } } );
      }

      if ( data.song ) {
        await this._normalizeSonglist( data.song.list )
          .then( songs => {
            ret = ret.concat( songs )
          });
      }

      return ret
    },

    // 格式化歌曲详情数据 剔除一些无用数据
    async _normalizeSonglist( list ) {
      let ret = [];

      await list.forEach( item => {
        if ( item.songid && item.albummid ) {
          createSong( item ).then( newSong => {
            ret.push( newSong )
          })
        }
      });
      return ret;
    },

    // 搜索结果列表各项的 icon 图标
    getIconClass( item ) {
      if ( item.type === TYPE_SINGER ) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },

    // 搜索结果列表各项显示名称处理
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }

  },

  watch: {
    query( newQuery ) {

      // 新的搜索关键字为空
      if ( newQuery.trim() === '' ) {
        return;
      }
      this._getSearchResult( newQuery );
    }
  }

}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

