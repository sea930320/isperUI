import xhr from './xhr/'
/**
 * 流程相关的 API
 */
class WorkflowService {

  /**
   * 获取流程列表
   * @param  {Object} 查询参数
   * @return {Object} workflows
   */
  fetchList(options) {
    return xhr({
      method: 'get',
      url: '/workflow/list',
      params: options
    })
  }

  /**
   * 创建流程
   * @param  {Object}
   * @return {Object} workflow
   */
  create(data) {
    return xhr({
      method: 'post',
      url: '/workflow/create',
      params: data
    })
  }

  /**
   * 更新流程
   * @param  {String}
   * @return {Object}
   */
  updateWorkflow(data) {
    return xhr({
      method: 'post',
      url: '/workflow/update',
      params: data
    })
  }

  /**
   * 删除流程
   * @param  {String}
   * @return {Object}
   */
  deleteWorkflow(data) {
    return xhr({
      method: 'post',
      url: '/workflow/delete',
      params: data
    })
  }

  /**
   * 发布流程
   * @param  {String}
   * @return {Object}
   */
  publishWorkflow(data) {
    return xhr({
      method: 'post',
      url: '/workflow/publish',
      params: data
    })
  }

  /**
   * 复制流程
   * @param  {String}
   * @return {Object}
   */
  copyWorkflow(data) {
    return xhr({
      method: 'post',
      url: '/workflow/flow/copy',
      params: data
    })
  }

  /**
   * 画流程图
   * @param  {String}
   * @return {Object}
   */
  drawWorkflow(data) {
    return xhr({
      method: 'post',
      url: '/workflow/flow/draw',
      params: data
    })
  }

  /**
   * 获取流程的环节列表
   * @param  {String}
   * @return {Object}
   */
  getWorkflowNodeList(data) {
    return xhr({
      method: 'get',
      url: '/workflow/node/list',
      params: data
    })
  }

  /**
   * 获取流程的详情
   * @param data
   * @returns {{pre, visitor}|*}
   */
  getWorkflowDetail(data) {
    return xhr({
      method: 'get',
      url: '/workflow/detail',
      params: data
    })
  }

  /**
   * 获取所有程序模块
   * @param  {String}
   * @return {Object}
   */
  getProcesses(data) {
    return xhr({
      method: 'get',
      url: '/workflow/processes',
      params: data
    })
  }

  /**
   * 获取程序模块相应的所有站位
   * @param  {String}
   * @return {Object}
   */
  getProcessPositions(data) {
    return xhr({
      method: 'get',
      url: '/workflow/process/positions',
      params: data
    })
  }

  /**
   * 更新流程的环节设置
   * @param  {String}
   * @return {Object}
   */
  updateWorkflowNodes(data) {
    return xhr({
      method: 'post',
      url: '/workflow/nodes/update',
      params: data
    })
  }

  /**
   * 获取流程的所有文档
   * @param  {String}
   * @return {Object}
   */
  getWorkflowDocList(data) {
    return xhr({
      method: 'get',
      url: '/workflow/doc/list',
      params: data
    })
  }

  /**
   * 删除流程文档
   * @param  {String}
   * @return {Object}
   */
  deleteWorkflowDoc(data) {
    return xhr({
      method: 'post',
      url: '/workflow/docs/delete',
      params: data
    })
  }

  /**
   * 更新流程文档设置
   * @param  {String}
   * @return {Object}
   */
  updateWorkflowDoc(data) {
    return xhr({
      method: 'post',
      url: '/workflow/docs/update',
      params: data
    })
  }

