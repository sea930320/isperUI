import xhr from './xhr/'

/**
 * Dictionary API
 */
class DictionaryService {

    getDicData(data) {
        return xhr({
            method: 'post',
            url: '/dic/getDicData',
            params: data
        })
    }

    getOfficeItemData(data) {
        return xhr({
            method: 'post',
            url: '/dic/getOfficeItemData',
            params: data
        })
    }

    newItemSave(data) {
        return xhr({
            method: 'post',
            url: '/dic/newItemSave',
            params: data
        })
    }

    editItemSave(data) {
        return xhr({
            method: 'post',
            url: '/dic/editItemSave',
            params: data
        })
    }

    deleteItemSave(data) {
        return xhr({
            method: 'post',
            url: '/dic/deleteItemSave',
            params: data
        })
    }

}

export default new DictionaryService()