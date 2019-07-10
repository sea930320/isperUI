<template>
  <div class="qa-step6 pt-5">
    <div class="w-60 mx-auto" v-if="survey">
      <div class="survey-title mb-3">{{survey.title}}</div>
      <div
        class="select-question"
        v-for="(question, index) in survey.select_questions"
        :key="'select'+index"
      >
        <div class="select-options text-left">
          <b-form-group :label="(index+1) + '.  ' + question.title">
            <b-row v-if="question.select_option==0">
              <b-col cols="3" v-for="(q_case, index1) in question.question_cases" :key="index1">
                <b-form-radio
                  v-model="question.answer"
                  :value="q_case.id"
                >{{indexToAlpah(index1) + ". " + q_case.case}}</b-form-radio>
              </b-col>
            </b-row>
            <b-form-checkbox-group v-model="question.answers" v-else>
              <b-row>
                <b-col cols="3" v-for="(q_case, index1) in question.question_cases" :key="index1">
                  <b-form-checkbox :value="q_case.id">{{indexToAlpah(index1) + ". " + q_case.case}}</b-form-checkbox>
                </b-col>
              </b-row>
            </b-form-checkbox-group>
          </b-form-group>
        </div>
      </div>
      <hr />
      <div
        class="blank-question text-left"
        style="margin-bottom: 1rem"
        v-for="(question, index) in survey.blank_questions"
        :key="'blank'+index"
      >
        <div class="question">
          {{index+1 + '.&nbsp;'}}
          <div v-html="question.title"></div>
        </div>
      </div>
      <hr />
      <div
        class="normal-question text-left"
        style="margin-bottom: 1rem"
        v-for="(question, index) in survey.normal_questions"
        :key="'normal'+index"
      >
        <div class="question">
          {{index+1 + '.&nbsp;'}}
          <div v-html="question.title"></div>
        </div>
        <div class="normal-question-answer ml-3 mt-2">
          <b-form-input></b-form-input>
        </div>
      </div>
      <hr />
      <div v-html="survey.end_quote"></div>
      <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="print()">Print</b-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {},
  computed: {
    ...mapState(["userInfo"]),
    survey() {
      return this.$store.state.meta.survey;
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
  methods: {
    init() {},
    indexToAlpah(value) {
      return String.fromCharCode(65 + value);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step6 {
  .question {
    display: flex;
    p {
      margin: 0px;
    }
  }
}
</style>