  /**
   * 新建角色
   * @param  {String}
   * @return {Object}
   */
  createWorkflowRole(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/create',
      params: data
    })
  }

  /**
   * 删除角色
   * @param  {String}
   * @return {Object}
   */
  deleteWorkflowRoles(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/delete',
      params: data
    })
  }

  /**
   * 更新角色
   * @param  {String}
   * @return {Object}
   */
  updateWorkflowRole(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/update',
      params: data
    })
  }

  /**
   * 获取流程相关项目业务数据
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRelated(data) {
    return xhr({
      method: 'get',
      url: '/workflow/related',
      params: data
    })
  }

  /**
   * 保存流程动作设置
   * @param  {String}
   * @return {Object}
   */
  saveWorkflowRoleAction(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/action',
      params: data
    })
  }

  /**
   * 获取流程角色分配数据
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRoleAllcation(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/allcation',
      params: data
    })
  }

  /**
   * 获取流程角色分配数据
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRoleAssign(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/assign/info',
      params: data
    })
  }

  /**
   * 保存流程角色分配数据
   * @param  {String}
   * @return {Object}
   */
  saveWorkflowRoleAllocate(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/allocate',
      params: data
    })
  }

  /**
   * 角色站位设置保存按钮
   * @param  {String}
   * @return {Object}
   */
  saveWorkflowRolePosition(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/position',
      params: data
    })
  }

  /**
   * 更新一个角色站位
   * @param  {String}
   * @return {Object}
   */
  updateRolePosition(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/position/setup',
      params: data
    })
  }

  /**
   * 保存流程角色列表
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRoleList(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/list',
      params: data
    })
  }

  /**
   * 获取流程角色形象列表
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRoleImageList(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/image/list',
      params: data
    })
  }

  /**
   * 获取所有动作
   * @param  {String}
   * @return {Object}
   */
  getWorkflowActions(data) {
    return xhr({
      method: 'get',
      url: '/workflow/flow/actions',
      params: data
    })
  }

  /**
   * 获取角色动作配置
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRoleActions(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/action',
      params: data
    })
  }

  /**
   * 获取角色场景动画配置
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRoleProcessActions(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/process/actions',
      params: data
    })
  }

  /**
   * 保存角色场景动画配置
   * @param  {String}
   * @return {Object}
   */
  saveWorkflowRoleProcessAction(data) {
    return xhr({
      method: 'post',
      url: '/workflow/roles/process/action',
      params: data
    })
  }

  /**
   * 保护流程
   * @param  {String}
   * @return {Object}
   */
  lockWorkflow(data) {
    return xhr({
      method: 'post',
      url: '/workflow/protected',
      params: data
    })
  }
  /**
   * 共享
   * @param  {String}
   * @return {Object}
   */
  shareWorkflow(data) {
    return xhr({
      method: 'get',
      url: '/workflow/share',
      params: data
    })
  }
  /**
   * Un共享
   * @param  {String}
   * @return {Object}
   */
  unshareWorkflow(data) {
    return xhr({
      method: 'get',
      url: '/workflow/unshare',
      params: data
    })
  }

  /**
   * Public
   * @param  {String}
   * @return {Object}
   */
  publicWorkflow(data) {
    return xhr({
      method: 'get',
      url: '/workflow/public',
      params: data
    })
  }

  /**
   * Public
   * @param  {String}
   * @return {Object}
   */
  unpublicWorkflow(data) {
    return xhr({
      method: 'get',
      url: '/workflow/unpublic',
      params: data
    })
  }

  /**
   * Public
   * @param  {String}
   * @return {Object}
   */
  getJobTypes(data) {
    return xhr({
      method: 'get',
      url: '/workflow/job_types',
      params: data
    })
  }

  /**
   * Public
   * @param  {String}
   * @return {Object}
   */
  getOfficeItems(data) {
    return xhr({
      method: 'get',
      url: '/workflow/office_items',
      params: data
    })
  }

  /**
   * Public
   * @param  {String}
   * @return {Object}
   */
  getCandidateJobType(data) {
    return xhr({
      method: 'get',
      url: '/workflow/job_type/candidate',
      params: data
    })
  }

  /**
   * Role Allocation List
   * @param  {String}
   * @return {Object}
   */
  roleAllocationList(data) {
    return xhr({
      method: 'get',
      url: '/workflow/role/allocation/list',
      params: data
    })
  }

  /**
   * Role Allocation Create
   * @param  {String}
   * @return {Object}
   */
  roleAllocationCreate(data) {
    return xhr({
      method: 'post',
      url: '/workflow/role/allocation/create',
      params: data
    })
  }

  /**
   * Role Allocation Remove
   * @param  {String}
   * @return {Object}
   */
  roleAllocationRemove(data) {
    return xhr({
      method: 'post',
      url: '/workflow/role/allocation/remove',
      params: data
    })
  }

  /**
   * Role Allocation Remove
   * @param  {String}
   * @return {Object}
   */
  roleAllocationBulkUpdate(data) {
    return xhr({
      method: 'post',
      url: '/workflow/role/allocation/bulk_update',
      params: data
    })
  }

  updateWorkflowRoleAllocImage(data) {
    return xhr({
      method: 'post',
      url: '/workflow/role/allocation/image_update',
      params: data
    })
  }

  getSelectDecideSeetings(data) {
    return xhr({
      method: 'post',
      url: '/workflow/selectDecide/get_setting',
      params: data
    })
  }

  getRelatedBusinessCount(data) {
    return xhr({
      method: 'post',
      url: '/workflow/selectDecide/get_related_business_count',
      params: data
    })
  }

  setSelectDecideSeetings(data) {
    return xhr({
      method: 'post',
      url: '/workflow/selectDecide/set_setting',
      params: data
    })
  }
}

export default new WorkflowService()
