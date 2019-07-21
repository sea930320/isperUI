<template>
  <div class="qa-report p-3 text-left">
    <loading v-if="isRunning"></loading>
    <b-tabs content-class="mt-3">
      <b-tab title="默认报告">
        <div class="report-title text-center">
          调查问卷统计报告
          <b-button
            class="styledBtn float-right"
            variant="outline-primary"
            @click.stop="downloadReport()"
          >下载</b-button>
        </div>
        <report-selection
          v-for="(selectReport, index) in selectReports"
          :key="'select' + index"
          :report="selectReport"
          :index="index+1"
        ></report-selection>
        <hr class="my-5" />
        <report-blank
          v-for="(blankReport, index) in blankReports"
          :key="'blank' + index"
          :report="blankReport"
          :index="index+1"
        ></report-blank>
        <hr class="my-5" />
        <report-normal
          v-for="(normalReport, index) in normalReports"
          :key="'normal' + index"
          :report="normalReport"
          :index="index+1"
        ></report-normal>
      </b-tab>
      <b-tab title="分类统计">
        <div style="display: flex">
          <label class="type-label">题目类型:</label> &nbsp;&nbsp;
          <b-form-group>
            <b-form-radio-group v-model="type1" :options="options"></b-form-radio-group>
          </b-form-group>
        </div>
        <div class="type-content">
          <div v-if="type1==0">
            <report-selection
              v-for="(selectReport, index) in selectReports"
              :key="'select' + index"
              :report="selectReport"
              :index="index+1"
            ></report-selection>
          </div>
          <div v-if="type1==1">
            <report-blank
              v-for="(blankReport, index) in blankReports"
              :key="'blank' + index"
              :report="blankReport"
              :index="index+1"
            ></report-blank>
          </div>
          <div v-if="type1==2">
            <report-normal
              v-for="(normalReport, index) in normalReports"
              :key="'normal' + index"
              :report="normalReport"
              :index="index+1"
            ></report-normal>
          </div>
        </div>
      </b-tab>
      <b-tab title="单题统计">
        <div style="display: flex">
          <label class="type-label">题目类型:</label> &nbsp;&nbsp;
          <b-form-group>
            <b-form-radio-group v-model="type2" :options="options"></b-form-radio-group>
          </b-form-group>
        </div>
        <div style="display: flex">
          <label class="type-label">题目选择:</label> &nbsp;&nbsp;
          <b-form-select
            style="width: 300px;"
            v-model="selIndex"
            :options="titleOptions"
            size="sm"
            class="m-0"
          ></b-form-select>
        </div>
        <div class="type-content" v-if="selIndex != -1">
          <div v-if="type2==0">
            <report-selection :report="selReport" :index="selIndex+1"></report-selection>
          </div>
          <div v-if="type2==1">
            <report-blank :report="selReport" :index="selIndex+1"></report-blank>
          </div>
          <div v-if="type2==2">
            <report-normal :report="selReport" :index="selIndex+1"></report-normal>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import businessService from "@/services/businessService";
import Loading from "@/components/loading/Loading";
import ReportSelection from "@/views/business/progress/qa/ReportSelection";
import ReportBlank from "@/views/business/progress/qa/ReportBlank";
import ReportNormal from "@/views/business/progress/qa/ReportNormal";
import _ from "lodash";

export default {
  components: { Loading, ReportSelection, ReportBlank, ReportNormal },
  props: {
    publicSurvey: {
      type: Object,
      default: () => {}
    },
    fromPublic: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reports: null,
      type1: 0,
      type2: 0,
      options: [
        { text: "选择题", value: 0 },
        { text: "填空题", value: 1 },
        { text: "问答题", value: 2 }
      ],
      selIndex: -1,
      downloadUrl: "/api/business/survey/report/export"
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"]),
    survey() {
      if (this.fromPublic) return this.publicSurvey;
      return this.$store.state.meta.survey;
    },
    selectReports() {
      if (!this.reports) return [];
      return this.reports.select_questions;
    },
    blankReports() {
      if (!this.reports) return [];
      return this.reports.blank_questions;
    },
    normalReports() {
      if (!this.reports) return [];
      return this.reports.normal_questions;
    },
    titleOptions() {
      if (this.type2 == 0) {
        return _.map(this.selectReports, (report, index) => {
          return {
            text: report.title,
            value: index
          };
        });
      } else if (this.type2 == 1) {
        return _.map(this.blankReports, (report, index) => {
          return {
            text: report.title,
            value: index
          };
        });
      } else {
        return _.map(this.normalReports, (report, index) => {
          return {
            text: report.title,
            value: index
          };
        });
      }
    },
    selReport() {
      if (this.selIndex == -1) return null;
      if (this.type2 == 0) {
        return this.selectReports[this.selIndex];
      } else if (this.type2 == 1) {
        return this.blankReports[this.selIndex];
      } else {
        return this.normalReports[this.selIndex];
      }
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    init() {
      this.run();
      businessService
        .surveyReport({ survey_id: this.survey.id })
        .then(data => {
          this.reports = data;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    downloadReport() {
      window.open(this.downloadUrl + "?survey_id=" + this.survey.id);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-report {
  .report-title {
    font-weight: 700;
    font-size: 25px;
  }
  .type-label {
    color: #409eff;
    font-weight: bold;
    min-width: 100px;
  }
}
</style>