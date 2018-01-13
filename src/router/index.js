import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Rank = ( resolve ) => {
  import( 'components/rank/rank.vue' ).then( module => {
    resolve( module );
  })
};

const Recommend = ( resolve ) => {
  import( 'components/recommend/recommend.vue' ).then( module => {
    resolve( module );
  })
};

const Search = ( resolve ) => {
  import( 'components/search/search.vue' ).then( module => {
    resolve( module );
  })
};

const Singer = ( resolve ) => {
  import( 'components/singer/singer.vue' ).then( module => {
    resolve( module );
  })
};

const SingerDetail = ( resolve ) => {
  import( 'components/singer-detail/singer-detail.vue' ).then( module => {
    resolve( module );
  })
};


const Disc = ( resolve ) => {
  import( 'components/disc/disc.vue' ).then( module => {
    resolve( module );
  })
};

const RankDetail = ( resolve ) => {
  import( 'components/rank-detail/rank-detail.vue' ).then( module => {
    resolve( module );
  })
};

const UserCenter = ( resolve ) => {
  import( 'components/user-center/user-center.vue' ).then( module => {
    resolve( module );
  })
};



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
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
