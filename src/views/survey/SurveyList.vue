<template>
  <div class="manager-container main-bg" style="height:100%">
    <loading v-if="isRunning"></loading>
    <div class="container" style="height:100%; padding: 40px 0 0 0;">
      <h4 style="float:left; color:#007bff; cursor: pointer;">
        <a class="btn-link" title="返回" @click="$router.go(-1)">
          <icon name="arrow-left"></icon>&nbsp;返回
        </a>
      </h4>
      <h1>问 卷 调 查</h1>
      <b-row class="cardDiv">
        <b-col lg="3" md="6" sm="12">
          <b-input-group :size="template_size">
            <b-input-group-prepend>
              <span class="input-group-text">
                <icon name="search"></icon>
              </span>
            </b-input-group-prepend>
            <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容" />
          </b-input-group>
        </b-col>
      </b-row>
      <div class="cardDiv">
        <b-table :items="survey.list" responsive small hover :fields="columns" head-variant>
          <template slot="title" slot-scope="row">{{row.item.title}}</template>
          <template
            slot="active_range"
            slot-scope="row"
          >{{row.item.start_time}} &#8764; {{row.item.end_time}}</template>
          <template slot="created_at" slot-scope="row">{{row.item.created_at}}</template>
          <template slot="take_survey" slot-scope="row">
            <div>
              <b-link
                :to="'/survey/' + row.item.id"
                style="color:#007bff"
                v-if="isActivity(row.item) == 3"
              >
                <icon name="play"></icon>
              </b-link>
              <b-link
                :to="'/survey/' + row.item.id"
                style="color:#007bff"
                v-else-if="isActivity(row.item) == 1"
              >
                <icon name="eye"></icon>
              </b-link>
              <div v-else>
                <icon name="clock"></icon>
              </div>
            </div>
          </template>
        </b-table>
      </div>
      <b-row class="justify-content-center row-margin-tweak cardDiv">
        <b-pagination
          :size="template_size"
          :total-rows="survey.total"
          :per-page="queryParam.size"
          limit="5"
          v-model="queryParam.page"
        />
      </b-row>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import _ from "lodash";
import BusinessService from "@/services/businessService";

export default {
  name: "survey_list",
  components: {
    Loading
  },
  created() {
    this.$nextTick(() => {
      this.querySurveyList();
    });
  },
  data() {
    return {
      survey: {
        list: [],
        total: 0
      },
      columns: {
        title: {
          label: "名称",
          sortable: false,
          class: "text-center field-20"
        },
        active_range: {
          label: "调查时间",
          sortable: false,
          class: "text-center field-50"
        },
        created_at: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-10"
        },
        take_survey: {
          label: "参与调查",
          sortable: false,
          class: "text-center field-10"
        }
      },
      queryParam: {
        page: 1,
        size: 8
      },
      queryDebounceParam: {
        search: ""
      }
    };
  },

  watch: {
    queryParam: {
      handler() {
        this.querySurveyList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.querySurveyList();
      }, 500)
    }
  },
  computed: {},
  methods: {
    querySurveyList() {
      this.run();
      BusinessService.surveyPublicList({
        ...this.queryParam,
        ...this.queryDebounceParam
      })
        .then(data => {
          this.survey.list = data.surveys;
          this.survey.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    isActivity(survey) {
      if (survey.is_ended) return 1;
      survey.start_time = this.$moment.utc(survey.start_time).local().format('YYYY-MM-DD HH:mm:ss')
      survey.end_time = this.$moment.utc(survey.end_time).local().format('YYYY-MM-DD HH:mm:ss')
      var startDate = new Date(survey.start_time),
        endDate = new Date(survey.end_time);
      var moment = this.$moment();
      var ret = 0;
      if (moment.isSameOrAfter(startDate)) {
        ret += 1;
      }
      if (moment.isSameOrBefore(endDate)) {
        ret += 2;
      }
      return ret;
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.field-50 {
  width: 50%;
}

.field-20 {
  width: 20%;
}

.field-10 {
  width: 10%;
}

.advertising_Index {
  padding: 10px;
}
</style>

