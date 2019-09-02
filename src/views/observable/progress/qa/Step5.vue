<template>
  <div class="qa-step5 pt-5">
    <loading v-if="isRunning"></loading>
    <b-row class="justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>输入结束语:</label>
      </b-col>
      <b-col cols="6">
        <b-form-textarea v-model="end_quote" rows="5" max-rows="20"></b-form-textarea>
      </b-col>
    </b-row>
    <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="saveEndQuotion()">保存</b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import businessService from "@/services/businessService";
import Loading from "@/components/loading/Loading";

export default {
  components: { Loading },
  data() {
    return {
      end_quote: ""
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
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  watch: {
    survey: {
      handler: function(val) {
        this.end_quote = val.end_quote || "";
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {
      this.end_quote = this.survey.end_quote || "";
    },
    saveEndQuotion() {
      if (!this.end_quote || this.end_quote.trim() == "") {
        this.$toasted.error("Please type quotion");
        return;
      }
      this.run();
      businessService
        .createOrUpdateSurvey({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          end_quote: this.end_quote
        })
        .then(() => {
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
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step5 {
}
</style>