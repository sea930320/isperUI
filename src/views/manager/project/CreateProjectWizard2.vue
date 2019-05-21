<template>
    <div class="mt-5 wizard-2">
        <loading v-if="isRunning"></loading>
        <b-alert variant="success" show>
            <b-container>
                <b-row>
                    <b-col sm="4">
                        项目名称 : {{project_data.name}}
                    </b-col>
                    <b-col sm="4">
                        相关流程 : {{project_data.flow_name}}
                    </b-col>
                    <b-col sm="4">
                        类型 : {{project_role.type}}
                    </b-col>
                    <b-col sm="4">

                    </b-col>
                </b-row>
            </b-container>
        </b-alert>
        <b-form @submit="onSubmit">
            <b-container fluid>
                <b-row align-v="start">
                    <b-col sm="5">
                        <div class="cardDiv">
                            <b-table responsive selectable :select-mode="selectMode"
                                     :items="projectRolesAssign.project_nodes" small hover :fields="columns"
                                     head-variant class="table-container" selectedVariant="primary"
                                     @row-selected="rowSelected">
                                <template slot="id" slot-scope="row">
                                    {{ row.index + 1}}
                                </template>
                                <template slot="name" slot-scope="row">
                                    {{ row.item.name}}
                                </template>
                                <template slot="appMode" slot-scope="row">
                                    <a href="javascript:;" class="case-text"
                                       @click="showBigProcessImg(row.item.process.image)">{{ row.item.process.name}}</a>
                                </template>
                                <template slot="agreeBit" slot-scope="row">
                                    <b-form-checkbox v-model="row.item.checked"
                                                     @change="changeCheckBox($event, row.item,1)">
                                        <!--<b-form-checkbox v-model="row.item.checked" @change="checkedIds()">-->
                                    </b-form-checkbox>
                                </template>
                            </b-table>
                        </div>
                    </b-col>
                    <b-col sm="7">
                        <div class="cardDiv ">
                            <div class="table-header text-left">
                                <table class="table table-green">
                                    <thead>
                                    <tr>
                                        <th width="15%">角色类型</th>
                                        <th width="15%">角色名称</th>
                                        <th width="37%">角色形象</th>
                                        <th width="11%">
                                            <div class="thead-top">是否使用</div>
                                        </th>
                                        <th width="11%">
                                            <div class="thead-top">结束环节</div>
                                        </th>
                                        <th width="11%">身份</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-body border h440 text-left table-container">
                                <table class="table table-hover">
                                    <tbody>
                                    <template v-for="(type, index) in projectRolesAssign.project_role_type"
                                              v-key="index">
                                        <tr class="tr-type" :key="'project_role_type_'+index">
                                            <td colspan="7" text-left>{{type}}</td>
                                        </tr>
                                        <tr v-for="(role, indexRole) in assignDataForType(type)" :key="'role_'+index+'_'+indexRole">
                                            <td width="15%"></td>
                                            <td width="15%">{{role.role_name}}</td>
                                            <td width="37%">{{role.image_name}}-{{role.gender ? (role.gender === 1 ? '男'
                                                : '女' ) : ''}} <a v-if="role.image_id" href="javascript:"
                                                                  v-b-modal.roleModal class="btn-link"
                                                                  @click="roleImageReselect(role)">重新选择</a></td>
                                            <td width="11%" class="check-padding">
                                                <b-form-checkbox v-model="role.is_use" @change="checkRoleAssign(role)">
                                                </b-form-checkbox>
                                            </td>
                                            <td width="11%" class="check-padding">
                                                <b-form-checkbox v-model="role.can_terminate"
                                                                 @change="checkRoleAssign(role)"
                                                                 @input="checkRoleAssign(role)">
                                                </b-form-checkbox>
                                            </td>
                                            <td width="11%" class="check-padding">
                                                <b-form-checkbox>
                                                </b-form-checkbox>
                                            </td>
                                        </tr>
                                    </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4" align-v="center">
                        <b-button-group class="float-">
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
                            <b-button size="lg" type="submit" style="width:100%" variant="primary" @click="nextPage()">
                                下一步
                            </b-button>
                            <!--<b-button size="lg"  type="submit"  style="width:300px" variant="success"  @click="savePage()"> 下一步 </b-button>-->
                        </b-button-group>
                    </b-col>
                </b-row>
                <b-modal id="roleModal" :visible="roleImageModalShow" title="角色形象" class="my-modal"
                         @ok="changeRoleImage" ok-title="确定" cancel-title="取消" @cancel="resetModal">
                    <b-container>
                        <b-row class="select-container">
                            <b-col sm="4" class="left">
                                <input type="text" class="search-input" v-model="searchKey">
                                <ul class="list">
                                    <li v-for="(roleItem, index) in searchData" :key="'roleItem_'+index" class="cursor"
                                        :class="{'active': activeTypeIndex === index }"
                                        @click="selectRoleImgType(roleItem, index)">{{roleItem.name}}
                                    </li>
                                </ul>
                            </b-col>
                            <b-col sm="8" class="right">
                                <ul class="module-figure-content">
                                    <li v-for="(roleImageItem, index) in roleImageForType" :key="'roleImageItem_'+index"
                                        @click="selectRoleName(roleImageItem, index)">
                                        <a href="javascript:;">
                                            <span class="module-avater"
                                                  :class="{'role-img-active': activeRoleIndex === index}"><img
                                                    :src="roleImageItem.avatar" alt="" width="100%"></span>
                                            <span class="module-text">{{roleImageItem.name}}-{{roleImageItem.gender === 1? '男' : '女'}}</span>
                                        </a>
                                    </li>
                                </ul>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
            </b-container>
            <br>
        </b-form>
        <br><br>
        <imageView :visible="bigprocessModal" :src="processImgSrc" @on-close="bigprocessModal=false"></imageView>
    </div>
