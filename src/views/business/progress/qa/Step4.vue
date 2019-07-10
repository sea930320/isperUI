<template>
  <div class="qa-step4 pt-5">
    <div
      class="w-60 mx-auto mb-3"
      v-for="(question, index) in normal_questions"
      :key="index"
      style="display: flex"
    >
      <div class="question-action">
        <label class="question-label">{{index+1}}</label>
        <b-button
          variant="outline-danger"
          size="sm"
          style="width: 32px"
          @click="removeQuestion(index)"
        >
          <icon name="times"></icon>
        </b-button>
      </div>
      <div style="flex: 1">
        <vue-editor v-model="question.title" />
      </div>
    </div>
    <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="newQuestion()">添加问题</b-button>
    <b-button class="styledBtn my-3" variant="outline-primary" @click.stop="saveQuestions()">保存</b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
  data() {
    return {
      normal_questions: []
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
        this.normal_questions = val.normal_questions || [];
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {},
    newQuestion() {
      this.normal_questions.push({
        id: null,
        title: ""
      });
    },
    removeQuestion(index) {
      this.normal_questions.splice(index, 1);
    },
    saveQuestions() {
      let isEmpty = false;
      this.normal_questions.forEach(question => {
        if (question.title == "") {
          isEmpty = true;
        }
      });
      if (isEmpty) {
        this.$toasted.error("Please fill all questions");
        return;
      }
      let survey = {
        ...this.survey,
        ...{
          normal_questions: this.normal_questions
        }
      };
      if (survey.normal_questions.length == 0) {
        this.$toasted.error("Please add at least one question");
        return;
      }
      this.setSurvey(survey);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step4 {
  .ql-editor {
    min-height: 80px;
  }
  .question-action {
    margin-top: 5px;
    margin-right: 10px;
    width: 32px;
    .question-label {
      width: 32px;
      height: 32px;
      line-height: 32px;
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }
  }
}
</style>