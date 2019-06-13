
export default class CourtFlash {
  constructor(obj, options = {}) {
    if (!obj) {
      return
    }
    let preload = true;
    if (options.preload !== undefined && options.preload === false) {
        preload = false
    }
    this.obj = obj;
    this.tmp = {
        obj: obj,
        options: options
    };

    if (preload) {
        this.init(options)
    }
  }

  init(options) {
    // 如果已有角色，先隐藏
    let roleStr = this.getRoles();
    let oldRolesPosition = typeof roleStr === 'string' && roleStr.length > 0 ? roleStr.split(',') : [];
    oldRolesPosition.forEach(position => {
      this.roleShow(position, 0)
    });
    // 重新初始化角色
    this.roleInit(options.status)
  }

  /**
   * flash角色初始化
   * @param  {Object} flash
   */
  roleInit(status) {
    let self = this;
    let cmds = self.createCmds(status);
    // console.log(cmds)
    cmds.forEach(cmd => {
      self.setRole(cmd.role_cmd);
      self.roleAction(cmd.show_cmd);
      self.roleAction(cmd.move_cmd)
    })
  }

  /**
   * 获取角色flash站位status
   * @param  {Object} status
   * @return {array} array
   */
  createCmds(status) {
    let self = this;
    if (Array.isArray(status)) {
      return status.filter(item => {
        return item.position
      }).map(item => {
        return self.roleStatusToCmds(item)
      })
    } else if (typeof status === 'object') {
      return self.roleStatusToCmds(status)
    } else {
      return null
    }
  }

  /**
   * 将一个角色的状态数据转化为cmd
   * @param  {Object} item 角色状态对象
   */
  roleStatusToCmds(item) {
    return {
      role_cmd: `role=${item.position.code_position}&sex=${item.gender === 1 ? '男' : '女'}&actor1=${item.actors[0]}&actor2=${item.actors[1]}&studentName=${item.user_name ? item.user_name : item.user && item.user.name ? item.user.name : ''}`,
      show_cmd: `cmd=show&rolename=${item.position.code_position}&operate=${item.sitting_status === 1 ? 'dvisible' : 'visible'}`,
      move_cmd: `cmd=move&rolename=${item.position.code_position}&direct=${item.stand_status === 1 ? 'up' : 'down'}`
    }
  }

  /**
   * 获取要入席角色cmd
   * @param  {Object} position 角色在站位code
   * @param  {Object} gender 角色性别
   */
  getRoleCmd(position, gender, actors, username) {
    return `role=${position}&sex=${gender === 1 ? '男' : '女'}&actor1=${actors[0]}&actor2=${actors[1]}&studentName=${username}`
  }

  /**
   * 获取角色显示隐藏cmd
   * @param  {Object} position 角色在站位code
   * @param  {Object} sitting_status 入席/退席状态
   */
  getShowCmd(position, status) {
    return `cmd=show&rolename=${position}&operate=${status === 1 ? 'dvisible' : 'visible'}`
  }

  /**
   * 获取角色起立坐下cmd
   * @param  {Object} position 角色在站位code
   * @param  {Object} stand_status 起立/坐下状态
   */
  getMoveCmd(position, status) {
    return `cmd=move&rolename=${position}&direct=${status === 1 ? 'up' : 'down'}`
  }

  /**
   * flash设置角色
   * @param  {Object} flash
   */
  setRole(cmd) {
    try {
      this.obj.setRole(cmd)
    } catch (e) {
      console.log(e)
    }
  }

  getRoles() {
    try {
      return this.obj.getRoles()
    } catch (e) {
      // console.log(e)
    }
  }

  /**
   * flash角色动作
   * @param  {Object} flash
   */
  roleAction(cmd) {
    try {
      this.obj.action(cmd)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * flash角色显示与隐藏
   * @param  {Object} flash
   * @param  {String} position
   * @param  {Number} show 0: 隐藏 1：显示
   */
  roleShow(position, show) {
    this.roleAction(`cmd=show&rolename=${position}&operate=${show === 0 ? 'dvisible' : 'visible'}`)
  }

  /**
   * flash角色入席 单个角色
   * @param  {Object} flash
   * @param  {Object} status 角色状态数据
   */
  sittingRole(status) {
    let cmds = this.createCmds(status);
    // console.log(cmds)
    try {
      this.setRole(cmds.role_cmd);
      this.roleAction(cmds.show_cmd)
      // this.roleShow(status.position.code_position, 1)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * flash角色入席 单个角色
   * @param  {Object} flash
   * @param  {Object} status 角色状态数据
   */
  sittingReportRole(status) {
    let cmds = this.createCmds(status);
    try {
      this.setRole(cmds.role_cmd);
      this.roleAction(cmds.show_cmd)
      // this.roleShow(status.position.code_position, 1)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * flash角色入席 多个角色
   * @param  {Object} flash
   */
  sittingRoles(roles) {
    let self = this;
    roles.forEach(role => {
      self.sittingRole(role)
    })
  }
}
