<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, i) in switches"
      :class="{'active': currentIndex == i }"
      @click="switchItem(i)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>


<script>
export default {
  name: 'switches',

  props: {
    switches: {
      type: Array,
      default: []
    },

    currentIndex: {
      type: Number,
      default: 0
    }
  },

  methods: {
    switchItem( index ) {
      this.$emit( 'switch', index );
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-theme-white
      &:first-child
        border-radius 5px 0 0 5px
      &:last-child
        border-radius 0 5px 5px 0
      &.active
        background: $color-background-aqua
        color: $color-text
</style>


