import jsonp from 'common/js/jsonp.js';
import { commonConfig, options } from './config.js';

/**
 * @description 获取排行榜列表数据
 */
const getTopList = () => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  let query = Object.assign({}, commonConfig, {
    uin: 0,
    needNewCode: 1,
    format: 'jsonp',
    _: 1515567995808
  });

  return jsonp(url, query, options)
}


const getRankList = ( topId ) => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  let query = Object.assign({}, commonConfig, {
    uin: 0,
    needNewCode: 1,
    format: 'json',
    _: 1515567995808,
    topid: topId,
    type: 'top',
    page: 'detail',
    tpl: 3
  });

  return jsonp(url, query, options)
}

export { getTopList, getRankList }
