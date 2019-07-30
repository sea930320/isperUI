<template>
    <div class="outside-course">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                          <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder=""/>
                </b-input-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="action" slot-scope="row">
                    <b-button
                            class="styledBtn"
                            :key="'c'+row.item.id"
                            :size="template_size"
                            variant="outline-primary"
                            @click="detailOpen(row)"
                    >查 看</b-button>
                    <b-button
                            class="styledBtn"
                            :key="'d'+row.item.id"
                            :size="template_size"
                            variant="outline-primary"
                            @click="teamOpen(row)"
                    >团队管理</b-button>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-end row-margin-tweak mx-0 mt-4 cardDiv">
            <b-pagination
                    :size="template_size"
                    :total-rows="allData.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <b-modal size="lg" hide-footer centered id="detailView" ref="detailView" title="查看详情">
            <b-container class="modalContainer" v-if="selectedRow">
                <b-row>
                    <b-col lg="3" md="4" sm="4" class="text-left">
                        序号：{{selectedRow.id}}
                    </b-col>
                    <b-col lg="9" md="4" sm="4" class="text-left">
                        课外学习主题：{{selectedRow.courseFullName}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="4" sm="12" class="text-left">
                        创建人：{{selectedRow.created_by}}
                    </b-col>
                    <b-col md="4" sm="12" class="text-left">
                        创建时间：{{selectedRow.create_time}}
                    </b-col>
                    <b-col md="4" sm="12" class="text-left">
                        指导者：{{selectedRow.teacherName}}
                    </b-col>
                </b-row>
                <b-row class="justify-content-center mt-5" style="font-size: 20px;">
                    业 务 清 单
                </b-row>
                <b-row class="my-2">
                    <b-col md="2" sm="12">
                        业务序号
                    </b-col>
                    <b-col md="5" sm="12">
                        业务名称
                    </b-col>
                    <b-col md="5" sm="12">
                        业务单位
                    </b-col>
                </b-row>
                <b-row v-for="item in selectedRow.linked_business" :key="item.id">
                    <b-col md="2" sm="12">
                        {{item.id}}
                    </b-col>
                    <b-col md="5" sm="12">
                        {{item.name}}
                    </b-col>
                    <b-col md="5" sm="12">
                        {{item.target_company}}
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <b-modal size="xl" hide-footer centered id="teamView" ref="teamView" title="团队管理">
            <b-container class="modalContainer" v-if="selectedRow">
                <b-row class="justify-content-center" style="font-size: 20px;">
                    团 队 清 单
                </b-row>
                <b-row class="my-2">
                    <b-col md="2" sm="12">
                        团队序号
                    </b-col>
                    <b-col md="2" sm="12">
                        团队名称
                    </b-col>
                    <b-col md="3" sm="12">
                        团队领导人
                    </b-col>
                    <b-col md="3" sm="12">
                        创建时间
                    </b-col>
                    <b-col md="2" sm="12">
                        团队数
                    </b-col>
                </b-row>
                <b-row v-for="item in selectedRow.linked_team" :key="item.id">
                    <b-col md="2" sm="12">
                        {{item.id}}
                    </b-col>
                    <b-col md="2" sm="12">
                        {{item.name}}
                    </b-col>
                    <b-col md="3" sm="12">
                        {{item.leader}}
                    </b-col>
                    <b-col md="3" sm="12">
                        {{item.create_time}}
                    </b-col>
                    <b-col md="2" sm="12">
                        {{item.member_count}}
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import CourseService from "@/services/courseService";
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "outside-course",
        components: {
            BRow,
            Loading,
        },
        data() {
            return {
                columns: {
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-id"
                    },
                    courseName: {
                        label: "课外学习主题",
                        sortable: false,
                        class: "text-center field-courseName"
                    },
                    created_by: {
                        label: "创建人",
                        sortable: false,
                        class: "text-center field-created_by"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-center field-create_time"
                    },
                    teacherName: {
                        label: "指导者",
                        sortable: false,
                        class: "text-center field-teacherName"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                queryParam: {
                    page: 1,
                    size: 5,
                },
                queryDebounceParam: {
                    search: ""
                },
                allData: {
                    list: [],
                    total: 0
                },
                selectedRow: {},
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryGroupChanges();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
            queryParam: {
                handler() {
                    this.queryGroupChanges();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryGroupChanges();
                }, 500)
            }
        },
        methods: {
            queryGroupChanges() {
                this.run();
                CourseService
                    .getOutsideCourseList({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.allData.list = data.results;
                        this.allData.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            detailOpen(row) {
                this.$refs['detailView'].show();
                this.selectedRow = row.item;
            },
            teamOpen(row) {
                this.$refs['teamView'].show();
                this.selectedRow = row.item;
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .outside-course {
    }
</style>
