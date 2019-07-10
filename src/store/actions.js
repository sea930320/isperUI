import * as types from './types'
import businessService from '@/services/businessService'

export default {
  showLoading({
    commit
  }) {
    commit(types.SHOW_LOADING)
  },
  hideLoading({
    commit
  }) {
    commit(types.HIDE_LOADING)
  },
  login({
    commit
  }, data) {
    commit(types.LOGIN_SUCCESS, data)
  },
  logout({
    commit
  }) {
    commit(types.LOGOUT_SUCCESS)
  },
  setFlowStep({
    commit
  }, data) {
    commit(types.SET_FLOW_STEP, data)
  },
  refreshMsg(state) {
    state.commit('refreshMsg')
  },
  sendMessage({
    commit
  }, data) {
    commit(types.SEND_MESSAGE_SUCCESS, data)
  },
  setCurrentRoleAllocation({
    commit
  }, data) {
    commit(types.SET_CURRENT_ROLE_ALLOCATION, data)
  },
  dispatchFlashAction({
    commit
  }, data) {
    commit(types.DISPATCH_FLASH_ACTION, data)
  },
  emptyActionCmd({
    commit
  }) {
    commit(types.EMPTY_ACTION_CMD)
  },
  startRoleBanned({
    commit
  }, data) {
    commit(types.START_ROLE_BANNED, data)
  },
  sendExperience({
    commit
  }, data) {
    commit('SEND_EXPERIENCE', data)
  },
  updateVoteStatus({
    commit
  }, data) {
    commit(types.UPDATE_VOTE_STATUS, data)
  },
  updateUserRoleAllocs({
    commit
  }, data) {
    commit(types.UPDATE_USER_ROLE_ALLOCS, data)
  },
  setPermission({
    commit
  }, data) {
    commit(types.SET_PERMISSION, data)
  },
  getBusinessDetail({
    commit
  }, params) {
    return new Promise((resolve, reject) => {
      businessService
        .getBusinessDetail(params)
        .then(data => {
          resolve(data);
          commit(types.GET_BUSINESS_DETAIL_SUCCESS, data)
        }).catch(err => {
          reject(err)
        })
    })
  },
  getBusinessNodeDetail({
    commit
  }, params) {
    return new Promise((resolve, reject) => {
      businessService
        .getBusinessNodeDetail(params)
        .then(data => {
          resolve(data);
          commit(types.GET_BUSINESS_NODE_DETAIL_SUCCESS, data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getBusinessNodeMessages({
    commit
  }, params) {
    businessService
      .getBusinessNodeMessages(params)
      .then(data => {
        commit(types.GET_BUSINESS_NODE_MESSAGES_SUCCESS, data.results)
      })
  },
  getBusinessNodeFunction({
    commit
  }, params) {
    businessService
      .getBusinessNodeFunction(params)
      .then(data => {
        commit(types.GET_BUSINESS_NODE_FUNCTION_SUCCESS, data);
        commit(types.UPDATE_USER_ROLE_ALLOCS, data.user_role_allocs);
        commit(types.HIDE_LOADING)
      })
  },
  getBusinessNodeDocs({
    commit
  }, params) {
    businessService
      .getBusinessNodeDocs(params)
      .then(data => {
        commit(types.GET_BUSINESS_NODE_DOCS_SUCCESS, data)
      })
  },
  getExperienceList({
    commit
  }, params) {
    businessService
      .getExperienceList(params)
      .then(data => {
        commit(types.GET_BUSINESS_EXPERIENCE_SUCCESS, data)
      })
  },
  setSurvey({
    commit
  }, data) {
    commit(types.SET_SURVEY, data)
  }
  // queryVoteStatus({
  //   commit
  // }, params) {
  //   businessService
  //     .queryVoteStatus(params)
  //     .then(data => {
  //       commit(types.QUERY_VOTE_STATUS_SUCCESS, data)
  //       commit(types.HIDE_LOADING)
  //     })
  // },
  // getBusinessProjectTips({
  //   commit
  // }, params) {
  //   businessService
  //     .getBusinessTemplates(params)
  //     .then(data => {
  //       commit(types.GET_BUSINESS_PROJECT_TIPS_SUCCESS, data)
  //     })
  // },
}