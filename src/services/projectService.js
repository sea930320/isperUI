import xhr from './xhr/'
/**
 * 项目相关的 API
 */
class ProjectService {
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getProjectList(data) {
        return xhr({
            method: 'get',
            url: '/project/list',
            params: data
        })
    }

    /**
     * 复制项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    copyProject(data) {
        return xhr({
            method: 'post',
            url: '/project/copy',
            params: data
        })
    }

    /**
     * 创建项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createProject(data) {
        return xhr({
            method: 'post',
            url: '/project/create',
            params: data
        })
    }

    /**
     * 更新项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    updateProject(data) {
        return xhr({
            method: 'post',
            url: '/project/update',
            params: data
        })
    }

    /**
     * 删除项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    deleteProject(data) {
        return xhr({
            method: 'post',
            url: '/project/delete',
            params: data
        })
    }

    /**
     * 获取项目相关业务
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getProjectRelated(data) {
        return xhr({
            method: 'get',
            url: '/project/related',
            params: data
        })
    }

    /**
     * 获取项目详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getProjectDetail(data) {
        return xhr({
            method: 'get',
            url: '/project/detail',
            params: data
        })
    }

    /**
     * 保存项目文档配置数据
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveProjectDocsAllocate(data) {
        return xhr({
            method: 'post',
            url: '/project/docs/allocate',
            params: data
        })
    }

    /**
     * 删除项目文档
     * @param data
     * @returns {{pre, visitor}|*}
     */
    deleteProjectDoc(data) {
        return xhr({
            method: 'post',
            url: '/project/docs/delete',
            params: data
        })
    }

    /**
     * 获取项目角色分配数据
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getProjectRolesDetail(data) {
        return xhr({
            method: 'get',
            url: '/project/roles/detail',
            params: data
        })
    }

    /**
     * 保存项目角色分配数据
     * @param data
     * @returns {{pre, visitor}|*}
     */
    configurateProjectRoles(data) {
        return xhr({
            method: 'post',
            url: '/project/roles/configurate',
            params: data
        })
    }

    /**
     * 获取项目文档分配数据
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getProjectDocsDetail(data) {
        return xhr({
            method: 'get',
            url: '/project/docs/detail',
            params: data
        })
    }

    /**
     * 更新项目角色形象
     * @param data
     * @returns {{pre, visitor}|*}
     */
    updateProjectRoleImage(data) {
        return xhr({
            method: 'post',
            url: '/project/role/image/update',
            params: data
        })
    }

    /**
     * 获取跳转设置页面数据
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getJumpDetail(data) {
        return xhr({
            method: 'get',
            url: '/project/jump/detail',
            params: data
        })
    }

    /**
     * 设置项目的跳转
     * @param data
     * @returns {{pre, visitor}|*}
     */
    postJumpSetup(data) {
        return xhr({
            method: 'post',
            url: '/project/jump/setup',
            params: data
        })
    }
    /**
     * 保护 项目
     * @param data
     * @returns {{pre, visitor}|*}
     */
    lockProject(data) {
        return xhr({
            method: 'post',
            url: '/project/protected',
            params: data
        })
    }
    /**
     * 共享
     * @param  {String}
     * @return {Object}
     */
    shareProject(data) {
        return xhr({
            method: 'get',
            url: '/project/share',
            params: data
        })
    }
    unshareProject(data) {
        return xhr({
            method: 'get',
            url: '/project/unshare',
            params: data
        })
    }

    getAllUsers_AllParts(data) {
        return xhr({
            method: 'get',
            url: '/project/getAllUsers_AllParts',
            params: data
        })
    }
}

export default new ProjectService()