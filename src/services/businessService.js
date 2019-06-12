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
    createBusiness(data) {
        return xhr({
            method: 'post',
            url: '/business/create',
            params: data
        })
    }

    /**
     * 获取实验列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    fetchList(data) {
        return xhr({
            method: 'get',
            url: '/business/list',
            params: data
        })
    }

    /**
     * 开始实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    startBusiness(data) {
      return xhr({
        method: 'post',
        url: '/business/start',
        params: data
      })
    }

    /**
     * 获取实验详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/detail',
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

    /**
     * 业务
     */
    getUnitUserList(data) {
        return xhr({
            method: 'post',
            url: '/business/getUnitUserList',
            params: data
        })
    }

    /**
     * 业务
     */
    addMoreTeammates(data) {
        return xhr({
            method: 'post',
            url: '/business/addMoreTeammates',
            params: data
        })
    }
}

// 实例化后导出，全局单例
export default new BusinessService()