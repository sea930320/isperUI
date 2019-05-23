<template>
    <div class="mt-5 wizard-3">
        <loading v-if="isRunning"></loading>
        <b-alert variant="success" show class="text-left px-0" style="margin: 0 15px">
            <b-row>
                <b-col sm="4">
                    项目名称 :
                    {{projectData.name}}
                </b-col>
                <b-col sm="4">
                    相关流程 :
                    {{projectData.flow_name}}
                </b-col>
                <b-col sm="4">
                    类型 :
                    {{projectData.type | expType}}
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="4">
                    等级 :
                    {{projectData.type | level}}
                </b-col>
                <b-col sm="4">
                    能力目标 :
                    {{projectData.ability_target | abilityTarget}}
                </b-col>
                <b-col sm="4">
                    <a href="javascript:;" class="btn-spe btn-upload" v-b-modal.uploadDoc>上传素材</a>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12" class="upload-resource mt-2">
                    <span class="upload-resourse-tip">
                        上传提示：
                        <b>项目提示</b> 和
                        <b>模板</b> 类型只能上传docx格式, 其他的用途类型格式不限
                    </span>
                </b-col>
            </b-row>
        </b-alert>
        <b-row align-v="start">
            <b-col sm="6">
                <div class="cardDiv" style="height: 550px; overflow:auto">
                    <b-table
                        :items="projectDocsAssign.docs"
                        small
                        hover
                        :fields="docColumns"
                        head-variant
                        class="table-container"
                        @row-clicked="docOnSelect"
                    >
                        <template slot="id" slot-scope="row">{{ row.index + 1}}</template>
                        <template slot="class" slot-scope="row">{{ row.item.type}}</template>
                        <template slot="name" slot-scope="row">{{ row.item.name}}</template>
                        <template slot="type" slot-scope="row">
                            <b-form-select
                                v-model="row.item.usage"
                                :options="usageOptions"
                                @change="changeUseHandle(row.item)"
                            ></b-form-select>
                        </template>
                        <template slot="control" slot-scope="row">
                            <a
                                href="javascript:;"
                                class="btn-link mx-1"
                                title="预览"
                                @click="previewFile(row.item.file)"
                            >
                                <icon name="eye"></icon>
                            </a>
                            <a
                                :href="row.item.file"
                                class="btn-link mx-1"
                                title="下载"
                                target="_blank"
                            >
                                <icon name="download"></icon>
                            </a>
                            <a
                                href="javascript:"
                                class="btn-link mx-1"
                                title="删除"
                                @click="deleteDocClick(row.item)"
                            >
                                <icon name="trash"></icon>
                            </a>
                            <b-form-checkbox
                                v-model="row.item.is_initial"
                                @on-change="setInitial(row.item)"
                            >设为初始素材</b-form-checkbox>
                        </template>
                    </b-table>
                </div>
            </b-col>
            <b-col sm="2">
                <div class="cardDiv" style="height: 550px; overflow:auto">
                    <b-table
                        :items="projectDocsAssign.nodes"
                        small
                        hover
                        :fields="nodeColumns"
                        head-variant
                        class="table-container"
                        @row-clicked="nodeOnSelect"
                    >
                        <template slot="number" slot-scope="row">{{ row.index + 1}}</template>
                        <template slot="name" slot-scope="row">{{ row.item.name}}</template>
                    </b-table>
                </div>
            </b-col>
            <b-col sm="4">
                <div class="cardDiv" style="height: 550px; overflow:auto">
                    <b-table
                        :items="docNodeRelated"
                        small
                        hover
                        :fields="docNodeRelatedColumns"
                        head-variant
                        class="table-container"
                    >
                        <!-- <template slot="HEAD_is_use" slot-scope="head">
                            <b-form-checkbox
                                v-model="dnrAllCheck"
                                :indeterminate="dnrIndeterminatedCheck"
                                @change="toggleAllDnr"
                            >{{head.label}}</b-form-checkbox>
                        </template>-->
                        <template slot="character_class" slot-scope="row">{{ row.item.type}}</template>
                        <template slot="character_name" slot-scope="row">{{ row.item.role_name}}</template>
                        <template slot="is_use" slot-scope="row">
                            <b-form-checkbox v-model="row.item.is_use" @change="isCheckUse()"></b-form-checkbox>
                        </template>
                    </b-table>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="4" align-v="center">
                <b-button-group class="float-center">
                    <b-button
                        size="lg"
                        type="submit"
                        style="width:100%"
                        variant="primary"
                        @click="goLast()"
                    >上一步</b-button>
                </b-button-group>
            </b-col>
            <b-col sm="4" align-v="center">
                <b-button-group class="float-center">
                    <b-button size="lg" style="width:100%" variant="primary" @click="savePage()">保存</b-button>
                </b-button-group>
            </b-col>
            <b-col sm="4" align-v="center">
                <b-button-group class="float-center">
                    <b-button
                        size="lg"
                        type="submit"
                        style="width:100%"
                        variant="primary"
                        v-b-modal.finishEdit
                        @click="goNext()"
                    >下一步</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <b-modal
            v-model="deleteModalShow"
            title="Delete Doc"
            ok-title="确定"
            cancel-title="取消"
            @ok="confirmDelete()"
            @cancel="deleteModalShow=false"
        >
            <p class="my-4">Do you want to delete Doc?</p>
        </b-modal>
        <!-- <b-modal id="uploadDoc" title="Upload Doc" @ok="uploadDoc()">
            <template>
                <div>
                </div>
            </template>
        </b-modal>-->
    </div>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import { openFile } from "@/utils/previewFile";
