import xhr from './xhr/'

/**
 * Dictionary API
 */
class UserManageService {

    //super

    getNormalUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getNormalUsers',
            params: data
        })
    }

    getManageUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getManageUsers',
            params: data
        })
    }

    getInstructorUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getInstructorUsers',
            params: data
        })
    }

    getStudentUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getStudentUsers',
            params: data
        })
    }

    //group

    getGroupUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getGroupUsers',
            params: data
        })
    }

    getGroupNonCompanyUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getGroupNonCompanyUsers',
            params: data
        })
    }

    getGroupChangeList(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getGroupChangeList',
            params: data
        })
    }

    set_Review(data) {
        return xhr({
            method: 'post',
            url: '/userManager/set_Review',
            params: data
        })
    }

    set_gChange(data) {
        return xhr({
            method: 'post',
            url: '/userManager/set_gChange',
            params: data
        })
    }

    //company

    queryCompanyUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/queryCompanyUsers',
            params: data
        })
    }

    excelDataSave(data) {
        return xhr({
            method: 'post',
            url: '/userManager/excelDataSave',
            params: data
        })
    }

    newUserSet(data) {
        return xhr({
            method: 'post',
            url: '/userManager/newUserSet',
            params: data
        })
    }

    deleteUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/deleteUsers',
            params: data
        })
    }

    getCompanyNonReviewUsers(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getCompanyNonReviewUsers',
            params: data
        })
    }

    getCompanyChangeList(data) {
        return xhr({
            method: 'post',
            url: '/userManager/getCompanyChangeList',
            params: data
        })
    }

    set_cChange(data) {
        return xhr({
            method: 'post',
            url: '/userManager/set_cChange',
            params: data
        })
    }

    //common

    resetPass(data) {
        return xhr({
            method: 'post',
            url: '/userManager/resetPass',
            params: data
        })
    }

}

export default new UserManageService()