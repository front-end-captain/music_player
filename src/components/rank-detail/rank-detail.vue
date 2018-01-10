<template>
  <transition name="slider">
    <music-list :title="title" :bgImg="bgImage" :songs="songs" :rank="isRank"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from 'components/music-list/music-list.vue'
import { getRankList } from 'api/rank.js'
import { createSong } from 'common/js/song.js'

export default {
  name: 'rank-detail',

  components: {
    MusicList
  },

  created() {
    this._getSongList();
  },

  data() {
    return {
      songs: [],
      isRank: true
    }
  },

  computed: {
    title() {
      return this.rankList.topTitle
    },

    bgImage() {
      return this.rankList.picUrl;
    },
    ...mapGetters([
      'rankList'
    ])
  },

  methods: {
    _getSongList() {
      if ( !this.rankList.id ) {
        this.$router.push({
          path: '/rank'
        });
        return;
      }
      getRankList( this.rankList.id )
      .then( res => {
        console.log( res );
        if ( res.code === 0 ) {
          this._normalizeSonglist( res.songlist ).then( ret => {
            this.songs = ret;
          });
        }
      })
    },

    // 格式化歌手详情数据 剔除一些无用数据
    async _normalizeSonglist( list ) {
      let ret = [];
      await list.forEach( item => {
        let { data } = item;

        if ( data.songid && data.albummid ) {
          createSong( data ).then( newSong => {
            ret.push( newSong )
          })
        }
      });
      return ret;
    }

  }


}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

