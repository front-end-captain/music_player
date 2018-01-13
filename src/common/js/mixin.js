import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playmode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'


export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },

  mounted() {
    this.handlePlayList( this.playList );
  },

  activated() {
    this.handlePlayList( this.playList );
  },

  watch: {
    playList( newPlayList ) {
      this.handlePlayList( newPlayList );
    }
  },

  methods: {
    handlePlayList() {
      throw new Error( 'Component must implement handlePlayList method!' );
    }
  }
}


export const playerMixin = {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteList'
    ]),

    iconMode () {
      return this.mode === playmode.sequence
        ? 'icon-sequence'
        : this.mode === playmode.loop
          ? 'icon-loop'
          : 'icon-random';
    },
  },

  methods: {

    ...mapMutations({
      shiftFullScreen: 'SET_FULLSCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),

    ...mapActions({
      saveFavorite: 'saveFavorite',
      deleteFavorite: 'deleteFavorite'
    }),


    // 改变播放模式 随机 / 循环 / 顺序
    changeMode() {
      let currentMode = (this.mode + 1) % 3;
      this.setPlayMode( currentMode );
      let list = null;
      if ( this.playmode === playmode.random ) {
        list = shuffle( this.sequenceList );
      } else {
        list = this.sequenceList;
      }

      this._resetCurrentIndex( list )
      this.setPlayList( list );
    },

    _resetCurrentIndex( list ) {
      let index = list.findIndex( ( item ) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex( index );
    },

    getFavoriteIcon( song ) {
      if ( this.isFavoriteSong( song ) ) {
        return 'icon-favorite';
      } else {
        return 'icon-not-favorite';
      }
    },

    toggleFavoriteIcon( song ) {
      if ( this.isFavoriteSong( song ) ) {
        this.deleteFavorite( song );
      } else {
        this.saveFavorite( song );
      }
    },

    isFavoriteSong( song ) {
      let index = this.favoriteList.findIndex( ( item ) => {
        return item.id === song.id;
      });
      return index > -1;
    }
  }
}


export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
  },


  methods: {

    ...mapActions({
      saveSearchHistory: 'saveSearchHistory',
      deleteSearchHistory: 'deleteSearchHistory',
    }),

    saveSearch() {
      this.saveSearchHistory( this.query );
    },

    listScroll() {
      console.log( this.$refs );
      this.$refs.searchBox.blur();
    },

    onQueryChange( newQuery ) {
      this.query = newQuery;
    },

    addQuery( newQuery ) {
      this.$refs.searchBox.setQuery( newQuery );
    },
  }
}
