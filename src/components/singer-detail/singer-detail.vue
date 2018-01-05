<template>
  <transition name="slider">
    <div class="singer-detail">
      歌手详情
    </div>
  </transition>
</template>

<script>

import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'common/js/song.js'


export default {
  name: 'singerDetail',
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters({
      singer: 'getSinger'
    })
  },
  created() {
    console.log( this.singer );
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if ( !this.singer.id ) {
        this.$router.push({
          path: '/singer'
        });
        return;
      }
      getSingerDetail( this.singer.id ).then( response => {
        if ( response.code === ERR_OK ) {
          this.songs = this._normalizeSonglist( response.data.list );
          console.log( this.songs );
        }
      })
   },
    _normalizeSonglist( list ) {
      let ret = [];
      list.forEach(element => {
        let { musicData } = element;
        if ( musicData.songid && musicData.albummid ) {
          ret.push( createSong( musicData ) )
        }
      });
      return ret;
    }
  },


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

