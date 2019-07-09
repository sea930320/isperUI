<template>
  <div class="qa-index">
    <loading v-if="isRunning"></loading>
    <b-card>
      <b-tabs content-class="mt-2" class="qa-tabs">
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
import { mapState } from "vuex";

export default {
  components: { Loading, Step1, Step2, Step3, Step4, Step5, Step6, Step7 },
  data() {
    return {};
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
    init() {}
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