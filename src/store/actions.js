import * as types from './types'
// import experimentService from '@/services/experimentService'

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
  sendMessage({
    commit
  }, data) {
    commit(types.SEND_MESSAGE_SUCCESS, data)
  },
  setCurrentRole({
    commit
  }, data) {
    commit(types.SET_CURRENT_ROLE, data)
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
  updateUserRoles({
    commit
  }, data) {
    commit(types.UPDATE_USER_ROLES, data)
  },
  // getExperimentDetail({
  //   commit
  // }, params) {
  //   return new Promise((resolve, reject) => {
  //     experimentService
  //       .getExperimentDetail(params)
  //       .then(data => {
  //         resolve(data)
  //         commit(types.GET_EXPERIMENT_DETAIL_SUCCESS, data)
  //       }).catch(err => {
  //         reject(err)
  //       })
  //   })
  // },
  // getExperimentNodeDetail({
  //   commit
  // }, params) {
  //   return new Promise((resolve, reject) => {
  //     experimentService
  //       .getExperimentNodeDetail(params)
  //       .then(data => {
  //         resolve(data)
  //         commit(types.GET_EXPERIMENT_NODE_DETAIL_SUCCESS, data)
  //       }).catch((err) => {
  //         reject(err)
  //       })
  //   })
  // },
  // getExperimentNodeMessages({
  //   commit
  // }, params) {
  //   experimentService
  //     .getExperimentNodeMessages(params)
  //     .then(data => {
  //       commit(types.GET_EXPERIMENT_NODE_MESSAGES_SUCCESS, data.results)
  //     })
  // },
  // getExperimentNodeDocs({
  //   commit
  // }, params) {
  //   experimentService
  //     .getExperimentNodeDocs(params)
  //     .then(data => {
  //       commit(types.GET_EXPERIMENT_NODE_DOCS_SUCCESS, data)
  //     })
  // },
  // queryVoteStatus({
  //   commit
  // }, params) {
  //   experimentService
  //     .queryVoteStatus(params)
  //     .then(data => {
  //       commit(types.QUERY_VOTE_STATUS_SUCCESS, data)
  //       commit(types.HIDE_LOADING)
  //     })
  // },
  // getExperimentProjectTips({
  //   commit
  // }, params) {
  //   experimentService
  //     .getExperimentTemplates(params)
  //     .then(data => {
  //       commit(types.GET_EXPERIMENT_PROJECT_TIPS_SUCCESS, data)
  //     })
  // },
  // getExperimentNodeFunction({
  //   commit
  // }, params) {
  //   experimentService
  //     .getExperimentNodeFunction(params)
  //     .then(data => {
  //       commit(types.GET_EXPERIMENT_NODE_FUNCTION_SUCCESS, data)
  //       commit(types.UPDATE_USER_ROLES, data.user_roles)
  //       commit(types.HIDE_LOADING)
  //     })
  // },
  // getExperienceList({
  //   commit
  // }, params) {
  //   experimentService
  //     .getExperienceList(params)
  //     .then(data => {
  //       commit(types.GET_EXPERIMENT_EXPERIENCE_SUCCESS, data)
  //     })
  // }
}