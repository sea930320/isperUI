<template>
  <div>
    <br><br>
    <h3> Main Option (Step 1)</h3>
    <br><br>
    <loading v-if="isRunning"></loading>
    <b-form @submit="onSubmit">
      <b-container fluid>
          <b-row align-v="left">
            <b-col sm="3">
              <b-form-group
                      id="fieldset-horizontal"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="流程名称:"
                      label-for="input-horizontal"
              >
                <!--<b-form-input disabled id="input-horizontal" required v-model="this.selectedFlowName"></b-form-input>-->
                <b-form-input id="input-horizontal" required v-model="selectedFlowName"></b-form-input>
              </b-form-group>
              <b-navbar toggleable="lg" variant="info">
                <b-navbar-brand href="#">&nbsp;&nbsp;&nbsp;流程</b-navbar-brand>
                <b-collapse id="nav-collapse" is-nav>
                  <!-- Right aligned nav items -->
                  <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                      <b-input-group :size="template_size">
                        <b-input-group-prepend>
                          <span class="input-group-text">
                            <icon name="search"></icon>
                          </span>
                        </b-input-group-prepend>
                        <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                      </b-input-group>
                      <!--<b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
                    </b-nav-form>
                  </b-navbar-nav>
                </b-collapse>
              </b-navbar>
              <!--<div class="subtable_div">-->
                <b-table selectable :select-mode="selectMode" :items="workflows.list" small hover :fields="columns" head-variant class="subtable" selectedVariant="primary" @row-selected="rowSelected">
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
                  <template slot="rend_ani_1" slot-scope="row">
                    <a
                      class="btn-link mx-1"
                      href="javascript:;"
                      v-if="row.item.status != 1"
                      @click="viewXmlHandler(row.item)"
                    >
                      <icon name="eye"></icon>
                    </a>
                  </template>
              </b-table>
              <b-row class="justify-content-center row-margin-tweak">
                <b-pagination
                        :size="template_size"
                        :total-rows="workflows.total"
                        :per-page="queryParam.size"
                        limit="5"
                        v-model="queryParam.page"
                ></b-pagination>
              </b-row>
              <!--</div>-->
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
                      <b-form-input id="input-horizontal" required v-model="project_data.name"></b-form-input>
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
                      <b-form-select v-model="project_data.entire_graph" :options="options_entire_graph"></b-form-select>
                    </b-form-group>
                  </b-col>

                </b-row>

                <b-row align-v="center">
                  <b-col sm="6">
                    <b-form-group
                            id="fieldset-horizontal"
                            label-cols-sm="4"
                            label-cols-lg="3"
                            label="开放模式:"
                            label-for="input-horizontal"
                    >
                      <b-form-select v-model="project_data.is_open" :options="options_is_open"></b-form-select>
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
                      <b-form-select v-model="project_data.reference" :options="options_reference"></b-form-select>
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
                      <b-form-select v-model="project_data.classification" :options="options_classification"></b-form-select>
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
                      <b-form-select  v-model="project_data.course" :options="options_course"></b-form-select>
                      <!--<b-form-select v-model="project_data.all_role" :options="options_all_role"></b-form-select>-->
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
                          <b-form-input type="date" v-model="project_data.start_time"></b-form-input>
                        </div>
                        &nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;
                        <div class="form-date-control">
                          <b-form-input type="date" v-model="project_data.end_time"></b-form-input>
                        </div>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-card header="项目简介（必填）" style="padding:0">
                      <b-form-textarea
                              v-model="project_data.intro"
                              placeholder=""
                              rows="3"
                              max-rows="6"
                              required
                      ></b-form-textarea>
                    </b-card>
                  </b-col>
                </b-row>
                <br>
                <b-row>
                  <b-col sm="12">
                    <b-card header="项目目的（必填）" style="padding:0">
                      <b-form-textarea
                              v-model="project_data.purpose"
                              placeholder=""
                              rows="3"
                              max-rows="6"
                              required
                      ></b-form-textarea>
                    </b-card>
                  </b-col>
                </b-row>
                <br>
                <b-row>
                  <b-col sm="12">
                    <b-card header="项目要求（必填）" style="padding:0">
                      <b-form-textarea
                              v-model="project_data.requirement"
                              placeholder=""
                              rows="3"
                              max-rows="6"
                              required
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
        <b-col sm="4" align-v="center" >
          <!--<b-button-group class="float-left" >-->
            <!--<b-button size="lg"  style="width:300px" variant="success"> 上一步 </b-button>-->
          <!--</b-button-group>-->
        </b-col>
        <b-col sm="4" align-v="center">
          <b-button-group class="float-center">
            <b-button size="lg"  type="submit" style="width:300px" variant="success" @click="savePage()"> 保存 </b-button>
            <!--<b-button size="lg"  style="width:300px" variant="success" @click="normal_button()"> 保存 </b-button>-->
          </b-button-group>
        </b-col>
        <b-col sm="4" align-v="center">
          <b-button-group class="float-right">
            <!--<b-button size="lg"  type="submit"  style="width:300px" variant="success" @click="nextPage()"> 下一步 </b-button>-->
            <b-button size="lg"  type="submit"  style="width:300px" variant="success"  @click="savePage()"> 下一步 </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-container>
    </b-form>
    <br><br>
    <view-xml :visible="xmlModalShow" :xml="workflowXml" @on-close="xmlModalShow = false"></view-xml>
  </div>

