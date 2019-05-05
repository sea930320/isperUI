<template>
  <modal :visible="show" title="角色形象" size="large" @on-cancel="cancelshow" @on-ok="addFiguresOk">
    <div class="select-container row">
      <div class="left col-xs-4">
        <input type="text" class="search-input" v-model="searchKey">
        <ul class="list">
          <li v-for="(roleItem, index) in searchData" class="cursor" :class="{'active': activeTypeIndex==index }" @click="selectRoleImgType(roleItem, index)">{{roleItem.name}}</li>
        </ul>
      </div>
      <div class="right col-xs-8">
        <ul class="module-figure-content">
          <li v-for="(roleImageItem, index) in roleImageForType" @click="selectRoleName(roleImageItem, index)">
            <a href="javascript:;">
              <span class="module-avater" :class="{'role-img-active': activeRoleIndex==index}"><img :src="roleImageItem.avatar" alt="" width="100%"></span>
              <span class="module-text">{{roleImageItem.name}}-{{roleImageItem.gender == 1? '男' : '女'}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </modal>
</template>
<script type="text/ecmascript-6">
import modal from 'components/modal/modal'
import workflowService from 'src/services/workflowService'
export default {
  components: { modal },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleImageList: [],
      searchKey: '',
      curSelectRole: null,
      activeTypeIndex: 0,
      activeRoleIndex: -1
    }
  },
  computed: {
    searchData() {
      let that = this
      return that.roleImageList.filter(roleItem => {
        return String(roleItem.name).toLowerCase().indexOf(String(that.searchKey).toLowerCase()) !== -1
      })
    },
    roleImageForType() {
      if (this.searchData[this.activeTypeIndex]) {
        return this.searchData[this.activeTypeIndex].roles
      } else {
        return []
      }
    }
  },
  mounted() {
    workflowService
      .getWorkflowRoleImageList()
      .then(data => {
        if (data.length > 0) {
          this.roleImageList = data
        }
      })
  },
  watch: {
    show(val) {
      if (val) {
        this.reset()
      }
    }
  },
  methods: {
    // 选择角色形象
    selectRoleName(roleImageItem, index) {
      this.curSelectRole = roleImageItem
      this.activeRoleIndex = index
    },
    // 选择角色形象类型
    selectRoleImgType(roleItem, index) {
      this.activeTypeIndex = index
    },
    reset() {
      this.searchKey = ''
      this.curSelectRole = null
      this.activeTypeIndex = 0
      this.activeRoleIndex = -1
    },
    // 确认添加角色
    addFiguresOk() {
      if (!this.curSelectRole) {
        this.$toast.warn('请选择角色形象')
        return
      }
      this.$emit('on-ok', this.curSelectRole)
    },
    cancelshow() {
      this.$emit('on-cancel')
    }
  }
}
</script>
<style>
.select-container {
	height: 427px;
	font-size: 14px;
  border: 1px solid #cdcdcd;
}
.select-container>.left {
  padding: 0;
  height: 100%;
	border-right: 1px solid #cdcdcd;
}
.search-input {
	border: 1px solid #cdcdcd;
	width: 97%;
	width: calc(100% - 6px);
	height: 30px;
	line-height: 30px;
	margin: 3px;
	outline: none;
	padding-left: 10px;
}
.select-container>.left>.list {
	height: calc(100% - 40px);
	overflow-x: hidden;
	overflow-y: auto;
}
.select-container>.left>.list > li {
	height: 35px;
	line-height: 35px;
	padding: 0 8px;
	border-top: 1px solid #fff;
	border-bottom: 1px solid #fff;
}
.select-container>.left>.list > li:hover {
	border-top: 1px solid #cdcdcd;
	border-bottom: 1px solid #cdcdcd;
	background-color: #f2f9ff;
}
.select-container>.left>.list > li.active {
	background-color: #d9edf7;
}
.select-container>.right {
  padding: 0;
	height: 100%;
	overflow-y: auto;
}
.module-figure-content .module-avater.role-img-active {
  border: 1px solid #51C314;
}
</style>
