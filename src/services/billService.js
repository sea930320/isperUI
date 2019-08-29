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

    getDocList(data){
        return xhr({
            method: 'get',
            url: '/bill/doc/list',
            params: data
        })
    }
    deleteDoc(data){
        return xhr({
            method: 'post',
            url: '/bill/doc/delete',
            params: data
        })
    }
    changePartUp(data){
        return xhr({
            method: 'get',
            url: '/bill/part/up',
            params: data
        })
    }

    changePartDown(data){
        return xhr({
            method: 'get',
            url: '/bill/part/down',
            params: data
        })
    }

    insertPart(data){
        return xhr({
            method: 'post',
            url: '/bill/part/insert',
            params: data
        })
    }

    uploadDoc(data){
        return xhr({
            method: 'post',
            url: '/bill/doc/upload',
            params: data
        })
    }

    billPreview(data){
        return xhr({
            method: 'get',
            url: '/bill/doc/preview',
            params: data
        })
    }



}

export default new BillService()