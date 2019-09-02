<template>
  <div class="qa-step pt-5">
    <b-row class="justify-content-md-center mb-3">
      <b-col cols="2" class="text-right">
        <label>设置调查时间:</label>
      </b-col>
      <b-col cols="6">
        <date-picker
          class="float-left"
          :editable="false"
          v-model="activeDateRange"
          range
          format="YYYY-MM-DD"
        ></date-picker>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>设置调查人群范围:</label>
      </b-col>
      <b-col cols="6">
        <b-form-select size="sm" v-model="target" :options="options"></b-form-select>
      </b-col>
    </b-row>
    <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="publishSurvey()">发布调查</b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DatePicker from "vue2-datepicker";
import businessService from "@/services/businessService";

export default {
  components: {
    DatePicker
  },
  data() {
    return {
      activeDateRange: [null, null],
      target: 0,
      options: [
        { value: 0, text: "群众" },
        { value: 1, text: "本业务人员" },
        { value: 2, text: "本环节人员" }
      ]
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
        this.activeDateRange = [val.start_time, val.end_time];
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {
      this.activeDateRange = [this.survey.start_time, this.survey.end_time];
    },
    publishSurvey() {
      if (
        this.activeDateRange.length != 2 ||
        !this.activeDateRange[0] ||
        !this.activeDateRange[1]
      ) {
        this.$toasted.error("Please set activation time");
        return;
      }
      let param = {
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        start_date: this.activeDateRange[0]
          ? this.$moment(this.activeDateRange[0]).format("YYYY-MM-DD")
          : "",
        end_date: this.activeDateRange[1]
          ? this.$moment(this.activeDateRange[1]).format("YYYY-MM-DD")
          : "",
        target: this.target
      };
      businessService.publishSurvey(param).then(() => {
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
      });
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step7 {
}
</style>