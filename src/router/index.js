import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

import BaseLayout from '@/layouts/BaseLayout'
import MainLayout from '@/layouts/MainLayout'
import SafeAreaLayout from '@/layouts/SafeAreaLayout'

import Home from '@/views/Home'
import Search from '@/views/Search'
import Rank from '@/views/Rank'
import Setting from '@/views/Setting'
import Artwork from '@/views/Artwork'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {
        path: '/',
        component: MainLayout,
        props: { safeArea: true },
        children: [
          {
            path: '/',
            redirect: '/home'
          },
          {
            path: '/home',
            name: 'Home',
            component: Home
          },
          {
            path: '/rank',
            redirect: '/rank/daily'
          },
          {
            path: '/rank/:type',
            name: 'Rank',
            component: Rank
          },
          {
            path: '/setting',
            name: 'Setting',
            component: Setting
          }
        ]
      },
      {
        path: '/',
        component: MainLayout,
        props: { safeArea: false },
        children: [
          {
            path: '/search',
            name: 'Search',
            component: Search
          }
        ]
      },
      {
        path: '/',
        component: MainLayout,
        children: [
          {
            path: '/artwork/:id',
            name: 'Artwork',
            component: Artwork
          }
        ]
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
