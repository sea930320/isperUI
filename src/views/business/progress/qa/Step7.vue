<template>
  <div class="qa-step pt-5">
    <b-row class="justify-content-md-center mb-3">
      <b-col cols="2" class="text-right">
        <label>Activation Time:</label>
      </b-col>
      <b-col cols="6">
        <date-picker
          class="float-left"
          :editable="false"
          :clearable="false"
          v-model="activeDateRange"
          range
          format="YYYY-MM-DD"
        ></date-picker>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center">
      <b-col cols="2" class="text-right">
        <label>Target:</label>
      </b-col>
      <b-col cols="6">
        <b-form-select size="sm" v-model="target" :options="options"></b-form-select>
      </b-col>
    </b-row>
    <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="saveSurvey()">保存</b-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DatePicker from "vue2-datepicker";

export default {
  components: {
    DatePicker
  },
  data() {
    return {
      activeDateRange: [],
      target: 0,
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "Business only" },
        { value: 2, text: "Node only" }
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
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
  methods: {
    init() {},
    saveSurvey() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step7 {
}
</style>