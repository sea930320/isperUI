function isUndefined(value) {
  return typeof value === 'undefined'
}

function isDefined(value) {
  return typeof value !== 'undefined'
}

function isObject(value) {
  return value !== null && typeof value === 'object'
}

function isString(value) {
  return typeof value === 'string'
}

function isNumber(value) {
  return typeof value === 'number'
}

function isArray(value) {
  return Array.isArray(value)
}

function isArrayLike(value) {
  return Array.isArray(value) || (isObject(value) && isNumber(value.length) && value.length > -1)
}

function isFunction(value) {
  return typeof value === 'function'
}

export default { // var this =
  trim: function(str) {
    if (!isString(str)) return str
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  },
  /**
   * 遍历
   * @param obj {object | Array}
   * @param func
   */
  each: function(obj, func) {
    var item
    if (isArrayLike(obj)) {
      var i = 0
      var l = obj.length
      for (i; i < l; i++) {
        item = obj[i]
        if (isDefined(item)) func(item, i)
      }
    } else if (isObject(obj)) {
      var key
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          item = obj[key]
          func(item, key)
        }
      }
    }
  },
  some: function(obj, func) {
    if (isArrayLike(obj)) {
      var i = 0
      var l = obj.length
      for (i; i < l; i++) {
        if (isDefined(obj[i]) && func(obj[i], i)) return true
      }
    } else if (isObject(obj)) {
      var key
      for (key in obj) {
        if (obj.hasOwnProperty(key) && func(obj[key], key)) return true
      }
    }
    return false
  },
  all: function(obj, func) {
    var l, results
    if (isArrayLike(obj)) {
      var i = 0
      l = obj.length
      results = 0
      for (i; i < l; i++) {
        if (isDefined(obj[i]) && func(obj[i], i)) results++
      }
      return (results === l)
    } else if (isObject(obj)) {
      var key
      l = 0
      results = 0
      for (key in obj) {
        l++
        if (obj.hasOwnProperty(key) && func(obj[key], key)) results++
      }
      return (results === l)
    }
    return false
  },
  clone: function(o, d) {
    if (o === null || o === undefined || typeof (o) !== 'object') {
      return o
    }
    var deep = !!d
    var cloned
    var i
    if (o.constructor === Array) {
      if (deep === false) {
        return o
      }
      cloned = []
      for (i in o) {
        cloned.push(this.clone(o[i], deep))
      }
      return cloned
    }

    cloned = {}

    for (i in o) {
      cloned[i] = deep ? this.clone(o[i], true) : o[i]
    }
    return cloned
  },

  extend: function(base, input) {
    if (!((isObject(base) && isObject(input)) || (isArrayLike(base) && isArrayLike(input)))) {
      return base
    }
    var result = this.clone(base, true)
    this.each(input, function(item, key) {
      if (isUndefined(item)) return
      result[key] = item
    })
    return result
  },

  bind: function(func, thisArg) {
    var args = Array.prototype.slice.call(arguments, 2)
    return function() {
        var inputArgs = Array.prototype.slice.call(arguments, 0)
        this.each(inputArgs, function(item, index) {
          args[index] = item
        })
        return func.apply(thisArg, args)
      }
  },

  /**
   * 判断 host 是否包含 obj
   * @param host 宿主对象
   * @param obj 需要判断的对象
   */
  contain: function(host, obj) {
    if (!(isObject(host) && isObject(obj))) {
      return false
    }
    var invalid = this.some(obj, function(value, key) {
      if (value !== host[key]) {
        return true
      }
    })
    return !invalid
  },

  /**
   * 倒序遍历
   * @param array
   * @param func
   */
  reverseEach: function(array, func) {
    if (!isArrayLike(array)) return false
    var i = array.length
    var item
    while (i--) {
      item = array[i]
      if (isDefined(item)) func(item, i)
    }
  },

  /**
   * 删除数组中的元素
   * @param array
   * @param reason {number | function | object}
   * number : 该元素在数组中的 index
   * function (item, index) : 自定义删除逻辑，返回 true 时删除
   * object : 和数组中的元素做对比，key和value 都匹配时删除
   */
  remove: function(array, reason) {
    if (isUndefined(reason) || !isArray(array)) return false
    var index = -1
    if (isNumber(reason)) {
      index = reason
    } else {
      index = this.indexOf(array, reason)
    }
    if (index > -1) array.splice(index, 1)
  },

  /**
   * 删除数组中的元素，满足条件的全部删除
   * @param array
   * @param reason {function | object}
   * function (item, index) : 自定义删除逻辑，返回 true 时删除
   * object : 和数组中的元素做对比，key和value 都匹配时删除
   */
  removeAll: function(array, reason) {
    if (isUndefined(reason)) return false
    var index = this.indexOf(array, reason)
    if (index > -1) {
      array.splice(index, 1)
      this.removeAll(array, reason)
    } else {
      return true
    }
  },

  /**
   * 查找在数组中位置
   * @param array
   * @param reason {function | object}
   * @param start 开始位置
   * function (item, index) : 自定义逻辑，返回 true 时
   * object : 和数组中的元素做对比，key和value都匹配时
   */
  indexOf: function(array, reason, start) {
    var i = start || 0
    var index = -1
    var item
    while (i < array.length) {
      item = array[i]

      if (isObject(reason)) {
        if (this.contain(item, reason)) {
          index = i
          break
        }
      } else if (isFunction(reason)) {
        if (reason(item, i)) {
          index = i
          break
        }
      } else {
        if (item === reason) {
          index = i
          break
        }
      }
      i++
    }
    return index
  },

  find: function(array, reason) {
    var index = this.indexOf(array, reason)
    if (index > -1) return array[index]
  },

  findAll: function(array, reason) {
    var index = -1
    var results = []
    do {
      index = this.indexOf(array, reason, index + 1)
      if (index > -1) results.push(array[index])
    } while (index > -1)
    return results
  }
}
