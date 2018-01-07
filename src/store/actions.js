import * as types from './mutation-types.js'

export const selectPlay = ( { commit, state }, { list, index } ) => {
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