</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState, mapActions } from "vuex";
 import Loading from "@/components/loading/Loading";
import workflowService from "@/services/workflowService";
import BContainer from "bootstrap-vue/src/components/layout/container";
import ViewXml from "@/components/workflowXML/ViewXML";
import _ from "lodash";
import ProjectService from "@/services/projectService";
import CourseService from "@/services/courseService";

export default {
  name: "create-project-wizard",
  components: {
    BContainer,
    Loading,
    ViewXml,
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
            },
            rend_ani_1: {
                label: "检查",
                sortable: false,
                class: "text-center field-rend_ani_1"
            },
        },
//        project_data:{
//            flow_id:'',
//            flow_name:'',
//            name:'',
//            intro:'',
//            purpose:'',
//            requirement:'',
//            start_time:'',
//            end_time:'',
////            ???
//            all_role:'',
//            course:1,
//            reference:1,
//            public_status:1,
//            level:'',
//            entire_graph:1,
//            can_redo:'',
//            is_open:1,
//            ability_target:'',
//
//
//        },
        project_data:{},
        is_edit:0,
        options_entire_graph: [
            { value: 1, text: '完整显示' },
            { value: 2, text: '逐步显示' },
        ],
        options_is_open: [
            { value: 1, text: '自由' },
            { value: 2, text: '限时' },
            { value: 2, text: '指定用户' },
        ],
        options_reference: [
            { value: 1, text: '同步' },
            { value: 2, text: '后步' },
            { value: 2, text: '最后' },
        ],
        options_course: [],
        options_classification: [
            { value: 1, text: 'test1' },
            { value: 2, text: 'test2' },
            { value: 2, text: 'test3' },
        ],
      // 查询参数
      queryParam: {
        status: '2',
        page: 1,
        size: 10,
        search: ''
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
        selectedFlowName:'',
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
        selectedWorkflow:0,
        selectMode: 'single',
        saveBtnClicked:0,
        nextBtnClicked:0,
        courses: {
            list: [],
            total: 0
        },
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
          this.queryCourseList();
          if (this.$route.params.is_edit == 1){
              this.is_edit = this.$route.params.is_edit;
              this.project_data = this.$route.params.currentProject;


          } else if (this.$route.params.is_edit == 0){
              this.is_edit = this.$route.params.is_edit;
              this.project_data = {
                  id:0,
                  flow_id:0,
                  name:'',
                  all_role:0,
                  course:'',
                  reference:1,
                  classficiation:0,
                  public_status:1,
                  level:0,
                  entire_graph:1,
                  can_redo:0,
                  is_open:1,
                  ability_target:0,
                  intro:'',
                  purpose:'',
                  requirement:'',
                  start_time:'',
                  end_time:'',
              };
          }
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
        this.queryProjectCreate();
        this.queryProjectUpdate();
        this.queryCourseList();
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
//                  if (this.is_edit == 1){
//                      for (var i = 0 ; i < this.workflows.list.length; i++){
//                          if (parseInt(this.workflows.list[i].id) == parseInt(this.project_data.flow_id)){
//                              alert(this.workflows.list[i].name);
//                              this.project_data.flow_name = this.workflows.list[i].name;
//                              break
//                          }
//                      }
//                  }
                  for (var i = 0 ; i < this.workflows.list.length; i++){
                      for (var j = 0; j<this.experimentTypeOptions.length; j++){
                          if (this.workflows.list[i].type_label == parseInt(this.experimentTypeOptions[j].value)){
                              this.workflows.list[i].convertedData = this.experimentTypeOptions[j].text;
                              break
                          }
                      }
                  }
                  this.workflows.total = data.paging.count;
                  this.$emit("data-ready");
              })
              .catch(() => {
                  this.$emit("data-failed");
              });
      },

      // get All Course
      queryCourseList(){
          this.run();
          CourseService
              .getCourseList()
              .then(data => {
                  this.options_course = data.results;
//                  alert(this.options_course.length);
              })
              .catch(() => {
              })
      },
    // Go To Crate Project Page
    createProjectPage() {
      this.$router.push("/manager/project/create_project_wizard2");
    },
