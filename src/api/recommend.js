import jsonp from 'common/js/jsonp.js'
import { commonConfig, options } from 'api/config.js'
import axios from 'axios'

/**
 * @description 获取首页推荐数据
 * 包括轮播图图片数据，电台列表，推荐歌单列表
 * 在后面只使用 轮播图图片数据
 */
const getRecommendData = () => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign( {}, commonConfig, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp( url, data, options );
}

/**
 * @description 获取歌单列表
 */
const getDiscList = () => {
  const url = 'api/getDiscList';

  const query = Object.assign( {}, commonConfig, {
    picmid: 1,
    rnd: 0.2731582205656147,
    g_tk: 5381,
    jsonpCallback: 'getPlaylist',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  });

  return axios.get( url, { params: query } ).then( ( res ) => {
    return Promise.resolve( res.data )
  })
}

/**
 * @description 获取歌单列表详情数据
 * @param {Number} disstid 歌单 id
 */
const getSongList = ( disstid ) => {
  let url = 'api/getSongList';
  const query = Object.assign({}, commonConfig, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  });

  return axios.get( url, { params: query } ).then( ( res ) => {
    return Promise.resolve( res.data )
  })
}

export { getRecommendData, getDiscList, getSongList }
