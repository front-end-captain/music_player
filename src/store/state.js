import { playmode } from 'common/js/config.js';
import { loadSearchHistory, loadPlayHistory, loadFavoriteEntries } from 'common/js/cache.js'

/**
 * singer 当前播放歌曲的歌手信息
 * playing 当前播放歌曲的播放状态 false表示暂停播放
 * fullScreen 播放器的显示状态 false 表示迷你显示
 * playList 当前播放列表，30首歌曲；当播放模式为随机，此列表为乱序；其他播放模式下，此列表数据与 sequenceList 中数据相同
 * sequenceList 当前顺序播放列表
 * mode 当前播放列表的播放模式
 * currentIndex 当前播放歌曲在播放列表中的索引
 * disc 存放歌单详细数据信息 比如歌单id,歌单名称，歌单作者，歌单图片地址等
 * rankList 存放某一个排行榜列表数据
 * searchHistory 存放用户搜索历史记录 初始值从 loaclStorage 中读取
 * playHistory 用户播放历史记录
 * favoriteList 用户收藏列表
 */
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playmode.sequence,
  currentIndex: -1,
  disc: {},
  rankList: [],
  searchHistory: loadSearchHistory(),
  playHistory: loadPlayHistory(),
  favoriteList: loadFavoriteEntries()
}

export default state;

