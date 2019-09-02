<template>
  <div class="qa-step4 pt-5">
    <loading v-if="isRunning"></loading>
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
import Loading from "@/components/loading/Loading";
import businessService from "@/services/businessService";
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor, Loading },
  data() {
    return {};
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
    normal_questions() {
      return this.survey.normal_questions || [];
    },
    currentRoleAllocation() {
      return this.$store.state.meta.currentRoleAllocation;
    }
  },
  watch: {},
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
      if (this.normal_questions.length == 0) {
        this.$toasted.error("Please add at least one question");
        return;
      }
      this.run();
      businessService
        .setSurveyNormalQuestions({
          business_id: this.$route.params.bid,
          node_id: this.$route.params.nid,
          survey_id: this.survey.id,
          normal_questions: JSON.stringify(this.normal_questions)
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