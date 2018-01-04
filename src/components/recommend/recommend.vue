<template>
  <div class="recommend">
    <scroll class="recommend-content" ref="scroll" :data="disclist">
      <div>
        <div v-if="sliders.length > 0" class="slider-wrapper">
          <slider v-bind:swiperSliders="sliders" v-bind:loadImg="this._loadImg"></slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in disclist" :key="index">
              <div class="icon">
                <img width="60" height="60" :src="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommendData, getDiscList } from "api/recommend.js";
import { ERR_OK } from "api/config.js";
import Slider from "base/slider/slider.vue";
import Scroll from 'base/scroll/scroll.vue'

export default {
  name: "recommend",
  data() {
    return {
      // 轮播图数据 length = 5
      // {
      //  id: 13680
      //  linkUrl: "http://y.qq.com/w/album.html?albummid=004HhaNX4FCTJT"
      //  picUrl: "http://y.gtimg.cn/music/photo_new/T003R720x288M000001o5FzB1wx40X.jpg"
      // }
      // ....
      sliders: [],
      // 歌单数据
      disclist: []
    };
  },
  components: {
    Slider,
    Scroll
  },
  created() {
    this._getRecommendData();
    this._getDiscList();
  },
  methods: {
    _getRecommendData() {
      getRecommendData().then(response => {
        if (response.code === ERR_OK) {
          this.sliders = response.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(response => {
        if (response.code === ERR_OK) {
          this.disclist = response.data.list;
        }
      });
    },
    _loadImg ( event ) {
      if ( !this.checkLoad ) {
        this.checkLoad = true;
        this.$refs.scroll.refresh();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
