import Vue from 'vue'
import Router from 'vue-router'

import Rank from 'components/rank/rank.vue'
import Recommend from 'components/recommend/recommend.vue'
import Search from 'components/search/search.vue'
import Singer from 'components/singer/singer.vue'
import SingerDetail from 'components/singer-detail/singer-detail.vue'
import Disc from 'components/disc/disc.vue'
import RankDetail from 'components/rank-detail/rank-detail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
