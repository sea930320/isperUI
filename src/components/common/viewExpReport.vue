<template>
  <modal
  :visible="visible"
  title="实验报告"
  :footerHide="true"
  size="panel"
  @on-cancel="cancel">
    <div class="meta-main-box">
      <div class="meta-content-wrapper clearfix">
        <div class="border report-wrapper">
          <div class="report-title blue3a tac">
            实验报告
            <span class="report-num"></span>
          </div>
          <div class="container report-info">
            <div class="row">
              <div class="col-xs-6 col-lg-4">任务名称：{{report.data.name}}</div>
              <div class="col-xs-6 col-lg-4">项目名称：{{report.data.project_name}}</div>
              <div class="col-xs-6 col-lg-4">流程名称：{{report.data.flow_name}}</div>
              <div class="col-xs-6 col-lg-4">课程信息：{{report.data.course_class ? report.data.course_class : '无'}}</div>
              <div class="col-xs-6 col-lg-4">任课老师：{{report.data.teacher ? report.data.teacher : ''}}</div>
              <div class="col-xs-6 col-lg-4">小组名称：{{report.data.team_name}}</div>
              <div class="col-xs-6 col-lg-4">实际完成时间：{{report.data.finish_time ? report.data.finish_time : ''}}</div>
              <div class="col-xs-6 col-lg-4">创建时间：{{report.data.create_time}}</div>
            </div>
            <div class="row">
              <div class="col-xs-12">成员名单：<span v-for="(member, i) in report.data.members" :key="i">{{member}}&nbsp;&nbsp;</span></div>
            </div>
            <div class="row">
              <div class="col-xs-12">组长：{{report.data.leader_name}}</div>
            </div>
          </div>
          <Panel title="业务成果">
            <div class="accordion-wrapper">
              <resultCollapse :nodes="report.nodes" :status="2"></resultCollapse>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import modal from 'components/modal/modal'
import Panel from 'components/panel/panel'
import resultCollapse from 'pages/experiment/meta/_components/result-collapse'
import experimentService from 'src/services/experimentService'
export default {
  name: 'viewExpReport',
  components: { modal, Panel, resultCollapse },
  props: ['visible', 'expId'],
  data() {
    return {
      report: {
        data: {},
        nodes: []
      }
    }
  },
  watch: {
    'expId': function(val) {
      this.init()
    }
  },
  methods: {
    init() {
      let param = { experiment_id: this.expId }
      experimentService
        .fetchResults(param)
        .then(data => {
          this.report.data = data.detail
          this.report.nodes = data.nodes
        })
    },
    replaceContent(con) {
      return con.replace(/\r?\n|\r/g, '<br/>')
    },
    cancel() {
      this.$emit('cancelView')
    }
  }
}
</script>
