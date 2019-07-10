<template>
  <div class="qa-step3 pt-5">
    <div
      class="w-60 mx-auto mb-3"
      v-for="(question, index) in blank_questions"
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
        <div :id="'toolbar-' + index">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-strike mr-2"></button>
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
          <select class="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option selected></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
            <option value="6"></option>
          </select>

          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>

          <button class="ql-indent" value="-1"></button>
          <button class="ql-indent" value="+1"></button>
          <button class="ql-direction" value="rtl"></button>

          <select class="ql-size">
            <option value="small"></option>
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
          <button class="ql-addBlank ml-3">
            <icon name="asterisk"></icon>
          </button>
        </div>
        <vue-editor
          :ref="'editor-' + index"
          v-model="question.title"
          :editorOptions="editorSettings(index)"
        />
      </div>
    </div>
    <b-modal v-model="length_input_model" title="Input Length">
      <b-form-input v-model="blank_lengths"></b-form-input>
      <div slot="modal-footer" class="w-100">
        <b-button
          :disabled="blank_lengths == 0"
          variant="primary"
          class="float-center mr-2"
          @click="setHandlerLength()"
        >确定</b-button>
        <b-button variant="secondary" class="float-center" @click="length_input_model=false">取消</b-button>
      </div>
    </b-modal>
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
      blank_questions: [],
      length_input_model: false,
      length_model_index: -1,
      blank_lengths: 0
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
        this.blank_questions = val.blank_questions || [];
      },
      deep: true
    },
    length_input_model(val) {
      if (!val) {
        this.length_model_index = -1;
        this.blank_lengths = 0;
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["setSurvey"]),
    init() {},
    editorSettings(index) {
      return {
        modules: {
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          },
          toolbar: {
            container: "#toolbar-" + index,
            handlers: {
              addBlank: () => {
                this.length_model_index = index;
                this.length_input_model = true;
              }
            }
          }
        }
      };
    },
    newQuestion() {
      this.blank_questions.push({
        id: null,
        title: ""
      });
    },
    removeQuestion(index) {
      this.blank_questions.splice(index, 1);
    },
    setHandlerLength() {
      let refs = this.$refs["editor-" + this.length_model_index];
      let ref = null;
      if (!refs || refs.length == 0) {
        this.length_input_model = false;
        return;
      } else {
        ref = refs[0];
      }
      ref.quill.clipboard.dangerouslyPasteHTML(
        ref.quill.getSelection(true).index,
        "<span class='blank_question'>" +
          "".repeat(Number(this.blank_lengths)) +
          "</span>"
      );
      this.length_input_model = false;
    },
    saveQuestions() {
      let isEmpty = false;
      this.blank_questions.forEach(question => {
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
          blank_questions: this.blank_questions
        }
      };
      if (survey.blank_questions.length == 0) {
        this.$toasted.error("Please add at least one question");
        return;
      }
      this.setSurvey(survey);
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-step3 {
  .ql-snow .ql-picker.ql-header {
    padding: 0px;
  }
  .ql-picker:not(.ql-background) {
    top: 0px;
  }
  .ql-picker-label {
    padding-left: 0px;
  }
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