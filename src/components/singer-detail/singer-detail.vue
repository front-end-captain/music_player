<template>
  <transition name="slider">
    <music-list
      :songs="songs"
      :title="title"
      :bgImg="bgImg"
      :loadFailed="loadFailed"
    ></music-list>
  </transition>
</template>

<script>

import MusicList from 'components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'api/song.js'


export default {
  name: 'singerDetail',

  data() {
    return {
      songs: [],
      loadFailed: false
    }
  },

  computed: {
    title() {
      return this.singer.name
    },
    bgImg() {
      return this.singer.avatar
    },
    ...mapGetters({
      singer: 'getSinger'
    })
  },

  created() {
    this._getSingerDetail();
  },

  methods: {

    // 获取歌手详情 若是 id 不存在 则跳转至歌手列表页
    async _getSingerDetail() {
      if ( !this.singer.id ) {
        this.$router.push({
          path: '/singer'
        });
        return;
      }

      let response = null;

      try {
        response = await getSingerDetail( this.singer.id );
      } catch ( e ) {
        this.loadFailed = true;
        return;
      }

      if ( response.code === ERR_OK ) {
        try {
          let ret = await this._normalizeSonglist( response.data.list );
          this.songs = ret;
        } catch ( e ) {
          this.loadFailed = true;
        }
      }
    },

    // 格式化歌曲详情数据 剔除一些无用数据
    async _normalizeSonglist( list ) {
      let ret = [];

      let promises = list.map( item => {
        let { musicData } = item;
        if ( musicData.songid && musicData.albummid ) {
          return createSong( musicData );
        }
      });

      ret = await Promise.all( promises );
      return ret;
    }
  },

  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background-color $color-background

  .slider-enter-active, .slider-leave-active
    transition all 0.3s
  .slider-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)
</style>

