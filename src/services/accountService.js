import xhr from './xhr/'
/**
 * 用户相关的 API
 */
class AccountService {
  /**
   * 登录
   * @param  {String} userData.username
   * @return {Object} userData
   */
  login(userData) {
    return xhr({
      method: 'post',
      url: '/account/login',
      params: userData
    })
  }

  /**
   * 注销登录
   * @return {Promise}
   */
  logout() {
    return xhr({
      method: 'post',
      url: '/account/logout'
    })
  }

  /**
   * Get Permission for manager
   * @return {Promise}
   */
  permission() {
    return xhr({
      method: 'get',
      url: '/account/permission'
    })
  }

  /**
   * 获取所有账户
   * @return {Promise}
   */
  getAccountUsers(options) {
    return xhr({
      method: 'get',
      url: '/account/users',
      params: options
    })
  }

  /**
   * 获取用户身份
   * @return {Promise}
   */
  getUserIdentity(data) {
    return xhr({
      method: 'get',
      url: '/account/query',
      params: data
    })
  }

  /**
   * 获取app 二维码图片
   * @return {Promise}
   */
  getQrcode() {
    return xhr({
      method: 'get',
      url: '/system/app/qr'
    })
  }

  /**
   * 获取app 二维码图片
   * @return {Promise}
   */
  getNotice() {
    return xhr({
      method: 'get',
      url: '/system/notice'
    })
  }

  /**
   * Create Account
   * @param data
   * @returns {Promise}
   */
  createAccount(data) {
    return xhr({
      method: 'post',
      url: '/account/user/create',
      params: data
    })
  }

  /**
   * Update Account
   * @param data
   * @returns {Promise}
   */
  updateAccount(data) {
    return xhr({
      method: 'post',
      url: '/account/user/update',
      params: data
    })
  }

  /**
   * Update Password
   * @param data
   * @returns {Promise}
   */
  updatePassword(data) {
    return xhr({
      method: 'post',
      url: '/account/password/update',
      params: data
    })
  }

  /**
   * Send Verifiy Code
   * @param data
   * @returns {Promise}
   */
  sendCode(data) {
    return xhr({
      method: 'post',
      url: '/account/send/code',
      params: data
    })
  }

  /**
   * 获取所有账户
   * @return {Promise}
   */
  getDefaultCompanies(options) {
    return xhr({
      method: 'get',
      url: '/account/default-group',
      params: options
    })
  }

  /**
   * Get Assistants
   * @return {Promise}
   */
  getAssistants(options) {
    return xhr({
      method: 'get',
      url: '/account/get/assistants',
      params: options
    })
  }

  /**
   * Set Assistants
   * @return {Promise}
   */
  setAssistants(options) {
    return xhr({
      method: 'post',
      url: '/account/set/assistants',
      params: options
    })
  }

  /**
   * UnSet Assistant
   * @return {Promise}
   */
  unsetAssistant(options) {
    return xhr({
      method: 'post',
      url: '/account/unset/assistant',
      params: options
    })
  }

  /**
   * Set Assistant Actions
   * @return {Promise}
   */
  setAssistantsActions(options) {
    return xhr({
      method: 'post',
      url: '/account/set/assistant/actions',
      params: options
    })
  }

  /**
   * Set Assistant Actions
   * @return {Promise}
   */
  setRolesActions(options) {
    return xhr({
      method: 'post',
      url: '/account/set/roles/actions',
      params: options
    })
  }

  /**
   * Get Permissions
   * @return {Promise}
   */
  getPermissions(options) {
    return xhr({
      method: 'get',
      url: '/account/get/permissions',
      params: options
    })
  }

  /**
   * Get MessageData
   * @return {Promise}
   */
  getMessageData(options) {
    return xhr({
      method: 'get',
      url: '/account/get/getMessageData',
      params: options
    })
  }
  
  /**
   * Get Roles
   * @return {Promise}
   */
  getRoles(options) {
    return xhr({
      method: 'get',
      url: '/account/roles',
      params: options
    })
  }
}

// 实例化后导出，全局单例
export default new AccountService()