//      normal_button () {
      queryProjectCreate() {
//          alert('----');
          this.run();
          ProjectService
              .createProject(this.project_data)
              .then(data => {
                  this.$router.push('/manager/project' );
//                  alert(data);
//                  this.project.id = data.id
//                  this.nextBtnShow = true
//                  this.$toast.success('创建项目成功')
              })
              .catch(() => {
//                  this.nextBtnShow = false
              })
      },
      queryProjectUpdate() {
//          alert(this.project_data.name);
//          this.run();
//          ProjectService
//              .createProject(this.project_data)
//              .then(data => {
//                  this.$router.push('/manager/project' );
//                  alert(data);
////                  this.project.id = data.id
////                  this.nextBtnShow = true
////                  this.$toast.success('创建项目成功')
//              })
//              .catch(() => {
////                  this.nextBtnShow = false
//              })
          this.run();
          ProjectService
              .updateProject(this.project_data)
              .then(() => {
                  this.$router.push('/manager/project' );
//                  this.project.id = data.id
//                  this.nextBtnShow = true
//                  this.$toast.success('创建项目成功')
              })
              .catch(() => {
//                  this.nextBtnShow = false
              })
      },
//      getEditedWorkFlowName(){
//          if (this.is_edit == 1){
//              for (var i = 0 ; i < this.workflows.list.length; i++){
//                  if (parseInt(this.workflows.list[i].id) == parseInt(this.project_data.flow_id)){
//                      alert(this.workflows.list[i].name);
//                      this.selectedFlowName = this.workflows.list[i].name;
//                      break
//                  }
//              }
//          }
//      },
    showBigImg(animation) {
        this.animationImgSrc = animation.url;
        this.bigImgModal = true;
    },
    viewXmlHandler(workflow) {
        this.workflowXml = workflow.xml;
        this.xmlModalShow = true;
    },
      rowSelected(items){
          if (items.length>0){
              this.selectedWorkflow = items[0].id;
              this.project_data.flow_id = items[0].id;
              this.selectedFlowName = items[0].name;
          } else {
              this.selectedWorkflow = 0;
              this.project_data.flow_id = 0
              this.selectedFlowName = '';
          }
      },

      onSubmit(e){
          e.preventDefault();
          if (this.nextBtnClicked == 1){
              this.$router.push({name: 'create-project-wizard-2', params:{currentProject:this.project_data,is_edit:this.is_edit}});
          }
          if (this.saveBtnClicked == 1){
              if (this.is_edit == 1){
                  this.queryProjectUpdate();
              }
              if (this.is_edit == 0){
                  this.queryProjectCreate();
              }
          }
      },
      nextPage(){
          this.nextBtnClicked = 1;
          this.saveBtnClicked = 0;
      },
      savePage(){
          this.nextBtnClicked = 0;
          this.saveBtnClicked = 1;
      },
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
.opened {
  background-color: yellow;
}
</style>