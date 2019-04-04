import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import modules from './modules'
import actions from './actions'
import getters from './getters'

import {
  STORAGE_KEY_USER,
  STORAGE_KEY_FLOW_STEP,
  STORAGE_KEY_CURRENT_ROLE
} from './storageKey'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
Vue.config.debug = debug

// 缓存本地插件
const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    window.sessionStorage.setItem(STORAGE_KEY_FLOW_STEP, JSON.stringify(state.flowStep))
    if (state.userInfo === null) VueCookie.delete(STORAGE_KEY_USER)
    window.sessionStorage.setItem(STORAGE_KEY_CURRENT_ROLE, JSON.stringify(state.meta.currentRole))
  })
}

export default new Vuex.Store({
  ...modules,
  actions: actions,
  getters: getters,
  plugins: [localStoragePlugin]
})