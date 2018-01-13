<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Music Player</div>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'm-header'
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme-white
    font-size: 0
    background-color: $color-background-aqua
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      border-radius 100%
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>

