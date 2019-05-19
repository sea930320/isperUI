<template>
    <div class="mt-5 wizard-3">
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
                        能力目标 :
                        {{projectData.ability_target | abilityTarget}}
                    </b-col>
                    <b-col sm="3">
                        <a href="javascript:;" class="btn-spe btn-upload" v-b-modal.uploadDoc>上传素材</a>
                    </b-col>
                </b-row>
            </b-container>
        </b-alert>
        <b-container fluid>
            <b-row align-v="start">
                <b-col sm="6">
                    <div class="cardDiv">
                        <!--<b-table  responsive selectable :select-mode="selectMode" :items="projectRolesAssign.project_nodes" small hover :fields="columns" head-variant class="table-container" selectedVariant="primary" @row-selected="rowSelected" >-->
                        <b-table responsive selectable :select-mode="selectMode" :items="projectDocsAssign.docs" small
                                 hover :fields="columns" head-variant class="table-container" selectedVariant="primary"
                                 @row-selected="selectDoc">
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
                                <b-form-select v-model="row.item.usage" :options="options1"
                                               @change="changeUseHandle(row.item)"></b-form-select>
                            </template>
                            <template slot="control" slot-scope="row">
                                <!--test-->
                                <a href="javascript:;"
                                   class="btn-link"
                                   title="预览"
                                   @click="previewFile(row.item.file)">
                                    <icon name="eye"></icon>
                                </a>&nbsp;&nbsp;
                                <a :href="row.item.file"
                                   class="btn-link"
                                   title="下载"
                                   target="_blank">
                                    <icon name="download"></icon>
                                </a>&nbsp;&nbsp;
                                <a v-b-modal.deleteConfirmModal
                                   href="javascript:"
                                   class="btn-link"
                                   title="删除"
                                   @click="deleteDocClick(row.item)">
                                    <icon name="trash"></icon>
                                </a>&nbsp;&nbsp;
                                <b-form-checkbox v-model="row.item.is_initial" @on-change="setInitial(row.item)">
                                    设为初始素材
                                </b-form-checkbox>
                            </template>
                        </b-table>
                    </div>
                </b-col>
                <b-col sm="2">
                    <div class="cardDiv">
                        <!--<b-table  responsive selectable :select-mode="selectMode" :items="projectDocsAssign.nodes" small hover :fields="columns1" head-variant class="table-container" selectedVariant="primary" @row-selected="selectNode">-->
                        <b-table responsive selectable :select-mode="selectMode" :items="projectDocsAssign.nodes" small
                                 hover :fields="columns1" head-variant class="table-container" selectedVariant="primary"
                                 @row-selected="selectNode">
                            <template slot="number" slot-scope="row">
                                {{ row.index + 1}}
                            </template>
                            <template slot="name" slot-scope="row">
                                {{ row.item.name}}
                            </template>
                        </b-table>
                    </div>
                </b-col>
                <b-col sm="4">
                    <div class="cardDiv">
                        <b-table responsive selectable :select-mode="selectMode" :items="curNode2Roles" small hover
                                 :fields="columns2" head-variant class="table-container" selectedVariant="primary"
                                 @row-selected="selectDoc">
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
                    </div>
                </b-col>
            </b-row>
            <br>
            <b-row>
                <b-col sm="4" align-v="center">
                    <b-button-group class="float-center">
                        <b-button size="lg" type="submit" style="width:100%" variant="primary" @click="goLast()"> 上一步
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
                                  @click="goNext()"> 下一步
                        </b-button>
                        <!--<b-button size="lg"  type="submit"  style="width:300px" variant="success"  @click="savePage()"> 下一步 </b-button>-->
                    </b-button-group>
                </b-col>
            </b-row>
            <br><br>
            <b-modal id="deleteConfirmModal" title="Delete Doc" @ok="confirmDelete()">
                <p class="my-4">Do you want to delete Doc?</p>
            </b-modal>
            <b-modal id="uploadDoc" title="Upload Doc" @ok="uploadDoc()">
                <template>
                    <div>
                        <!--accepted-file-types="text/plain"-->
<!--                        <file-pond-->
<!--                                ref="pond"-->
<!--                                accepted-file-types="application/pdf"-->
<!--                                allow-multiple="true"-->
<!--                                max-files="3"-->
<!--                                fileValidateTypeLabelExpectedTypes="Must be a plain text file"-->
<!--                                instant-upload="true"-->
<!--                                allow-replace="false"-->
<!--                                allow-revert="false"-->
<!--                                :server="server"-->
<!--                                @addfile="handleAddFile"-->
<!--                                @removefile="handleRemoveFile"-->
<!--                                @processfilestart="handleProcessFileStart"-->
<!--                                @processfileabort="handleProcessFileAbort"-->
<!--                                @processfilerevert="handleProcessFileUndo"-->
<!--                                @processfile="handleProcessFile"-->
<!--                                name="test"-->
<!--                                label-idle="Upload PDF file..."-->
<!--                                v-bind:files="myFiles">-->
<!--                        </file-pond>-->
                    </div>
                </template>
            </b-modal>
        </b-container>
    </div>
