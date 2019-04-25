<template>
  <form-wizard
    @on-complete="onComplete"
    shape="tab"
    back-button-text="上一步"
    next-button-text="下一步"
    finish-button-text="保存"
    color="#9b59b6"
  >
    <tab-content title="基本属性">
      <b-container fluid>
        <b-row align-v="center">
          <b-col sm="3">
            <b-table :items="workflows.list" small striped hover :fields="columns" head-variant>
              <template slot="sn" slot-scope="row">
                {{ row.item.id}}
              </template>
              <template slot="name" slot-scope="row">
                {{row.item.name}}
              </template>
              <template slot="creator" slot-scope="row">
                {{this.experimentTypeOptions[row.item.type_label-1].text}}
              </template>
            </b-table>
          </b-col>
          <b-col sm="9">
            <b-container fluid>
              <b-row align-v="center">
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="项目名称:"
                          label-for="input-horizontal"
                  >
                    <b-form-input id="input-horizontal"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="流程图完整显示:"
                          label-for="input-horizontal"
                  >
                    <b-dropdown variant="light" text="完整显示" class="w-100">
                      <b-dropdown-item-button>动作1</b-dropdown-item-button>
                      <b-dropdown-item-button>动作2</b-dropdown-item-button>
                      <b-dropdown-item-button>其他</b-dropdown-item-button>
                    </b-dropdown>
                  </b-form-group>
                </b-col>

              </b-row>

              <b-row align-v="center">
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="开发模式:"
                          label-for="input-horizontal"
                  >
                    <b-dropdown variant="light" text="完整显示" class="w-100">
                      <b-dropdown-item-button>选项1</b-dropdown-item-button>
                      <b-dropdown-item-button>选项2</b-dropdown-item-button>
                      <b-dropdown-item-button>其他</b-dropdown-item-button>
                    </b-dropdown>
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="成果参考释放方式:"
                          label-for="input-horizontal"
                  >
                    <b-dropdown variant="light" text="同步" class="w-100">
                      <b-dropdown-item-button>选项1</b-dropdown-item-button>
                      <b-dropdown-item-button>选项2</b-dropdown-item-button>
                      <b-dropdown-item-button>其他</b-dropdown-item-button>
                    </b-dropdown>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row align-v="center">
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="事务类型:"
                          label-for="input-horizontal"
                  >
                    <b-dropdown variant="light" text="请选择" class="w-100">
                      <b-dropdown-item-button>事务1</b-dropdown-item-button>
                      <b-dropdown-item-button>事务2</b-dropdown-item-button>
                      <b-dropdown-item-button>其他</b-dropdown-item-button>
                    </b-dropdown>
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="关联课程:"
                          label-for="input-horizontal"
                  >
                    <b-dropdown variant="light" text="" class="w-100">
                      <b-dropdown-item-button></b-dropdown-item-button>
                      <b-dropdown-item-button></b-dropdown-item-button>
                      <b-dropdown-item-button></b-dropdown-item-button>
                    </b-dropdown>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row align-v="center">
                <b-col sm="6">
                  <b-form-group
                          id="fieldset-horizontal"
                          label-cols-sm="4"
                          label-cols-lg="3"
                          label="开发时段:"
                          label-for="input-horizontal"
                  >
                    <b-row align-v="center">
                      <div class="form-date-control">
                        <b-form-input type="date"></b-form-input>
                      </div>
                      &nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;
                      <div class="form-date-control">
                        <b-form-input type="date"></b-form-input>
                      </div>
                    </b-row>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12">
                  <b-card header="项目简介（必填）" style="padding:0">
                    <b-form-textarea
                            v-model="text"
                            placeholder=""
                            rows="3"
                            max-rows="6"
                    ></b-form-textarea>
                  </b-card>
                </b-col>
              </b-row>
              <br>
              <b-row>
                <b-col sm="12">
                  <b-card header="项目目的（必填）" style="padding:0">
                    <b-form-textarea
                            v-model="text"
                            placeholder=""
                            rows="3"
                            max-rows="6"
                    ></b-form-textarea>
                  </b-card>
                </b-col>
              </b-row>
              <br>
              <b-row>
                <b-col sm="12">
                  <b-card header="项目要求（必填）" style="padding:0">
                    <b-form-textarea
                            v-model="text"
                            placeholder=""
                            rows="3"
                            max-rows="6"
                    ></b-form-textarea>
                  </b-card>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
      </b-container>
    </tab-content>
    <tab-content title="环节及身份配置">
      <b-alert variant="success" show>Success Alert</b-alert>
      <b-container>
        <b-row>
          <b-col sm="4" class="subtable_div">
            <b-table
              :items="table1.list"
              small
              striped
              hover
              :fields="table_1"
              head-variant
              class="subtable"
            >
              <template slot="field_1" slot-scope="row">{{ row.index + 1 }}</template>
              <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
              <template slot="field_3" slot-scope="row">{{row.item.field_3}}</template>

              <template slot="field_4" slot-scope>
                <b-form-checkbox></b-form-checkbox>
              </template>
            </b-table>
          </b-col>

          <b-col sm="8" class="subtable_div">
            <b-table
              :items="table2.list"
              small
              striped
              hover
              :fields="table_2"
              head-variant
              class="subtable"
            >
              <template slot="field_1" slot-scope="row">{{ row.index + 1 }}</template>
              <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
              <template slot="field_3" slot-scope="row">{{row.item.field_3}}</template>

              <template slot="field_4" slot-scope>
                <b-form-checkbox></b-form-checkbox>
              </template>
              <template slot="field_5" slot-scope>
                <b-form-checkbox></b-form-checkbox>
              </template>
              <template slot="field_6" slot-scope>
                <b-form-checkbox></b-form-checkbox>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>
    </tab-content>
    <tab-content title="素材设置">
      <b-alert variant="success" show>Success Alert</b-alert>
      <b-container>
        <b-row>
          <b-col sm="6" class="subtable_div">
            <b-table
              :items="table3.list"
              small
              striped
              hover
              :fields="table_3"
              head-variant
              class="subtable"
            >
              <template slot="field_1" slot-scope="row">{{ row.index + 1 }}</template>
              <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
              <template slot="field_3" slot-scope="row">{{row.item.field_3}}</template>
              <template slot="field_3" slot-scope="row">{{row.item.field_3}}</template>
            </b-table>
          </b-col>
          <b-col sm="3" class="subtable_div">
            <b-table
              :items="table4.list"
              small
              striped
              hover
              :fields="table_4"
              head-variant
              class="subtable"
            >
              <template slot="field_1" slot-scope="row">{{ row.index + 1 }}</template>
              <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
            </b-table>
          </b-col>

          <b-col sm="3" class="subtable_div">
            <b-table
              :items="table5.list"
              small
              striped
              hover
              :fields="table_5"
              head-variant
              class="subtable"
            >
              <template slot="field_1" slot-scope="row">{{ row.item.field_1}}</template>
              <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
              <template slot="field_3" slot-scope>
                <b-form-checkbox></b-form-checkbox>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>
    </tab-content>
    <tab-content title="跳转/嵌套设置">
      <b-container>
        <b-row>
          <b-col sm="6">
            <b-row>
              <b-col sm="12">
                <b-table
                  :items="table5.list"
                  small
                  striped
                  hover
                  :fields="table_5"
                  head-variant
                  class="subtable"
                >
                  <template slot="field_1" slot-scope="row">{{ row.item.field_1}}</template>
                  <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
                  <template slot="field_3" slot-scope>
                    <b-form-checkbox></b-form-checkbox>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="6">
            <b-row>
              <b-col sm="12">
                <b-card header="要跳转的项目名称" style="padding:0">
                  <b-form-textarea
                    v-model="text"
                    placeholder="地方性法规二审通用项目"
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                </b-card>
              </b-col>
            </b-row>
            <br>
            <b-row>
              <b-col sm="12">
                <b-table
                  :items="table5.list"
                  small
                  striped
                  hover
                  :fields="table_5"
                  head-variant
                  class="subtable"
                >
                  <template slot="field_1" slot-scope="row">{{ row.item.field_1}}</template>
                  <template slot="field_2" slot-scope="row">{{row.item.field_2}}</template>
                  <template slot="field_3" slot-scope>
                    <b-form-checkbox></b-form-checkbox>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </tab-content>
  </form-wizard>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState, mapActions } from "vuex";
