import VueRouter from 'vue-router'
import Vue from 'vue'
import VueCookie from 'vue-cookie'

// import store from './store'
import {
  STORAGE_KEY_USER
} from './store/storageKey'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  base: process.env.BASE_URL,
  linkActiveClass: 'active'
})

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (VueCookie.get(STORAGE_KEY_USER)) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router