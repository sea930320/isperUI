<template>
  <div class="prepare2 container" v-if="userInfo">
    <loading v-if="isRunning"></loading>
    <b-row>
      <b-col cols="12">
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
          <b-table :items="projects.list" responsive small hover :fields="columns" head-variant>
            <template slot="sn" slot-scope="row">{{ row.item.id }}</template>
            <template slot="company_name" slot-scope="row">{{row.item.company_name}}</template>
            <template slot="name" slot-scope="row">{{row.item.name}}</template>
            <template slot="office_type" slot-scope="row">{{row.item.officeItem_name}}</template>
            <template slot="part" slot-scope="row">{{row.item.use_to && row.item.use_to.text}}</template>
            <template slot="action" slot-scope="row">
              <a class="btn-link mx-1" href="javascript:" @click="startBusiness(row.item)">
                <icon name="play"></icon>
              </a>
            </template>
          </b-table>
        </div>
        <div class="cardDiv" v-if="projects.total>0">
          <b-row class="justify-content-center row-margin-tweak">
            <b-pagination
              :size="template_size"
              :total-rows="projects.total"
              :per-page="queryParam.size"
              limit="5"
              v-model="queryParam.page"
            />
          </b-row>
        </div>
      </b-col>
    </b-row>
    <business-start-modal></business-start-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import BusinessStartModal from "@/components/business/modal/BusinessStart";
import ProjectService from "@/services/projectService";
import _ from "lodash";

export default {
  name: "prepare2",
  components: { Loading, BusinessStartModal },
  filters: {},
  data() {
    return {
      // 查询参数
      queryParam: {
        page: 1,
        size: 8,
        group_id: null,
        company_id: null,
        by_method: "company",
        office_id: null
      },
      queryDebounceParam: {
        search: ""
      },
      columns: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-right w-5"
        },
        company_name: {
          label: "项目创建单位",
          sortable: false,
          class: "text-left w-25"
        },
        name: {
          label: "项目名称",
          sortable: false,
          class: "text-left w-25"
        },
        office_type: {
          label: "事务类型",
          sortable: false,
          class: "text-left w-20"
        },
        part: {
          label: "部门",
          sortable: false,
          class: "text-left w-15"
        },
        action: {
          label: "业务启动",
          sortable: false,
          class: "text-center w-10"
        }
      },
      projects: {
        list: [],
        total: 0
      },
      startedProject: null
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.initData();
    next();
  },
  created() {
    this.$nextTick(() => {
      this.initData();
      this.$on("BusinessStartCancelled", () => {
        this.startedProject = null;
      });
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    queryParam: {
      handler() {
        this.queryProjectList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryProjectList();
      }, 500)
    }
  },
  methods: {
    initData() {
      this.projects = {
        list: [],
        total: 0
      };
      this.queryParam.group_id = this.userInfo.manager_info.group_id;
      this.queryProjectList();
    },
    queryProjectList() {
      this.run();
      ProjectService.getProjectList({
        ...this.queryParam,
        ...this.queryDebounceParam
      })
        .then(data => {
          this.businessPosts = data.business_posts;
          this.projects.list = data.results;
          this.projects.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    startBusiness(project) {
      this.$emit("openBusinessStartModal", project);
      this.startedProject = project;
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.prepare2 {
  .no-round {
    border-radius: 0px;
  }
  .align-items-center.d-flex.justify-content-between.list-group-item {
    padding: 7px 8px 7px 15px;
    font-family: "SimHei";
    font-size: 15px;
  }
  .subListItem {
    padding: 3px 8px 3px 30px !important;
    font-size: 14px !important;
    color: darkgrey !important;
  }
  .cycle {
    -webkit-transition-duration: 0.3s;
    -moz-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: -webkit-transform;
    -moz-transition-property: -moz-transform;
    -o-transition-property: -o-transform;
    transition-property: transform;
  }
  .btn.active {
    background-color: #6081e6 !important;
    border-color: #6081e6 !important;
  }
  .btn.inactive {
    color: #616161;
    background-color: #cacaca;
    border-color: #cacaca;
  }
  .list-group-item.active {
    background-color: #6081e6 !important;
    border-color: #6081e6 !important;
    color: white !important;
  }
  .bordered {
    border: 1px solid #dfdfdf;
  }
  .no-border-x {
    border-left: 0px;
    border-right: 0px;
  }
  .transparent-bg {
    background: transparent !important;
    .active {
      background: transparent !important;
    }
  }
  .project-list-by-office {
    min-height: 264px;
    .card-body {
      background: #cfe0ff;
      cursor: pointer;
      .card-title {
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .card-text {
        font-size: 17px;
        text-align: left;
      }
    }
  }
  .card.active {
    .card-body {
      background-color: #6081e6 !important;
      border-color: #6081e6 !important;
      color: white !important;
    }
  }
}
</style>