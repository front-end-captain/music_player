<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    :probeType="probeType"
    :listenScroll="isListenScrollEvent"
    @scroll="scroll">

    <!-- 歌手分组列表 -->
    <ul>
      <li v-for="(group, i) in data" class="list-group" :key="i" ref="listgroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <!-- 某一组歌手列表 -->
          <li v-for="(item, j) in group.items" :key="j" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 右侧快速入口 -->
    <div class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent>
      <ul>
        <li
          class="item"
          v-for="(item, i) in shortcutList"
          :key="i"
          :class="{'current': currentIndex === i}"
          :data-index='i'>
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 固定的分组标题 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }} </div>
    </div>

    <!-- loading -->
    <div class="loading-container" v-show="!data.length > 0">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'

// 右侧快速入口的每一个锚点的高度 22px
const ANVHOR_HEIGHT = 22;

// 分组标题高度 30px
const TITLE_HEIGHT = 30;

export default {
  name: 'listview',

  props: {

    // data 字段保存所有歌手数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      scrollY: -1,         // 滚动区域向上滚去的距离 向上滚动时值为负值，向下滚动时值为正值
      currentIndex: 0,     // 当前分组的索引
      diff: -1             // 分组标题距离顶部的高度和滚动区域被卷去的高度只差（在下面的代码中会是之和 因为被卷区的高度为负值）
    }
  },

  created() {
    this.touch = {}                     // 保存右侧快速入口 touch 事件的坐标信息
    this.isListenScrollEvent = true     // 是否监听滚动区域的滚动事件
    this.listGroupsHeight = []          // 保存各个分组的高度
    this.probeType = 3                  // 实时派发 scroll 事件
  },

  computed: {
    shortcutList() {
      return this.data.map( ( group ) => {
        return group.title.substring(0, 1);
      })
    },

    fixedTitle() {
      if ( this.scrollY > 0 ) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },

  methods: {
    /**
     * @description touchstart 事件监听程序
     */
    onShortcutTouchStart( event ) {
      let anchorIndex = parseInt(event.target.getAttribute( 'data-index' ));
      let firstTouch = event.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;

      this._scrollTo( anchorIndex );
    },

    /**
     * @description touchmove 事件监听程序
     */
    onShortcutTouchMove( event ) {
      let firstTouch = event.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = parseInt( ((this.touch.y2 - this.touch.y1) / ANVHOR_HEIGHT).toFixed(0) );
      let anchorIndex = this.touch.anchorIndex + delta;

      this._scrollTo( anchorIndex )
    },

    /**
     * @description 滚动到某一个分组所在的位置
     *
     */
    _scrollTo( index ) {
      if ( !index && index !== 0 ) {
        return;
      }
      if ( index < 0 ) {
        index = 0
      }
      if ( index > this.listGroupsHeight.length - 2 ) {
        index = this.listGroupsHeight - 2
      }
      this.scrollY = -this.listGroupsHeight[index]
      this.$refs.listview.scrollToElement( this.$refs.listgroup[index], 0)
    },

    /**
     * @description scroll 事件监听程序
     */
    scroll( position ) {
      this.scrollY = position.y;
    },

    /**
     * @description 计算所有分组的各个高度 这里的某一组的高度是累加的
     */
    _calculteHeight() {
      this.listGroupsHeight = []
      const list = this.$refs.listgroup

      // firstgroup height
      let height = 0
      this.listGroupsHeight.push( height );
      for ( let i = 0; i < list.length; i++ ) {
        let item = list[i]
        height += item.clientHeight
        this.listGroupsHeight.push( height )
      }
    }
  },

  watch: {
    data() {
      setTimeout(() => {
        this._calculteHeight()
      }, 20)
    },

    scrollY( newScrollY ) {

      const listGroupsHeight = this.listGroupsHeight

      // 滚动到顶部
      if ( newScrollY > 0 ) {
        this.currentIndex = 0;
        return;
      }

      // 中间部分滚动
      for( let j = 0; j < listGroupsHeight.length - 1; j++ ) {

        // 某一个分组列表的高度上限 和 高度下限
        let heightCeil  = listGroupsHeight[j]
        let heightFloor = listGroupsHeight[j + 1]
        console.log( heightCeil, heightFloor, newScrollY );
        if ( -newScrollY >= heightCeil && -newScrollY < heightFloor ) {
          this.currentIndex = j
          this.diff = heightFloor + newScrollY
          return
        }
      }

      // 滚动到底部
      this.currentIndex = listGroupsHeight.length - 2;
    },

    diff( newVal ) {
      let fixedTop = ( newVal > 0 && newVal < TITLE_HEIGHT ) ? newVal - TITLE_HEIGHT : 0;
      if ( this.fixedTop === fixedTop ) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translateY( ${fixedTop}px )`;
    }
  },

  components: {
    Scroll,
    Loading
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
