<template>
  <div class="attention-course">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv">
      <!-- <b-col lg="2" md="6" sm="12" style="line-height: 32px;">用户注册审核</b-col> -->
      <b-col lg="5" md="6" sm="12">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder />
        </b-input-group>
      </b-col>
      <b-col md="7" class="align-self-center">
        <b-button-group
          class="float-right"
          v-if="isActionAllowed('code_user_management', 'code_user_review_user')"
        >
          <b-button
            :size="template_size"
            class="styledBtn fontedBtn"
            variant="outline-primary"
            @click="requestAttentionOpen"
          >签订关注许可</b-button>
          <b-button
            class="styledBtn fontedBtn"
            :size="template_size"
            variant="outline-primary"
            @click="cancelRequest"
          >取消关注协议</b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <div class="cardDiv">
      <b-table
        :items="allData.list"
        small
        hover
        :fields="columns"
        head-variant
        style="fontSize: 18px"
      >
        <template slot="check" slot-scope="row">
          <b-form-checkbox
            :id="row.item.id.toString()"
            v-model="selected"
            name="checkbox"
            :value="row.item.id"
            unchecked-value
          ></b-form-checkbox>
        </template>
        <template slot="action" slot-scope="row">
          <b-button
            class="styledBtn"
            :size="template_size"
            variant="outline-primary"
            @click="viewDetail(row)"
            v-if="isActionAllowed('code_user_management', 'code_user_review_user')"
          >
            <icon name="check"></icon>查看详情
          </b-button>
        </template>
      </b-table>
    </div>
    <b-row class="justify-content-end row-margin-tweak mx-0 mt-4 cardDiv">
      <b-pagination
        :size="template_size"
        :total-rows="allData.total"
        :per-page="queryParam.size"
        limit="5"
        v-model="queryParam.page"
      ></b-pagination>
    </b-row>
    <b-modal hide-footer centered id="requestModal" ref="requestModal" title="关联指导者">
      <div>
        <b-form-select v-model="requestData.targetCompany" :options="companyList"></b-form-select>
        <b-form-textarea
          class="mt-3"
          id="textarea"
          placeholder="关注协议"
          rows="3"
          max-rows="4"
          v-model.trim="requestData.requestMsg"
        ></b-form-textarea>
        <b-button
          variant="success"
          @click="sendRequestData"
          class="mt-5"
          :disabled="requestData.targetCompany === null"
        >确&emsp;定</b-button>
      </div>
    </b-modal>
    <b-modal size="lg" hide-footer centered id="detailView" ref="detailView" title="查看详情">
      <b-container class="modalContainer" v-if="selectedData">
        <b-row>
          <b-col lg="6" md="4" sm="4" class="text-left">序号：{{selectedData.id}}</b-col>
          <b-col lg="6" md="4" sm="4" class="text-left">状态：{{selectedData.status}}</b-col>
        </b-row>
        <b-row>
          <b-col lg="12" md="4" sm="12" class="text-left">单位名称：{{selectedData.linked_company}}</b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12" class="text-left">创建人：{{selectedData.created_by}}</b-col>
          <b-col md="6" sm="12" class="text-left">创建时间：{{selectedData.create_time}}</b-col>
        </b-row>
        <b-row>
          <b-col lg="12" md="12" sm="12" class="text-left">关注协议：{{selectedData.message}}</b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12" class="text-left">签订人：{{selectedData.setter}}</b-col>
          <b-col md="6" sm="12" class="text-left">签订时间：{{selectedData.seted_time}}</b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import CourseService from "@/services/courseService";
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";

export default {
  name: "attention-course",
  components: {
    BRow,
    Loading
  },
  data() {
    return {
      selected: [],
      columns: {
        check: {
          label: "",
          sortable: false,
          class: "text-left field-check"
        },
        id: {
          label: "序号",
          sortable: false,
          class: "text-right field-id"
        },
        linked_company: {
          label: "单位名称",
          sortable: false,
          class: "text-left field-linked_company"
        },
        status: {
          label: "状态",
          sortable: false,
          class: "text-left field-status"
        },
        created_by: {
          label: "申请时间",
          sortable: false,
          class: "text-right field-created_by"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-left field-action"
        }
      },
      queryParam: {
        page: 1,
        size: 5
      },
      queryDebounceParam: {
        search: ""
      },
      allData: {
        list: [],
        total: 0
      },
      requestData: {
        targetCompany: null,
        requestMsg: ""
      },
      companyList: [],
      selectedData: {}
    };
  },
  created() {
    this.$nextTick(() => {
      this.queryDataList();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    queryParam: {
      handler() {
        this.queryDataList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryDataList();
      }, 500)
    }
  },
  methods: {
    queryDataList() {
      this.run();
      CourseService.getInitAttentionData({
        ...this.queryParam,
        ...this.queryDebounceParam
      })
        .then(data => {
          this.allData.list = data.results;
          this.companyList = data.companyList;
          this.allData.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    requestAttentionOpen() {
      this.requestData.requestMsg = "";
      this.requestData.targetCompany = null;
      this.$refs["requestModal"].show();
    },
    sendRequestData() {
      this.run();
      CourseService.sendRequestData(this.requestData)
        .then(data => {
          if (data.results === "success") {
            this.queryDataList();
            this.$refs["requestModal"].hide();
            this.$emit("data-ready");
          } else this.$emit("data-failed");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    viewDetail(row) {
      this.selectedData = row.item;
      this.$refs["detailView"].show();
    },
    cancelRequest() {
      this.selected = this.selected.filter(
        item =>
          this.allData.list.filter(x => x.id === item)[0].status === "已关注"
      );
      if (this.selected.length !== 0) {
        this.run();
        CourseService.sendCancelData({
          ids: JSON.stringify(this.selected)
        })
          .then(data => {
            if (data.results === "success") {
              CourseService.getInitAttentionData({
                ...this.queryParam,
                ...this.queryDebounceParam
              })
                .then(data => {
                  this.allData.list = data.results;
                  this.companyList = data.companyList;
                  this.allData.total = data.paging.count;
                  this.$emit("data-ready");
                })
                .catch(() => {
                  this.$emit("data-failed");
                });
            } else this.$emit("data-failed");
          })
          .catch(() => {
            this.$emit("data-failed");
          });
      }
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.attention-course {
  .field-check {
    width: 15%;
    padding-top: 11px;
    text-align: right !important;
  }
  .field-id {
    width: 10%;
    text-align: left !important;
  }
  .field-linked_company {
    width: 25%;
    text-align: left !important;
  }
  .field-status {
    width: 10%;
    text-align: left !important;
  }
  .field-created_by {
    width: 15%;
  }
  .field-action {
    width: 20%;
    text-align: left !important;
  }
}
</style>
