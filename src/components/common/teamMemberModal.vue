<template>
  <modal :visible="show" title="添加小组成员" size="large" :cancelHide="true" okText="添加" @on-ok="addok" @on-cancel="cancel">
    <div class="row center mb10">
      <SearchInput placeholder="请输入内容" ref="searchInputRef" class="mb10" v-model.trim="queryParam.search" @on-search="searchConfirm"></SearchInput>
    </div>
    <div class="table-wrapper border">
      <table class="table table-green table-striped table-hover">
        <colgroup>
          <col width="10%">
          <col width="30%">
          <col width="30%">
          <col width="10%">
          <col width="20%">
        </colgroup>
        <thead>
          <tr>
            <th><checkbox v-model="allCheck"></checkbox></th>
            <th>学号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>班级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in accountUsers.list" :key="index">
            <td><checkbox v-model="user.checked"></checkbox></td>
            <td>{{user.username}}</td>
            <td>{{user.name}}</td>
            <td>{{user.gender | gender}}</td>
            <td>{{user.class_name}}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-wrapper">
        <page :page="queryParam.page"  :page-size="queryParam.size"  :total="accountUsers.total" :page-handler="pageHandler"></page>
      </div>
    </div>
  </modal>
</template>
<script type="text/ecmascript-6">
import SearchInput from 'components/search-input/search-input'
import checkbox from 'components/checkbox/checkbox'
import modal from 'components/modal/modal'
import page from 'components/pagination/pagination'
import { gender } from 'src/filters/fun'
import { mapActions, mapGetters } from 'vuex'
import accountService from 'src/services/accountService'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    members: {  // 已选择的小组成员
      type: Array,
      default: []
    },
    courseId: {
      default: ''
    }
  },
  data() {
    return {
      addTeamModal: false,
      queryParam: {
        search: '',
        page: 1,
        size: 10,
        course_id: ''
      },
      accountUsers: {
        list: [],
        total: 0
      }
    }
  },
  filters: { gender },
  computed: {
    allCheck: {
      get() {
        return this.accountUsers.list.length > 0 && this.accountUsers.list.every(user => {
          return user.checked
        })
      },
      set(val) {
        this.accountUsers.list.forEach(user => {
          user.checked = val
        })
      }
    },
    checkedItems() {
      return this.accountUsers.list.filter((item) => {
        return item.checked === true
      })
    },
    selectedUsernames() {
      return this.members.map(item => {
        return item.username
      })
    },
    checkedUsernames() {
      return this.checkedItems.map(item => {
        return item.username
      })
    }
  },
  mounted() {
  },
  watch: {
    'queryParam': {
      handler(param) {
        this.queryAccountUsers(param)
      },
      deep: true
    },
    show(val) {
      this.queryParam.search = ''
      this.queryParam.page = 1
      this.$refs.searchInputRef.currentValue = ''
      if (val) {
        this.queryParam.course_id = this.courseId
        this.queryAccountUsers(this.queryParam)
      } else {
        this.accountUsers.list = []
      }
    }
  },
  methods: {
    queryAccountUsers(param) {
      accountService
        .getAccountUsers(param)
        .then(data => {
          data.results.forEach(it => {
            this.$set(it, 'checked', false)
          })
          this.accountUsers.list = data.results
          this.accountUsers.total = data.paging.count
        })
    },
    pageHandler(page) {
      this.queryParam.page = page
    },
    // 判断选择的用户是否已在成员中
    isMemberContain() {
      let result = true
      if (this.checkedUsernames.length === 0) {
        this.$toast.warn('请选择要添加的成员')
        return false
      }
      this.checkedUsernames.forEach(item => {
        if (this.selectedUsernames.indexOf(item) !== -1) {
          this.$toast.error('你勾选的用户小组成员中已存在，请重新选择')
          result = false
        }
      })
      return result
    },
    // 确认添加成员
    addok() {
      if (this.isMemberContain()) {
        this.$emit('add-member', this.checkedItems)
      }
    },
    // 取消
    cancel() {
      this.$emit('on-cancel')
    },
    searchConfirm(value) {
      this.queryParam.search = value
    }
  },
  components: {modal, checkbox, SearchInput, page}
}
</script>
<style scoped>
  .table-wrapper.border{
    min-height: 380px;
  }
</style>
