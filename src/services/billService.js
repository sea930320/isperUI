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

    getBillNameOnly(data){
        return xhr({
            method: 'get',
            url: '/business/bill/name/only',
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

    saveBill(data){
        return xhr({
            method: 'post',
            url: '/business/bill/save',
            params: data
        })
    }

    deleteAllData(data){
        return xhr({
            method: 'post',
            url: '/business/bill/delete',
            params: data
        })
    }
    getDocListAll(data){
        return xhr({
            method: 'get',
            url: '/business/bill/doc/listall',
            params: data
        })
    }
    uploadDocBill(data){
        return xhr({
            method: 'post',
            url: '/business/bill/doc/uploadbill',
            params: data
        })
    }
    getBillAll(data){
        return xhr({
            method: 'get',
            url: '/business/bill/get/all',
            params: data
        })
    }



}

export default new BillService()