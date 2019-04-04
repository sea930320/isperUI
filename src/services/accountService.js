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
}

// 实例化后导出，全局单例
export default new AccountService()