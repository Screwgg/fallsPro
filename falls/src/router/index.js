import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'

import discover from '@/components/tab/discover'
import release from '@/components/tab/release'
import magazine from '@/components/tab/magazine'
import qa from '@/components/tab/qa'
import collect from '@/components/tab/collect'
import individual from '@/components/tab/individual'
import blank from '@/components/tab/blank'

import homepage from '@/components/homepage/homepage'
import userinfo from '@/components/homepage/userinfo'
import daily from '@/components/homepage/daily'
import detail from '@/components/homepage/detail'
import setting from '@/components/homepage/setting'
import service from '@/components/homepage/service'
import photo from '@/components/homepage/photo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children: [
        {
          path: '',
          name: 'discover',
          component: discover
        }, {
          path: '/release',
          name: 'release',
          component: release
        }, {
          path: '/magazine',
          name: 'magazine',
          component: magazine
        }, {
          path: '/qa',
          name: 'qa',
          component: qa
        }, {
          path: '/collect',
          name: 'collect',
          component: collect
        }, {
          path: '/detail',
          name: 'detail',
          component: detail
        }, {
          path: '/outdetail',
          name: 'outdetail',
          component: detail
        }, {
          path: '/individual',
          name: 'individual',
          component: individual
        }, {
          path: '/blank',
          name: 'blank',
          component: blank
        }, {
          path: '/homepage',
          component: homepage,
          children: [
            {
              path: '',
              name: 'userinfo',
              component: userinfo
            }, {
              path: 'daily',
              name: 'daily',
              component: daily
            }, {
              path: 'setting',
              name: 'setting',
              component: setting
            }, {
              path: 'service',
              name: 'service',
              component: service
            }, {
              path: 'photo',
              name: 'photo',
              component: photo
            }
          ]
        }
      ]
    }
  ]
})
