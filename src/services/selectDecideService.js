import xhr from './xhr/'

/**
 * Dictionary API
 */
class SelectDecideService {

    getSetting(data) {
        return xhr({
            method: 'post',
            url: '/business/selectDecide/getSetting',
            params: data
        })
    }

    saveResult(data) {
        return xhr({
            method: 'post',
            url: '/business/selectDecide/saveResult',
            params: data
        })
    }

}

export default new SelectDecideService()
