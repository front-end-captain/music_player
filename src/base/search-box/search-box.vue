<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>

import { debounce } from 'common/js/utils.js'

export default {
  name: 'search-box',

  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },

  data() {
    return {
      query: ''
    }
  },

  methods: {
    setQuery( newQuery ) {
      this.query = newQuery;
    },

    clear() {
      this.query = '';
    }
  },

  //
  created() {
    this.$watch( 'query', debounce( ( newQuery ) => {
      this.$emit( 'query', newQuery );
    }, 200));
  }

}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 46px
    background: $color-background-aqua
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 36px
      background: $color-background-aqua
      color: $color-text
      font-size: $font-size-medium-x
      text-indent: $font-size-medium
      border none
      outline none
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 26px
      color: $color-background
</style>

