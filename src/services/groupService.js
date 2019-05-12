import xhr from './xhr/'

/**
 * 流程相关的 API
 */
class GroupService {

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

    deleteGroups(data) {
        return xhr({
            method: 'post',
            url: '/group/delete',
            params: data
        })
    }

    update(data) {
        return xhr({
            method: 'post',
            url: '/group/update',
            params: data
        })
    }

    addManager(data) {
        return xhr({
            method: 'post',
            url: '/group/addManager',
            params: data
        })
    }

    updateManager(data) {
        return xhr({
            method: 'post',
            url: '/group/updateManager',
            params: data
        })
    }

    pResetManager(data) {
        return xhr({
            method: 'post',
            url: '/group/resetManager',
            params: data
        })
    }

    getOwnGroup(data) {
        return xhr({
            method: 'post',
            url: '/group/getOwnGroup',
            params: data
        })
    }

    getInstructorItemList(data) {
        return xhr({
            method: 'post',
            url: '/group/getInstructorItemList',
            params: data
        })
    }

    saveInstructors(data) {
        return xhr({
            method: 'post',
            url: '/group/saveInstructors',
            params: data
        })
    }

    createInstructors(data) {
        return xhr({
            method: 'post',
            url: '/group/createInstructors',
            params: data
        })
    }

    // Company actions

    fetchCompanyList(data) {
        return xhr({
            method: 'post',
            url: '/company/fetchCompanyList',
            params: data
        })
    }

    createCompany(data) {
        return xhr({
            method: 'post',
            url: '/company/createCompany',
            params: data
        })
    }

    deleteCompany(data) {
        return xhr({
            method: 'post',
            url: '/company/deleteCompany',
            params: data
        })
    }

    updateCompany(data) {
        return xhr({
            method: 'post',
            url: '/company/updateCompany',
            params: data
        })
    }

    addCManager(data) {
        return xhr({
            method: 'post',
            url: '/company/addCManager',
            params: data
        })
    }

    updateCManager(data) {
        return xhr({
            method: 'post',
            url: '/company/updateCManager',
            params: data
        })
    }

    pCResetManager(data) {
        return xhr({
            method: 'post',
            url: '/company/pCResetManager',
            params: data
        })
    }

    fetchAllGroupDetail(data) {
        return xhr({
            method: 'get',
            url: '/group/all-list',
            params: data
        })
    }

    checkUserGroup(data) {
        return xhr({
            method: 'post',
            url: '/group/checkUserGroup',
            params: data
        })
    }
}

export default new GroupService()