import xhr from './xhr/'

/**
 * Dictionary API
 */
class DictionaryService {

    fetchList(options) {
        return xhr({
            method: 'get',
            url: '/group/list',
            params: options
        })
    }

    create(data) {
        return xhr({
            method: 'post',
            url: '/group/create',
            params: data
        })
    }

}

export default new DictionaryService()