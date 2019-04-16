import {
  rootPath,
  errHandler
} from './config'
import {
  STORAGE_KEY_USER
} from '../../store/storageKey'
import VueCookie from 'vue-cookie'
import Vue from 'vue'
import router from '../../router'
import axios from 'axios'
import qs from 'qs'
const ERR_OK = 0
const NOT_LOGIN = 10003

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => {
    // 当返回信息为未登录或者登录失效的时候重定向为登录页面
    if (response.data.c === NOT_LOGIN) {
      router.push({
        path: '/login',
        querry: {
          redirect: router.currentRoute.fullPath
        } // 从哪个页面跳转
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

const xhr = ({
  method = 'get',
  url,
  params = null
}) => {
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      axios.get(rootPath + url, {
          params: params
        })
        .then(response => {
          var data = response.data
          if (data.c === ERR_OK) {
            resolve(data.d)
          } else if (data.c === NOT_LOGIN) {
            Vue.toasted.error(data.m)
            VueCookie.delete(STORAGE_KEY_USER)
          } else {
            Vue.toasted.error(data.m)
            reject(data.m)
          }
        })
        .catch(err => errHandler(reject, err))
    } else if (method === 'post') {
      axios.post(rootPath + url, qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          var data = response.data
          if (data.c === ERR_OK) {
            resolve(data.d)
          } else {
            Vue.toasted.error(data.m)
            reject(data.m)
          }
        })
        .catch(err => errHandler(reject, err))
    } else {
      //
    }
  })
}

export default xhr