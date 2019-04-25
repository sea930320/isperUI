<template>
  <div>
    <br><br>
    <h3> Main Option (Step 1) </h3>
    <br><br>
    <loading v-if="isRunning"></loading>
    <b-container fluid>
        <b-row align-v="left">
          <b-col sm="3">
            <div class="subtable_div">
              <b-table :items="workflows.list" small striped hover :fields="columns" head-variant class="subtable">
              <template slot="id" slot-scope="row">
                {{ row.item.id}}
              </template>
              <template slot="name" slot-scope="row">
                {{row.item.name}}
              </template>
              <template slot="convertedData" slot-scope="row">
                {{row.item.convertedData}}
                <!--{{row.item.type_label}}-->
              </template>
            </b-table>
            </div>
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
    <br>
    <b-container fluid>
      <b-row>
        <b-col sm="4">
          <b-button-group class="float-right">
            <b-button size="lg"  style="width:300px" variant="success"> 上一步 </b-button>
          </b-button-group>
        </b-col>
        <b-col sm="4">
          <b-button-group class="float-right">
            <b-button size="lg"  style="width:300px" variant="success"> 保存 </b-button>
          </b-button-group>
        </b-col>
        <b-col sm="4">
          <b-button-group class="float-right">
            <b-button size="lg"  style="width:300px" variant="success" @click="test()"> 下一步 </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-container>
    <br><br>
  </div>

</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState, mapActions } from "vuex";
 import Loading from "@/components/loading/Loading";
// import imageView from "@/components/imageView/ImageView";
import _ from "lodash";
import workflowService from "@/services/workflowService";
// import arrayUtils from "@/utils/arrayUtils";
import BContainer from "bootstrap-vue/src/components/layout/container";

export default {
  name: "create-project-wizard",
  components: {
    BContainer,
    Loading,
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
            id: {
                label: "序号",
                sortable: false,
                class: "text-center field-sn"
            },
            name: {
                label: "流程名称",
                sortable: false,
                class: "text-center field-name"
            },
            convertedData: {
                label: "实验类型",
                sortable: false,
                class: "text-center field-creator"
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
                  for (var i = 0 ; i < this.workflows.list.length; i++){
                      for (var j = 0; j<this.experimentTypeOptions.length; j++){
                          if (this.workflows.list[i].type_label == parseInt(this.experimentTypeOptions[j].value)){
                              this.workflows.list[i].convertedData = this.experimentTypeOptions[j].text;
                              break
                          }
                      }
//
                  }
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
    createProjectPage() {
      this.$router.push("/manager/project/create_project_wizard2");
    },
      test(){
          alert(this.workflows.list[0].name);
      }
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