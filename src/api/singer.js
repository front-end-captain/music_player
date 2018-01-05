import jsonp from 'common/js/jsonp.js';
import { commonConfig, options } from './config.js';

const getSingerList = () => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const query = Object.assign({}, commonConfig, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, query, options)
}

const getSingerDetail = ( singerId ) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const query = Object.assign({}, commonConfig, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, query, options)
}

export { getSingerList, getSingerDetail }
