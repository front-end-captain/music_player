const express = require( 'express' );
const config = require( './config' );

const axios = require( 'axios' );

const PORT = process.env.PORT || config.build.port;

const app = express();


app.use( function ( request, _, next ) {
	console.log( "The request type is " + request.method + "; request url is " + request.originalUrl );
	next();
});

const ApiRouter = express.Router();

// 获取首页推荐数据
ApiRouter.use( '/getDiscList', ( request, response ) => {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get( url,{
    headers: {
      Referer: 'https://y.qq.com/portal/playlist.html'
    },
    params: request.query
  }).then( ( res ) => {
    response.json( res.data )
  }).catch( ( error ) => {
    console.log( error );
  })
})

// 获取歌曲歌词数据
ApiRouter.use( '/getLyric', ( request, response ) => {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: request.query
  })
  .then( res => {
    let ret = res.data;

    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    response.json( ret )
  })
  .catch( error => {
    console.log( error )
  })
})

// 获取歌单列表数据
ApiRouter.use( '/getSongList', ( request, response ) => {
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

  axios.get( url,{
    headers: {
      Referer: `https://y.qq.com/n/yqq/playlist/${request.query.disstid}.html`
    },
    params: request.query
  }).then( ( res ) => {
    response.json( res.data )
  }).catch( ( error ) => {
    console.log( error );
  })
})


// 获取搜索结果
ApiRouter.use('/getSearchResult', (request, response) => {
  const url = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";

  axios.get(url, {
    params: request.query,
    headers: {
      Referer: "https://y.qq.com/m/index.html",
      Origin: "https://y.qq.com",
    }
  })
  .then((res) => {
    let data;
    const callback = (result) => {
      data = result;
    };

    // 这里也可以用 eval 来执行 jsonp callback
    // 目的是为了拿到传递给 jsonp callback 的参数
    const script = new vm.Script(res.data);
    const context = vm.createContext({
      callback,
      global: this,
    });
    script.runInNewContext(context);

    response.json(data);
  })
  .catch((error) => {
    console.log(error);
  });
});

app.use( '/api', ApiRouter );
app.use( express.static( 'dist') );



const server = app.listen( PORT, "localhost", () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log( "The server is listening at http://%s:%s", host, port );
});

module.exports = server;
