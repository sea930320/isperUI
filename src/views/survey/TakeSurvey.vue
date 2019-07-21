<template>
  <div class="qa-survey main-bg" style="min-height:100vh">
    <loading v-if="isRunning"></loading>
    <div class="container" style="height:100%; padding: 40px 0 0 0;">
      <h4 style="float:left; color:#007bff; cursor: pointer;">
        <a class="btn-link" title="返回" @click="$router.go(-1)">
          <icon name="arrow-left"></icon>&nbsp;返回
        </a>
      </h4>
      <h1>问 卷 调 查</h1>
      <div class="cardDiv p-5" v-if="survey && isActivity == 3">
        <div class="survey-title mb-3">{{survey.title}}</div>
        <div>({{survey.start_time}} &#8764; {{survey.end_time}})</div>
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
                    <b-form-checkbox
                      :value="q_case.id"
                    >{{indexToAlpah(index1) + ". " + q_case.case}}</b-form-checkbox>
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
            <div style="display: flex;">
              <div
                v-for="(title, index1) in question.titleArray"
                :key="'question' + index + index1"
              >
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
        <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="submit()">Submit</b-button>
      </div>
      <b-card class="my-3" v-else-if="isActivity == 1">
        <report v-if="survey" :publicSurvey="survey" :fromPublic="true"></report>
      </b-card>
      <b-card class="my-3" v-else-if="isActivity == 2">Before Acitivate</b-card>
    </div>
  </div>
</template>

<script>
import businessService from "@/services/businessService";
import _ from "lodash";
import Loading from "@/components/loading/Loading";
import Report from "@/views/business/progress/qa/Report";
import BlankInput from "@/components/business/progress/BlankInput";

export default {
  components: { Loading, Report, BlankInput },
  data() {
    return {
      survey: null
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {},
  computed: {
    isActivity() {
      if (!this.survey || !this.survey.start_time || !this.survey.end_time) {
        return -1;
      }
      if (this.survey.is_ended) return 1;
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
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  mounted() {},
  methods: {
    init() {
      this.run();
      businessService
        .surveyPublicDetail({
          survey_id: this.$route.params.id
        })
        .then(data => {
          let blank_questions = data.blank_questions;
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
          this.survey = data;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    indexToAlpah(value) {
      return String.fromCharCode(65 + value);
    },
    change(val, index, index1) {
      this.survey.blank_questions[index].titleArray[index1].answer = val;
    },
    complete(val, index, index1) {
      this.survey.blank_questions[index].titleArray[index1].answer = val;
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
.qa-survey {
  .question {
    display: flex;
    p {
      margin: 0px;
    }
  }
}
</style>