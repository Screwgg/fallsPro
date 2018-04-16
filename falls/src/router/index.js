import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import discover from '@/components/tab/discover'
import release from '@/components/tab/release'
import magazine from '@/components/tab/magazine'
import qa from '@/components/tab/qa'
import collect from '@/components/tab/collect'
import individual from '@/components/tab/individual'
import daily from '@/components/daily'
import detail from '@/components/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/discover',
          name: 'discover',
          component: discover
        },
        {
          path: '/release',
          name: 'release',
          component: release
        },
        {
          path: '/magazine',
          name: 'magazine',
          component: magazine
        },
        {
          path: '/qa',
          name: 'qa',
          component: qa
        },
        {
          path: '/collect',
          name: 'collect',
          component: collect
        },
        {
          path: '/daily',
          name: 'daily',
          component: daily
        },
        {
          path: '/detail',
          name: 'detail',
          component: detail
        },
        {
          path: '/individual',
          name: 'individual',
          component: individual
        }
      ]
    }
  ]
})
