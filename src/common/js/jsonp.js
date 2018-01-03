import originJSONP from 'jsonp'

/**
 * @description: 将查询参数拼接到 URL 中
 * @param {Object} data 查询参数
 * @returns {String} url 一个拼好的 URL
 */
function param ( data ) {
  let url = '';
  for ( var k in data ) {
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}}`
  }

  // 将 URL 中的第一个 & 去掉
  url = url ? url.substring(1) : '';
  return url;
}

/**
 * @description: 使用 Promise 二次封装 jsonp(https://github.com/webmodules/jsonp)
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 */
function jsonp ( url, data, options ) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  return new Promise( ( resolve, reject ) => {
    originJSONP( url, options, ( error, data ) => {
      if ( !error ) {
        resolve( data )
      }
      reject( error )
    })
  })
}

export default jsonp
