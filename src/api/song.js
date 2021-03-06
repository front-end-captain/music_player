import jsonp from 'common/js/jsonp.js';
import { getLyric } from './lyric.js'
import { Base64 } from 'js-base64';

class Song {
  constructor ( { id, mid, singer, name, album, duration, img, url, invalidUrl } ) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.img = img;
    this.url = url;
    this.invalidUrl = invalidUrl;
  }

  /**
   * @description 创建歌词
   */
  createLyric() {
    if ( this.lyric ) {
      return Promise.resolve( this.lyric );
    }
    return new Promise( ( resolve, reject ) => {
      getLyric( this.mid ).then( res => {
        if ( res.retcode === 0 ) {
          this.lyric = Base64.decode( res.lyric );
          resolve( this.lyric );
        }
        reject( 'no lyric' );
      })
    })
  }
}


/**
 * @description 获取歌曲资源路径
 * @param {Number} songmid
 */
async function getSongUrl ( songmid ) {
  let url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  let songUrl = '';
  let res = null;
  let mock_guid = 6639759492;

  let query = {
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    cid: 205361747,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: mock_guid,
  };

  /**
   *    http://dl.stream.qqmusic.qq.com/C400003aAYrm3GE0Ac.m4a?
        vkey=VBFGBDNT...&
        guid=7059694423&
        uin=0&
        fromtag=66
   */
  // 这里 param 中的回调名为 callback 不是配置文件中 jsonpCallback
  // guid 存放在 cookie 中 字段名为 pgv_pvid, 并且这个 pgv_pvid 的值是随机的，每一次访问都会重新随机分配一个值
  // return jsonp( url, query, { param: 'callback' } ).then( res => {
  //   songUrl = `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${res.data.items[0].vkey}&guid=7059694423&uin=0&fromtag=66`
  //   return Promise.resolve( songUrl );
  // }).catch( e => console.log( e ))

  try {
    res = await jsonp( url, query, { param: 'callback' } );
  } catch ( e ) {
    return songUrl = ''
  }
  if ( res.code === 0 ) {
    songUrl = `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${res.data.items[0].vkey}&guid=${mock_guid}&uin=0&fromtag=66`;
    return songUrl;
  }
  return songUrl = '';
}

/**
 * @description 工厂方法 创建 Song 类的实例
 * @param {*} musicData
 */
async function createSong ( musicData ) {
  let songUrl = await getSongUrl( musicData.songmid );

  // duration: musicData.interval,
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger( musicData.singer ),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: songUrl,
    invalidUrl: songUrl
  })
}

/**
 * @description 处理歌曲的歌手信息 一首歌可能存在多个歌手
 * @param {Array} singer
 */
function filterSinger ( singer ) {
  let res = [];
  if ( !singer ) {
    return []
  }
  singer.forEach(element => {
    res.push( element.name )
  });
  return res.join( '/' )
}

export { createSong, Song }
