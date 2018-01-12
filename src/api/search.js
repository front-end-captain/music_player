import jsonp from 'common/js/jsonp.js';
import { commonConfig, options } from './config.js';

/**
 * @description 获取热门搜索关键词
 */
const getHotKey = () => {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  let query = Object.assign( {}, commonConfig, {
    uin: 0,
    needNewCode: 1,
    _: 1515582467090
  });

  return jsonp( url, query, options );
}

/**
 *
 * @param {String} keyword 搜索关键词
 * @param {Number} pageNum 当前搜索结果的第几页
 * @param {Boolean} hasZhiDa 搜索结果是否有 ‘zhida’ 字段 表示该条搜索结果直达歌手详情页
 * @param {Number} perpage 每一页要显示的搜索结果条数
 */
const getSearchResult = ( keyword, pageNum, hasZhiDa, perpage ) => {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  let query = {
    g_tk: 5381,
    uin: 0,
    needNewCode: 1,
    w: keyword,
    zhidaqu: 1,
    catZhida: hasZhiDa ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: pageNum,
    remoteplace: 'txt.mqq.all',
    _: 1515593122083
  };

  return jsonp( url, query, options );
}

export { getHotKey, getSearchResult }
