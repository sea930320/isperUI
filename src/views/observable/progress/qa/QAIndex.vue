<template>
  <div class="qa-index">
    <loading v-if="isRunning"></loading>
    <b-card class="my-3" v-if="isActivity == 1">
      <report></report>
    </b-card>
    <!-- <b-card class="my-3" v-else-if="isActivity == 2">Before Acitivate</b-card> -->
    <b-card
      overlay
      img-src="/media/waiting.gif"
      img-alt="Waiting..."
      text-variant="white"
      title="请耐心等待。。。"
      sub-title="正在进行投票，请等待"
      v-else
      style="margin-top: 10%"
      class="ml-auto mr-auto w-40 text-left"
    ></b-card>
  </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import Report from "@/views/business/progress/qa/Report";
import { mapActions } from "vuex";
import businessService from "@/services/businessService";

export default {
  components: {
    Loading,
    Report
  },
  data() {
    return {
      commitEnd: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
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
    }
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {
      this.run();
      businessService
        .getSurvey({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          is_observable: 1
        })
        .then(data => {
          this.setSurvey(data);
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
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