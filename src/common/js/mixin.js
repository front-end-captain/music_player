import { mapGetters } from 'vuex'


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
