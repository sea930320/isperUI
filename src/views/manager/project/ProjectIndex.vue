<template>
    <div class="projects-index">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                            <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                </b-input-group>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center">
                <b-button-group class="float-right" v-if="[2,3,6,7].includes(userInfo.role)">
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        v-if="isActionAllowed('code_project_management', 'code_create_project')"
                        @click="createProjectPage()"
                    >新建项目</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        v-if="isActionAllowed('code_project_management', 'code_export_project')"
                        @click="handleDownload()"
                    >导出</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        v-b-modal.shareConfirmModal
                        v-if="isActionAllowed('code_project_management', 'code_share_unshare_project')"
                        @click="sharableFilter"
                    >共享</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        v-b-modal.unshareConfirmModal
                        v-if="isActionAllowed('code_project_management', 'code_share_unshare_project')"
                        @click="sharableFilter"
                    >取消共享</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="projects.list" responsive small hover :fields="columns" head-variant>
                <template slot="HEAD_sn" slot-scope="head">
                    <b-form-checkbox v-model="allChecked">{{head.label}}</b-form-checkbox>
                </template>
                <template slot="sn" slot-scope="row">
                    <b-form-checkbox v-model="row.item.checked">{{ row.index + 1 }}</b-form-checkbox>
                </template>
                <template
                    slot="currentShare"
                    slot-scope="row"
                    v-if="userInfo.role === 2 || userInfo.role === 3 "
                >
                    <span v-if="row.item.current_share==1" class="badge badge-success">
                        <icon scale="0.6" name="share"></icon>
                    </span>
                </template>
                <template
                    slot="is_protected"
                    slot-scope="row"
                    v-if="userInfo.role === 2 || userInfo.role === 3 "
                >
                    <span v-if="row.item.protected === 1" class="badge badge-success">
                        <icon scale="0.6" name="lock"></icon>
                    </span>
                    <span class="badge badge-success" v-else>
                        <icon scale="0.6" name="unlock"></icon>
                    </span>
                </template>
                <template slot="name" slot-scope="row">{{row.item.name}}</template>
                <template
                    slot="creator"
                    slot-scope="row"
                >{{row.item.created_by ? row.item.created_by.name : 'n/a'}}</template>
                <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
                <template slot="dependence" slot-scope="row">{{row.item.flow.name}}</template>
                <template
                    slot="is_open"
                    slot-scope="row"
                >{{
                    (row.item.is_open === 1) ? "自由":
                    (row.item.is_open === 2) ? "不公开":
                    (row.item.is_open === 3) ? "限时":
                    (row.item.is_open === 4) ? "指定用户":
                    (row.item.is_open === 5) ? "指定部门/单位": ''
                }}</template>
                <template slot="mission_type" slot-scope="row">{{row.item.course}}</template>
                <template slot="edit_control" slot-scope="row">
                    <a class="btn-link mx-1"
                        href="javascript:"
                        v-if="isActionAllowed('code_project_management', 'code_edit_project') && (row.item.edit_able === 1) && (userInfo.role === 2 || userInfo.role === 3)"
                        v-b-modal.editConfirmModal
                        @click="editProjectConfirm(row.item)" >
                        <icon name="edit"></icon>
                    </a>
                    <a class="btn-link mx-1"
                       href="javascript:"
                       v-if="userInfo.role === 1"
                       @click="showProject(row.item)" >
                        <icon name="eye"></icon>
                    </a>
                    <a class="btn-link mx-1"
                        href="javascript:"
                        v-if="isActionAllowed('code_project_management', 'code_delete_project') && row.item.delete_able === 1"
                        v-b-modal.deleteConfirmModal
                        @click="deleteProjectConfirm(row.item)" >
                        <icon name="trash"></icon>
                    </a>
                    <a class="btn-link mx-1"
                        href="javascript:"
                        v-if="userInfo.role === 1 && (row.item.protected === 1)"
                        @click="protectedProject(row.item)" >
                        <icon name="lock"></icon>
                    </a>
                    <a class="btn-link mx-1"
                        href="javascript:"
                        v-if="userInfo.role === 1 && (row.item.protected === 0)"
                        @click="protectedProject(row.item)" >
                        <icon name="lock-open"></icon>
                    </a>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-center row-margin-tweak cardDiv">
            <b-pagination
                :size="template_size"
                :total-rows="projects.total"
                :per-page="queryParam.size"
                limit="5"
                v-model="queryParam.page"
            />
        </b-row>
        <br>
        <br>
        <br>
        <!--//Confirm Delete Project-->
        <b-modal id="deleteConfirmModal" title="Delete Project" @ok="deleteProject()">
            <p class="my-4">Do you want to delete "{{this.currentProjectID.name}}" Project?</p>
        </b-modal>
        <!--&lt;!&ndash;Confirm Share Project&ndash;&gt;-->
        <b-modal id="shareConfirmModal" title="Project Sharing" @ok="shareProject()">
            <b-table
                :items="checkedUnsharedItems"
                responsive
                small
                hover
                :fields="sharable_columns"
                head-variant
            >
                您要确定共享项目吗？您只能共享以下项目:
                <template slot="name" slot-scope="row">{{row.item.name}}</template>
                <template slot="course" slot-scope="row">{{row.item.course}}</template>
            </b-table>
        </b-modal>
        <!--&lt;!&ndash;Confirm UnShare Project&ndash;&gt;-->
        <b-modal id="unshareConfirmModal" title="Cancel Project Sharing" @ok="unshareProject()">
            <p class="my-4">Do you want to not share Project(s)?</p>
            <b-table
                :items="checkedSharedItems"
                responsive
                small
                hover
                :fields="sharable_columns"
                head-variant
            >
                您确定要取消共享项目吗？只能取消以下过项目:
                <template slot="name" slot-scope="row">{{row.item.name}}</template>
                <template slot="course" slot-scope="row">{{row.item.course}}</template>
            </b-table>
        </b-modal>
        <b-modal id="editConfirmModal" title="Cancel Project Sharing" @ok="editProject()">
            <p class="my-4">Do you want to edit "{{this.currentProjectID.name}}" Project?</p>
        </b-modal>
    </div>