</template>

<script>
    import {expType, level, abilityTarget} from "@/filters/fun";
    import {mapState, mapActions} from "vuex";
    import Loading from "@/components/loading/Loading";
    import workflowService from "@/services/workflowService";
    import BContainer from "bootstrap-vue/src/components/layout/container";
    import _ from "lodash";
    import ProjectService from "@/services/projectService";
    import imageView from "@/components/imageView/ImageView";

    export default {
        name: "wizard-2",
        components: {
            BContainer,
            Loading,
            imageView,
//            roleImageModal
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
                    appMode: {
                        label: "对应模块",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    agreeBit: {
                        label: "AgreeBit",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                },
                columns1: {
                    charact_class: {
                        label: "角色类型",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    charact_name: {
                        label: "角色名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    charact_img: {
                        label: "角色形象",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    is_useable: {
                        label: "是否使用",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    is_end: {
                        label: "结束环节",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    is_num: {
                        label: "奖励数量",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    is_score: {
                        label: "奖励分数",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                },
//                params
                project_data: {},
                project_role: {},
                projectRolesAssign: {},
                is_edit: 0,
                nodes2roles: {},
                curNodes2Roles: {},
                activeNodeIndex: -1,
                bigprocessModal: false,
                processImgSrc: '',
                roleImageModalShow: false,
                curRoleId: null,
                curRole: null,

                roleImageList: [],
                searchKey: '',
                curSelectRole: null,
                activeTypeIndex: 0,
                activeRoleIndex: -1,
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
                if (this.$route.params.is_edit) {
                    this.is_edit = this.$route.params.is_edit;
                    this.project_data = this.$route.params.currentProject;
                } else {
                    this.is_edit = this.$route.params.is_edit;
                    this.project_data = {
                        id: 0,
                        flow_id: 0,
                        name: '',
                        all_role: 0,
                        course: '',
                        reference: 1,
                        classficiation: 0,
                        public_status: 1,
                        level: 0,
                        entire_graph: 1,
                        can_redo: 0,
                        is_open: 1,
                        ability_target: 0,
                        intro: '',
                        purpose: '',
                        requirement: '',
                        start_time: '',
                        end_time: '',
                    };
                }
                this.queryWorkflowList();
                this.getProjectRolesDetail();
                this.queryWorkFlowRoleImage();

            });
        },
        computed: {
            ...mapState(["userInfo"]),
            searchData() {
                let that = this
                return that.roleImageList.filter(roleItem => {
                    return String(roleItem.name).toLowerCase().indexOf(String(that.searchKey).toLowerCase()) !== -1
                })
            },
            roleImageForType() {
                if (this.searchData[this.activeTypeIndex]) {
                    return this.searchData[this.activeTypeIndex].roles
                } else {
                    return []
                }
            }
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
                    this.queryWorkflowList();
                    this.queryProjectCreate();
                    this.queryProjectUpdate();
                    this.getProjectRolesDetail();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryWorkflowList();
                }, 500)
            }
        },
        methods: {
            ...mapActions(["setFlowStep"]),
            updatePage: function (value) {
                this.$emit('input', value);
            },
            queryWorkFlowRoleImage() {
                workflowService
                    .getWorkflowRoleImageList()
                    .then(data => {
                        if (data.length > 0) {
                            this.roleImageList = data
                        }
                    })
            },
            selectRoleImgType(roleItem, index) {
                this.activeTypeIndex = index
            },
            selectRoleName(roleImageItem, index) {
                this.curSelectRole = roleImageItem;
                this.activeRoleIndex = index
            },
            reset() {
                this.searchKey = '';
                this.curSelectRole = null;
                this.activeTypeIndex = 0;
                this.activeRoleIndex = -1
            },
            // 查询流程列表数据
            queryWorkflowList() {
                this.run();
                workflowService
                    .fetchList({...this.queryParam, ...this.queryDebounceParam})
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
                        if (this.is_edit === 1) {
                            for (let i = 0; i < this.workflows.list.length; i++) {
                                if (parseInt(this.workflows.list[i].id) === parseInt(this.project_data.flow_id)) {
//                              this.project_data.flow_name = this.workflows.list[i].name;
                                    this.selectedFlowName = this.workflows.list[i].name;
                                    break
                                }
                            }
                        }
                        for (let i = 0; i < this.workflows.list.length; i++) {
                            for (let j = 0; j < this.experimentTypeOptions.length; j++) {
                                if (this.workflows.list[i].type_label === parseInt(this.experimentTypeOptions[j].value)) {
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

            //get roles Detail
            getProjectRolesDetail() {
                this.run();
                ProjectService
                //                    .getProjectRolesDetail({project_id: this.project_data.id})
                    .getProjectRolesDetail({project_id: 2035})
                    .then(data => {
                        this.project_role = data.project;
                        this.initData(data)
                    })
            },

            //init Tables
            initData(data) {
                this.projectRolesAssign = data;
                this.nodes2roles = {};
                data.project_nodes.forEach(node => {
                    if (node.process.type === 1) this.imageNode = node;
                    this.nodes2roles[node.id] = data.project_roles.map(role => {
                        return {
                            role_id: role.id,
                            role_name: role.role_name,
                            type: role.type,
                            gender: role.gender,
                            image_id: node.process.type === 1 ? role.image_id : null,
                            image_name: node.process.type === 1 ? role.image_name : '非动画模块无形象',
                            is_use: data.project_node_roles.some(obj => {
                                return obj.node_id === node.id && obj.role_id === role.id
                            }),
                            can_terminate: data.project_node_roles.some(obj => {
                                return (obj.node_id === node.id && obj.role_id === role.id) ? obj.can_terminate : false
                            }),
                            can_brought: data.project_node_roles.some(obj => {
                                return (obj.node_id === node.id && obj.role_id === role.id) ? obj.can_brought : false
                            }),
                            num: (function () {
                                let num = 0;
                                data.project_node_roles.forEach(obj => {
                                    if (obj.node_id === node.id && obj.role_id === role.id) {
                                        num = obj.num ? obj.num : 0
                                    }
                                });
                                return num
                            })(),
                            score: (function () {
                                let score = 0;
                                data.project_node_roles.forEach(obj => {
                                    if (obj.node_id === node.id && obj.role_id === role.id) {
                                        score = obj.score ? obj.score : 0
                                    }
                                });
                                return score
                            })()
                        }
                    })
                });
                this.curNodes2Roles = this.nodes2roles[data.project_nodes[0].id]
            },
//          showBitProcess
            showBigProcessImg(img) {
                if (!img) {
                    this.$toasted.error('当前程序模块没有图片,无法展示');
                    return
                }
                this.bigprocessModal = true
                this.processImgSrc = img
            },
            assignDataForType(type) {
                return this.curNodes2Roles.filter((item) => {
                    return item.type === type
                })
            },
            checkRoleAssign(item) {
                if (item.can_terminate && !item.is_use) {
                    this.$toast.warn('请先勾是否使用该角色')
                    item.can_terminate = false
                }
            },
            roleImageReselect(roleItem) {
                this.roleImageModalShow = true;
                this.curRoleId = roleItem.role_id;
                this.curRole = roleItem
            },
            // Go To Crate Project Page
            // createProjectPage() {
            //     this.$router.push("/manager/project/create_project_wizard2");
            // },
            queryProjectCreate() {
                this.run();
                ProjectService
                    .createProject(this.project_data)
                    .then(() => {
                        this.$router.push('/manager/project');
                    })
                    .catch(() => {
                    })
            },
            queryProjectUpdate() {
                this.run();
                ProjectService
                    .updateProject(this.project_data)
                    .then(() => {
                        this.$router.push('/manager/project');
                    })
                    .catch(() => {
                    })
            },
            showBigImg(animation) {
                this.animationImgSrc = animation.url;
                this.bigImgModal = true;
            },
            viewXmlHandler(workflow) {
                this.workflowXml = workflow.xml;
                this.xmlModalShow = true;
            },
            rowSelected(items) {
//                this.activeNodeIndex = index;
                this.curNodes2Roles = this.nodes2roles[items[0].id]
            },
            getSaveData() {
                let projectNodeRoles = [];
                let roleImgs = [];
                this.projectRolesAssign.project_nodes.forEach(node => {
                    this.nodes2roles[node.id].forEach((role) => {
                        if (role.is_use) {
                            projectNodeRoles.push({
                                node_id: node.id,
                                role_id: role.role_id,
                                can_brought: role.can_brought,
                                can_terminate: role.can_terminate,
                                num: role.num,
                                score: role.score
                            })
                        }
                    })
                });
                let data = {project_roles: roleImgs, project_node_roles: projectNodeRoles};
                return JSON.stringify(data)
            },
            changeRoleImage(item) {
                this.roleImageModalShow = false;
//                this.curRole.image_name = item.name;
                this.curRole.image_name = this.curSelectRole.name;
//                this.curRole.image_id = item.id;
                this.curRole.image_id = this.curSelectRole.id;
//                this.curRole.gender = item.gender;
                this.curRole.gender = this.curSelectRole.gender;
//                if (this.$route.params.project_id && this.curRoleId && item.id) {
//                this.$route.params.project_id = 2035;
//                if (this.curRoleId && item.id) {
                if (this.curRoleId && this.curSelectRole.id) {
                    ProjectService.updateProjectRoleImage({
//                        project_id: this.$route.params.project_id,
                        project_id: 2035,
                        role_id: this.curRoleId,
                        image_id: item.id
                    }).then(() => {
                        this.$toasted.success('更新角色形象成功')
                    })
                }
            },
            resetModal() {
                this.searchKey = '';
                this.curSelectRole = null;
                this.activeTypeIndex = 0;
                this.activeRoleIndex = -1
            },
            onSubmit(e) {
                e.preventDefault();
                if (this.nextBtnClicked === 1) {
                    this.updatePage(2);
                }
                if (this.saveBtnClicked === 1) {
                    ProjectService.configurateProjectRoles({
                        project_id: this.project_data.id,
                        data: this.getSaveData()
                    }).then(() => {
                        this.$toasted.success('保存项目角色设置成功');
                    })
                }
                if (this.previousBtnClicked === 1) {
                    this.updatePage(0);
                }
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
            },
            previousPage() {
                this.nextBtnClicked = 0;
                this.saveBtnClicked = 0;
                this.previousBtnClicked = 1;
            },
        }
    };
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
    .wizard-2 {
        .check-padding {
            padding: 15px 40px !important;
        }

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
                overflow-y: auto !important;
                width: 100%;
            }
        }

        .fixed-table thead, tbody {
            display: block;
        }

        .fixed-table tbody {
            height: 100px; /* Just for the demo          */
            overflow-y: auto; /* Trigger vertical scroll    */
            overflow-x: hidden; /* Hide the horizontal scroll */
        }

        .select-container {
            height: 427px;
            font-size: 14px;
            border: 1px solid #cdcdcd;
        }

        .select-container > .left {
            padding: 0px 0px 0px 0px;
            height: 100%;
            border-right: 1px solid #cdcdcd;
        }

        .search-input {
            border: 1px solid #cdcdcd;
            width: 97%;
            width: calc(100% - 6px);
            height: 30px;
            line-height: 30px;
            margin: 3px;
            outline: none;
            padding-left: 0px;
        }

        .select-container > .left > .list {
            margin: 0;
            padding: 0;
            height: calc(100% - 40px);
            overflow-x: hidden;
            overflow-y: auto;
        }

        .select-container > .left > .list > li {
            height: 35px;
            line-height: 35px;
            padding: 0 8px;
            border-top: 1px solid #fff;
            border-bottom: 1px solid #fff;
        }

        .select-container > .left > .list > li:hover {
            border-top: 1px solid #cdcdcd;
            border-bottom: 1px solid #cdcdcd;
            background-color: #f2f9ff;
        }

        .select-container > .left > .list > li.active {
            background-color: #d9edf7;
            border: 1px solid
        }

        .select-container > .right {
            padding: 0;
            height: 100%;
            overflow-y: auto;
        }

        .module-figure-content .module-avater.role-img-active {
            border: 1px solid #51C314;
        }

        li {
            cursor: pointer;
            list-style-type: none;
        }

        .my-modal .modal-dialog {
            width: 2000px !important;
        }

        .table-container {
            height: calc(100vh - 450px);
        }

        .table-container table {
            display: flex;
            flex-flow: column;
            height: 100%;
            width: 100%;
        }

        .table-container table thead {
            flex: 0 0 auto;
            width: 100%;
        }

        .table-container table tbody {
            flex: 1 1 auto;
            display: block;
            width: 100%;
            overflow-y: auto;
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