</template>

<script>
    import {expType, level, abilityTarget} from "@/filters/fun";
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import {openFile} from "@/components/previewFile";
    import ProjectService from "@/services/projectService";
    import _ from "lodash";


    // import vueFilePond from 'vue-filepond';
    import 'filepond/dist/filepond.min.css';
    // import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

    // const FilePond = vueFilePond(FilePondPluginFileValidateType);

    export default {
        name: "wizard-3",
        components: {
            Loading,
            // FilePond
        },
        props: ['value'],
        filters: {
            expType,
            level,
            abilityTarget
        },
        data() {
            return {
                projectData: {},
                columns: {
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    class: {
                        label: "素材类型",
                        sortable: false,
                        class: "text-center field_15"
                    },
                    name: {
                        label: "素材名称",
                        sortable: false,
                        class: "text-center field-35"
                    },
                    type: {
                        label: "用途",
                        sortable: false,
                        class: "text-center field-15"
                    },
                    control: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-25"
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
                        class: "text-center field-30"
                    },
                    character_name: {
                        label: "角色名称",
                        sortable: false,
                        class: "text-center field-50"
                    },
                    is_use: {
                        label: "是否使用本素材",
                        sortable: false,
                        class: "text-center field-20"
                    },
                },
                options1: [
                    {value: 1, text: '操作指南'},
                    {value: 2, text: '关联文件'},
                    {value: 3, text: '模板'},
                    {value: 4, text: '材料'},
                    {value: 5, text: '公文'},
                    {value: 6, text: '成果参考'},
                    {value: 7, text: '项目提示'},
                ],
//                params
                project_id: -1,
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

                // 查询参数
                allChecked: false,
                queryParam: {
                    status: "",
                    page: 1,
                    size: 15,
                },
                queryDebounceParam: {
                    search: ""
                },
                // 流程列表
                projects: {
                    list: [],
                    total: 0
                },
                // 流程相关项目
                animationImgSrc: "",
                bigImgModal: false,
                currentProjectID: {},
                checkedSharedItemsID: [],
                checkedUnsharedItemsID: [],
                checkedSharedItems: [],
                checkedUnsharedItems: [],
                myFiles: []
            };
        },
        created() {
            this.$nextTick(() => {
//                this.is_edit = this.$route.params.is_edit;
//                this.project_data = this.$route.params.currentProject;
                this.project_id = 2034;
//                this.queryProjectList();
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
                    this.queryProjectList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryProjectList();
                }, 500)
            },
            allChecked: {
                handler(val) {
                    if (val) {
                        this.projects.list.map(item => {
                            item.checked = true;
                            return item;
                        });
                    } else {
                        this.projects.list.map(item => {
                            item.checked = false;
                            return item;
                        });
                    }
                }
            }
        },
        methods: {
            updatePage: function (value) {
                this.$emit('input', value);
            },
            handleFilePondInit: function () {
                return true;
//                console.log('FilePond has initialized');

                // FilePond instance methods are available on `this.$refs.pond`
            },
            queryProjectDocsDetail() {
                this.run();
                ProjectService
                    .getProjectDocsDetail({project_id: this.project_id})
                    .then(data => {
                        this.initData(data);
                        this.$emit("data-ready");
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
            selectNode(items) {
//                var selectedNodeIndex = this.projectDocsAssign.nodes.indexOf(items[0]);
                this.activeNodeIndex = this.projectDocsAssign.nodes.indexOf(items[0]);
                this.activeNodeId = items[0].id;
                this.getCurNode2Roles()
            },
            selectDoc(items) {
                this.activeDocIndex = this.projectDocsAssign.docs.indexOf(items[0]);
                this.activeDocId = items[0].id;
                this.currentDoc = items[0];
                this.getCurNode2Roles()
            },
            isCheckUse(role) {
                if (!this.activeDocId) {
                    this.$toasted.warn('当前没有素材或者没有选择素材');
                    role.is_use = false;
                    return
                }
                // console.log(role)
                this.nodes2roles.forEach(node => {
                    if (this.activeNodeId && node.id === this.activeNodeId) {
                        node.roles.forEach(item => {
                            if (item.id === role.role_id) {
                                let index = item.doc_ids.indexOf(this.activeDocId);
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
            changeUseHandle(doc) {
                if (doc.usage === 7 || doc.usage === 3) {
                    if (doc.name.substring(doc.name.lastIndexOf('.') + 1).toLowerCase() !== 'docx') {
                        this.$toast.warn('模板或项目提示用途必须是docx格式的文件');
                        doc.usage = null;
                        return false
                    }
                }
            },
            goLast() {
                this.updatePage(1);
            },
            goNext() {
                this.updatePage(3);
            },
            getSaveData() {
                let projectDocs = this.projectDocsAssign.docs.map((doc) => {
                    return {
                        id: doc.id,
                        usage: doc.usage,
                        type: doc.type,
                        is_initial: doc.is_initial
                    }
                })

                let projectDocsNodes = []
                let projectDocsRole = []
                this.nodes2roles.forEach(node => {
                    node.roles.forEach(role => {
                        role.doc_ids.forEach(doc => {
                            projectDocsRole.push({
                                doc_id: doc,
                                node_id: node.id,
                                role_id: role.id
                            })
                        })
                    })
                })
                let saveData = {
                    project_docs: projectDocs,
                    project_docs_nodes: projectDocsNodes,
                    project_docs_roles: projectDocsRole
                };
                return JSON.stringify(saveData)
            },
            validateSaveData() {
                if (this.projectDocsAssign.docs.length === 0) {
                    this.$toasted.error('请上传素材')
                    return false
                }
                return this.projectDocsAssign.docs.every((doc) => {
                    if (doc.type === '') {
                        this.$toasted.error(`请填写素材${doc.name}的类型`);
                        return false
                    }

                    if (!doc.usage) {
                        this.$toasted.error(`请选择素材${doc.name}的用途`);
                        return false
                    }

                    if ((doc.usage === 7 || doc.usage === 3) && doc.name.substring(doc.name.lastIndexOf('.') + 1).toLowerCase() !== 'docx') {
                        this.$toasted.error(`素材【${doc.name}】格式不是docx，不得选择模板或项目提示用途，请重新选择`)
                        return false
                    }
                    return true
                })
            },
            savePage() {
                if (this.validateSaveData()) {
                    ProjectService.saveProjectDocsAllocate({
                        project_id: this.project_id,
                        data: this.getSaveData()
                    }).then(() => {
                        this.$toasted.success('保存成功')
                    })
                }
            },
            setInitial(doc) {
                this.nodes2roles.forEach(node => {
                    node.roles.forEach(role => {
                        let index = role.doc_ids.indexOf(doc.id)
                        if (!doc.is_initial) {
                            if (index === -1) role.doc_ids.push(doc.id)
                        } else {
                            if (index !== -1) role.doc_ids.splice(index, 1)
                        }
                    })
                })
            },
            deleteDocClick(item) {
                this.deleteModalShow = true;
                this.currentDoc = item
            },
            previewFile(fileUrl) {
                openFile(fileUrl, this.userInfo.id)
            },
            confirmDelete() {
                this.deleteModalShow = false;
                ProjectService
                    .deleteProjectDoc({doc_id: this.currentDoc.id})
                    .then(() => {
                        this.nodes2roles.forEach(item => {
                            item.roles.forEach(role => {
                                let index = role.doc_ids.indexOf(this.currentDoc.id)
                                if (index !== -1) {
                                    role.doc_ids.splice(index, 1)
                                }
                            })
                        })
                        this.projectDocsAssign.docs.splice(this.projectDocsAssign.docs.indexOf(this.currentDoc), 1)
                        this.getCurNode2Roles()
                    })
            },
            uploadDoc() {
                return true;
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .wizard-3 {
        .projects-index {
            .field-sn {
                width: 5%;
            }

            .field-name {
                width: 25%;
            }

            .field-creator {
                width: 30%;
            }

            .field-create_time {
                width: 9%;
            }

            .field-rend_ani_1 {
                width: 15%;
            }

            .field-rend_ani_2 {
                width: 35%;
            }

            .field-experiment_type_label {
                width: 10%;
            }

            .field-experiment_task_label {
                width: 10%;
            }

            .field-10 {
                width: 10%
            }

            .field-20 {
                width: 20%
            }

            .field-30 {
                width: 30%
            }

            .field-40 {
                width: 40%
            }

            .field-50 {
                width: 50%
            }

            .field-60 {
                width: 60%
            }

            .field-70 {
                width: 70%
            }

            .field-80 {
                width: 80%
            }

            .field-90 {
                width: 90%
            }

            .field-100 {
                width: 100%
            }

            .field_class {
                width: 15%
            }

            .field-status {
                width: 5%;
            }

            .field-action {
                width: 20%;
            }

            .table th,
            .table td {
                vertical-align: middle;
            }

            .modal-body {
                .message {
                    font-size: 16px;
                }

                .tip {
                    font-size: 14px;
                    color: #999;
                }
            }
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