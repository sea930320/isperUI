<template>
    <div class="business-evaluation">
        <loading v-if="isRunning"></loading>
        <div class="cardDiv">
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="evaluation" slot-scope="row">
                    <b-button
                            class="styledBtn"
                            :key="'c'+row.item.id"
                            :size="template_size"
                            variant="outline-primary"
                            @click="evaluationOpen(row)"
                    >评价</b-button>
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
        <b-modal size="xl" hide-footer centered id="EvaluationModal" ref="EvaluationModal" title="业务评价">
            <div class="p-4" v-if="selectedBusiness.business_id">
                <div class="cardDiv">
                    <h4 class="ml-4 my-3 float-left">业务参与人员</h4>
                    <b-table :items="selectedBusiness.members" small hover
                             :fields="member_columns"
                             @row-selected="memberSelected"
                             selectable
                             select-mode="single"
                             head-variant style="fontSize: 18px">
                        <template slot="action" slot-scope="row">
                            <b-button
                                    class="styledBtn"
                                    :key="'c'+row.item.user_id"
                                    :size="template_size"
                                    variant="outline-primary"
                                    @click="evaluationView(row)"
                            >查看评价</b-button>
                        </template>
                    </b-table>
                </div>
                <a class="ml-4 text-left row" style="cursor: pointer; color: blue" @click="BusinessView">查看业务报告</a>
                <b-card no-body class="cardDiv" v-if="selectedMember">
                    <a class="ml-2 text-left">点评内容</a>
                    <b-tabs pills card>
                        <b-tab title="针对环节点评" active>
                            <div class="row mb-1" v-for="(nodeItem, index) in selectedMember.node_evaluation" :key="index">
                                <div class="col-2 text-right">
                                    <label class="spanItem">{{nodeItem.node_name}} : </label>
                                </div>
                                <div class="col-10">
                                    <b-form-input size="sm" class="inp-edit form-control" v-model="nodeItem.node_comment"/>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab title="总体点评">
                            <b-form-textarea
                                id="textarea-small"
                                size="sm"
                                placeholder="总体点评"
                                v-model="selectedMember.comment"
                            ></b-form-textarea>
                        </b-tab>
                    </b-tabs>
                    <a class="row ml-2 text-left mx-auto">指导者评分 :&ensp;
                        <b-form-input size="sm" class="inp-edit form-control col-3 mr-auto" v-model="selectedMember.value"/>
                        <b-button class="styledBtn col-4"
                                size="sm"
                                variant="outline-primary"
                                @click="evaluationSave(selectedMember)"
                        >保存</b-button>
                    </a>
                </b-card>
            </div>
        </b-modal>
        <b-modal size="lg" hide-footer centered id="EvaluationView" ref="EvaluationView" title="评价详情">
            <div class="p-4" v-if="selectedViewRow.business_id">
                <div class="mx-3 my-3">
                    人员 ID : {{selectedViewRow.user_id}}&ensp;&ensp;&ensp;
                    姓名 : {{selectedViewRow.name}}&ensp;&ensp;&ensp;
                    单位 : {{selectedViewRow.company}}<br/>
                    部门 : {{selectedViewRow.part}}&ensp;&ensp;&ensp;
                    职务 : {{selectedViewRow.position}}&ensp;&ensp;&ensp;
                    身份 : {{selectedViewRow.role}}&ensp;&ensp;&ensp;
                    分数 : {{selectedViewRow.value}}
                    <div class="text-left mt-2">总体点评</div>
                    <label class="border py-2 px-3 text-left w-100">
                        {{selectedViewRow.comment}}
                    </label>
                    <div class="text-left">环节点评</div>
                    <div class="border py-2 px-3 text-left w-100 row">
                        <span class="col-12 border" v-for="(node, index) in selectedViewRow.node_evaluation" :key="'node' + index">{{node.node_name + ' : ' + node.node_comment}}</span>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal size="lg" hide-footer centered id="BusinessView" ref="BusinessView" title="查看评价">
        </b-modal>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import Loading from "@/components/loading/Loading";
    import businessService from "@/services/businessService";

    export default {
        name: "business-evaluation",
        components: {
            Loading,
        },
        data() {
            return {
                columns: {
                    business_id: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-business_id"
                    },
                    business_name: {
                        label: "业务名称",
                        sortable: false,
                        class: "text-center field-business_name"
                    },
                    create_company: {
                        label: "创建单位",
                        sortable: false,
                        class: "text-center field-create_company"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-center field-create_time"
                    },
                    business_status: {
                        label: "业务状态",
                        sortable: false,
                        class: "text-center field-business_status"
                    },
                    evaluation: {
                        label: "评价",
                        sortable: false,
                        class: "text-center field-evaluation"
                    }
                },
                member_columns: {
                    user_id: {
                        label: "人员 ID",
                        sortable: false,
                        class: "text-center field-user_id"
                    },
                    name: {
                        label: "姓名",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    company: {
                        label: "单位",
                        sortable: false,
                        class: "text-center field-company"
                    },
                    part: {
                        label: "部门",
                        sortable: false,
                        class: "text-center field-part"
                    },
                    position: {
                        label: "职务",
                        sortable: false,
                        class: "text-center field-position"
                    },
                    role: {
                        label: "身份",
                        sortable: false,
                        class: "text-center field-role"
                    },
                    value: {
                        label: "分数",
                        sortable: false,
                        class: "text-center field-value"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                allData: {
                    list: [],
                    total: 0
                },
                selectedBusiness: {},
                selectedMember: null,
                selectedViewRow: {},
                queryParam: {
                    page: 1,
                    size: 10
                },
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryInitBusinessEvaluation();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
            ...mapState({
                metaInfo: state => state.meta.info,
                experiences: state => state.meta.experiences,
                currentRoleAllocation: state => state.meta.currentRoleAllocation
            }),
        },
        watch: {
            queryParam: {
                handler() {
                    this.queryInitBusinessEvaluation();
                },
                deep: true
            },
        },
        methods: {
            queryInitBusinessEvaluation() {
                this.run();
                businessService
                    .getInitBusinessEvaluation(this.queryParam)
                    .then(data => {
                        this.allData.list = data.results;
                        this.allData.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            evaluationOpen(row) {
                this.selectedBusiness = row.item;
                this.selectedMember = null;
                this.$refs['EvaluationModal'].show();
            },
            evaluationView(row) {
                this.selectedViewRow = row.item;
                this.$refs['EvaluationView'].show();
            },
            memberSelected(items) {
                this.selectedMember = items[0];
            },
            evaluationSave(data) {
                this.run();
                businessService
                    .evaluationSave({
                        business_id: data.business_id,
                        user_id: data.user_id,
                        value: data.value,
                        comment: data.comment,
                        node_evaluation: JSON.stringify(data.node_evaluation)
                    })
                    .then(() => {
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            BusinessView() {
                this.$refs['BusinessView'].show();
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .business-evaluation {
    }
</style>
