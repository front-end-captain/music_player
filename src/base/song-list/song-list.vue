<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" class="item" @click="selectItem(song, index)" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankClass(index)">{{ index + 1 }}</span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: []
    },

    // 是否对排名前三的歌曲进行特殊显示
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getRankClass( index ) {
      if (index <= 2) {
        return `rank-top`
      } else {
        return 'text'
      }
    },

    // 歌手-专辑
    getDesc(song) {
      return `${song.singer}-${song.album}`
    },
    selectItem( song, index ) {
      this.$emit( 'select', song, index );
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .rank-top
          color: red
          font-size: $font-size-large
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>


