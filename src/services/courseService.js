import xhr from './xhr/'
/**
 * 项目相关的 API
 */
class CourseService {
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    static getCourseList(data) {
        return xhr({
            method: 'get',
            url: '/course/list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    static getCourseFullList(data) {
        return xhr({
            method: 'get',
            url: '/course/full_list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    static saveNewCourse(data) {
        return xhr({
            method: 'post',
            url: '/course/save_new',
            params: data
        })
    }

}

export default new CourseService()
