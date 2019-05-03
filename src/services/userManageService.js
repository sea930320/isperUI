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

    set_Review(data) {
        return xhr({
            method: 'post',
            url: '/userManager/set_Review',
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