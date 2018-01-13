<template>
  <transition name="slider">
    <music-list
      :title="title"
      :bgImg="bgImage"
      :songs="songs"
    ></music-list>
  </transition>
</template>


<script>

import MusicList from 'components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend.js'
import { createSong } from 'api/song.js'

export default {
  name: 'discList',
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters([
      'disc'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if ( !this.disc.dissid ) {
        this.$router.push( '/recommend' );
        return;
      }

      getSongList( this.disc.dissid )
      .then( res => {
        this.normalizeList( res.cdlist[0].songlist ).then( songs => this.songs = songs )
      })

    },
    async normalizeList( list ) {
      let ret = [];
      await list.forEach( musicData => {
        createSong( musicData ).then( song => {
          ret.push( song );
        })
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

</style>