// import Loading from "@/components/loading/Loading";
// import ProjectService from "@/services/projectService";
// import imageView from "@/components/imageView/ImageView";
import _ from "lodash";
import workflowService from "@/services/workflowService";
// import arrayUtils from "@/utils/arrayUtils";
// import dateUtils from "@/utils/dateUtils";
import BContainer from "bootstrap-vue/src/components/layout/container";

export default {
  name: "create-project-wizard",
  components: {
    BContainer
    // Loading,
    // imageView
  },
  filters: {
    expType,
    level,
    abilityTarget
  },
  data() {
    return {
        columns: {
            sn: {
                label: "序号",
                sortable: false,
                class: "text-center field-sn"
            },
            name: {
                label: "流程名称",
                sortable: false,
                class: "text-center field-name"
            },
            creator: {
                label: "实验类型",
                sortable: false,
                class: "text-center field-creator"
            }
        },
      table_1: {
        field_1: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        field_2: {
          label: "环节名称",
          sortable: false,
          class: "text-center field-sn"
        },
        field_3: {
          label: "对应模块",
          sortable: false,
          class: "text-center field-sn"
        },
        field_4: {
          label: "允许观摩",
          sortable: false,
          class: "text-center field-name"
        }
      },
      table_2: {
        field_1: {
          label: "身份类型",
          sortable: false,
          class: "text-center field-sn"
        },
        field_2: {
          label: "身份名称",
          sortable: false,
          class: "text-center field-sn"
        },
        field_3: {
          label: "身份形象",
          sortable: false,
          class: "text-center field-sn"
        },
        field_4: {
          label: "是否使用",
          sortable: false,
          class: "text-center field-name"
        },
        field_5: {
          label: "结束环节",
          sortable: false,
          class: "text-center field-name"
        },
        field_6: {
          label: "身份邀请权",
          sortable: false,
          class: "text-center field-name"
        }
      },
      table_3: {
        field_1: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        field_2: {
          label: "素材名称",
          sortable: false,
          class: "text-center field-sn"
        },
        field_3: {
          label: "用途",
          sortable: false,
          class: "text-center field-sn"
        },
        field_4: {
          label: "操作",
          sortable: false,
          class: "text-center field-name"
        }
      },
      table_4: {
        field_1: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        field_2: {
          label: "环节名称",
          sortable: false,
          class: "text-center field-sn"
        }
      },
      table_5: {
        field_1: {
          label: "角色类型",
          sortable: false,
          class: "text-center field-sn"
        },
        field_2: {
          label: "角色名称",
          sortable: false,
          class: "text-center field-sn"
        },
        field_3: {
          label: "是否使用素材",
          sortable: false,
          class: "text-center field-sn"
        }
      },
      // 查询参数
      queryParam: {
        status: "",
        page: 1,
        size: 10
      },
      workflows: {
          list: [],
          total: 0
      },
      queryDebounceParam: {
        search: ""
      },
      // 流程列表
      table1: {
        list: [],
        total: 0
      },
      table2: {
        list: [],
        total: 0
      },
      table3: {
        list: [],
        total: 0
      },
      table4: {
        list: [],
        total: 0
      },
      table5: {
        list: [],
        total: 0
      },
      // 流程相关项目
      relatedProjects: [],
      animationImgSrc: "",
      copyModalName: "",
      workflowXml: null,
      deleteModal: false,
      publishModal: false,
      copyModal: false,
      bigImgModal: false,
      newFlowStatus: false,
      xmlModalShow: false,
      relatedShow: false,
      isSuperFlag: false,
      shareModal: false,
      experimentTypeOptions: [
        { value: "1", text: "立法类型实验" },
        { value: "2", text: "执法类型实验" },
        { value: "3", text: "诉讼与仲裁实验" },
        { value: "4", text: "自由类型实验" },
        { value: "5", text: "非诉讼与法务管理类型实验" },
        { value: "6", text: "法律思维类型实验" },
        { value: "7", text: "证据科学类型实验" },
        { value: "8", text: "法律实效评价类型实验" }
      ]
    };
  },
  created() {
      this.$nextTick(() => {
          this.isSuperFlag = this.userInfo.identity === 1;
          this.queryWorkflowList();
      });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    // 监控查询参数，如有变化 查询列表数据
    queryParam: {
      handler() {
        this.queryWorkflowList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryWorkflowList();
      }, 500)
    }
  },
  methods: {
      ...mapActions(["setFlowStep"]),
      // 查询流程列表数据
      queryWorkflowList() {
          this.run();
          workflowService
              .fetchList({ ...this.queryParam, ...this.queryDebounceParam })
              .then(data => {
                  data.results.forEach(item => {
                      if (item.checked === undefined) {
                          item.checked = false;
                      }
                      if (item.locked === undefined) {
                          item.locked = false;
                      }
                  });
                  this.workflows.list = data.results;
                  this.workflows.total = data.paging.count;
                  if (this.newProcessAdded) {
                      this.addNewProcess();
                  }
                  this.$emit("data-ready");
              })
              .catch(() => {
                  this.$emit("data-failed");
              });
      },
    // 查询流程列表数据
    onComplete: function() {
      alert("Yay. Done!");
    },

    // Go To Crate Project Page
//    createProjectPage() {
//      this.$router.push("/manager/project/create_project_wizard");
//    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
.card-body {
  padding: 0;
}
.card-header {
  text-align: left;
}
</style>