<template>
    <div class="prepare1 container" v-if="userInfo">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col cols="3">
                <div class="cardDiv p-0" style="background:#c7dbff">
                    <div class="d-flex flex-row flex-wrap">
                        <div class="flex-fill">
                            <b-button
                                :variant="queryParam.by_method==='company' ? 'primary':'secondary'"
                                class="no-round"
                                v-bind:class="{active:queryParam.by_method==='company', inactive:queryParam.by_method!=='company'}"
                                block
                                size="sm"
                                to="/business/prepare/prepare1/company"
                            >单位</b-button>
                        </div>
                        <div class="flex-fill">
                            <b-button
                                :variant="queryParam.by_method!=='company' ? 'primary':'secondary'"
                                v-bind:class="{active:queryParam.by_method!=='company', inactive:queryParam.by_method==='company'}"
                                class="no-round"
                                block
                                size="sm"
                                to="/business/prepare/prepare1/office"
                            >事务</b-button>
                        </div>
                    </div>
                    <b-list-group
                        class="d-inline-flex m-0 p-0 w-100 mt-1"
                        v-if="queryParam.by_method === 'company'"
                    >
                        <template v-for="(group, index) in groups">
                            <b-list-group-item
                                class="d-flex justify-content-between align-items-center no-round"
                                :key="'groupIndex' + index"
                                :id="'groupIndex' + index"
                                v-b-toggle="'collapse-'+group.id"
                                @click="groupClicked(group, 'groupIndex' + index)"
                                :active="activeItemId==='groupIndex' + index"
                            >
                                {{group.name}}
                                <icon
                                    name="angle-right"
                                    class="ml-auto cycle"
                                    v-if="group.companies.length > 1"
                                ></icon>
                            </b-list-group-item>
                            <b-collapse :id="'collapse-'+group.id" :key="'collapse-'+group.id">
                                <b-list-group
                                    class="d-inline-flex w-100"
                                    v-if="group.companies.length > 1"
                                >
                                    <template v-for="(company, index1) in group.companies">
                                        <b-list-group-item
                                            class="d-flex justify-content-between align-items-center subListItem no-round"
                                            :key="'companyIndex' + index + index1"
                                            v-if="company.name !=='DEFAULT-COMPANY'"
                                            :active="activeItemId==='companyIndex' + index + index1"
                                            @click="companyClicked(group, company, 'companyIndex' + index + index1)"
                                        >{{company.name}}</b-list-group-item>
                                    </template>
                                </b-list-group>
                            </b-collapse>
                        </template>
                    </b-list-group>
                    <b-list-group class="d-inline-flex m-0 p-0 w-100 mt-1" v-else>
                        <template v-for="(officeKind, index) in officeKinds">
                            <b-list-group-item
                                class="d-flex justify-content-between align-items-center no-round"
                                :key="'officeKindIndex' + index"
                                @click="officeKindClicked(officeKind, index)"
                                :active="activeItemId==='officeKindIndex' + index"
                            >{{officeKind.name}}</b-list-group-item>
                        </template>
                    </b-list-group>
                </div>
            </b-col>
            <b-col cols="9">
                <div class="cardDiv p-0" v-if="queryParam.by_method==='company'">
                    <b-row class="mb-3">
                        <b-col class="text-center py-3 bordered">
                            <h3>{{queryParam.company_id?'单位简介':queryParam.group_id?'集群简介':''}}</h3>
                            <div
                                class="text-left"
                            >{{queryParam.company_id?selectedCompany && selectedCompany.comment:queryParam.group_id?selectedGroup && selectedGroup.comment:''}}</div>
                        </b-col>
                        <b-col class="text-center py-3 bordered" style="border-left: 0">
                            <h4>公示栏</h4>
                            <div class="text-left">
                                <b-list-group>
                                    <b-list-group-item
                                        class="d-flex justify-content-between align-items-center no-round no-border-x"
                                    >Cras justo odio</b-list-group-item>

                                    <b-list-group-item
                                        class="d-flex justify-content-between align-items-center no-round no-border-x"
                                    >Dapibus ac facilisis in</b-list-group-item>

                                    <b-list-group-item
                                        class="d-flex justify-content-between align-items-center no-round no-border-x"
                                    >Morbi leo risus</b-list-group-item>
                                </b-list-group>
                            </div>
                        </b-col>
                    </b-row>
                </div>

                <div class="cardDiv p-0 pt-3" v-else>
                    <b-nav tabs v-if="selOfficeKind && selOfficeKind.subItems.length > 0">
                        <b-nav-item
                            v-for="(office, index) in selOfficeKind.subItems"
                            :key="index"
                            class="no-round transparent-bg mx-2"
                            :active="queryParam.office_id===office.sid"
                            @click="queryParam.office_id=office.sid"
                        >{{office.sname}}</b-nav-item>
                    </b-nav>
                    <b-row class="mt-3">
                        <b-col lg="3" md="6" sm="12">
                            <b-input-group :size="template_size">
                                <b-input-group-prepend>
                                    <span class="input-group-text">
                                        <icon name="search"></icon>
                                    </span>
                                </b-input-group-prepend>
                                <b-form-input
                                    v-model.lazy="queryDebounceParam.search"
                                    placeholder="请输入内容"
                                />
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <div class="project-list-by-office py-3">
                        <b-row class>
                            <b-col
                                cols="3"
                                v-for="(project, index) in projects.list"
                                :key="index"
                                class="my-2"
                            >
                                <b-card
                                    :title="project.name"
                                    v-bind:class="{active:startedProject && startedProject.id===project.id}"
                                    @click="startBusiness(project)"
                                >
                                    <b-card-text>{{project.intro}}</b-card-text>
                                </b-card>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <b-row class="cardDiv" v-if="queryParam.by_method==='company'">
                    <b-col lg="3" md="6" sm="12">
                        <b-input-group :size="template_size">
                            <b-input-group-prepend>
                                <span class="input-group-text">
                                    <icon name="search"></icon>
                                </span>
                            </b-input-group-prepend>
                            <b-form-input
                                v-model.lazy="queryDebounceParam.search"
                                placeholder="请输入内容"
                            />
                        </b-input-group>
                    </b-col>
                </b-row>
                <div class="cardDiv" v-if="queryParam.by_method==='company'">
                    <b-table
                        :items="projects.list"
                        responsive
                        small
                        hover
                        :fields="columns"
                        head-variant
                    >
                        <template slot="sn" slot-scope="row">{{ row.item.id }}</template>
                        <template slot="company_name" slot-scope="row">{{row.item.company_name}}</template>
                        <template slot="name" slot-scope="row">{{row.item.name}}</template>
                        <template
                            slot="office_type"
                            slot-scope="row"
                        >{{row.item.officeItem_name}}</template>
                        <template
                            slot="part"
                            slot-scope="row"
                        >{{row.item.use_to && row.item.use_to.text}}</template>
                        <template slot="action" slot-scope="row">
                            <a
                                class="btn-link mx-1"
                                href="javascript:"
                                @click="startBusiness(row.item)"
                            >
                                <icon name="play"></icon>
                            </a>
                        </template>
                    </b-table>
                </div>
                <div class="cardDiv" v-if="projects.total>0">
                    <b-row class="justify-content-center row-margin-tweak">
                        <b-pagination
                            :size="template_size"
                            :total-rows="projects.total"
                            :per-page="queryParam.size"
                            limit="5"
                            v-model="queryParam.page"
                        />
                    </b-row>
                </div>
            </b-col>
        </b-row>
        <business-start-modal ></business-start-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import BusinessStartModal from "@/components/business/modal/BusinessStart";
