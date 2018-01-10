import jsonp from 'common/js/jsonp.js';
import { commonConfig, options } from './config.js';


const getHotKey = () => {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  let query = Object.assign( {}, commonConfig, {
    uin: 0,
    needNewCode: 1,
    _: 1515582467090
  });

  return jsonp( url, query, options );
}

const getSearchResult = ( keyword, pageNum, hasZhiDa ) => {
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
    perpage: 20,
    n: 20,
    p: pageNum,
    remoteplace: 'txt.mqq.all',
    _: 1515593122083
  };

  return jsonp( url, query, options );
}

export { getHotKey, getSearchResult }
