<template>
  <div class="qa-step5 pt-5">
    <b-row class="justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>End Quotions:</label>
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
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
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
        this.end_quote = val.end_quote;
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {},
    saveEndQuotion() {
      let survey = {
        ...this.survey,
        ...{
          end_quote: this.end_quote
        }
      };
      this.setSurvey(survey);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step5 {
}
</style>