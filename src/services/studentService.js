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
    myTeamList(data) {
        return xhr({
            method: 'get',
            url: '/student/team/my-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    availableTeamList(data) {
        return xhr({
            method: 'get',
            url: '/student/team/available-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    businessTeamDetail(data) {
        return xhr({
            method: 'get',
            url: '/student/team/detail',
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


    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    requestAssist(data) {
        return xhr({
            method: 'post',
            url: '/student/request-assist',
            params: data
        })
    }


    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    requestAssistList(data) {
        return xhr({
            method: 'get',
            url: '/student/request-assist-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    requestAssistUpdate(data) {
        return xhr({
            method: 'post',
            url: '/student/request-assist/update',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    messageList(data) {
        return xhr({
            method: 'get',
            url: '/student/msg-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    sendMessage(data) {
        return xhr({
            method: 'post',
            url: '/student/send-msg',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    todoList(data) {
        return xhr({
            method: 'get',
            url: '/student/todo-list',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    todoListUpdate(data) {
        return xhr({
            method: 'post',
            url: '/student/todo-list/update',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    todoListAdd(data) {
        return xhr({
            method: 'post',
            url: '/student/todo-list/add',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    todoListRemove(data) {
        return xhr({
            method: 'get',
            url: '/student/todo-list/remove',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    teamUserList(data) {
        return xhr({
            method: 'get',
            url: '/student/team/users',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    addTeamUser(data) {
        return xhr({
            method: 'post',
            url: '/student/team/add-user',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    removeTeamUser(data) {
        return xhr({
            method: 'post',
            url: '/student/team/remove-user',
            params: data
        })
    }
}

// 实例化后导出，全局单例
export default new StudentService()
