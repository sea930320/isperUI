<template>
    <div class="mt-5 wizard-4">
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
            </b-container>
        </b-alert>
        <b-form @submit="onSubmit">
            <b-container fluid>
                <b-row align-v="start">
                    <b-col sm="4">
                        <div class="cardDiv">
                            <b-table responsive selectable :select-mode="selectMode" :items="nodes" small hover
                                     :fields="columns" head-variant class="subtable table-container"
                                     selectedVariant="primary" @row-selected="selectNode">
                                <template slot="id" slot-scope="row">
                                    {{ row.index + 1}}
                                </template>
                                <template slot="name" slot-scope="row">
                                    {{ row.item.name}}
                                </template>
                                <template slot="matching_name" slot-scope="row">
                                    <a href="javascript:;" @click="showBigProcessImg(row.item.process.image)">{{row.item.process.name}}</a>
                                </template>
                            </b-table>
                        </div>
                    </b-col>
                    <b-col sm="4">
                        <div class="cardDiv text-left">
                            <b-table responsive :items="currentJump" small :fields="columns1" head-variant
                                     class="subtable text-left table-container" selectedVariant="primary">
                                <template slot="name" slot-scope="row">
                                    {{ row.item.name}}
                                    <span style="float:right;" @click="deleteJumpHandle">
                  <icon name="window-close" title="删除" style="cursor: pointer;"></icon>
                </span>
                                </template>
                            </b-table>
                        </div>
                    </b-col>

                    <b-col sm="4">

                        <div class="cardDiv text-left">
                            <b-navbar toggleable="lg" variant="info">
                                <!-- Right aligned nav items -->
                                <b-input-group>
                          <span class="input-group-text">
                            <icon name="search"></icon>
                          </span>
                                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                                </b-input-group>
                                <!--<b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
                            </b-navbar>
                            <b-table responsive selectable :select-mode="selectMode" hover :items="projects.list" small
                                     :fields="columns2" head-variant class="subtable text-left table-container"
                                     selectedVariant="primary" @row-selected="selectProjectHandle">
                                <template slot="id" slot-scope="">
                                    <span class="icon-select">✔</span>
                                </template>
                                <template slot="name" slot-scope="row">
                                    {{ row.item.name }}
                                </template>
                                <template slot="class" slot-scope="row">
                                    {{ row.item.type | expType }}
                                </template>
                            </b-table>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4" align-v="center">
                        <b-button-group class="float-center">
                            <b-button size="lg" type="submit" style="width:100%" variant="primary"
                                      @click="previousPage()"> 上一步
                            </b-button>
                        </b-button-group>
                    </b-col>
                    <b-col sm="4" align-v="center">
                        <b-button-group class="float-center">
                            <b-button size="lg" style="width:100%" variant="primary" @click="savePage()"> 保存</b-button>
                            <!--<b-button size="lg"  style="width:300px" variant="success" @click="normal_button()"> 保存 </b-button>-->
                        </b-button-group>
                    </b-col>
                    <b-col sm="4" align-v="center">
                        <b-button-group class="float-center">
                            <b-button size="lg" type="submit" style="width:100%" variant="primary" v-b-modal.finishEdit
                                      @click="nextPage()"> 下一步
                            </b-button>
                            <!--<b-button size="lg"  type="submit"  style="width:300px" variant="success"  @click="savePage()"> 下一步 </b-button>-->
                        </b-button-group>
                    </b-col>
                </b-row>
                <br><br>
            </b-container>
        </b-form>
        <b-modal id="finishEdit" title="Finish Edit Project" @ok="finishEdit()">
            <p class="my-4">Do you want to finish editing this project?</p>
        </b-modal>
        <imageView :visible="bigprocessModal" :src="processImgSrc" @on-close="bigprocessModal=false"></imageView>
    </div>
</template>

