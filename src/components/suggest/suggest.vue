<template>
  <scroll
    class="suggest"
    ref="suggest"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="onListScroll"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>

import Scroll from 'base/scroll/scroll.vue'
import { mapMutations, mapActions } from 'vuex';
import { getSearchResult } from 'api/search.js';
import { createSong } from 'common/js/song.js'
import Singer from 'common/js/singer.js'
import Loading from 'base/loading/loading.vue'
import NoResult from 'base/no-result/no-result.vue'

const TYPE_SINGER = 'singer';
const perpage = 20;

export default {
  name: 'suggest',

  data() {
    return {

      // 搜素结果
      result: [],

      // 当前搜索的第几页
      pageNum: 1,

      // 传递给 scroll 组件的属性 表示是否监听 scrollend 事件，做出上拉显示更多搜索结果
      // 具体见 searchMore 方法
      pullup: true,

      // 标志位 表示是否存在更多的搜索结果
      // 具体见 checkMore 方法
      hasMore: true,

      // 传递给 scroll 组件的属性 表示是否监听 beforeScrollStart 事件
      // 在用户滚动搜索结果列表时，搜索框失去焦点，收起键盘，优化用户体验
      // 具体见 onListScroll 方法
      beforeScroll: true
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
    Scroll,
    Loading,
    NoResult
  },

  methods: {

    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),

    ...mapActions([
      'insertSong'
    ]),

    // 发起请求 获取搜索结果数据
    async _getSearchResult( newQuery, pageNum, showSinger, perpage  ) {

      this.hasMore = true;
      this.$refs.suggest.scrollTo( 0, 0 );

      let res = await getSearchResult( newQuery, pageNum, showSinger, perpage );

      if ( res.code === 0 ) {
        let ret = await this.handleResult( res.data );
        this.result = ret;
        this.checkMore( res.data );
      }
    },

    // 搜索更多
    async searchMore() {
      if ( !this.hasMore ) {
        return;
      }

      this.pageNum ++;

      let res = await getSearchResult( this.query, this.pageNum, this.showSinger, perpage );

      if ( res.code === 0 ) {
        let ret = await this.handleResult( res.data );
        this.result = this.result.concat( ret );
        this.checkMore( res.data );
      }
    },

    // 检查是否有更多的搜索数据
    checkMore( data ) {
      let song = data.song;
      if ( song.list.length === 0 || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum ) {
        this.hasMore = false;
      }
    },

    // 对搜索结果进行处理
    async handleResult( data ) {
      let ret = [];

      // 在 zhida 字段中的 albummid 并不是歌手的 id ，而应该在搜索匹配歌手的 id
      if ( data.zhida && data.zhida.albummid ) {
        let result = data.song.list.find( ( item ) => {
          return item.albummid === data.zhida.albummid
        });

        if ( result ) {
          ret.push( { ...result.singer[0], ...{ type: TYPE_SINGER } } );
        }
      }

      if ( data.song ) {
        let songs = await this._normalizeSonglist( data.song.list );
        ret = ret.concat( songs );
      }

      return ret
    },

    // 格式化歌曲详情数据 剔除一些无用数据
    async _normalizeSonglist( list ) {
      let ret = [];

      let promises = list.map( item => {
        if ( item.songid && item.albummid ) {
          return createSong( item )
        }
      });

      // for ( let promise of promises ) {
      //   ret.push( await promise );
      // }

      // or
      ret = await Promise.all( promises );

      // createSong 若是并发执行 ret 的值将变的不可控
      /**
        list.forEach( async (item) => {
          if ( item.songid && item.albummid ) {
            let newSong = await createSong( item );
            ret.push( newSong );
            console.log( ret );
          }
        });
       */

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
        return item.name;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },

    selectItem( item ) {
      if ( item.type === TYPE_SINGER ) {
        let singer = new Singer({
          id: item.mid,
          name: item.name
        })
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger( singer );
      } else {
        this.insertSong( item );
      }
      this.$emit( 'select' );
    },

    onListScroll() {
      this.$emit( 'listScroll' );
    },

    refresh() {
      this.$refs.suggest.refresh();
    }
  },

  watch: {
    query( newQuery ) {

      // 新的搜索关键字为空
      if ( newQuery.trim() === '' ) {
        return;
      }
      this._getSearchResult( newQuery, this.pageNum, this.showSinger, perpage );
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
          color: $color-theme-black
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-theme-black
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

