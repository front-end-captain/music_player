/**
 * @description 当前播放歌曲的歌手信息
 */
export const getSinger = state => state.singer;


/**
 * @description 当前歌曲播放状态 true 表示正在播放；false 表示暂停播放；初始为 false
 */
export const playing = state => state.playing;


/**
 * @description 播放器的显示状态；true 表示全屏显示；false 表示迷你显示；初始为 false
 */
export const fullScreen = state => state.fullScreen;


/**
 * @description 当前播放列表，30首歌曲
 * 当播放模式为随机，此列表为乱序
 * 其他播放模式下，此列表数据与 sequenceList 中数据相同
 */
export const playList = state => state.playList;


/**
 * @description 当前播放列表的有序播放列表版本，同为30首歌曲
 */
export const sequenceList = state => state.sequenceList;


/**
 * @description 列表播放模式
 * sequence: 0 表示有序播放
 * loop: 1 表示单曲循环播放
 * random: 2 表示随机播放
 */
export const mode = state => state.mode;


/**
 * @description 当前播放的歌曲在播放列表中的索引
 */
export const currentIndex = state => state.currentIndex;


/**
 * @description 当前播放的歌曲（在播放列表中正在播放的歌曲）
 */
export const currentSong = state => {
  return state.playList[state.currentIndex] || {}
}


/**
 * @description 返回歌单列表数据
 */
export const disc = state => state.disc;


/**
 * @description 返回某一个排行榜的列表数据
 */
export const rankList = state => state.rankList;


/**
 * @description 返回用户搜索历史记录
 */
export const searchHistory = state => state.searchHistory;
