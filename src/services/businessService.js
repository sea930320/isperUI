import xhr from './xhr/'

/**
 * 业务 API
 */
class BusinessService {
    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createBusiness(data) {
        return xhr({
            method: 'post',
            url: '/business/create',
            params: data
        })
    }

    /**
     * 获取实验列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    fetchList(data) {
        return xhr({
            method: 'get',
            url: '/business/list',
            params: data
        })
    }

    /**
     * 获取实验详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/detail',
            params: data
        })
    }
    genarateBusinessReport(data) {
        return xhr({
            method: 'get',
            url: '/business/report/generate',
            params: data
        })
    }

    /**
     * 获取实验环节详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/node/detail',
            params: data
        })
    }

    /**
     * 获得结束并走向的 选项
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessTransPath(data) {
        return xhr({
            method: 'get',
            url: '/business/trans/path',
            params: data
        })
    }

    /**
     * 获取环节交流历史记录
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeMessages(data) {
        return xhr({
            method: 'get',
            url: '/business/node/messages',
            params: data
        })
    }

    /**
     * 获取动画环节所有功能按钮
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeFunction(data) {
        return xhr({
            method: 'get',
            url: '/business/node/function',
            params: data
        })
    }

    /**
     * 获取实验环节所有素材
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeDocs(data) {
        return xhr({
            method: 'get',
            url: '/business/node/role/docs',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessListNoDel(data) {
        return xhr({
            method: 'get',
            url: '/business/list_nodel',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessListDel(data) {
        return xhr({
            method: 'get',
            url: '/business/list_del',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessDelete(data) {
        return xhr({
            method: 'post',
            url: '/business/delete',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessRecovery(data) {
        return xhr({
            method: 'post',
            url: '/business/recovery',
            params: data
        })
    }

    /**
     * 查询未读留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     */
    unReadBusinessMessage(data) {
        return xhr({
            method: 'get',
            url: '/cms/new/msg-business/num',
            params: data
        })
    }
    /**
     * 发送留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     * @param data.content 发送内容
     * @param data.to_user_ids 发送对象ids
     * @param data.host_id 主题贴ID，回贴时必要
     */
    sendMessage(data) {
        return xhr({
            method: 'post',
            url: '/cms/send/msg-business',
            params: data
        })
    }

    /**
     * 获取留言的成员表
     * @param data 参数
     * @param data.business_id 实验id
     */
    getSendMembers(data) {
        return xhr({
            method: 'get',
            url: '/cms/to/user/list-business',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getMessageList(data) {
        return xhr({
            method: 'get',
            url: '/cms/msg/list-business',
            params: data
        })
    }

    /**
     * 业务
     */
    getUnitUserList(data) {
        return xhr({
            method: 'post',
            url: '/business/getUnitUserList',
            params: data
        })
    }

    /**
     * 回复留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     * @param data.content 发送内容
     * @param data.to_user_ids 发送对象ids
     * @param data.host_id 主题贴ID，回贴时必要
     */
    replyMessage(data) {
        return xhr({
            method: 'post',
            url: '/cms/send/msg-business',
            params: data
        })
    }

    /**
     * 获取实验成果
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessResults(data) {
        return xhr({
            method: 'get',
            url: '/business/messages',
            params: data
        })
    }

    /**
     * 获取实验展示列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessDisplayList(data) {
        return xhr({
            method: 'get',
            url: '/business/file/display/list',
            params: data
        })
    }

    /**
     * 获取实验模板
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessTemplates(data) {
        return xhr({
            method: 'get',
            url: '/business/templates',
            params: data
        })
    }

    /**
     * 获取实验所有环节对应笔记
     * @param data
     * @returns {*|{pre, visitor}}
     */
    getBusinessNoteList(data) {
        return xhr({
            method: 'get',
            url: '/business/note/list',
            params: data
        })
    }

    /**
     * 保存实验笔记
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveBusinessNote(data) {
        return xhr({
            method: 'post',
            url: '/business/note/create',
            params: data
        })
    }

    /**
     * 发送消息到后端
     * @param data
     * @returns {{pre, visitor}|*}
     */
    pushMessage(data) {
        return xhr({
            method: 'post',
            url: '/business/message/push',
            params: data
        })
    }

    /**
     * 发送消息到后端
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveMessage(data) {
        return xhr({
            method: 'post',
            url: '/business/message/save',
            params: data
        })
    }

    /**
     * 业务
     */
    addMoreTeammates(data) {
        return xhr({
            method: 'post',
            url: '/business/addMoreTeammates',
            params: data
        })
    }

    /**
     * 获取实验角色flash状态
     * @param data
     * @returns {*|{pre, visitor}}
     */
    getBusinessRoleStatus(data) {
        return xhr({
            method: 'get',
            url: '/business/role/status',
            params: data
        })
    }

    /**
     * 获取请入实验角色
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessRoleInList(data) {
        return xhr({
            method: 'get',
            url: '/business/role/in/list',
            params: data
        })
    }

    /**
     * 获取请出实验角色
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessRoleOutList(data) {
        return xhr({
            method: 'get',
            url: '/business/role/out/list',
            params: data
        })
    }

    /**
     * 获取实验环节可以被安排报告的角色
     * @param data 参数
     * @param data.experiment_id 实验id
     * @param data.node_id 环节id
     * @returns {{pre, visitor}|*}
     */
    getReportRoles(data) {
        return xhr({
            method: 'get',
            url: '/business/role/report/list',
            params: data
        })
    }

    /**
     * 获取实验环节中需要签字的角色
     * @param data 参数
     * @param data.experiment_id 实验id
     * @param data.node_id 环节id
     * @param data.role_id 当前角色id
     * @returns {{pre, visitor}|*}
     */
    querySignRoles(data) {
        return xhr({
            method: 'get',
            url: '/business/request/sign/roles',
            params: data
        })
    }

    /**
     * 获取流程下一步或上一步流程分支
     * @param  {String}
     * @return {Object}
     */
    queryWorkflowTrans(data) {
        return xhr({
            method: 'get',
            url: '/workflow/trans/query',
            params: data
        })
    }

    createPost(data) {
        return xhr({
            method: 'post',
            url: '/business/post/create',
            params: data
        })
    }

    postDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/post/detail',
            params: data
        })
    }