<script>
    import ProjectService from "@/services/projectService";
    import {expType, level, abilityTarget} from "@/filters/fun";
    import {mapState, mapActions} from "vuex";
    import Loading from "@/components/loading/Loading";
    //    import BContainer from "bootstrap-vue/src/components/layout/container";
    //    import ViewXml from "@/components/workflowXML/ViewXML";
    import _ from "lodash";
    import imageView from "@/components/imageView/ImageView";

    export default {
        name: "wizard-4",
        components: {
            Loading,
            imageView,
        },
        props: ['value'],
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
                        label: "环节名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    matching_name: {
                        label: "对应模块",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                },
                columns1: {
                    name: {
                        label: "要跳转的项目名称",
                        sortable: false,
                        class: "text-left"
                    },
                },
                columns2: {
                    id: {
                        label: "选择",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "要跳转的项目名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    class: {
                        label: "类型",
                        sortable: false,
                        class: "text-center field-name"
                    },
                },
//                params
                project_id: -1,
                projectData: {},
                roleImageModalShow: false,
                successTipModal: false,
                // 跳转设置是否保存
                isSaved: false,
                // 当前选中的流程index值
                activeNodeIndex: 0,
                activeProjectIndex: -1,
                currentNode: null,
                bigprocessModal: false,
                curSelectedProcess: {},
                processImgSrc: '',
                searchKey: '',
                nodes: [],
                // 当前环节对应的跳转项目
                currentJump: [],
                // 选中的项目
                selectProject: null,
                projects: {
                    list: [],
                    total: 0
                },
                // 查询项目的参数
