// 用户身份
export function identity(num) {
  if (num === 1) {
    return '实验人员'
  } else if (num === 2) {
    return '实验指导'
  } else if (num === 3) {
    return '系统管理员'
  } else if (num === 4) {
    return '超级管理员'
  } else {
    return
  }
}

// 程序模块类别
export function processType(val) {
  if (val === 1) {
    return '动画'
  } else if (val === 2) {
    return '编辑'
  } else if (val === 3) {
    return '展示'
  } else if (val === 4) {
    return '心得'
  } else if (val === 5) {
    return '投票'
  } else if (val === 6) {
    return '跳转'
  } else if (val === 7) {
    return '公示'
  } else if (val === 8) {
    return '表决'
  } else if (val === 9) {
    return '嵌套'
  } else if (val === 10) {
    return '交付与签收'
  } else if (val === 11) {
    return '调查问卷'
  } else if (val === 12) {
    return '判断与选择'
  } else {
    return ''
  }
}

// 用户性别
export function gender(val) {
  if (val === 1) {
    return '男'
  } else if (val === 2) {
    return '女'
  } else {
    return '男'
  }
}

// 转换能力目标
export function abilityTarget(num) {
  if (num === 1) {
    return '简易'
  } else if (num === 2) {
    return '基础'
  } else if (num === 3) {
    return '进阶'
  } else if (num === 4) {
    return '综合'
  } else if (num === 5) {
    return '创新'
  } else {
    return
  }
}
// 转换实验类型
export function expType(num) {
  if (num === 1) {
    return '立法类型实验'
  } else if (num === 2) {
    return '执法类型实验'
  } else if (num === 3) {
    return '诉讼与仲裁实验'
  } else if (num === 4) {
    return '自由类型实验'
  } else if (num === 5) {
    return '非诉讼与法务管理类型实验'
  } else if (num === 6) {
    return '法律思维类型实验'
  } else if (num === 7) {
    return '证据科学类型实验'
  } else if (num === 8) {
    return '法律实效评价类型实验'
  } else {
    return
  }
}

// 转换项目等级
export function level(num) {
  if (num === 1) {
    return '*'
  } else if (num === 2) {
    return '**'
  } else if (num === 3) {
    return '***'
  } else if (num === 4) {
    return '****'
  } else if (num === 5) {
    return '*****'
  } else {
    return ''
  }
}

// 转换申请公共项目状态
export function publicStatus(num) {
  if (num === 1) {
    return '申请'
  } else if (num === 2) {
    return '不申请'
  } else {
    return ''
  }
}

// 转换流程图显示
export function entireGraph(num) {
  if (num === 1) {
    return '完整显示'
  } else if (num === 2) {
    return '逐步显示'
  } else if (num === 3) {
    return '不显示'
  } else {
    return ''
  }
}

// 成果参考释放方式
export function reference(num) {
  if (num === 1) {
    return '同步'
  } else if (num === 2) {
    return '后步'
  } else if (num === 3) {
    return '最后'
  } else {
    return ''
  }
}

// 开放模式
export function isOpen(num) {
  if (num === 1) {
    return '自由'
  } else if (num === 2) {
    return '不公开'
  } else if (num === 3) {
    return '限时'
  } else if (num === 4) {
    return '指定用户'
  } else if (num === 5) {
    return '指定部门/单位'
  } else {
    return ''
  }
}

export function canRedo(num) {
  if (num === 1) {
    return '允许'
  } else if (num === 2) {
    return '不允许'
  } else {
    return ''
  }
}

// 添加角色人物类别
export function categoryValue(value) {
  value = parseInt(value)
  if (value === 1) {
    return '律师'
  } else if (value === 2) {
    return '法官'
  } else if (value === 3) {
    return '公务员'
  } else if (value === 4) {
    return '检察官'
  } else if (value === 5) {
    return '公证员'
  } else if (value === 6) {
    return '立法者'
  } else if (value === 99) {
    return '其他'
  } else {
    return ''
  }
}

// 实验任务状态
export function businessStatus(value) {
  if (value === 1) {
    return '等待中'
  } else if (value === 2) {
    return '进行中'
  } else if (value === 9) {
    return '已结束'
  } else {
    return ''
  }
}

// 实验任务状态
export function experimentStatus(value) {
  if (value === 1) {
    return '等待中'
  } else if (value === 2) {
    return '进行中'
  } else if (value === 9) {
    return '已结束'
  } else {
    return ''
  }
}

// 素材用途
export function docUsage(value) {
  if (value === 1) {
    return '操作指南'
  } else if (value === 2) {
    return '关联文件'
  } else if (value === 3) {
    return '模板'
  } else if (value === 4) {
    return '材料'
  } else if (value === 5) {
    return '公文'
  } else if (value === 6) {
    return '成果参考'
  } else if (value === 7) {
    return '项目提示'
  } else {
    return ''
  }
}

// 权限是否
export function isPower(value) {
  if (value === 0) {
    return '否'
  } else if (value === 1) {
    return '是'
  } else {
    return ''
  }
}

// 创建者类型
export function createType(value) {
  if (value === 1) {
    return '学生'
  } else if (value === 2) {
    return '老师'
  } else {
    return ''
  }
}
