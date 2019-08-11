<template>
  <div class="qa-report-selection my-3">
    <div class="title">
      <span>{{index}}.</span>
      &nbsp; {{report.title}}
    </div>
    <table class="mt-3 table table-sm b-table table-bordered table-striped">
      <thead>
        <tr>
          <th class="text-left w-40">选项</th>
          <th class="text-left w-10">回答人数</th>
          <th class="text-left w-50">比例</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(question_case, index) in report.question_cases" :key="index">
          <td class="text-left w-40">{{question_case.case}}</td>
          <td class="text-left w-10">{{question_case.answers}}</td>
          <td class="w-50 px-3" style="vertical-align: middle">
            <b-progress animated variant="secondary">
              <b-progress-bar
                :value="question_case.answers / report.total_answers * 100"
                :label="`${((question_case.answers / report.total_answers) * 100).toFixed(1)}%`"
              ></b-progress-bar>
            </b-progress>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    report: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    init() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-report-selection {
  .title {
    font-size: 20px;
    font-weight: 500;
  }
  table {
    thead {
      background: #909090;
    }
  }
}
</style>