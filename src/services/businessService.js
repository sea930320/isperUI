import xhr from './xhr/'

/**
 * 业务 API
 */
class BusinessService {
    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createExperiment(data) {
        return xhr({
            method: 'post',
            url: '/business/create',
            params: data
        })
    }
    
    /**
     * 业务
     */
    getBusinessListNoDel(data) {
        return xhr({
            method: 'get',
            url: '/business/list_nodel',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessListDel(data) {
        return xhr({
            method: 'get',
            url: '/business/list_del',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessDelete(data) {
        return xhr({
            method: 'post',
            url: '/business/delete',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessRecovery(data) {
        return xhr({
            method: 'post',
            url: '/business/recovery',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessResult(data) {
        return xhr({
            method: 'get',
            url: '/business/result',
            params: data
        })
    }
}

// 实例化后导出，全局单例
export default new BusinessService()