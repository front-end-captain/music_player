<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li v-for="(group, i) in data" class="list-group" :key="i" ref="listgroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="(item, j) in group.items" :key="j" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent>
      <ul>
        <li class="item" v-for="(item, i) in shortcutList" :key="i" :data-index='i'>
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue'

// 每一个锚点的高度
const ANVHOR_HEIGHT = 22;

export default {
  name: 'listview',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    shortcutList() {
      return this.data.map( ( group ) => {
        return group.title.substring(0, 1);
      })
    }
  },
  methods: {
    onShortcutTouchStart( event ) {
      let anchorIndex = parseInt(event.target.getAttribute( 'data-index' ));
      let firstTouch = event.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;

      this._scrollTo( anchorIndex );
    },
    onShortcutTouchMove( event ) {
      let firstTouch = event.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = parseInt( ((this.touch.y2 - this.touch.y1) / ANVHOR_HEIGHT).toFixed(0) );
      let anchorIndex = this.touch.anchorIndex + delta;

      this._scrollTo( anchorIndex )
    },
    _scrollTo( index ) {
      this.$refs.listview.scrollToElement( this.$refs.listgroup[index], 0)
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 5px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
