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
     * 获取实验环节详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/node/detail',
            params: data
        })
    }

    /**
     * 获得结束并走向的 选项
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessTransPath(data) {
        return xhr({
            method: 'get',
            url: '/business/trans/path',
            params: data
        })
    }

    /**
     * 获取环节交流历史记录
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeMessages(data) {
        return xhr({
            method: 'get',
            url: '/business/node/messages',
            params: data
        })
    }

    /**
     * 获取动画环节所有功能按钮
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeFunction(data) {
        return xhr({
            method: 'get',
            url: '/business/node/function',
            params: data
        })
    }
    
    /**
     * 获取实验环节所有素材
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeDocs(data) {
        return xhr({
            method: 'get',
            url: '/business/node/role/docs',
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