import ProjectService from "@/services/projectService";
import groupService from "@/services/groupService";
import DictionaryService from "@/services/dictionaryService";
import JQuery from "jquery";
import _ from "lodash";

export default {
    name: "prepare1",
    components: { Loading, BusinessStartModal },
    filters: {},
    data() {
        return {
            groups: [],
            officeKinds: [],
            selOfficeKind: null,
            activeItemId: null,
            // 查询参数
            queryParam: {
                page: 1,
                size: 8,
                group_id: null,
                company_id: null,
                by_method: this.$route.params.by,
                office_id: null
            },
            queryDebounceParam: {
                search: ""
            },
            columns: {
                sn: {
                    label: "序号",
                    sortable: false,
                    class: "text-center w-5"
                },
                company_name: {
                    label: "项目创建单位",
                    sortable: false,
                    class: "text-center w-25"
                },
                name: {
                    label: "项目名称",
                    sortable: false,
                    class: "text-center w-25"
                },
                office_type: {
                    label: "事务类型",
                    sortable: false,
                    class: "text-center w-25"
                },
                part: {
                    label: "部门",
                    sortable: false,
                    class: "text-center w-15"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-center w-5"
                }
            },
            projects: {
                list: [],
                total: 0
            },
            startedProject: null
        };
    },
    beforeRouteUpdate(to, from, next) {
        this.queryParam.by_method = to.params.by;
        if (this.queryParam.by_method === "company") {
            this.getGroupList();
        } else {
            this.getOfficeList();
        }
        next();
    },
    created() {
        this.$nextTick(() => {
            this.queryParam.by_method = this.$route.params.by;
            if (this.queryParam.by_method === "company") {
                this.getGroupList();
            } else {
                this.getOfficeList();
            }
            this.$on("BusinessStartCancelled", () => {
                this.startedProject = null;
            });
        });
    },
    computed: {
        ...mapState(["userInfo"]),
        selectedGroup() {
            if (!this.queryParam.group_id) return null;
            return _.find(this.groups, { id: this.queryParam.group_id });
        },
        selectedCompany() {
            if (!this.queryParam.company_id) return null;
            return _.find(this.selectedGroup.companies, {
                id: this.queryParam.company_id
            });
        }
    },
    watch: {
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
        selOfficeKind: {
            deep: true,
            handler(val) {
                if (val && val.subItems.length > 0) {
                    this.queryParam.office_id = val.subItems[0].sid;
                } else {
                    this.queryParam.office_id = null;
                }
            }
        }
    },
    methods: {
        initData() {
            this.projects = {
                list: [],
                total: 0
            };
            this.groups = [];
            this.officeKinds = [];
        },
        getGroupList() {
            this.run();
            this.initData();
            groupService
                .fetchAllGroupDetail()
                .then(data => {
                    this.groups = data.results;
                    if (this.groups.length > 0) {
                        this.queryParam.group_id = this.userInfo.manager_info.group_id;
                        let groupIndex = this.groups.findIndex(group => {
                            return group.id === this.queryParam.group_id;
                        }, this);
                        if (this.userInfo.manager_info.company_id) {
                            this.queryParam.company_id = this.userInfo.manager_info.company_id;
                            let companyIndex = this.groups[
                                groupIndex
                            ].companies.findIndex(company => {
                                return company.id === this.queryParam.company_id;
                            }, this);
                            let groupId = this.queryParam.group_id;
                            setTimeout(() => {
                                this.$root.$emit(
                                    "bv::toggle::collapse",
                                    "collapse-" + groupId
                                );
                                this.groupClicked(
                                    null,
                                    "groupIndex" + groupIndex
                                );
                            }, 500);
                            this.activeItemId =
                                "companyIndex" + groupIndex + companyIndex;
                        } else {
                            this.queryParam.company_id = null;
                            this.activeItemId = "groupIndex" + groupIndex;
                        }
                    }
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-field");
                });
        },
        getOfficeList() {
            this.run();
            this.initData();
            DictionaryService.getDicData({})
                .then(data => {
                    this.officeKinds = data.results.office;
                    if (this.officeKinds.length > 0) {
                        this.officeKindClicked(this.officeKinds[0], 0);
                    }
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        queryProjectList() {
            if ( this.queryParam.by_method === "office" && this.queryParam.office_id === null ) {
                this.projects = {
                    list: [],
                    total: 0
                };
                return;
            }

            this.run();
            ProjectService.getProjectList({
                ...this.queryParam,
                ...this.queryDebounceParam
            })
                .then(data => {
                    this.projects.list = data.results;
                    this.projects.total = data.paging.count;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        groupClicked(group, target) {
            if (
                JQuery("#" + target + " svg:first").css("transform") === "none"
            ) {
                JQuery("#" + target + " svg:first").css(
                    "transform",
                    "rotate(90deg)"
                );
            } else {
                JQuery("#" + target + " svg:first").css("transform", "");
            }
            if (!group) return;
            this.activeItemId = target;
            this.queryParam.group_id = group.id;
            this.queryParam.company_id = null;
        },
        companyClicked(group, company, key) {
            this.activeItemId = key;
            this.queryParam.group_id = group.id;
            this.queryParam.company_id = company.id;
        },
        officeKindClicked(officeKind, index) {
            this.activeItemId = "officeKindIndex" + index;
            this.selOfficeKind = officeKind;
        },
        startBusiness(project) {
            this.$emit("openBusinessStartModal", project);
            this.startedProject = project;
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.prepare1 {
    .no-round {
        border-radius: 0px;
    }
    .align-items-center.d-flex.justify-content-between.list-group-item {
        padding: 7px 8px 7px 15px;
        font-family: "SimHei";
        font-size: 15px;
    }
    .subListItem {
        padding: 3px 8px 3px 30px !important;
        font-size: 14px !important;
        color: darkgrey !important;
    }
    .cycle {
        -webkit-transition-duration: 0.3s;
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-property: -webkit-transform;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        transition-property: transform;
    }
    .btn.active {
        background-color: #6081e6 !important;
        border-color: #6081e6 !important;
    }
    .btn.inactive {
        color: #616161;
        background-color: #cacaca;
        border-color: #cacaca;
    }
    .list-group-item.active {
        background-color: #6081e6 !important;
        border-color: #6081e6 !important;
        color: white !important;
    }
    .bordered {
        border: 1px solid #dfdfdf;
    }
    .no-border-x {
        border-left: 0px;
        border-right: 0px;
    }
    .transparent-bg {
        background: transparent !important;
        .active {
            background: transparent !important;
        }
    }
    .project-list-by-office {
        min-height: 264px;
        .card-body {
            background: #cfe0ff;
            cursor: pointer;
            .card-title {
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .card-text {
                font-size: 17px;
                text-align: left;
            }
        }
    }
    .card.active {
        .card-body {
            background-color: #6081e6 !important;
            border-color: #6081e6 !important;
            color: white !important;
        }
    }
}
</style>