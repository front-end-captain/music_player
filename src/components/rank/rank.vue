<template>
 <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li class="item" @click="selectItem( item )" v-for="(item, i) in topList" :key="i">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <h4 class="top-title">{{ item.topTitle }}</h4>
            <li class="song" v-for="(song, j) in item.songList">
              <span>{{ j + 1 }}</span>
              <span>{{ song.songname }} - {{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length > 0">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>

import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import { getTopList } from 'api/rank.js'
import { mapMutations } from 'vuex'

export default {
  name: 'rank',

  data() {
    return {
      topList: []
    }
  },

  created() {
    this._getTopList();
  },

  methods: {

    // 跳转值排行榜详情页
    selectItem( item ) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setRankList( item );
    },

    // 获取排行榜数据
    _getTopList() {
      getTopList()
      .then( res => {
        if ( res.code === 0 ) {
          this.topList = res.data.topList.filter( item => item.topTitle !== '巅峰榜·MV' );
        }
      })
    },

    ...mapMutations({
      setRankList: 'SET_RANKLIST'
    })
  },

  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .top-title
            color: $color-text
            line-height: 20px
          .song
            no-wrap()
            line-height: 20px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

