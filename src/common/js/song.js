class Song {
  /**
   *
   * @param {id} id 歌曲 id
   */
  constructor ( { id, mid, singer, name, album, duration, img, url } ) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.img = img;
    this.url = url;
  }
}

function createSong ( musicData ) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger( musicData.singer ),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=66`
  })
}

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

export { createSong }
