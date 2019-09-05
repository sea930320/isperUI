<template>
  <div class="qa-index">
    <loading v-if="isRunning"></loading>
    <b-card v-if="currentRoleAllocation.can_terminate && step != 6 && isActivity == -1">
      <b-tabs content-class="mt-2" class="qa-tabs" v-model="tabIndex">
        <b-tab title="主题和备注">
          <step1></step1>
        </b-tab>
        <b-tab title="选择题" :disabled="!step || step < 1">
          <step2></step2>
        </b-tab>
        <b-tab title="填空题" :disabled="!step || step < 2">
          <step3></step3>
        </b-tab>
        <b-tab title="问答题" :disabled="!step || step < 3">
          <step4></step4>
        </b-tab>
        <b-tab title="结束语" :disabled="!step || step < 4">
          <step5></step5>
        </b-tab>
        <b-tab title="预览问卷" :disabled="!step || step < 5">
          <step6></step6>
        </b-tab>
        <b-tab title="发布调查" :disabled="!step || step < 5">
          <step7></step7>
        </b-tab>
      </b-tabs>
      <b-button
        v-if="tabIndex!=0"
        class="styledBtn mt-3"
        variant="outline-primary"
        @click.stop="prevTab()"
      >上一步</b-button>
      <b-button
        v-if="tabIndex!=6"
        class="styledBtn mt-3"
        variant="outline-primary"
        @click.stop="nextTab()"
      >下一步</b-button>
    </b-card>
    <b-card class="my-3" v-else-if="isActivity == 3">
      <step6 :runSurvey="true"></step6>
    </b-card>
    <b-card class="my-3" v-else-if="isActivity == 1">
      <report></report>
    </b-card>
    <!-- <b-card class="my-3" v-else-if="isActivity == 2">Before Acitivate</b-card> -->
    <b-jumbotron v-else header="Wait...">
      <p>Please wait until survey is ready</p>
    </b-jumbotron>

    <end-node-handle :isCommit="commitEnd" @on-cancel="endNodeCancel"></end-node-handle>
    <siderUserBar></siderUserBar>

    <div class="cardDiv" v-if="currentRoleAllocation.can_terminate && [3,1].includes(isActivity)">
      <b-button class="styledBtn" variant="outline-primary" @click="commitEnd = true">结束并走向</b-button>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import Step1 from "@/views/business/progress/qa/Step1";
import Step2 from "@/views/business/progress/qa/Step2";
import Step3 from "@/views/business/progress/qa/Step3";
import Step4 from "@/views/business/progress/qa/Step4";
import Step5 from "@/views/business/progress/qa/Step5";
import Step6 from "@/views/business/progress/qa/Step6";
import Step7 from "@/views/business/progress/qa/Step7";
import Report from "@/views/business/progress/qa/Report";
import endNodeHandle from "@/components/business/modal/endNodeHandle";
import siderUserBar from "@/components/business/common/SiderUserBar";
import { mapState, mapActions } from "vuex";
import businessService from "@/services/businessService";

export default {
  components: {
    Loading,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7,
    Report,
    siderUserBar,
    endNodeHandle
  },
  data() {
    return {
      tabIndex: 0,
      commitEnd: false
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
      return this.$store.state.meta.survey;
    },
    isActivity() {
      if (!this.survey.start_time || !this.survey.end_time) {
        return -1;
      }
      var startDate = new Date(this.survey.start_time),
        endDate = new Date(this.survey.end_time);
      var moment = this.$moment();
      var ret = 0;
      if (moment.isSameOrAfter(startDate)) {
        ret += 1;
      }
      if (moment.isSameOrBefore(endDate)) {
        ret += 2;
      }
      return ret;
    },
    step() {
      return this.survey.step;
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
  watch: {
    tabIndex(val) {
      if (val == 5) {
        this.run();
        businessService
          .getSurvey({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid
          })
          .then(data => {
            data.start_time = data.start_time
              ? this.$moment
                  .utc(data.start_time)
                  .local()
                  .format("YYYY-MM-DD HH:mm:ss")
              : "";
            data.end_time = data.end_time
              ? this.$moment
                  .utc(data.end_time)
                  .local()
                  .format("YYYY-MM-DD HH:mm:ss")
              : "";
            this.setSurvey(data);
            this.$emit("data-ready");
          })
          .catch(() => {
            this.$emit("data-failed");
          });
      }
    }
  },
  methods: {
    ...mapActions(["setSurvey"]),
    init() {
      this.run();
      businessService
        .getSurvey({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid
        })
        .then(data => {
          this.setSurvey(data);
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    prevTab() {
      this.tabIndex = this.tabIndex - 1;
    },
    nextTab() {
      this.tabIndex = this.tabIndex + 1;
    },
    endNodeCancel() {
      this.commitEnd = false;
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-index {
  .qa-tabs {
    border: 1px solid #d8d8d8;
    border-radius: 0.25rem;
    min-height: 500px;
  }
  .nav-link {
    color: #3f51b5;
  }
}
</style>