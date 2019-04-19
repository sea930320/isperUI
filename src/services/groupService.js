import xhr from './xhr/'
/**
 * 流程相关的 API
 */
class GroupService {

  fetchList(options) {
    return xhr({
      method: 'get',
      url: '/group/list',
      params: options
    })
  }

  create(data) {
    return xhr({
      method: 'post',
      url: '/group/create',
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
      url: '/group/update',
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
      url: '/group/delete',
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
      url: '/group/publish',
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
      url: '/group/flow/copy',
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
      url: '/group/flow/draw',
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
      url: '/group/node/list',
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
      url: '/group/detail',
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
      url: '/group/processes',
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
      url: '/group/process/positions',
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
      url: '/group/nodes/update',
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
      url: '/group/doc/list',
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
      url: '/group/docs/delete',
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
      url: '/group/docs/update',
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
      url: '/group/roles/create',
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
      url: '/group/roles/delete',
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
      url: '/group/roles/update',
      params: data
    })
  }

  /**
   * 获取流程相关项目实验数据
   * @param  {String}
   * @return {Object}
   */
  getWorkflowRelated(data) {
    return xhr({
      method: 'get',
      url: '/group/related',
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
      url: '/group/roles/action',
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
      url: '/group/role/allcation',
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
      url: '/group/role/assign/info',
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
      url: '/group/roles/allocate',
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
      url: '/group/roles/position',
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
      url: '/group/roles/position/setup',
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
      url: '/group/role/list',
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
      url: '/group/role/image/list',
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
      url: '/group/flow/actions',
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
      url: '/group/role/action',
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
      url: '/group/role/process/actions',
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
      url: '/group/roles/process/action',
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
      url: '/group/protected',
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
      url: '/group/share',
      params: data
    })
  }
}

export default new GroupService()