import ProjectService from "@/services/projectService";
import _ from "lodash";

export default {
    name: "wizard-3",
    components: {
        Loading
    },
    props: ["value"],
    filters: {
        expType,
        level,
        abilityTarget
    },
    data() {
        return {
            docColumns: {
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
                }
            },
            nodeColumns: {
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
            docNodeRelatedColumns: {
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
                }
            },
            usageOptions: [
                { value: 1, text: "操作指南" },
                { value: 2, text: "关联文件" },
                { value: 3, text: "模板" },
                { value: 4, text: "材料" },
                { value: 5, text: "公文" },
                { value: 6, text: "成果参考" },
                { value: 7, text: "项目提示" }
            ],
            projectData: {},
            project_id: null,
            is_edit: null,
            projectDocsAssign: {
                docs: [],
                nodes: [],
                role_type: []
            },
            activeDocIndex: 0,
            activeNodeIndex: 0,
            currentDoc: null,
            successTipModal: false,
            deleteModalShow: false,
            uploadModalShow: false, // 显示隐藏素材上传模态框
            docsUploadUrl: "/api/project/docs/create", // 素材上传接口地址
            nodes2roles: {},
            queryParam: {
                status: "",
                page: 1,
                size: 15
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
    computed: {
        ...mapState(["userInfo"]),
        // 当前选中素材ID
        activeNodeId() {
            if (this.projectDocsAssign.nodes.length === 0) return null;
            return this.projectDocsAssign.nodes[this.activeNodeIndex].id;
        },
        activeNode() {
            if (this.projectDocsAssign.nodes.length === 0) return null;
            return this.projectDocsAssign.nodes[this.activeNodeIndex];
        },
        activeDocId() {
            if (this.projectDocsAssign.docs.length === 0) return null;
            return this.projectDocsAssign.docs[this.activeDocIndex].id;
        },
        activeDoc() {
            if (this.projectDocsAssign.docs.length === 0) return null;
            return this.projectDocsAssign.docs[this.activeDocIndex];
        },
        docNodeRelated() {
            if (!this.activeNodeId || !this.activeDocId) return null;
            let docNodeRelated = this.activeNode.project_role_allocs.map(
                project_role_alloc => {
                    return {
                        role_alloc_id: project_role_alloc.id,
                        role_id: project_role_alloc.role_id,
                        type: project_role_alloc.type,
                        role_name: project_role_alloc.name,
                        is_use:
                            project_role_alloc.doc_ids.indexOf(
                                this.activeDocId
                            ) !== -1
                    };
                }
            );
            return docNodeRelated;
        }
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
            handler: _.debounce(function() {
                this.queryProjectList();
            }, 500)
        }
    },
    created() {
        this.$nextTick(() => {
            if (this.$route.params.is_edit) {
                this.is_edit = this.$route.params.is_edit;
                // this.project_id = this.$route.params.project_id;
                this.project_id = 2034;
            } else {
                this.is_edit = this.$route.params.is_edit;
                this.project_id = 2034;
            }
            this.queryProjectDocsDetail();
        });
    },
    methods: {
        queryProjectDocsDetail() {
            this.run();
            ProjectService.getProjectDocsDetail({ project_id: this.project_id })
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
            this.nodes2roles = data.project_nodes;
            if (this.projectDocsAssign.nodes.length > 0) {
                this.nodeOnSelect(this.projectDocsAssign.nodes[0], 0);
            }
            if (this.projectDocsAssign.docs.length > 0) {
                this.docOnSelect(this.projectDocsAssign.docs[0], 0);
            }
        },
        nodeOnSelect(item, index) {
            this.activeNodeIndex = index;
            this.projectDocsAssign.nodes.map(node => {
                node._rowVariant = "";
                return node;
            });
            this.activeNode._rowVariant = "primary";
        },
        docOnSelect(item, index) {
            this.activeDocIndex = index;
            this.projectDocsAssign.docs.map(doc => {
                doc._rowVariant = "";
                return doc;
            });
            this.activeDoc._rowVariant = "primary";
        },
        isCheckUse(role) {
            if (!this.activeDocId) {
                this.$toasted.warn("当前没有素材或者没有选择素材");
                role.is_use = false;
                return;
            }
            // console.log(role)
            this.nodes2roles.forEach(node => {
                if (this.activeNodeId && node.id === this.activeNodeId) {
                    node.roles.forEach(item => {
                        if (item.id === role.role_id) {
                            let index = item.doc_ids.indexOf(this.activeDocId);
                            if (!role.is_use) {
                                if (index === -1)
                                    item.doc_ids.push(this.activeDocId);
                            } else {
                                if (index !== -1) item.doc_ids.splice(index, 1);
                            }
                        }
                    });
                }
            });
        },
        changeUseHandle(doc) {
            if (doc.usage === 7 || doc.usage === 3) {
                if (
                    doc.name
                        .substring(doc.name.lastIndexOf(".") + 1)
                        .toLowerCase() !== "docx"
                ) {
                    this.$toasted.error(
                        "模板或项目提示用途必须是docx格式的文件"
                    );
                    doc.usage = null;
                    return false;
                }
            }
        },
        previewFile(fileUrl) {
            openFile(fileUrl, this.userInfo.id);
        },
        goLast() {
            this.updatePage(1);
        },
        goNext() {
            this.updatePage(3);
        },
        getSaveData() {
            let projectDocs = this.projectDocsAssign.docs.map(doc => {
                return {
                    id: doc.id,
                    usage: doc.usage,
                    type: doc.type,
                    is_initial: doc.is_initial
                };
            });

            let projectDocsNodes = [];
            let projectDocsRole = [];
            this.nodes2roles.forEach(node => {
                node.roles.forEach(role => {
                    role.doc_ids.forEach(doc => {
                        projectDocsRole.push({
                            doc_id: doc,
                            node_id: node.id,
                            role_id: role.id
                        });
                    });
                });
            });
            let saveData = {
                project_docs: projectDocs,
                project_docs_nodes: projectDocsNodes,
                project_docs_roles: projectDocsRole
            };
            return JSON.stringify(saveData);
        },
        validateSaveData() {
            if (this.projectDocsAssign.docs.length === 0) {
                this.$toasted.error("请上传素材");
                return false;
            }
            return this.projectDocsAssign.docs.every(doc => {
                if (doc.type === "") {
                    this.$toasted.error(`请填写素材${doc.name}的类型`);
                    return false;
                }

                if (!doc.usage) {
                    this.$toasted.error(`请选择素材${doc.name}的用途`);
                    return false;
                }

                if (
                    (doc.usage === 7 || doc.usage === 3) &&
                    doc.name
                        .substring(doc.name.lastIndexOf(".") + 1)
                        .toLowerCase() !== "docx"
                ) {
                    this.$toasted.error(
                        `素材【${
                            doc.name
                        }】格式不是docx，不得选择模板或项目提示用途，请重新选择`
                    );
                    return false;
                }
                return true;
            });
        },
        savePage() {
            if (this.validateSaveData()) {
                ProjectService.saveProjectDocsAllocate({
                    project_id: this.project_id,
                    data: this.getSaveData()
                }).then(() => {
                    this.$toasted.success("保存成功");
                });
            }
        },
        setInitial(doc) {
            this.nodes2roles.forEach(node => {
                node.roles.forEach(role => {
                    let index = role.doc_ids.indexOf(doc.id);
                    if (!doc.is_initial) {
                        if (index === -1) role.doc_ids.push(doc.id);
                    } else {
                        if (index !== -1) role.doc_ids.splice(index, 1);
                    }
                });
            });
        },
        deleteDocClick(item) {
            this.deleteModalShow = true;
            this.currentDoc = item;
        },
        confirmDelete() {
            this.deleteModalShow = false;
            this.run();
            ProjectService.deleteProjectDoc({
                doc_id: this.currentDoc.id
            })
                .then(() => {
                    this.nodes2roles.forEach(item => {
                        item.roles.forEach(role => {
                            let index = role.doc_ids.indexOf(
                                this.currentDoc.id
                            );
                            if (index !== -1) {
                                role.doc_ids.splice(index, 1);
                            }
                        });
                    });
                    this.projectDocsAssign.docs.splice(
                        this.projectDocsAssign.docs.indexOf(this.currentDoc),
                        1
                    );
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        updatePage: function(value) {
            this.$emit("input", value);
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
            width: 10%;
        }

        .field-20 {
            width: 20%;
        }

        .field-30 {
            width: 30%;
        }

        .field-40 {
            width: 40%;
        }

        .field-50 {
            width: 50%;
        }

        .field-60 {
            width: 60%;
        }

        .field-70 {
            width: 70%;
        }

        .field-80 {
            width: 80%;
        }

        .field-90 {
            width: 90%;
        }

        .field-100 {
            width: 100%;
        }

        .field_class {
            width: 15%;
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

    .table-container table thead,
    .table-container table tbody tr {
        display: table;
        table-layout: fixed;
    }

    .table-container table {
        border-collapse: collapse;
    }

    .table-container table td,
    .table-container table th {
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
    .table-container th.table-action,
    .table-container td.table-action {
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

    .upload-resource {
        font-size: 13px;
        .upload-resourse-tip {
            color: #253568;
        }
    }
}
</style>