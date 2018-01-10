<template>
  <div class="search">

    <!-- 搜索框 开始 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 搜索框 结束 -->

    <div class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut">
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
          <!-- 搜索历史记录列表 结束 -->

        </div>
      </scroll>
    </div>

    <!-- 搜索结果列表 开始 -->
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
    <!-- 搜索结果列表 结束 -->
  </div>
</template>

<script>

import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll.vue'
import Suggest from 'components/suggest/suggest.vue'
import { getHotKey } from 'api/search.js';


export default {
  name: 'scarch',

  data() {
    return {
      hotKey: [],          // 热门搜索关键字列表
      query: ''            // 用户搜索关键字
    }
  },

  components: {
    SearchBox,
    Scroll,
    Suggest
  },

  created() {
    this._getHotKey();
  },

  methods: {

    // 获取热门搜索关键词
    _getHotKey() {
      getHotKey().then( res => {
        if ( res.code === 0 ) {
          this.hotKey = res.data.hotkey.splice( 0 ,10 );
        }
      })
    },

    addQuery( newQuery ) {
      this.$refs.searchBox.setQuery( newQuery );
    },

    onQueryChange( newQuery ) {
      this.query = newQuery;
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
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
            .hot
              color: red
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
