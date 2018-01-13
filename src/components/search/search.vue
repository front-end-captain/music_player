<template>
  <div class="search">

    <!-- 搜索框 开始 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 搜索框 结束 -->

    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <!-- Scroll 组件只能包裹一个子元素 -->
      <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>

          <!-- 热门搜索标签列表 开始 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                <span :class="{'hot': index === 0}">{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- 热门搜索标签列表 结束 -->

          <!-- 搜索历史记录列表 开始 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchEntry" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
          <!-- 搜索历史记录列表 结束 -->

        </div>
      </scroll>
    </div>

    <!-- 搜索结果列表 开始 -->
    <div class="search-result" v-show="query" ref="searchResultWrapper">
      <suggest :query="query" @listScoll="listScroll" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <!-- 搜索结果列表 结束 -->

    <confirm ref="confirm" text="是否清空搜索历史记录" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>

import SearchBox from 'base/search-box/search-box.vue'
import Scroll from 'base/scroll/scroll.vue'
import Suggest from 'components/suggest/suggest.vue'
import SearchList from 'base/search-list/search-list.vue'
import Confirm from 'base/confirm/confirm.vue'
import { mapActions } from 'vuex'
import { getHotKey } from 'api/search.js'
import { playListMixin, searchMixin } from 'common/js/mixin'


export default {
  name: 'scarch',

  mixins: [playListMixin, searchMixin],

  data() {
    return {

      // 热门搜索关键字列表
      hotKey: []
    }
  },

  components: {
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  },

  created() {
    this._getHotKey();
  },

  computed: {

    shortcut() {
      return this.hotKey.concat( this.searchHistory );
    }
  },

  methods: {
    ...mapActions({
      clearSearchHistory: 'clearSearchHistory'
    }),

    handlePlayList( playList ) {
      if ( !playList.length ) {
        return;
      }

      let bottom = playList.length > 0 ? '60px' : 0;

      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();

      this.$refs.searchResultWrapper.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },

    // 获取热门搜索关键词
    async _getHotKey() {
      let res = await getHotKey();
      if ( res.code === 0 ) {
        this.hotKey = res.data.hotkey.splice( 0 ,10 );
      }
    },

    showConfirm() {
      this.$refs.confirm.show();
    },

    deleteSearchEntry( item ) {
      this.deleteSearchHistory( item );
    },


  },

  watch: {
    query( newQuery ) {
      if ( !newQuery ) {
        setTimeout( () => {
          this.$refs.shortcut.refresh();
        }, 20)
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-theme-black
          .item
            display: inline-block
            padding: 10px 12px
            margin: 0 20px 10px 0
            border-radius: 22px
            font-size: $font-size-medium
            color: $color-theme-black
            border 1px solid #cccccc
            .hot
              font-size: $font-size-medium-x
              color: $color-background-aqua
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-gray
            border-bottom: 1px solid #5a5a5a
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-theme-black
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
