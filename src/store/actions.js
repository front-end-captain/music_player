import * as types from './mutation-types.js'
import { playmode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'

/**
 * @description 选择即播放
 * @param list 当前播放列表
 * @param index 当前播放歌曲在播放列表中的索引
 */
export const selectPlay = ( { commit, state }, { list, index } ) => {
  commit( types.SET_CURRENTINDEX, index )
  commit( types.SET_SEQUENCELIST, list )
  commit( types.SET_PLAYLIST, list )
  commit( types.SET_FULLSCREEN, true )
  commit( types.SET_PLAYING_STATE, true )
}


export const randomPlay = ( {commit }, { list } ) => {
  commit( types.SET_PLAY_MODE, playmode.random );
  commit( types.SET_SEQUENCELIST, list );

  let randomList = shuffle( list );

  commit( types.SET_PLAYLIST, randomList );
  commit( types.SET_CURRENTINDEX, 0 )
  commit( types.SET_FULLSCREEN, true )
  commit( types.SET_PLAYING_STATE, true )
}
