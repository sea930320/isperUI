<template>
    <div class="work-log">
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
            <b-col lg="6" md="6" sm="12" class="align-self-center d-flex justify-content-between">
                <date-picker class="mx-2" v-model="queryParam.range" range format="YYYY-MM-DD"></date-picker>
                <b-form-select
                    v-if="userInfo.identity==1"
                    :size="template_size"
                    class="mx-1"
                    v-model="queryParam.group_id"
                    :options="groups"
                    value-field="id"
                    text-field="name"
                    style="flex:1"
                ></b-form-select>
                <b-form-select
                    v-if="[1,2,6].includes(userInfo.identity)"
                    :size="template_size"
                    class="mx-1"
                    v-model="queryParam.company_id"
                    :options="companies"
                    value-field="id"
                    text-field="name"
                    style="flex:1"
                ></b-form-select>
            </b-col>
            <b-col lg="3" md="6" sm="12" class="align-self-center">
                <b-button-group class="float-right">
                    <b-button
                        v-if="userInfo.identity==1"
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="deleteLogs"
                    >清理</b-button>
                    <b-button
                        :size="template_size"
                        class="styledBtn"
                        variant="outline-primary"
                        @click="exportLogs"
                    >导出</b-button>
                </b-button-group>
            </b-col>
        </b-row>

        <div class="cardDiv">
            <b-table :items="workLogList" small hover :fields="columns" head-variant>
                <template slot="HEAD_sn" slot-scope="head">
                    <b-form-checkbox v-if="userInfo.identity==1" v-model="allChecked">{{head.label}}</b-form-checkbox>
                    <span v-else>{{head.label}}</span>
                </template>
                <template slot="sn" slot-scope="row">
                    <b-form-checkbox
                        v-if="userInfo.identity==1"
                        v-model="row.item.checked"
                    >{{ row.index + 1 }}</b-form-checkbox>
                    <span v-else>{{ row.index + 1 }}</span>
                </template>
                <template slot="user_id" slot-scope="row">{{row.item.user_id}}</template>
                <template slot="user_name" slot-scope="row">{{row.item.user_name}}</template>
                <template slot="group" slot-scope="row">{{row.item.group && row.item.group.name}}</template>
                <template
                    slot="company"
                    slot-scope="row"
                >{{row.item.company && row.item.company.name}}</template>
                <template slot="role" slot-scope="row">{{row.item.role && row.item.role.name}}</template>
                <template slot="log_at" slot-scope="row">{{row.item.log_at}}</template>
                <template slot="ip" slot-scope="row">{{row.item.ip}}</template>
                <template slot="action" slot-scope="row">
                    <span class="badge badge-info">{{row.item.action}}</span>
                    {{row.item.targets}}
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-center row-margin-tweak cardDiv">
            <b-pagination
                :size="template_size"
                :total-rows="total"
                :per-page="queryParam.size"
                limit="5"
                v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <!-- Remove Logs Modal -->
        <b-modal
            title="Remove Logs"
            v-model="removeLogModal"
            ok-title="确定"
            cancel-title="取消"
            @cancel="removeLogModal=false"
            @ok="removeLogOk"
        >
            <div class="modal-msg">
                <p class="message">Are u sure to remove selected logs</p>
            </div>
        </b-modal>
    </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import _ from "lodash";
import DatePicker from "vue2-datepicker";
import workLogService from "@/services/workLogService";
import groupService from "@/services/groupService";
import utils from "@/utils/util";
import { mapState } from "vuex";

