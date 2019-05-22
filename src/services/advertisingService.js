import xhr from './xhr/'
/**
 * 项目相关的 API
 */
class AdvertisingService {
    /**
     *
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getAdvertisingList(data) {
        return xhr({
            method: 'get',
            url: '/advertising/list',
            params: data
        })
    }

    getAdvertisingListHome(data) {
        return xhr({
            method: 'get',
            url: '/advertising/list_home',
            params: data
        })
    }

    /**
     * 删除
     * @param data
     * @returns {{pre, visitor}|*}
     */
    deleteAdvertising(data) {
        return xhr({
            method: 'post',
            url: '/advertising/delete',
            params: data
        })
    }

    /**
     * 创建
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createAdvertising(data) {
        return xhr({
            method: 'post',
            url: '/advertising/create',
            params: data
        })
    }
}

export default new AdvertisingService()