//                params
                // 查询参数
                queryParam: {
                    page: 1,
                    size: 8,
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
                selectedFlowName: '',
                animationImgSrc: "",
                copyModalName: "",
                workflowXml: null,
                newFlowStatus: false,
                relatedShow: false,
                shareModal: false,
                selectedWorkflow: 0,
                selectMode: 'single',
                saveBtnClicked: 0,
                previousBtnClicked: 0,
                nextBtnClicked: 0,
                courses: {
                    list: [],
                    total: 0
                }
            };
        },
        created() {
            this.$nextTick(() => {
                this.project_id = this.$route.params.project_id;
//                this.project_id = 2035;
                this.project_id = 2051;
                this.queryDetail();
                this.queryProjectList();
            });
        },
        computed: {
            ...mapState(["userInfo"])
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
//                    this.queryWorkflowList();
//                    this.queryProjectCreate();
//                    this.queryProjectUpdate();
//                    this.queryCourseList();
//                    this.getProjectRolesDetail();
                    this.queryDetail();
                    this.queryProjectList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryProjectList();
                }, 500)
            }
        },
        methods: {
            ...mapActions(["setFlowStep"]),
            updatePage: function (value) {
                this.$emit('input', value);
            },
            // 查询流程列表数据
            queryDetail() {
                ProjectService
                    .getJumpDetail({
                        project_id: this.project_id
                    })
                    .then(data => {
                        this.projectData = data.project;
                        this.nodes = data.project_nodes;
                        // 跳转设置是否完整且保存
                        this.isSaved = this.nodes.filter(node => node.process.type === 6).some(node => node.project_jump)
                        if (data.project_nodes.length > 0) {
                            this.currentJump = data.project_nodes[0].project_jump
                        }
                    })
            },
            selectNode(items) {
                var selectedNodeIndex = this.nodes.indexOf(items[0]);
                var item = items[0];
                // if (item.process.type !== 6) {
                //   return
                // }
                this.activeNodeIndex = selectedNodeIndex;
                this.activeProjectIndex = -1;
                this.currentNode = item;
                this.currentJump = item.project_jump ? [item.project_jump] : [];
//                if (item.project_jump){
////                    alert('query');
//                    queryProjectList();
//                } else {
//                    this.projects ={
//                        list: [],
//                        total: 0
//                    }
//                }
            },
            showBigProcessImg(img) {
                if (!img) {
                    this.$toasted.error('当前程序模块没有图片,无法展示');
                    return
                }
                this.bigprocessModal = true;
                this.processImgSrc = img;
            },
            deleteJumpHandle() {
                this.isSaved = false;
                this.currentJump = null;
                this.nodes[this.activeNodeIndex].project_jump = null
                this.activeProjectIndex = -1
            },
            queryProjectList() {
                this.run();
                ProjectService.getProjectList({...this.queryParam, ...this.queryDebounceParam}).then(data => {
                    this.projects.list = data.results.map(i => {
                        this.$set(i, 'checked', false);
                        this.$emit("data-ready");
                        return i
                    });
                    this.projects.total = data.paging.count
                })
            },
            selectProjectHandle(items) {
                let selectedProject = items[0];
                let currentNode = this.nodes[this.activeNodeIndex];

                if (!!currentNode && currentNode.process.type !== 6) {
                    return
                }
                if (this.projectData.id && selectedProject.id === this.projectData.id) {
                    this.$toasted.error('跳转项目不能选择自己本身');
                    return
                }
                let selectedProjectIndex = this.projects.list.indexOf(items[0]);
                this.activeProjectIndex = selectedProjectIndex;
                this.selectProject = selectedProject;
                this.currentJump = [{
                    id: selectedProject.id,
                    name: selectedProject.name
                }];
                this.nodes[this.activeNodeIndex].project_jump = this.currentJump
            },
            onSubmit(e) {
                e.preventDefault();
            },
            finishEdit() {
                this.$router.push({name: 'manager-project'});
            },
            nextPage() {
                this.nextBtnClicked = 1;
                this.saveBtnClicked = 0;
                this.previousBtnClicked = 0;
            },
            savePage() {
                this.nextBtnClicked = 0;
                this.saveBtnClicked = 1;
                this.previousBtnClicked = 0;
                if (!this.nodes.filter(node => node.process.type === 6).some(node => node.project_jump)) {
                    this.$toasted.error('某些跳转环节没有配置');
                    return
                }
                var jumpData = {};
                jumpData.project_jumps = this.nodes.filter(node => node.process.type === 6)
                    .map(node => {
                        return {
                            node_id: node.id,
                            jump_project_id: node.project_jump.id
                        }
                    });
                ProjectService
                    .postJumpSetup({
                        project_id: this.$route.params.project_id,
                        data: JSON.stringify(jumpData)
                    })
                    .then(() => {
                        this.isSaved = true;
                        this.$toasted.success('跳转设置成功');
                    })
            },
            previousPage() {
                this.nextBtnClicked = 0;
                this.saveBtnClicked = 0;
                this.previousBtnClicked = 1;
                this.updatePage(2);
            },
        }
    };
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
    .wizard-4 {
        .card-body {
            padding: 0;
        }

        .card-header {
            text-align: left;
        }

        .opened {
            background-color: yellow;
        }

        .table-fixed {
            tbody {
                height: 200px;
                overflow-y: auto;
                width: 100%;
            }
        }

        .inactive {
            color: red;
        }

        icon {
            cursor: pointer;
        }

        .table-container {
            height: calc(100vh - 450px);

        }

        .table-container table {
            display: flex;
            flex-flow: column;
            height: 100%;
            width: 100%;
            overflow-y: auto;
        }

        .table-container table thead {
            flex: 0 0 auto;
            width: 100%;
        }

        .table-container table tbody {
            flex: 1 1 auto;
            display: block;
            width: 100%;
            overflow-y: scroll;
        }

        .table-container table tbody tr {
            width: 100%;
        }

        .table-container table thead, .table-container table tbody tr {
            display: table;
            table-layout: fixed;
        }

        .table-container table {
            border-collapse: collapse;
        }

        .table-container table td, .table-container table th {
            padding: 0.4em;
        }

        .table-container table tbody td {
            padding: 8px;
            cursor: pointer;
        }

        .table-container table thead td {
            padding: 10px 5px;
        }

        /* START Adjustments for width and scrollbar hidden */
        .table-container th.table-action, .table-container td.table-action {
            width: 5.8vw;
        }

        .table-container table thead {
            width: calc(100% - 1px);
        }

        .table-container table tbody::-webkit-scrollbar {
            width: 1px;
        }

        .table-container table tbody::-webkit-scrollbar {
            width: 1px;
        }

        .table-container table tbody::-webkit-scrollbar-thumb {
            width: 1px;
        }
    }
</style>