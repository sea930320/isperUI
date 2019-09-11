<template>
  <div class="experiment-wrapper">
    <div class="row">
      <div class="col-xs-12 center">
        <SearchInput v-model.lazy="params.search" placeholder="请输入内容" @on-search="searchExp"></SearchInput>
      </div>
    </div>
    <div class="experiment-list-wrap">
      <div class="table-wrapper mt20" v-loading="isLoading">
        <div v-if="!isLoading && !experiments.total" class="no-result">
          <p class="text">没有相关数据</p>
        </div>
        <div v-if="experiments.total > 0" class="table-container">
          <table class="table table-green table-striped table-hover table-border-full">
            <colgroup>
              <col width="1%">
              <col width="4%">
              <col width="20%">
              <col width="20%">
              <col width="10%">
              <col width="10%">
              <col width="7%">
              <col width="10%">
              <col width="9%">
              <col width="9%">
            </colgroup>
            <thead>
              <tr>
                <th><checkbox v-model="allCheck"></checkbox></th>
                <th>序号</th>
                <th>任务名称</th>
                <th>项目名称</th>
                <th>对应课堂</th>
                <th>创建时间</th>
                <th>创建者</th>
                <th>创建者类型</th>
                <th v-if="status == 1">状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in experiments.list" :key="index">
                <td><checkbox v-model="item.checked" @input="emitChecked"></checkbox></td>
                <td>{{index + 1}}</td>
                <td>{{item.name}}</td>
                <td>{{item.project.name}}</td>
                <td>{{item.course_class? item.course_class.name : '无'}}</td>
                <td>{{item.create_time}}</td>
                <td>{{item.created_by.name}}</td>
                <td>{{item.created_by.identity | identity}}</td>
                <td v-if="status == 1">
                  <a href="javascript:;" class="new-task-btn">{{item.status | experimentStatus}}</a>
                </td>
                <td v-if="status == 1">
                  <a href="javascript:;" class="new-task-btn" @click="startTaskHandler(item)">开始业务</a>
                </td>
                <td v-if="status == 2">
                  <router-link class="new-task-btn" :to="{name: 'doneDetail', params: {eid: item.id}}">查看</router-link>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td :colspan="status == 1 ? 10 : 9">
                  <div class="pagination-wrapper" v-if="experiments.total > params.size">
                    <page :page="params.page"  :page-size="params.size"  :total="experiments.total" :page-handler="pageHandler"></page>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
          <div class="bottom-button">
            <a href="javascript:;" class="btn btn-blue" @click="handleDelete">删除任务</a>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除角色Modal -->
    <modal :visible="deleteModal" title="删除提醒" @on-cancel="deleteModal=false" @on-ok="comfirmDelete">
      <div class="modal-msg">
        <p class="message">是否确认要删除选中的业务吗?</p>
      </div>
    </modal>
    <!-- 开始业务Modal -->
    <startAnimation :showStartModal="startModal"></startAnimation>
  </div>
