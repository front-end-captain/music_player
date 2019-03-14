'use strict'

const vm = require("vm");
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')
const axios = require('axios')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

app.use( function ( request, _, next ) {
	console.log( "+ new log ==========================" )
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


const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
