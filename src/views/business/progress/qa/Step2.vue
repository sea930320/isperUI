<template>
  <div class="qa-step2 pt-5">
    <div class="w-60 mx-auto" v-for="(question, index) in select_questions" :key="index">
      <b-input-group :prepend="index+1" class="mt-3">
        <b-form-input v-model="question.title"></b-form-input>
        <b-input-group-append>
          <b-button
            :pressed.sync="!question.select_option"
            variant="outline-primary"
            @click="question.select_option = 1 - question.select_option"
          >Single Sel</b-button>
          <b-button
            :pressed.sync="question.select_option"
            variant="outline-primary"
            @click="question.select_option = 1 - question.select_option"
          >Multi Sel</b-button>
        </b-input-group-append>
      </b-input-group>
      <div class="w-60 mx-auto" v-for="(item, index1) in question.question_cases" :key="index1">
        <b-input-group :prepend="index1+1" class="mt-3">
          <b-form-input v-model="item.case"></b-form-input>
        </b-input-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  data() {
    return {
      select_questions: [
        {
          title: "which options you like?",
          select_option: 0,
          question_cases: [
            { id: null, case: "case1" },
            { id: null, case: "case2" },
            { id: null, case: "case3" }
          ]
        }
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
    init() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step2 {
}
</style>