    getPost(data) {
        return xhr({
            method: 'get',
            url: '/business/post',
            params: data
        })
    }

    /**
     * 获取实验列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperienceList(data) {
        return xhr({
            method: 'get',
            url: '/business/experience/list',
            params: data
        })
    }

    /**
     * @param data
     * @returns {{pre, visitor}|*}
     */
    postBusinessExperience(data) {
        return xhr({
            method: 'post',
            url: '/business/experience/save',
            params: data
        })
    }

    /**
     * 开始实验跳转项目
     * @param data 参数
     * @param data.business_id 实验id
     * @param data.project_id 要跳转的项目id
     * @param data.data 角色配置数据
     * @returns {{pre, visitor}|*}
     */
    jumpStart(data) {
        return xhr({
            method: 'post',
            url: '/business/jump/start',
            params: data
        })
    }

    removeBusiness(data) {
        return xhr({
            method: 'get',
            url: '/business/remove',
            params: data
        })
    }

    /**
     * 获取实验成果详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    fetchResults(data) {
        return xhr({
            method: 'get',
            url: '/business/result',
            params: data
        })
    }

    // added by ser
    // edit module api calls
    createBusinessTemplate(data) {
        return xhr({
            method: 'post',
            url: '/business/template/create',
            params: data
        })
    }

    newBusinessTemplate(data) {
        return xhr({
            method: 'post',
            url: '/business/template/new',
            params: data
        })
    }
    
    templateSign(data) {
        return xhr({
            method: 'post',
            url: '/business/template/sign',
            params: data
        })
    }
    // edit module api calls end

    // display module api calls
    getBusinessStepStatus(data) {
        return xhr({
            method: 'get',
            url: '/business/step/status',
            params: data
        })
    }

    updateBusinessStepStatus(data) {
        return xhr({
            method: 'post',
            url: '/business/step/status/update',
            params: data
        })
    }
    
    deleteBusinessDisplayFile(data) {
        return xhr({
            method: 'post',
            url: '/business/docs/delete',
            params: data
        })
    }

    getBusinessDocTeamStatus(data) {
        return xhr({
            method: 'get',
            url: '/business/doc/team/status',
            params: data
        })
    }

    createBusinessDocTeamStatus(data) {
        return xhr({
            method: 'post',
            url: '/business/doc/team/status/create',
            params: data
        })
    }

    updateBusinessDocTeamStatus(data) {
        return xhr({
            method: 'post',
            url: '/business/doc/team/status/update',
            params: data
        })
    }

    createBusinessDocTeam(data) {
        return xhr({
            method: 'post',
            url: '/business/docs/team/create',
            params: data
        })
    }

    getBusinessPrevDocs(data) {
        return xhr({
            method: 'get',
            url: '/business/prev/doc/get',
            params: data
        })
    }

    createBusinessDocFromPrev(data) {
        return xhr({
            method: 'post',
            url: '/business/doc/create/prev',
            params: data
        })
    }
}

// 实例化后导出，全局单例
export default new BusinessService()