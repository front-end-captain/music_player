import * as types from './mutation-types.js';


const mutations = {
  [types.SET_SINGER]( state, singer ) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE]( state, flag ) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN]( state, flag ) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST]( state, list ) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST]( state, list ) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE]( state, mode ) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX]( state, index ) {
    state.currentIndex = index
  },
  [types.SET_DISC]( state, disc ) {
    state.disc = disc
  },
  [types.SET_RANKLIST]( state, ranklist ) {
    state.rankList = ranklist;
  },
  [types.SET_SEARCH_HISTORY]( state, searchHistory ) {
    state.searchHistory = searchHistory;
  },
  [types.SET_PLAYHISTORY]( state, playHistory ) {
    state.playHistory = playHistory;
  },
  [types.SET_FAVORITELIST]( state, list ) {
    state.favoriteList = list
  }

}

export default mutations;
