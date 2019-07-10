<template>
  <div class="qa-step1 pt-5">
    <loading v-if="isRunning"></loading>
    <b-row class="justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>Title:</label>
      </b-col>
      <b-col cols="6">
        <b-form-input size="sm" v-model="survey.title"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="mt-2 justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>Description:</label>
      </b-col>
      <b-col cols="6">
        <b-form-textarea v-model="survey.description" rows="3" max-rows="6"></b-form-textarea>
      </b-col>
    </b-row>

    <b-button class="styledBtn mt-3" variant="outline-primary" @click.stop="createSurvey()">保存</b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import businessService from "@/services/businessService";

export default {
  components: { Loading },
  data() {
    return {
      title: "",
      description: ""
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  mounted() {},
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
        this.title = val.title;
        this.description = val.description;
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(["setSurvey"]),
    init() {},
    createSurvey() {
      this.run();
      businessService
        .createOrUpdateSurvey({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          title: this.title,
          description: this.description
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
.qa-step1 {
}
</style>