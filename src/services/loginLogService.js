import xhr from './xhr/'
/**
 * 流程相关的 API
 */
class loginLogService {
    /**
     * fetch Logs
     * @param  {Object}
     * @return {Object}
     */
    fetchLogs(options) {
        return xhr({
            method: 'get',
            url: '/account/get/loginlogs',
            params: options
        })
    }

    /**
     * fetch Logs
     * @param  {Object}
     * @return {Object}
     */
    removeLogs(options) {
        return xhr({
            method: 'get',
            url: '/account/remove/loginlogs',
            params: options
        })
    }
}

export default new loginLogService()