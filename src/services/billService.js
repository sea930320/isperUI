import xhr from './xhr/'
/**
 * 项目相关的 API
 */
class BillService {
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBillName(data){
        return xhr({
            method: 'get',
            url: '/bill/name/list',
            params: data
        })
    }

    updateFullBills(data){
        return xhr({
            method: 'post',
            url: '/bill/update/full',
            params: data
        })
    }

    updateBillListName(data){
        return xhr({
            method: 'post',
            url: '/bill/update/billname',
            params: data
        })
    }

    deletePart(data){
        return xhr({
            method: 'post',
            url: '/bill/part/delete',
            params: data
        })
    }

    addPart(data){
        return xhr({
            method: 'post',
            url: '/bill/part/add',
            params: data
        })
    }


    getBillChapter(data) {
        return xhr({
            method: 'get',
            url: '/bill/chapter/list',
            params: data
        })
    }

    saveBillChapter(data) {
        return xhr({
            method: 'post',
            url: '/bill/chapter/save',
            params: data
        })
    }

    /**
     * 复制项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBillSection(data) {
        return xhr({
            method: 'get',
            url: '/bill/section/list',
            params: data
        })
    }

    saveBillSection(data) {
        return xhr({
            method: 'post',
            url: '/bill/section/save',
            params: data
        })
    }

    /**
     * 创建项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBillPart(data) {
        return xhr({
            method: 'get',
            url: '/bill/part/list',
            params: data
        })
    }

    saveBillPart(data) {
        return xhr({
            method: 'post',
            url: '/bill/part/save',
            params: data
        })
    }

    getBillPartDoc(data) {
        return xhr({
            method: 'get',
            url: '/bill/part/doc/list',
            params: data
        })
    }

    saveBillPartDoc(data) {
        return xhr({
            method: 'post',
            url: '/bill/part/doc/save',
            params: data
        })
    }
    deleteBillPartDoc(data) {
        return xhr({
            method: 'post',
            url: '/bill/part/doc/delete',
            params: data
        })
    }
}

export default new BillService()