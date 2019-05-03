import xhr from './xhr/'

/**
 * Dictionary API
 */
class UserManageService {

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

    resetPass(data) {
        return xhr({
            method: 'post',
            url: '/userManager/resetPass',
            params: data
        })
    }

}

export default new UserManageService()