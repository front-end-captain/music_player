<template>
  <transition name="slider">
    <music-list :title="title" :bgImg="bgImage" :songs="songs" :rank="isRank"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from 'components/music-list/music-list.vue'
import { getRankList } from 'api/rank.js'
import { createSong } from 'api/song.js'

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

      // 某一个排行榜下的歌曲列表
      songs: [],

      // 是否对排名前三的歌曲进行高亮显示
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

    // 获取某一个排行榜下的歌曲列表
    async _getSongList() {
      if ( !this.rankList.id ) {
        this.$router.push({
          path: '/rank'
        });
        return;
      }
      let res = await getRankList( this.rankList.id );

      if ( res.code === 0 ) {
        this.songs = await this._normalizeSonglist( res.songlist );
      }
    },

    // 格式化歌曲详情数据 剔除一些无用数据
    async _normalizeSonglist( list ) {
      let ret = [];

      let promises = list.map( item => {
        let { data } = item;
        if ( data.songid && data.albummid ) {
          return createSong( data );
        }
      });

      ret = await Promise.all( promises );
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

