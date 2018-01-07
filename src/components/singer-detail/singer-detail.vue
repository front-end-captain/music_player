<template>
  <transition name="slider">
    <music-list
      :songs="songs"
      :title="title"
      :bgImg="bgImg"
    ></music-list>
  </transition>
</template>

<script>

import MusicList from 'components/music-list/music-list.vue'
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
        }
      })
   },
    _normalizeSonglist( list ) {
      let ret = [];
      list.forEach( item => {
        let { musicData } = item;

        if ( musicData.songid && musicData.albummid ) {
          createSong( musicData ).then( newSong => {
            ret.push( newSong )
          })
        }
      });
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

