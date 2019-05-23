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
                    <a href="javascript:;" class="btn-spe btn-upload" @click.stop="docUpload">上传素材</a>
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
                        <template slot="class" slot-scope="row">
                            <b-form-input size="sm" type="text" v-model.trim="row.item.type"/>
                        </template>
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
                                @change="setInitial(row.item, $event)"
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
                        <template slot="character_class" slot-scope="row">{{ row.item.type}}</template>
                        <template slot="character_name" slot-scope="row">{{ row.item.role_name}}</template>
                        <template slot="is_use" slot-scope="row">
                            <b-form-checkbox
                                v-model="row.item.is_use"
                                @change="isCheckUse(row.item)"
                            ></b-form-checkbox>
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
        <!-- upload-modal -->
        <upload-modal @on-uploadConfirm="docUploadConfirm"></upload-modal>
    </div>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import { openFile } from "@/utils/previewFile";
import ProjectService from "@/services/projectService";
import _ from "lodash";
import uploadModal from "@/components/common/uploadModal";

export default {
    name: "wizard-3",
    components: {
        Loading,
        uploadModal
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
                    class: "text-center w-10"
                },
                class: {
                    label: "素材类型",
                    sortable: false,
                    class: "text-center w-15"
                },
                name: {
                    label: "素材名称",
                    sortable: false,
                    class: "text-center w-35"
                },
                type: {
                    label: "用途",
                    sortable: false,
                    class: "text-center w-15"
                },
                control: {
                    label: "操作",
                    sortable: false,
                    class: "text-center w-25"
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
                    class: "text-center w-30"
                },
                character_name: {
                    label: "角色名称",
                    sortable: false,
                    class: "text-center w-50"
                },
                is_use: {
                    label: "是否使用本素材",
                    sortable: false,
                    class: "text-center w-20"
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
            docsUploadUrl: "/api/project/docs/create", // 素材上传接口地址
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
            return this.activeNode.project_role_allocs.map(
                project_role_alloc => {
                    return {
                        role_alloc_id: project_role_alloc.id,
                        role_id: project_role_alloc.role_id,
                        type: project_role_alloc.type,
                        role_name: project_role_alloc.name,
                        no: project_role_alloc.no,
                        is_use:
                            project_role_alloc.doc_ids.indexOf(
                                this.activeDocId
                            ) !== -1
                    };
                }
            );
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
        isCheckUse(projectRoleAlloc) {
            if (!this.activeDocId || !this.activeNodeId) {
                this.$toasted.error("当前没有素材或者没有选择素材");
                projectRoleAlloc.is_use = false;
                return;
            }
            this.activeNode.project_role_allocs.forEach(item => {
                if (item.id === projectRoleAlloc.role_alloc_id) {
                    let index = item.doc_ids.indexOf(this.activeDocId);
                    if (!projectRoleAlloc.is_use) {
                        if (index === -1) item.doc_ids.push(this.activeDocId);
                    } else {
                        if (index !== -1) item.doc_ids.splice(index, 1);
                    }
                }
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
                    this.projectDocsAssign.nodes.forEach(item => {
                        item.project_role_allocs.forEach(project_role_alloc => {
                            let index = project_role_alloc.doc_ids.indexOf(
                                this.currentDoc.id
                            );
                            if (index !== -1) {
                                project_role_alloc.doc_ids.splice(index, 1);
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
        setInitial(doc, val) {
            this.projectDocsAssign.nodes.forEach(node => {
                node.project_role_allocs.forEach(project_role_alloc => {
                    let index = project_role_alloc.doc_ids.indexOf(doc.id);
                    if (val) {
                        if (index === -1)
                            project_role_alloc.doc_ids.push(doc.id);
                    } else {
                        if (index !== -1)
                            project_role_alloc.doc_ids.splice(index, 1);
                    }
                });
            });
        },
        docUpload() {
            this.$emit("openUploadModal", {
                uploadUrl: this.docsUploadUrl,
                uploadParams: {
                    project_id: this.project_id
                }
            });
        },
        docUploadConfirm(data) {
            data = data.map(doc => {
                return {
                    id: doc.id,
                    name: doc.name,
                    file: doc.file,
                    type: "",
                    usage: null,
                    is_initial: false
                };
            });
            this.projectDocsAssign.docs.push(...data);
        },
        goLast() {
            this.updatePage(1);
        },
        goNext() {
            this.updatePage(3);
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
        getSaveData() {
            let projectDocs = this.projectDocsAssign.docs.map(doc => {
                return {
                    id: doc.id,
                    usage: doc.usage,
                    type: doc.type,
                    is_initial: doc.is_initial
                };
            });

            let projectDocsRole = [];
            this.projectDocsAssign.nodes.forEach(node => {
                node.project_role_allocs.forEach(project_role_alloc => {
                    project_role_alloc.doc_ids.forEach(doc => {
                        projectDocsRole.push({
                            doc_id: doc,
                            node_id: node.id,
                            role_id: project_role_alloc.role_id,
                            no: project_role_alloc.no,
                            alloc_id: project_role_alloc.id
                        });
                    });
                });
            });
            let saveData = {
                project_docs: projectDocs,
                project_docs_roles: projectDocsRole
            };
            return JSON.stringify(saveData);
        },
        updatePage: function(value) {
            this.$emit("input", value);
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
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.wizard-3 {
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

    .upload-resource {
        font-size: 13px;
        .upload-resourse-tip {
            color: #253568;
        }
    }
}
</style>