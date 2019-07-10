<template>
  <div class="qa-index">
    <loading v-if="isRunning"></loading>
    <b-card v-if="currentRoleAllocation.can_terminate && step != 6">
      <b-tabs content-class="mt-2" class="qa-tabs" v-model="tabIndex">
        <b-tab title="Description">
          <step1></step1>
        </b-tab>
        <b-tab title="Selection Mode">
          <step2></step2>
        </b-tab>
        <b-tab title="Blank Mode">
          <step3></step3>
        </b-tab>
        <b-tab title="Normal Mode">
          <step4></step4>
        </b-tab>
        <b-tab title="End Quotion">
          <step5></step5>
        </b-tab>
        <b-tab title="Preview">
          <step6></step6>
        </b-tab>
        <b-tab title="Target&Time">
          <step7></step7>
        </b-tab>
      </b-tabs>
      <b-button
        v-if="tabIndex!=0"
        class="styledBtn mt-3"
        variant="outline-primary"
        @click.stop="prevTab()"
      >Prev</b-button>
      <b-button
        v-if="tabIndex!=6"
        class="styledBtn mt-3"
        variant="outline-primary"
        @click.stop="nextTab()"
      >Next</b-button>
    </b-card>
    <b-card class="my-3" v-else>
      <step6></step6>
    </b-card>
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
import { mapState, mapActions } from "vuex";
import businessService from "@/services/businessService";

export default {
  components: { Loading, Step1, Step2, Step3, Step4, Step5, Step6, Step7 },
  data() {
    return {
      tabIndex: 0,
      step: 5
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"]),
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
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
}
</style>