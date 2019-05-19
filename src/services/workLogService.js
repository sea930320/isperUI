import xhr from './xhr/'
/**
 * 流程相关的 API
 */
class workLogService {
    /**
     * fetch Logs
     * @param  {Object}
     * @return {Object}
     */
    fetchLogs(options) {
        return xhr({
            method: 'get',
            url: '/account/get/worklogs',
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
            url: '/account/remove/worklogs',
            params: options
        })
    }
}

export default new workLogService()