import * as types from './mutation-types.js'
import { playmode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'
import { saveSearchEntry, deleteSearchEntry, clearSearchEntries } from 'common/js/cache.js'


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


/**
 * @description 随机播放
 */
export const randomPlay = ( {commit }, { list } ) => {
  commit( types.SET_PLAY_MODE, playmode.random );
  commit( types.SET_SEQUENCELIST, list );

  let randomList = shuffle( list );

  commit( types.SET_PLAYLIST, randomList );
  commit( types.SET_CURRENTINDEX, 0 )
  commit( types.SET_FULLSCREEN, true )
  commit( types.SET_PLAYING_STATE, true )
}


/**
 * @description 在当前播放列表中插入歌曲
 */
export const insertSong = ( { commit, state }, song ) => {

  // 应该创建一个新的数组来保存播放列表 而不是简单的引用赋值（这样 vuex 会报错）
  let playlist = Array.from( state.playList )
  let sequencelist = Array.from( state.sequenceList );
  let currentIndex = state.currentIndex;

  // 记录当前播放歌曲
  let currentSong = playlist[currentIndex];

  // 在插入之前 先检查当前播放列表中是否已经插入的传入的歌曲 song
  let playindex = playlist.findIndex( item => item.id === song.id );

  currentIndex ++;

  // 插入
  playlist.splice( currentIndex, 0, song );

  // 播放列表中存在带插入的歌曲
  if ( playindex > -1 ) {
    if ( currentIndex > playindex ) {
      playlist.splice( playindex, 1 );
      currentIndex --;
    } else {
      playlist.splice( playindex + 1, 1 );
    }
  }

  let currentSequenceIndex = sequencelist.findIndex( item => item.id === currentSong.id );

  let squenceIndex = sequencelist.findIndex( item => item.id === song.id );

  currentSequenceIndex ++;

  sequencelist.splice( currentSequenceIndex, 0, song );

  if ( squenceIndex > -1 ) {
    if ( currentSequenceIndex > squenceIndex ) {
      sequencelist.splice( squenceIndex, 1 );
      currentSequenceIndex --;
    } else {
      sequencelist.splice( squenceIndex + 1, 1 );
    }
  }


  commit( types.SET_PLAYLIST, playlist );
  commit( types.SET_SEQUENCELIST, sequencelist );
  commit( types.SET_CURRENTINDEX, currentIndex );
  commit( types.SET_FULLSCREEN, true )
  commit( types.SET_PLAYING_STATE, true )
}


/**
 * @description 保存搜索条目到搜索历史记录
 */
export const saveSearchHistory = ( {commit}, query ) => {
  commit( types.SET_SEARCH_HISTORY, saveSearchEntry( query ) );
}


/**
 * @description 删除指定搜索条目从搜索历史记录
 */
export const deleteSearchHistory = ( {commit}, query ) => {
  commit( types.SET_SEARCH_HISTORY,  deleteSearchEntry( query ) )
}


/**
 * @description 清空搜索历史记录
 */
export const clearSearchHistory = ( { commit } ) => {
  commit( types.SET_SEARCH_HISTORY, clearSearchEntries() );
}
