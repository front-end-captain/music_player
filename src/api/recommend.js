import jsonp from 'common/js/jsonp.js'
import { commonConfig, options } from 'api/config.js'

function getRecommendData () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign( {}, commonConfig, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp( url, data, options );
}

export default getRecommendData;