export default {
    name: "work-log",
    components: {
        Loading,
        DatePicker
    },
    created() {
        this.$nextTick(() => {
            this.queryParam.group_id = [2, 6].includes(this.userInfo.identity)
                ? this.userInfo.manager_info.group_id
                : null;
            this.getWorkLogs();
            if ([1, 2, 6].includes(this.userInfo.identity)) {
                this.getGroupList();
            }
        });
    },
    data() {
        return {
            columns: {
                sn: {
                    label: "序号",
                    sortable: false,
                    class: "text-center field-sn"
                },
                user_id: {
                    label: "用户名",
                    sortable: false,
                    class: "text-center field-user_id"
                },
                user_name: {
                    label: "姓名",
                    sortable: false,
                    class: "text-center field-user_name"
                },
                group: {
                    label: "集群",
                    sortable: false,
                    class: "text-center field-group"
                },
                company: {
                    label: "单位",
                    sortable: false,
                    class: "text-center field-company"
                },
                role: {
                    label: "登录角色",
                    sortable: false,
                    class: "text-center field-role"
                },
                log_at: {
                    label: "登录时间",
                    sortable: false,
                    class: "text-center field-log_at"
                },
                ip: {
                    label: "登录IP",
                    sortable: false,
                    class: "text-center field-ip"
                },
                action: {
                    label: "操作内容",
                    sortable: false,
                    class: "text-left field-action"
                }
            },
            workLogList: [],
            total: 1,
            // 查询参数
            queryParam: {
                page: 1,
                size: 5,
                range: "",
                group_id: null,
                company_id: null
            },
            queryDebounceParam: {
                search: ""
            },
            groups: [],
            allChecked: false,
            removeLogModal: false
        };
    },
    watch: {
        // 监控查询参数，如有变化 查询列表数据
        queryParam: {
            handler() {
                this.getWorkLogs();
            },
            deep: true
        },
        "queryParam.group_id": {
            handler() {
                this.queryParam.company_id = null;
            }
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.getWorkLogs();
            }, 500)
        },
        allChecked: {
            handler(val) {
                if (val) {
                    this.workLogList.map(item => {
                        item.checked = true;
                        return item;
                    });
                } else {
                    this.workLogList.map(item => {
                        item.checked = false;
                        return item;
                    });
                }
            }
        }
    },
    computed: {
        ...mapState(["userInfo"]),
        companies() {
            let items = [
                {
                    id: null,
                    name: "单位筛选"
                }
            ];
            if (!this.queryParam.group_id) {
                return items;
            }
            let groupID = this.queryParam.group_id;
            let currentGroup = this.groups.filter(group => group.id == groupID);
            if (currentGroup.length > 0) {
                items = [
                    ...items,
                    ...currentGroup[0]["companies"].filter(
                        company => company.name != "DEFAULT-COMPANY"
                    )
                ];
            }
            return items;
        },
        checkedItems() {
            return this.workLogList.filter(item => item.checked === true);
        },
        checkedIds() {
            return this.checkedItems.map(item => item.id);
        }
    },
    methods: {
        getGroupList() {
            groupService
                .fetchAllGroupDetail()
                .then(data => {
                    this.groups = data.results;
                    this.groups.unshift({
                        id: null,
                        name: "集群筛选"
                    });
                })
                .catch(() => {});
        },
        getWorkLogs() {
            this.allChecked = false;
            this.run();
            let param = {
                ...this.queryParam,
                ...this.queryDebounceParam
            };
            delete param.range;
            if (this.queryParam.range != "") {
                param["start_date"] = this.queryParam.range[0]
                    ? this.$moment(this.queryParam.range[0]).format(
                          "YYYY-MM-DD"
                      )
                    : "";
                param["end_date"] = this.queryParam.range[1]
                    ? this.$moment(this.queryParam.range[1]).format(
                          "YYYY-MM-DD"
                      )
                    : "";
            } else {
                param["start_date"] = "";
                param["end_date"] = "";
            }
            workLogService
                .fetchLogs(param)
                .then(data => {
                    data.results.forEach(item => {
                        if (item.checked === undefined) {
                            item.checked = false;
                        }
                    });
                    this.total = data.paging.count;
                    this.workLogList = data.results;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        exportLogs() {
            let param = {
                ...this.queryParam,
                ...this.queryDebounceParam
            };
            delete param.range;
            if (this.queryParam.range != "") {
                param["start_date"] = this.queryParam.range[0]
                    ? this.$moment(this.queryParam.range[0]).format(
                          "YYYY-MM-DD"
                      )
                    : "";
                param["end_date"] = this.queryParam.range[1]
                    ? this.$moment(this.queryParam.range[1]).format(
                          "YYYY-MM-DD"
                      )
                    : "";
            } else {
                param["start_date"] = "";
                param["end_date"] = "";
            }
            param = utils.jsonToQueryString(param);
            let url = "/api/account/export/worklogs" + param;
            window.open(url);
        },
        deleteLogs() {
            if (this.checkedItems.length > 0) {
                this.removeLogModal = true;
            } else {
                this.$toasted.error("请选择要清理的日志。");
            }
        },
        removeLogOk() {
            this.removeLogModal = false;
            workLogService
                .removeLogs({ data: JSON.stringify(this.checkedIds) })
                .then(() => {
                    this.getWorkLogs();
                    this.$toasted.success("清理成功");
                });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.work-log {
    .mx-input {
        height: 31px;
    }
    .field-sn {
        text-align: left !important;
        padding-left: 20px;
        width: 6%;
    }
    .field-user_id {
        width: 15%;
    }
    .field-user_name {
        width: 10%;
    }
    .field-group {
        width: 10%;
    }
    .field-company {
        width: 10%;
    }
    .field-role {
        width: 10%;
    }
    .field-log_at {
        width: 9%;
    }
    .field-ip {
        width: 10%;
    }
    .field-action {
        width: 20%;
    }
}
</style>