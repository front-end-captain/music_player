<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" ref="list"></list-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer.js'
import Singer from 'common/js/singer.js'
import ListView from 'base/listview/listview.vue'

/**
 * 从服务端获取的数据 这个数组的长度大概为 100
 * [
      {
          "Farea": "1",
          "Fattribute_3": "3",
          "Fattribute_4": "0",
          "Fgenre": "0",
          "Findex": "X",
          "Fother_name": "Joker",
          "Fsinger_id": "5062",
          "Fsinger_mid": "002J4UUk29y8BY",
          "Fsinger_name": "薛之谦",
          "Fsinger_tag": "541,555",
          "Fsort": "1",
          "Ftrend": "0",
          "Ftype": "0",
          "voc": "0"
      }
      .....
    ]
 */

/**
 * 最终的数据结构为
 * [
      {
        title: '热门',
        item: [
          {
            avatar: "https://y.gtimg.cn/music/photo_new/T001R300x300M000002J4UUk29y8BY.jpg?max_age=2592000"
            id: "002J4UUk29y8BY"
            name: "薛之谦"
          },
          {
            avatar:"https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000"
            id:"0025NhlN2yWrP4"
            name:"周杰伦"
          }
          ...
        ]
      },
      {
        title: 'A',
        item: [
          {
            avatar:"https://y.gtimg.cn/music/photo_new/T001R300x300M0000020PeOh4ZaCw1.jpg?max_age=2592000"
            id:"0020PeOh4ZaCw1"
            name:"Alan Walker (艾伦·沃克)"
          },
          {
            avatar:"https://y.gtimg.cn/music/photo_new/T001R300x300M000003ArN8Z0WpjTz.jpg?max_age=2592000"
            id:"003ArN8Z0WpjTz"
            name:"A-Lin"
          }
          ...
        ]
      },
      {
        title: 'A',
        item: [
          {}
          ...
        ]
      }
      .....
    ]
 */


const HOT_SINGER_LENGTH = 10
const HOT_NAME = '热门'
export default {
  name: 'singer',
  data () {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerData()
  },
  methods: {
    _getSingerData() {
      getSingerList().then( ( response ) => {
        console.log( response );
        if ( response.code === 0 ) {
          this.singers = this._normalizeSinger( response.data.list )
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {

        // 将列表中的前 10 项做为热门
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }

        // '热门' 'A' 'B' 'C' 'D' ...
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // map[A] map[B] map[C]...
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // 处理 map 获取一个有序的列表
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 排序
      ret.sort((a, b) => {
        return a.title.localeCompare( b.title );
      })
      return hot.concat(ret)
    }


  }
}
</script>


<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
