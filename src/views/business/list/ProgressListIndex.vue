<template>
    <div class="progress-list-index" v-if="userInfo">
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
        </b-row>
        <div class="cardDiv">
            <b-table :items="business.list" small hover :fields="columns" head-variant>
                <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
                <template slot="name" slot-scope="row">{{row.item.name}}</template>
                <template
                    slot="office_type"
                    slot-scope="row"
                >{{row.item.officeItem? row.item.officeItem.name : row.item.project && row.item.project.office_item}}</template>
                <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
                <template
                    slot="creator"
                    slot-scope="row"
                >{{row.item.created_by && row.item.created_by.name && row.item.created_by.username}}</template>
                <template slot="status" slot-scope="row">{{row.item.status | businessStatus}}</template>
                <template slot="action" slot-scope="row">
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="runBusiness(row.item)"
                        :disabled="row.item.status === 1"
                    >办理</b-button>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-center row-margin-tweak cardDiv">
            <b-pagination
                :size="template_size"
                :total-rows="business.total"
                :per-page="queryParam.size"
                limit="5"
                v-model="queryParam.page"
            ></b-pagination>
        </b-row>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import businessService from "@/services/businessService";
import { businessStatus } from "@/filters/fun";
import _ from "lodash";
export default {
    name: "progress-list-index",
    components: { Loading },
    filters: { businessStatus },
    data() {
        return {
            columns: {
                sn: {
                    label: "序号",
                    sortable: false,
                    class: "text-center field-sn w-5"
                },
                name: {
                    label: "业务名称",
                    sortable: false,
                    class: "text-center field-name w-20"
                },
                office_type: {
                    label: "事务类型",
                    sortable: false,
                    class: "text-center field-office_type w-20"
                },
                create_time: {
                    label: "申请时间",
                    sortable: false,
                    class: "text-center field-create_time w-20"
                },
                creator: {
                    label: "申请人",
                    sortable: false,
                    class: "text-center field-creator w-15"
                },
                status: {
                    label: "状态",
                    sortable: false,
                    class: "text-center field-status w-10"
                },
                action: {
                    label: "操作",
                    sortable: false,
                    class: "text-center field-action w-10"
                }
            },
            queryParam: {
                status: 3,
                page: 1,
                size: 15
            },
            queryDebounceParam: {
                search: ""
            },
            business: {
                list: [],
                total: 0
            }
        };
    },
    created() {
        this.$nextTick(() => {
            this.queryBusinessList();
        });
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {
        queryParam: {
            handler() {
                this.queryBusinessList();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.queryBusinessList();
            }, 500)
        }
    },
    methods: {
        queryBusinessList() {
            this.run();
            businessService
                .fetchList({ ...this.queryParam, ...this.queryDebounceParam })
                .then(data => {
                    this.business.list = data.results;
                    this.business.total = data.paging.count;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        runBusiness(business) {
            if (business.status === 9) {
                this.$toasted.error("该实验已结束不能重新开始");
                return false;
            }
            if (business.status === 2) {
                this.run();
                businessService
                    .getBusinessDetail({ business_id: business.id })
                    .then(data => {
                        this.$emit("data-ready");
                        if (data.role_not_set) {
                            this.$toasted.error(data.role_not_set);
                            return;
                        }
                        this.toProgress(data);
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
                return;
            }
            this.run();
            businessService
                .startBusiness({ business_id: business.id })
                .then(data => {
                    this.$emit("data-ready");
                    this.toProgress(data);
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        toProgress(data) {
            let type = data.node.process_type;
            this.$router.push({
                path: `/business/progress/${type}/${data.id}/${data.node.id}`
            });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.progress-list-index {
}
</style>