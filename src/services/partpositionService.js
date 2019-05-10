import xhr from './xhr/'

/**
 * Dictionary API
 */
class PartPositionService {

    getPartPositionData(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/getPartPositionData',
            params: data
        })
    }

    newPPSave(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/newPPSave',
            params: data
        })
    }

    deletePPSave(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/deletePPSave',
            params: data
        })
    }

    getPartUsers(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/getPartUsers',
            params: data
        })
    }

    getNonPPUsers(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/getNonPPUsers',
            params: data
        })
    }

    setNewPP(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/setNewPP',
            params: data
        })
    }

    getInnerPermissions(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/getInnerPermissions',
            params: data
        })
    }

    setInnerPermissions(data) {
        return xhr({
            method: 'post',
            url: '/partPosition/setInnerPermissions',
            params: data
        })
    }

}

export default new PartPositionService()