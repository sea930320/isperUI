import xhr from './xhr/'

/**
 * 业务 API
 */
class StudentService {
    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    watchBusinessList(data) {
        return xhr({
            method: 'get',
            url: '/student/watch-business-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    watchCourseList(data) {
        return xhr({
            method: 'get',
            url: '/student/watch-course-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    watchCompanyUserList(data) {
        return xhr({
            method: 'get',
            url: '/student/watch-company-user-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    businessTeamList(data) {
        return xhr({
            method: 'get',
            url: '/student/business-team-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    teacherList(data) {
        return xhr({
            method: 'get',
            url: '/student/teacher/list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    watchStart(data) {
        return xhr({
            method: 'post',
            url: '/student/watch-start',
            params: data
        })
    }

}

// 实例化后导出，全局单例
export default new StudentService()
