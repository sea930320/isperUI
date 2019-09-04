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
            url: '/business/bill/name/list',
            params: data
        })
    }

    updateFullBills(data){
        return xhr({
            method: 'post',
            url: '/business/bill/update/full',
            params: data
        })
    }

    updateBillListName(data){
        return xhr({
            method: 'post',
            url: '/business/bill/update/billname',
            params: data
        })
    }

    deletePart(data){
        return xhr({
            method: 'post',
            url: '/business/bill/part/delete',
            params: data
        })
    }

    addPart(data){
        return xhr({
            method: 'post',
            url: '/business/bill/part/add',
            params: data
        })
    }

    getDocList(data){
        return xhr({
            method: 'get',
            url: '/business/bill/doc/list',
            params: data
        })
    }
    deleteDoc(data){
        return xhr({
            method: 'post',
            url: '/business/bill/doc/delete',
            params: data
        })
    }
    changePartUp(data){
        return xhr({
            method: 'get',
            url: '/business/bill/part/up',
            params: data
        })
    }

    changePartDown(data){
        return xhr({
            method: 'get',
            url: '/business/bill/part/down',
            params: data
        })
    }

    insertPart(data){
        return xhr({
            method: 'post',
            url: '/business/bill/part/insert',
            params: data
        })
    }

    uploadDoc(data){
        return xhr({
            method: 'post',
            url: '/business/bill/doc/upload',
            params: data
        })
    }

    billPreview(data){
        return xhr({
            method: 'get',
            url: '/business/bill/doc/preview',
            params: data
        })
    }

    saveBill(data){
        return xhr({
            method: 'post',
            url: '/business/bill/save',
            params: data
        })
    }



}

export default new BillService()