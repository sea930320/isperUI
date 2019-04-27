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
    getCourseList(data) {
        return xhr({
            method: 'get',
            url: '/course/list',
            params: data
        })
    }

}

export default new CourseService()