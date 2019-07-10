<template>
  <div class="qa-step2 pt-5">
    <loading v-if="isRunning"></loading>
    <div class="w-60 mx-auto mb-3" v-for="(question, index) in select_questions" :key="index">
      <b-input-group :prepend="'' + (index+1)">
        <b-form-input v-model="question.title"></b-form-input>
        <b-input-group-append>
          <b-button
            :pressed.sync="question.select_option == 0"
            variant="outline-primary"
            @click="question.select_option = 1 - question.select_option"
          >Single Sel</b-button>
          <b-button
            :pressed.sync="question.select_option == 1"
            variant="outline-primary"
            @click="question.select_option = 1 - question.select_option"
          >Multi Sel</b-button>
          <b-button variant="outline-danger" @click="removeQuestion(index)">
            <icon name="minus"></icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>
      <div class="w-60 mx-auto" v-for="(item, index1) in question.question_cases" :key="index1">
        <b-input-group :prepend="indexToAlpah(index1)" class="mt-3">
          <b-form-input v-model="item.case"></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-danger" @click="removeCase(index, index1)">
              <icon name="minus"></icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <div class="w-60 mx-auto">
        <b-input-group class="mt-3">
          <b-input-group-prepend>
            <b-button
              :disabled="!question.newCase || question.newCase.trim() == ''"
              variant="outline-primary"
              @click="addCase(index)"
            >
              <icon name="plus"></icon>
            </b-button>
          </b-input-group-prepend>
          <b-form-input v-model="question.newCase"></b-form-input>
        </b-input-group>
      </div>
    </div>

    <div class="w-60 mx-auto">
      <b-input-group class="mt-3">
        <b-input-group-prepend>
          <b-button
            :disabled="new_question.title.trim() == '' || new_question.question_cases.length == 0"
            variant="outline-primary"
            @click="addQuestion()"
          >
            <icon name="plus"></icon>
          </b-button>
        </b-input-group-prepend>
        <b-form-input v-model="new_question.title"></b-form-input>
        <b-input-group-append>
          <b-button
            :pressed.sync="new_question.select_option == 0"
            variant="outline-primary"
            @click="new_question.select_option = 1 - new_question.select_option"
          >Single Sel</b-button>
          <b-button
            :pressed.sync="new_question.select_option == 1"
            variant="outline-primary"
            @click="new_question.select_option = 1 - new_question.select_option"
          >Multi Sel</b-button>
        </b-input-group-append>
      </b-input-group>
      <div class="w-60 mx-auto" v-for="(item, index1) in new_question.question_cases" :key="index1">
        <b-input-group :prepend="indexToAlpah(index1)" class="mt-3">
          <b-form-input v-model="item.case"></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-danger" @click="removeCase(-1, index1)">
              <icon name="minus"></icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <div class="w-60 mx-auto">
        <b-input-group class="mt-3">
          <b-input-group-prepend>
            <b-button
              :disabled="new_question.newCase.trim() == ''"
              variant="outline-primary"
              @click="addCase(-1)"
            >
              <icon name="plus"></icon>
            </b-button>
          </b-input-group-prepend>
          <b-form-input v-model="new_question.newCase"></b-form-input>
        </b-input-group>
      </div>
    </div>

    <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="saveQuestions()">保存</b-button>
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
      new_question: {
        id: null,
        title: "",
        select_option: 0,
        question_cases: [],
        newCase: ""
      }
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
    select_questions() {
      return this.survey.select_questions || [];
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  watch: {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {},
    indexToAlpah(value) {
      return String.fromCharCode(65 + value);
    },
    removeQuestion(index) {
      this.select_questions.splice(index, 1);
    },
    addQuestion() {
      this.select_questions.push({ ...this.new_question });
      this.new_question = {
        id: null,
        title: "",
        select_option: 0,
        question_cases: [],
        newCase: ""
      };
    },
    removeCase(index, index1) {
      if (index != -1) {
        this.select_questions[index].question_cases.splice(index1, 1);
      } else {
        this.new_question.question_cases.splice(index1, 1);
      }
    },
    addCase(index) {
      if (index != -1) {
        this.select_questions[index].question_cases.push({
          id: null,
          case: this.select_questions[index].newCase
        });
        this.select_questions[index].newCase = "";
      } else {
        this.new_question.question_cases.push({
          id: null,
          case: this.new_question.newCase
        });
        this.new_question.newCase = "";
      }
    },
    saveQuestions() {
      if (this.select_questions.length == 0) {
        this.$toasted.error("Please add at least one question");
        return;
      }
      this.run();
      businessService
        .setSurveySelectQuestions({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          survey_id: this.survey.id,
          select_questions: JSON.stringify(this.select_questions)
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
.qa-step2 {
}
</style>