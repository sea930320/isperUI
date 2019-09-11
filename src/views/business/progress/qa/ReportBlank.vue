<template>
  <div class="qa-report-blank my-3">
    <div class="title">
      <span>{{index}}.</span>
      &nbsp;
      <div v-html="report.title" />
    </div>
    <b-button class="styledBtn" variant="outline-primary" @click.stop="showAnswerModal = true">结果查看</b-button>
    <b-modal v-model="showAnswerModal" title="结果查看" hide-footer size="lg">
      <div class="my-2" v-html="report.title" />
      <hr />
      <b-row no-gutters class="mb-3 justify-content-md-between">
        <b-col cols="6">
          <b-input-group>
            <b-form-input v-model="filter" placeholder></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-table
        show-empty
        stacked="md"
        small
        :items="answers"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
      >
        <template slot="answer" slot-scope="row">{{ row.item}}</template>
      </b-table>
      <b-row class="justify-content-center row-margin-tweak">
        <b-pagination
          size="sm"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  components: {},
  props: {
    report: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showAnswerModal: false,
      fields: {
        answer: {
          label: "Answer",
          sortable: false
        }
      },
      currentPage: 1,
      perPage: 10,
      filter: "",
      totalRows: 1
    };
  },
  created() {},
  computed: {
    answers() {
      let filter = this.filter;
      let answers = _.filter(this.report.answers, answer => {
        return answer.indexOf(filter) !== -1;
      });
      return answers;
    }
  },
  watch: {},
  mounted() {
    this.totalRows = this.answers.length;
  },
  methods: {
    init() {}
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.qa-report-blank {
  .title {
    font-size: 20px;
    font-weight: 500;
    display: flex;
  }
  table {
    thead {
      background: #909090;
    }
  }
}
</style>