import { commonConfig } from './config'
import axios from 'axios'

/**
 * @description 获取当前播放歌曲的歌词
 * @param {Number} mid
 */
async function getLyric( mid ) {

  const url = '/api/getLyric'

  const query = Object.assign({}, commonConfig, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  let res = await axios.get( url, { params: query } );
  return res.data;
}

export { getLyric }
