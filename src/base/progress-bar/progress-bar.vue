<template>
  <div class="progress-bar" ref="progressBar" @click="changeCurrentPosition">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
        >
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>

const btnWidth = 16;

export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart( event ) {
      this.touch.init = true;
      this.touch.startX = event.touches[0].pageX;

      // 当前已经播放长度
      this.touch.left = this.$refs.progress.clientWidth;
    },

    progressTouchMove( event ) {
      if ( !this.touch.init ) {
        return;
      }
      const progressBarWidth = this.$refs.progressBar.clientWidth - btnWidth;
      let deltaX = event.touches[0].pageX - this.touch.startX;
      let offsetWidth = Math.min( progressBarWidth, Math.max( 0, this.touch.left + deltaX ) );

      this._offset( offsetWidth );
    },

    progressTouchEnd( event ) {
      this.touch.init = false;
      this.tirggerPercentChange()
    },

    changeCurrentPosition( event ) {
      let offsetLeft = this.$refs.progressBar.getBoundingClientRect().left;
      let offsetWidth = event.pageX - offsetLeft;

      this._offset( offsetWidth );
      this.tirggerPercentChange();
    },

    _offset( offset ) {
      this.$refs.progress.style.width = offset + 'px'
      this.$refs.progressBtn.style.transform = `translateX(${offset}px)`
    },
    tirggerPercentChange() {
      const progressBarWidth = this.$refs.progressBar.clientWidth - btnWidth;
      let percent = this.$refs.progress.clientWidth / progressBarWidth;
      this.$emit( 'percent', percent );
    }

  },
  watch: {
    percent( newPercent ) {
      if ( newPercent > 0 && !this.touch.init ) {
        const progressBarWidth = this.$refs.progressBar.clientWidth - btnWidth;
        let offsetWidth = newPercent * progressBarWidth;

        this._offset( offsetWidth )
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-background-aqua
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-background-aqua
</style>


