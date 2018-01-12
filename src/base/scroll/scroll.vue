<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BetterScroll from "better-scroll";
export default {
  name: "scroll",
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    // 上拉加载更多
    pullup: {
      type: Boolean,
      default: false
    },
    // 监听 beforeScrollStart 事件
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },

    // 是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    }

  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });

      // 监听 scroll 事件，获取滚动的位置
      if (this.listenScroll) {
        let _that = this;
        this.scroll.on("scroll", pos => {
          _that.$emit("scroll", pos);
        });
      }

      // 需要上拉加载更多
      if (this.pullup) {
        this.scroll.on( 'scrollEnd', () => {
          if ( this.scroll.y <= this.scroll.maxScrollY + 50 ) {
            this.$emit( 'scrollToEnd' );
          }
        });
      }

      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    // 滚动到指定位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    // 滚动到某一个元素的位置
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>