</template>

<script>
import { expType, level, abilityTarget } from "@/filters/fun";
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import ProjectService from "@/services/projectService";
import _ from "lodash";
export default {
    name: "project-index",
    components: {
        Loading
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
                    class: "text-center field-3"
                },
                currentShare: {
                    label: "",
                    sortable: false,
                    class: "text-center field-3"
                },
                is_protected: {
                    label: "",
                    sortable: false,
                    class: "text-center field-3"
                },
                name: {
                    label: "项目名称",
                    sortable: false,
                    class: "text-center field-20"
                },
                creator: {
                    label: "创建者",
                    sortable: false,
                    class: "text-center field-10"
                },
                create_time: {
                    label: "创建时间",
                    sortable: false,
                    class: "text-center field-create_time"
                },
                dependence: {
                    label: "相关流程",
                    sortable: false,
                    class: "text-center field-rend_ani_1"
                },
                is_open: {
                    label: "开放模式",
                    sortable: false,
                    class: "text-center field-experiment_type_label"
                },
                mission_type: {
                    label: "事务类型",
                    sortable: false,
                    class: "text-center field-experiment_task_label"
                },
                edit_control: {
                    label: "操作",
                    sortable: false,
                    class: "text-center field-action"
                }
            },
            sharable_columns: {
                name: {
                    label: "项目名称",
                    sortable: false,
                    class: "text-center field-sn"
                },
                course: {
                    label: "事务类型",
                    sortable: false,
                    class: "text-center field-sn"
                }
            },
            // 查询参数
            allChecked: false,
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
            //                shareButtonDisabled: true,
            //                unshareButtonDisabled: true,
            checkedSharedItemsID: [],
            checkedUnsharedItemsID: [],
            checkedSharedItems: [],
            checkedUnsharedItems: []
        };
    },
    created() {
        this.$nextTick(() => {
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
                this.queryProjectList();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
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
        // 查询流程列表数据
        queryProjectList() {
            this.allChecked = false;
            this.run();
            ProjectService.getProjectList({
                ...this.queryParam,
                ...this.queryDebounceParam
            })
                //                    .getProjectList()
                .then(data => {
                    data.results.forEach(item => {
                        if (item.checked === undefined) {
                            item.checked = false;
                        }
                        if (item.locked === undefined) {
                            item.locked = false;
                        }
                    });
                    this.projects.list = data.results;
                    this.projects.total = data.paging.count;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        //Delete Project Confirm
        deleteProjectConfirm(idValue) {
            this.currentProjectID = idValue;
        },
        editProjectConfirm(idValue) {
            this.currentProjectID = idValue;
        },
        showProject(idVal) {
            this.$router.push({
                name: "create-project-wizard",
                params: { project_id: idVal.id }
            });
        },
        // Delete Project
        deleteProject() {
            this.run();
            ProjectService.deleteProject({
                project_id: parseInt(this.currentProjectID.id)
            }).then(() => {
                this.queryProjectList();
            });
        },
        shareProject() {
            let ids = JSON.stringify(this.checkedUnsharedItemsID);
            this.run();
            ProjectService.shareProject({ data: ids }).then(() => {
                this.queryProjectList();
                //                        this.unshareButtonDisabled = true;
                //                        this.shareButtonDisabled = true;
            });
        },
        unshareProject() {
            let ids = JSON.stringify(this.checkedSharedItemsID);
            this.run();
            ProjectService.unshareProject({ data: ids }).then(() => {
                this.queryProjectList();
                //                        this.unshareButtonDisabled = true;
                //                        this.shareButtonDisabled = true;
            });
        },
        checkedItems() {
            return this.projects.list.filter(item => item.checked === true);
        },
        // 查看渲染动画的大图
        showBigImg(animation) {
            this.animationImgSrc = animation.url;
            this.bigImgModal = true;
        },
        protectedProject(idVal) {
            ProjectService.lockProject({ project_id: parseInt(idVal.id) }).then(
                () => {
                    this.$set(
                        idVal,
                        "protected",
                        idVal.protected === 1 ? 0 : 1
                    );
                    if (idVal.protected === 1) {
                        this.$toasted.success("保护项目成功");
                    }
                    if (idVal.protected === 0) {
                        this.$toasted.success("解除保护项目成功");
                    }
                }
            );
        },
        // Go To Create Project Page
        createProjectPage() {
            this.$router.push({
                name: "create-project-wizard",
                params: { currentProject: {}, is_edit: 0, project_id: null }
            });
        },
        editProject() {
            this.$router.push({
                name: "create-project-wizard",
                params: {
                    project_id: this.currentProjectID.id,
                    currentProject: this.currentProjectID,
                    is_edit: 1
                }
            });
        },
        sharableFilter() {
            this.checkedSharedItems = this.checkedItems().filter(
                item => item.current_share === 1
            );
            this.checkedUnsharedItems = this.checkedItems().filter(
                item => item.current_share === 0
            );
            this.checkedSharedItemsID = this.checkedSharedItems.map(
                item => item.id
            );
            this.checkedUnsharedItemsID = this.checkedUnsharedItems.map(
                item => item.id
            );
        },
        handleDownload() {
            this.run();
            import("@/components/UploadExcel/Export2Excel").then(excel => {
                const tHeader = [
                    "项目名称",
                    "创建者",
                    "创建时间",
                    "相关流程",
                    "开放模式",
                    "事务类型"
                ];
                const list = this.projects.list;
                const data = this.formatJson(list);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "项目列表",
                    autoWidth: true,
                    bookType: "xlsx"
                });
            });
            this.$emit("data-ready");
        },
        formatJson(jsonData) {
            return jsonData.map(v =>
                [
                    v['name'],
                    v['created_by']['name'],
                    v['create_time'],
                    v['flow']['name'],
                    v['is_open'] === 1 ? "自由":
                    v['is_open'] === 2 ? "不公开":
                    v['is_open'] === 3 ? "限时":
                    v['is_open'] === 4 ? "指定用户":
                    v['is_open'] === 5 ? "指定部门/单位": '',
                    v['course']
                ]
            );
        },
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.projects-index {
    .field-3 {
        width: 3%;
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
    .field-sn {
        width: 3%;
    }
    .field-name {
        width: 25%;
    }
    .field-creator {
        width: 9%;
    }
    .field-create_time {
        width: 9%;
    }
    .field-rend_ani_1 {
        width: 20%;
    }
    .field-rend_ani_2 {
        width: 10%;
    }
    .field-experiment_type_label {
        width: 10%;
    }
    .field-experiment_task_label {
        width: 10%;
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
</style>