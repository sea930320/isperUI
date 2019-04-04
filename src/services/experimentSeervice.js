import xhr from './xhr/'
/**
 * 实验相关的 API
 */
class ExperimentService {

    /**
     * 获取课程列表
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

    /**
     * 注册课堂列表
     * @returns {{pre, visitor}|*}
     */
    getCourseClassList(param) {
        return xhr({
            method: 'get',
            url: '/course/class/list?' + param
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
            url: '/experiment/list',
            params: data
        })
    }

    /**
     * 删除实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    delete(data) {
        return xhr({
            method: 'post',
            url: '/experiment/delete',
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
            url: '/experiment/result',
            params: data
        })
    }

    /**
     * 创建实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createExperiment(data) {
        return xhr({
            method: 'post',
            url: '/experiment/create',
            params: data
        })
    }

    /**
     * 获取实验详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentDetail(data) {
        return xhr({
            method: 'get',
            url: '/experiment/detail',
            params: data
        })
    }

    /**
     * 保存实验更新
     * @param data
     * @returns {{pre, visitor}|*}
     */
    updateExperiment(data) {
        return xhr({
            method: 'post',
            url: '/experiment/update',
            params: data
        })
    }

    /**
     * 开始实验
     * @param data
     * @returns {{pre, visitor}|*}
     */
    startExperiment(data) {
        return xhr({
            method: 'post',
            url: '/experiment/start',
            params: data
        })
    }

    /**
     * 获取请入实验角色
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentRoleInList(data) {
        return xhr({
            method: 'get',
            url: '/experiment/role/in/list',
            params: data
        })
    }

    /**
     * 获取请出实验角色
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentRoleOutList(data) {
        return xhr({
            method: 'get',
            url: '/experiment/role/out/list',
            params: data
        })
    }

    /**
     * 获取实验环节详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentNodeDetail(data) {
        return xhr({
            method: 'get',
            url: '/experiment/node/detail',
            params: data
        })
    }

    /**
     * 获取实验环节所有素材
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentNodeDocs(data) {
        return xhr({
            method: 'get',
            url: '/experiment/node/role/docs',
            params: data
        })
    }

    /**
     * 获取动画环节所有功能按钮
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentNodeFunction(data) {
        return xhr({
            method: 'get',
            url: '/experiment/node/function',
            params: data
        })
    }

    /**
     * 获取环节交流历史记录
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentNodeMessages(data) {
        return xhr({
            method: 'get',
            url: '/experiment/node/messages',
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
            url: '/experiment/message/push',
            params: data
        })
    }

    /**
     * 申请约见
     * @param data
     * @returns {{pre, visitor}|*}
     */
    postExperimentMeetApply(data) {
        return xhr({
            method: 'post',
            url: '/experiment/meet/apply',
            params: data
        })
    }

    /**
     * 获取实验展示列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentDisplayList(data) {
        return xhr({
            method: 'get',
            url: '/experiment/file/display/list',
            params: data
        })
    }

    getExperimentDisplayApplication(data) {
        return xhr({
            method: 'get',
            url: '/experiment/display/application',
            params: data
        })
    }

    /**
     * 删除展示列表的文件
     * @param data
     * @returns {{pre, visitor}|*}
     */
    deleteExperimentDisplayFile(data) {
        return xhr({
            method: 'post',
            url: '/experiment/docs/delete',
            params: data
        })
    }

    /**
     * 获取实验所有环节对应笔记
     * @param data
     * @returns {*|{pre, visitor}}
     */
    getExperimentNoteList(data) {
        return xhr({
            method: 'get',
            url: '/experiment/note/list',
            params: data
        })
    }

    /**
     * 保存实验笔记
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveExperimentNote(data) {
        return xhr({
            method: 'post',
            url: '/experiment/note/create',
            params: data
        })
    }

    /**
     * 结束本环节
     * @param data
     * @returns {{pre, visitor}|*}
     */
    postExperimentNodeEnd(data) {
        return xhr({
            method: 'post',
            url: '/experiment/node/end',
            params: data
        })
    }

    /**
     * 获取实验模板
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentTemplates(data) {
        return xhr({
            method: 'get',
            url: '/experiment/templates',
            params: data
        })
    }

    /**
     * 保存编辑环节模板修改
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createExperimentTemplate(data) {
        return xhr({
            method: 'post',
            url: '/experiment/template/create',
            params: data
        })
    }

    /**
     * 新建模板
     * @param data
     * @returns {{pre, visitor}|*}
     */
    newExperimentTemplate(data) {
        return xhr({
            method: 'post',
            url: '/experiment/template/new',
            params: data
        })
    }

    /**
     * 生成实验报告
     * @param data
     * @returns {{pre, visitor}|*}
     */
    genarateExperimentReport(data) {
        return xhr({
            method: 'get',
            url: '/experiment/report/generate',
            params: data
        })
    }

    /**
     * 提交实验心得
     * @param data
     * @returns {{pre, visitor}|*}
     */
    postExperimentExperience(data) {
        return xhr({
            method: 'post',
            url: '/experiment/experience/save',
            params: data
        })
    }

    /**
     * 获取实验成果
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentResults(data) {
        return xhr({
            method: 'get',
            url: '/experiment/messages',
            params: data
        })
    }

    /**
     * 获取实验角色flash状态
     * @param data
     * @returns {*|{pre, visitor}}
     */
    getExperimentRoleStatus(data) {
        return xhr({
            method: 'get',
            url: '/experiment/role/status',
            params: data
        })
    }

    /**
     * 获得结束并走向的 选项
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperimentTransPath(data) {
        return xhr({
            method: 'get',
            url: '/experiment/trans/path',
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
            url: '/experiment/experience/list',
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

    /**
     * 应用模板签名
     * @param data 参数
     * @param data.experiment_id 实验id
     * @param data.node_id 环节id
     * @param data.doc_id 文档id
     * @returns {{pre, visitor}|*}
     */
    templateSign(data) {
        return xhr({
            method: 'post',
            url: '/experiment/template/sign',
            params: data
        })
    }

    /**
     * 开始实验跳转项目
     * @param data 参数
     * @param data.experiment_id 实验id
     * @param data.project_id 要跳转的项目id
     * @param data.data 角色配置数据
     * @returns {{pre, visitor}|*}
     */
    jumpStart(data) {
        return xhr({
            method: 'post',
            url: '/experiment/jump/start',
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
            url: '/experiment/role/report/list',
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
            url: '/experiment/request/sign/roles',
            params: data
        })
    }

    queryVoteStatus(data) {
        return xhr({
            method: 'get',
            url: '/experiment/node/vote/status',
            params: data
        })
    }

    getDocDetail(data) {
        return xhr({
            method: 'get',
            url: '/experiment/doc/detail',
            params: data
        })
    }

    /**
     * 获取留言的成员表
     * @param data 参数
     * @param data.experiment_id 实验id
     */
    getSendMembers(data) {
        return xhr({
            method: 'get',
            url: '/cms/to/user/list',
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
            url: '/cms/send/msg',
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
            url: '/cms/msg/list',
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
            url: '/cms/send/msg',
            params: data
        })
    }

    /**
     * 查询未读留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     */
    unReadMessage(data) {
        return xhr({
            method: 'get',
            url: '/cms/new/msg/num',
            params: data
        })
    }

    /**
     * 创建实验时新建小组
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createNewGroup(data) {
        return xhr({
            method: 'post',
            url: '/team/create/v3',
            params: data
        })
    }
}

export default new ExperimentService()