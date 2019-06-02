import xhr from './xhr/'

class BusinessService {
    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createExperiment(data) {
        return xhr({
            method: 'post',
            url: '/business/create',
            params: data
        })
    }
}


export default new BusinessService()