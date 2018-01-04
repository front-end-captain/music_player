<template>
  <div class="loading">
    <img src="./loading.gif" width="50" height="50">
    <p class="loading-desc">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在加载中...'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .loading
    width 100%
    text-align center
    .loading-desc
      line-height 20px
      font-size $font-size-small
      color $color-text-l
</style>