</template>
<script type="text/ecmascript-6">
import startAnimation from 'src/views/pages/experiment/doing/_components/start-animation'
import modal from 'components/modal/modal'
import SearchInput from 'components/search-input/search-input'
import checkbox from 'components/checkbox/checkbox'
import page from 'components/pagination/pagination'
import { identity, experimentStatus } from 'src/filters/fun'
import ExperimentService from 'src/services/experimentService'
export default {
  components: { page, modal, SearchInput, checkbox, startAnimation },
  filters: { experimentStatus, identity },
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      startModal: false,
      isLoading: false,
      deleteModal: false,
      experiments: {
        list: [],
        total: 0
      },
      params: {
        search: '',
        status: 1,
        page: 1,
        size: 15
      }
    }
  },
  computed: {
    allCheck: {
      get() {
        return this.experiments.list.every(item => item.checked)
      },
      set(val) {
        this.experiments.list.forEach(item => {
          item.checked = val
        })
        this.emitChecked()
      }
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    checkeds() {
      return this.experiments.list.filter(item => item.checked)
    }
  },
  methods: {
    init() {
      this.params.status = this.status
      this.fetchExpList()
    },
    // 将勾选的业务传递给父级
    emitChecked() {
      this.$emit('on-checked', this.checkeds)
    },
    // 查询数据
    searchExp(value) {
      this.params.search = value
    },
    pageHandler(page) {
      this.params.page = page
    },
    fetchExpList() {
      this.isLoading = true
      ExperimentService.fetchList(this.params).then(data => {
        this.experiments.list = data.results.map(item => {
          this.$set(item, 'checked', false)
          return item
        })
        this.experiments.total = data.paging.count
        this.isLoading = false
      })
    },
    // 删除前验证
    deleteValidate() {
      if (this.checkeds.length === 0) {
        this.$toast.warn('您未勾选任何业务任务')
        return false
      }

      let result = this.checkeds.some(item => {
        return item.status === 2
      })

      if (result) {
        this.$toast.warn('有些业务已开始不能删除')
        return false
      }

      return this.checkeds.every(item => {
        if (item.team.leader.id !== this.userInfo.id &&
          item.created_by.id !== this.userInfo.id) {
          this.$toast.error(`你不是${item.name}业务小组组长或者创建者无权删除`)
        }
        return item.team.leader.id === this.userInfo.id ||
          item.created_by.id === this.userInfo.id
      })
    },
    handleDelete() {
      if (this.deleteValidate()) {
        this.deleteModal = true
      }
    },
    // 确定删除
    comfirmDelete() {
      ExperimentService.delete({data: JSON.stringify(this.checkeds.map(it => it.id))}).then(() => {
        this.checkeds.forEach(item => {
          let index = this.experiments.list.indexOf(item)
          this.experiments.list.splice(index, 1)
        })
      })
      this.deleteModal = false
    },
    // 开始业务处理
    startTaskHandler(exp) {
      if (exp.status === 9) {
        this.$toast.error('该业务已结束不能重新开始')
        return false
      }

      ExperimentService.getExperimentDetail({
        experiment_id: exp.id
      })
      .then(data => {
        // console.log(data)
        if (!data.course_class) {
          this.$toast.warn('未注册到课堂，不能进入业务')
          return
        } else if (data.role_not_set) {
          this.$toast.warn(data.role_not_set)
          return
        } else {
          if (data.status === 1) {
            // 等待中
            if (this.userInfo.id !== exp.team.leader.id) {
              this.$toast.warn('您不是该业务小组的组长，无权开始本业务')
              return
            }
            ExperimentService.startExperiment({
              experiment_id: exp.id
            })
            .then(data => {
              this.toMeta(data)
            })
          } else if (data.status === 2) {
            // 进行中
            this.toMeta(data)
          } else {
            // 已结束
            this.$toast.info('该业务已结束，不能进入')
          }
        }
      })
    },
    toMeta(data) {
      /* if (data.user_roles.length === 0) {
        this.$toast.warn('您在业务所在环节没有角色，不能进入业务')
        return
      } */
      this.startModal = true
      let param = {
        huanxin_id: data.huanxin_id,
        experiment_id: data.id,
        node_id: data.node.id,
        flow_id: data.flow_id,
        process_type: data.node.process_type
      }
      // 设定业务的参数
      // this.setExpParam(param)
      // this.$store.dispatch('setCurrentRole', data.user_roles[0])
      // this.setCurrentRole(data.user_roles[0])
      setTimeout(() => {
        let type = data.node.process_type
        this.$router.push({path: `/experiment/meta/${type}/${data.id}/${data.node.id}`})
      }, 1000)
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    params: {
      handler() {
        this.fetchExpList()
      },
      deep: true
    }
  }
}
</script>
<style>
</style>
