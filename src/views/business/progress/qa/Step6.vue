<template>
  <div class="qa-step6 pt-5">
    <loading v-if="isRunning"></loading>
    <div class="w-60 mx-auto" v-if="survey">
      <div class="survey-title mb-3">{{survey.title}}</div>
      <div class="question_type">选择题</div>
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
      <div class="question_type">填空题</div>
      <div
        class="blank-question text-left"
        style="margin-bottom: 1rem"
        v-for="(question, index) in survey.blank_questions"
        :key="'blank'+index"
      >
        <div class="question">
          {{index+1 + '.&nbsp;'}}
          <div v-html="question.title" v-if="!runSurvey"></div>
          <div v-else style="display: flex;">
            <div v-for="(title, index1) in question.titleArray" :key="'question' + index + index1">
              <b-input-group-text v-if="!title.blank_length">{{title}}</b-input-group-text>
              <!-- <custom-input
                v-else
                input-height="38px"
                :input-number="title.blank_length"
                input-type="text"
                input-style-type="allBorder"
                @custom-input-change="($event) => change($event, index, index1)"
                @custom-input-complete="($event) => complete($event, index, index1)"
                :style="{width: title.blank_length * 30 + 'px'}"
              ></custom-input>-->
              <blank-input
                v-else
                :input-length="title.blank_length"
                @blank-input-change="(val) => change(val, index, index1)"
              ></blank-input>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="question_type">问答题</div>
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
          <b-form-input v-model="question.answer"></b-form-input>
        </div>
      </div>
      <hr />
      <div v-html="survey.end_quote"></div>
      <b-button
        v-if="!runSurvey"
        class="styledBtn my-3"
        variant="outline-primary"
        @click.stop="print()"
      >打印</b-button>
      <b-button v-else class="styledBtn my-3" variant="outline-primary" @click.stop="submit()">提交</b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import businessService from "@/services/businessService";
import _ from "lodash";
import Loading from "@/components/loading/Loading";
import BlankInput from "@/components/business/progress/BlankInput";

export default {
  components: { Loading, BlankInput },
  props: {
    runSurvey: {
      type: Boolean,
      default: false
    }
  },
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
      let survey = this.$store.state.meta.survey;
      if (this.runSurvey) {
        let blank_questions = survey.blank_questions;
        _.each(blank_questions, bq => {
          let titleArray = bq.title.replace(/<[^>]*>?/gm, "");
          /* eslint-disable */
          titleArray = _.map(titleArray.split(/([]+)/), title => {
            if (title[0] == "") {
              return { blank_length: title.length };
            } else return title;
          });
          bq.titleArray = titleArray;
        });
        return survey;
      } else return survey;
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
    },
    change(val, index, index1) {
      this.survey.blank_questions[index].titleArray[index1].answer = val;
    },
    complete(val, index, index1) {
      this.survey.blank_questions[index].titleArray[index1].answer = val;
    },
    print() {
      window.print();
    },
    submit() {
      var BreakException = {};
      let qas = [];
      try {
        this.survey.blank_questions.forEach(bq => {
          let answer = "";
          bq.titleArray.forEach(ta => {
            if (ta.blank_length) {
              if (
                !ta.answer ||
                ta.answer.replace(" ", "").length != ta.blank_length
              ) {
                throw BreakException;
              }
              answer += ta.answer;
            } else answer += ta;
          });
          qas.push({
            id: bq.id,
            answer: answer
          });
        });
        this.survey.select_questions.forEach(sq => {
          if (sq.select_option == 0) {
            if (!sq.answer) {
              throw BreakException;
            }
            qas.push({
              id: sq.id,
              answer: sq.answer
            });
          } else {
            if (!sq.answers || sq.answers.length == 0) {
              throw BreakException;
            }
            qas.push({
              id: sq.id,
              answers: sq.answers
            });
          }
        });
        this.survey.normal_questions.forEach(nq => {
          if (!nq.answer) {
            throw BreakException;
          }
          qas.push({
            id: nq.id,
            answer: nq.answer
          });
        });
      } catch (e) {
        this.$toasted.error("Please Fill all fields");
        return;
      }
      this.run();
      businessService
        .surveyAnswer({
          survey_id: this.survey.id,
          answers: JSON.stringify(qas)
        })
        .then(() => {
          this.$emit("data-ready");
          this.$toasted.success("Success");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
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
  .question_type {
    text-align: left;
    margin-bottom: 10px;
    font-weight: bold;
  }
}
</style>