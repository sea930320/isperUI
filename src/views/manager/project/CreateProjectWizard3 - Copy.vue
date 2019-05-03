<template>
  <div>
    <br><br>
    <h3> Main Option (Step 3)</h3>
    <br><br>
    <loading v-if="isRunning"></loading>
    <b-alert variant="success" show class="text-left">
      <b-container>
        <b-row>
          <b-col sm="5">
            项目名称 :
            {{projectData.name}}
          </b-col>
          <b-col sm="4">
            相关流程 :
            {{projectData.flow_name}}
          </b-col>
          <b-col sm="3">
            类型 :
            {{projectData.type | expType}}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="5">
            等级 :
            {{projectData.leve | level}}
          </b-col>
          <b-col sm="4">
            能力目标 :
            {{projectData.ability_target | abilityTarget}}
          </b-col>
          <b-col sm="3">
            <a href="javascript:;" class="btn-spe btn-upload"  @click="showUploadModal">上传素材</a>
          </b-col>
        </b-row>
      </b-container>
    </b-alert>
    <b-container fluid>
      <b-row align-v="left">
        <b-col sm="6">
          <div class="cardDiv">
            <b-table  responsive selectable :select-mode="selectMode" :items="projectDocsAssign.docs" small hover :fields="columns" head-variant class="subtable" selectedVariant="primary" @row-selected="selectDoc">
            <template slot="id" slot-scope="row">
              {{ row.index + 1}}
            </template>
            <template slot="class" slot-scope="row">
              {{ row.item.type}}
            </template>
            <template slot="name" slot-scope="row">
              {{ row.item.name}}
            </template>
            <template slot="type" slot-scope="row">
              <b-form-select v-model="row.item.usage" :options="options1"></b-form-select>
            </template>
            <template slot="control" slot-scope="row">
              <!--test-->
              <a :href="row.item.file" target="_blank">下载</a>
            </template>
          </b-table>
          </div>
        </b-col>
        <b-col sm="2">
          <b-table  responsive selectable :select-mode="selectMode" :items="projectDocsAssign.nodes" small hover :fields="columns1" head-variant class="subtable" selectedVariant="primary" @row-selected="selectNode">
            <template slot="number" slot-scope="row">
              {{ row.index + 1}}
            </template>
            <template slot="name" slot-scope="row">
              {{ row.item.name}}
            </template>
          </b-table>
        </b-col>
        <b-col sm="4">
          <b-table  responsive selectable :select-mode="selectMode" :items="curNode2Roles" small hover :fields="columns2" head-variant class="subtable" selectedVariant="primary" @row-selected="selectDoc">
            <template slot="character_class" slot-scope="row">
              {{ row.item.type}}
            </template>
            <template slot="character_name" slot-scope="row">
              {{ row.item.role_name}}
            </template>
            <template slot="is_use" slot-scope="row">
              <b-form-checkbox v-model="row.item.is_use" @change="isCheckUse()"></b-form-checkbox>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
    <br><br>
    <uploadModal
            :modalShow="uploadModalShow"
            :uploadUrl="docsUploadUrl"
            :uploadParams="uploadParams"
            @on-uploadConfirm="docUploadConfirm"
            @on-cancel="uploadModalShow=false">
    </uploadModal>
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
    import imageView from "@/components/imageView/ImageView";
    import ToggleUpload from "@/components/upload/ToggleUpload";
    import uploadModal from '@/components/upload/uploadModal'

    export default {
        name: "create-project-wizard",
        components: {
            BContainer,
            Loading,
            ToggleUpload
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
                    class: {
                        label: "素材类型",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    name: {
                        label: "素材名称",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    type: {
                        label: "用途",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    control: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                },
                columns1: {
                    number: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "环节名称",
                        sortable: false,
                        class: "text-center field-name"
                    }
                },
                columns2: {
                    character_class: {
                        label: "角色类型",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    character_name: {
                        label: "角色名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    is_use: {
                        label: "是否使用本素材",
                        sortable: false,
                        class: "text-center field-name"
                    },
                },
                options1:[
                  { value: 1, text:'操作指南' },
                  { value: 2, text:'关联文件' },
                  { value: 3, text:'模板' },
                  { value: 4, text:'材料' },
                  { value: 5, text:'公文' },
                  { value: 6, text:'成果参考' },
                  { value: 7, text:'项目提示' },
                ],
//                params
                project_id:-1,
                projectData: {},
                projectDocsAssign: {
                    docs: [],
                    nodes: [],
                    role_type: []
                },
                activeDocIndex: 0,
                selectMode: 'single',
                activeNodeIndex: 0,
                activeNodeId: null,
                activeDocId: null,
                currentDoc: {},
                isLoading: false,
                successTipModal: false,
                deleteModalShow: false,
                uploadModalShow: false,  // 显示隐藏素材上传模态框
                docsUploadUrl: '/api/project/docs/create', // 素材上传接口地址
                nodes2roles: {},
                curNode2Roles: [],
                uploadModalShow:false,
//                params
                // 查询参数
                queryParam: {
                    status: '2',
                    page: 1,
                    size: 10,
                },
                workflows: {
                    list: [],
                    total: 0
                },
                queryDebounceParam: {
                    search: ""
                },
                // 流程相关项目
                relatedProjects: [],
                selectedFlowName:'',
                animationImgSrc: "",
                copyModalName: "",
                workflowXml: null,
                newFlowStatus: false,
                relatedShow: false,
                shareModal: false,
                selectedWorkflow:0,
                selectMode: 'single',
                saveBtnClicked:0,
                previousBtnClicked:0,
                nextBtnClicked:0,
                courses: {
                    list: [],
                    total: 0
                }
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryCourseList();
                this.is_edit = this.$route.params.is_edit;
                this.project_data = this.$route.params.currentProject;
                this.queryWorkflowList();
                this.getProjectRolesDetail();
                this.queryWorkFlowRoleImage();

            });
            this.$nextTick(() => {
//                this.project_id = this.$route.params.project_id;
                this.project_id = 2035;
                this.queryProjectDocsDetail();
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
                    this.getProjectRolesDetail();
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
            queryProjectDocsDetail() {
                this.run();
                ProjectService
                    .getProjectDocsDetail({project_id:this.project_id})
                    .then(data => {
                        this.$emit("data-ready");
                        alert('success');
                        this.initData(data);
                        this.projectData = data.project;
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            initData(data) {
                this.projectData = data.project;
                this.projectDocsAssign.nodes = data.project_nodes;
                this.projectDocsAssign.docs = data.project_docs;
                this.activeNodeId = this.activeNodeId || data.project_nodes[0].id;
                if (data.project_docs.length > 0) this.activeDocId = this.activeDocId || data.project_docs[0].id;
                this.nodes2roles = data.project_nodes;
                this.getCurNode2Roles()
            },
            getCurNode2Roles() {
                this.curNode2Roles = this.nodes2roles.filter(node => node.id === this.activeNodeId)[0].roles.map(role => {
                    return {
                        role_id: role.id,
                        type: role.type,
                        role_name: role.name,
                        is_use: role.doc_ids.indexOf(this.activeDocId) !== -1
                    }
                })
            },
            selectDoc (items) {
                item = items[0];
//                this.activeDocIndex = index;
                this.activeDocId = item.id;
                this.currentDoc = item;
                this.getCurNode2Roles();
            },
            changeUseHandle(doc) {
                if (doc.usage === 7 || doc.usage === 3) {
                    if (doc.name.substring(doc.name.lastIndexOf('.') + 1).toLowerCase() !== 'docx') {
                        this.$toasted.success('模板或项目提示用途必须是docx格式的文件');
                        doc.usage = null
                        return false
                    }
                }
            },
            selectNode (index, item) {
                this.activeNodeIndex = index;
                this.activeNodeId = item.id;
                this.getCurNode2Roles()
            },
            isCheckUse(role) {
                if (!this.activeDocId) {
                    alert('当前没有素材或者没有选择素材')
                    role.is_use = false
                    return
                }
                // console.log(role)
                this.nodes2roles.forEach(node => {
                    if (this.activeNodeId && node.id === this.activeNodeId) {
                        node.roles.forEach(item => {
                            if (item.id === role.role_id) {
                                let index = item.doc_ids.indexOf(this.activeDocId)
                                if (!role.is_use) {
                                    if (index === -1) item.doc_ids.push(this.activeDocId)
                                } else {
                                    if (index !== -1) item.doc_ids.splice(index, 1)
                                }
                            }
                        })
                    }
                })
            },
            uploadAnimationSuccess(data) {
                let item = arrayUtils.find(this.workflows.list, data);
                item.animation1 = data.animation1;
                item.animation2 = data.animation2;
            },
            showUploadModal() {
                this.uploadModalShow = true
            },
            onSubmit(e){
                e.preventDefault();
                if (this.nextBtnClicked == 1){
                    this.$router.push({name: 'create-project-wizard3', params: { project_id: this.projectData.id }});
                }
                if (this.saveBtnClicked == 1){
                    ProjectService.configurateProjectRoles({
                        project_id: this.projectData.id,
                        data: this.getSaveData()
                    }).then(() => {
                        this.$toasted.success('保存项目角色设置成功');
                    })
                }
                if (this.previousBtnClicked == 1){
                    this.$router.push({name: 'create-project-wizard1', params:{currentProject:this.projectData,is_edit:this.is_edit}});
                }
            },
            nextPage(){
                this.nextBtnClicked = 1;
                this.saveBtnClicked = 0;
                this.previousBtnClicked = 0;
            },
            savePage(){
                this.nextBtnClicked = 0;
                this.saveBtnClicked = 1;
                this.previousBtnClicked = 0;
            },
            previousPage(){
                this.nextBtnClicked = 0;
                this.saveBtnClicked = 0;
                this.previousBtnClicked = 1;
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
  .table-fixed{
    tbody{
      height:200px;
      overflow-y:auto;
      width: 100%;
    }
  }
</style>