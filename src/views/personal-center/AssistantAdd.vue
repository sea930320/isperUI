<template>
    <div>
        <loading v-if="isRunning"></loading>
        <b-modal
            v-model="visible"
            title="对应的程序模块"
            centered
            size="xl"
            @cancel="cancelHandler"
            @ok="okHandler"
            hide-footer
        >
            <div class="assistant-add-container">
                <b-row class="cardDiv">
                    <b-col cols="12">
                        <b-form-group class="m-0 mt-1 mb-3 text-center">
                            <b-form-radio-group v-model="selectedType" :options="typeOptions"></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                    <b-col :cols="selectedType == 0 ? 6 : 4" v-if="selectedType!==2">
                        <b-form-group
                            label-cols="3"
                            label-cols-lg="3"
                            label="用户名:"
                            class="m-0 text-left"
                        >
                            <b-input-group :size="template_size">
                                <b-input-group-prepend>
                                    <span class="input-group-text">
                                        <icon name="search"></icon>
                                    </span>
                                </b-input-group-prepend>
                                <b-form-input v-model.lazy="queryDebounceParam.search" placeholder/>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col :cols="selectedType == 0 ? 6 : 4" v-if="selectedType!==2">
                        <b-form-group
                            label-cols="3"
                            label-cols-lg="3"
                            label="单位:"
                            class="m-0 text-left"
                            v-if="userInfo.identity == 2"
                        >
                            <b-form-select
                                v-model="queryParam.company_id"
                                value-field="id"
                                text-field="name"
                                size="sm"
                                :options="company"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col cols="4" v-if="selectedType == 1">
                        <b-form-group
                            label-cols="3"
                            label-cols-lg="3"
                            label="部门:"
                            class="m-0 text-left"
                        >
                            <b-form-select
                                v-model="queryParam.part_id"
                                value-field="id"
                                text-field="name"
                                size="sm"
                                :options="parts"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <div class="cardDiv" v-if="selectedType == 0">
                    <table class="table b-table table-sm table-bordered vertical-center">
                        <thead class>
                            <tr>
                                <th class="w-20 text-left pl-3">
                                    <b-form-checkbox
                                        v-model="toggleManager.all_check"
                                        :indeterminate="toggleManager.indetermined_check"
                                        @change="toggleAllManagers($event)"
                                    >用户名</b-form-checkbox>
                                </th>
                                <th class="w-30">集群</th>
                                <th class="w-30">单位</th>
                                <th class="w-20">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(manager, index) in managers" :key="index">
                                <td class="text-left pl-3">
                                    <b-form-checkbox
                                        v-model="manager.is_checked"
                                        @change="onToggleManager($event, manager)"
                                    >{{manager.name}}</b-form-checkbox>
                                </td>
                                <td>{{manager.group}}</td>
                                <td>{{manager.company }}</td>
                                <td>{{manager.role}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="cardDiv" v-else-if="selectedType == 1">
                    <table class="table b-table table-sm table-bordered vertical-center">
                        <thead class>
                            <tr>
                                <th class="w-20 text-left pl-3">
                                    <b-form-checkbox
                                        v-model="toggleUser.all_check"
                                        :indeterminate="toggleUser.indetermined_check"
                                        @change="toggleAllUsers($event)"
                                    >用户名</b-form-checkbox>
                                </th>
                                <th class="w-30">集群</th>
                                <th class="w-30">单位</th>
                                <th class="w-20">部门</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in users" :key="index">
                                <td class="text-left pl-3">
                                    <b-form-checkbox
                                        v-model="user.is_checked"
                                        @change="onToggleUser($event, user)"
                                    >{{user.name}}</b-form-checkbox>
                                </td>
                                <td>{{user.group}}</td>
                                <td>{{user.company}}</td>
                                <td>{{user.part}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="cardDiv" v-else>
                    <b-form-group label-cols="4" label-cols-lg="2" label="用户名 *" label-for="name">
                        <b-form-input
                            type="text"
                            v-model="newAssistant.name"
                            placeholder="请输入用户名"
                            name="name"
                        />
                    </b-form-group>

                    <b-form-group
                        label-cols="4"
                        label-cols-lg="2"
                        label="密 码 *"
                        label-for="password"
                    >
                        <b-form-input
                            type="password"
                            v-model="newAssistant.password"
                            placeholder="请输入密码"
                            name="password"
                        />
                    </b-form-group>
                </div>

                <b-row
                    class="justify-content-end row-margin-tweak mx-0 mt-4 cardDiv"
                    v-if="selectedType != 2"
                >
                    <b-pagination
                        :size="template_size"
                        :total-rows="count"
                        :per-page="queryParam.size"
                        limit="5"
                        v-model="queryParam.page"
                    ></b-pagination>
                </b-row>
            </div>
            <div class="w-100">
                <b-button
                    variant="primary"
                    class="float-center styledBtn"
                    @click="okHandler"
                    :disabled="selectedType == 2 && (!newAssistant.name || !newAssistant.password)"
                >确定</b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import userManageService from "@/services/userManageService";
import groupService from "@/services/groupService";
import partpositionService from "@/services/partpositionService";
import accountService from "@/services/accountService";
import Loading from "@/components/loading/Loading";
import _ from "lodash";

export default {
    name: "assistant-add",
    components: { Loading },
    data() {
        return {
            visible: false,
            typeOptions: [
                { text: "系统用户", value: 0 },
                { text: "普通用户", value: 1 },
                { text: "新用户", value: 2 }
            ],
            selectedType: 0,
            queryParam: {
                page: 1,
                size: 5,
                company_id: null,
                part_id: null
            },
            queryDebounceParam: {
                search: ""
            },
            group: [],
            company: [],
            parts: [
                {
                    id: null,
                    name: "----"
                }
            ],
            newAssistant: {
                name: "",
                password: ""
            },
            toggleUser: {
                all_check: false,
                indetermined_check: false
            },
            users: [],
            toggleManager: {
                all_check: false,
                indetermined_check: false
            },
            managers: [],
            count: 0
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {
        "queryParam.company_id": {
            handler() {
                this.getPartPositionData();
            }
        },
        queryParam: {
            handler() {
                this.fetchData();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.fetchData();
            }, 500)
        },
        selectedType: {
            handler() {
                if (this.queryParam.page != 1) {
                    this.queryParam.page = 1;
                } else {
                    this.fetchData();
                }
            }
        }
    },
    created() {
        this.$parent.$on("openAssistantAddModal", () => {
            this.visible = true;
            this.queryParam = {
                page: 1,
                size: 5,
                company_id: null,
                part_id: null
            };
            this.init();
            this.fetchData();
        });
    },
    methods: {
        init() {
            if (this.userInfo.identity == 2) {
                this.run();
                groupService
                    .fetchCompanyList({ page: 1, size: 500 })
                    .then(response => {
                        this.company = response.results;
                        this.company.unshift({
                            id: null,
                            name: "----"
                        });
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            } else {
                this.getPartPositionData();
            }
        },
        fetchData() {
            if (this.selectedType == 2) {
                return;
            }
            this.run();
            let params = { ...this.queryParam, ...this.queryDebounceParam };
            if (this.userInfo.identity == 2) {
                params["group_id"] = this.userInfo.manager_info.group_id;
                params["except_group_assistant"] = 1;
            } else if (this.userInfo.identity == 3) {
                params["company_id"] = this.userInfo.manager_info.company_id;
                params["except_company_assistant"] = 1;
            }
            if (this.selectedType == 0) {
                userManageService
                    .getManageUsers(params)
                    .then(repsonse => {
                        this.$set(this.toggleManager, "all_check", false);
                        this.$set(
                            this.toggleManager,
                            "indetermined_check",
                            false
                        );
                        this.managers = repsonse.results;
                        this.count = repsonse.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            } else if (this.selectedType == 1) {
                userManageService
                    .getNormalUsers(params)
                    .then(repsonse => {
                        this.$set(this.toggleUser, "all_check", false);
                        this.$set(this.toggleUser, "indetermined_check", false);
                        this.users = repsonse.results;
                        this.count = repsonse.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            }
        },
        getPartPositionData() {
            if (this.queryParam.company_id || this.userInfo.identity == 3) {
                let params = {
                    company_id:
                        this.queryParam.company_id ||
                        this.userInfo.manager_info.company_id
                };
                partpositionService
                    .getPartPositionData(params)
                    .then(response => {
                        this.parts = response.results;
                        this.parts.unshift({
                            id: null,
                            name: "----"
                        });
                        this.queryParam.part_id = null;
                    });
            } else {
                this.queryParam.part_id = null;
                this.parts = [
                    {
                        id: null,
                        name: "----"
                    }
                ];
            }
        },
        toggleAllManagers(value) {
            this.$set(this.toggleManager, "all_check", value);
            this.managers.forEach(manager => {
                this.$set(manager, "is_checked", value);
            });
        },
        onToggleManager(value, manager) {
            this.$set(manager, "is_checked", value);
            let isAllChecked = this.managers.every(manager => {
                return manager.is_checked;
            });
            let isAllNotChecked = this.managers.every(manager => {
                return !manager.is_checked;
            });
            if (isAllChecked) {
                this.$set(this.toggleManager, "indetermined_check", false);
                this.$set(this.toggleManager, "all_check", true);
            } else if (isAllNotChecked) {
                this.$set(this.toggleManager, "indetermined_check", false);
                this.$set(this.toggleManager, "all_check", false);
            } else {
                this.$set(this.toggleManager, "indetermined_check", true);
                this.$set(this.toggleManager, "all_check", false);
            }
        },
        toggleAllUsers(value) {
            this.$set(this.toggleUser, "all_check", value);
            this.users.forEach(user => {
                this.$set(user, "is_checked", value);
            });
        },
        onToggleUser(value, user) {
            this.$set(user, "is_checked", value);
            let isAllChecked = this.users.every(user => {
                return user.is_checked;
            });
            let isAllNotChecked = this.users.every(user => {
                return !user.is_checked;
            });
            if (isAllChecked) {
                this.$set(this.toggleUser, "indetermined_check", false);
                this.$set(this.toggleUser, "all_check", true);
            } else if (isAllNotChecked) {
                this.$set(this.toggleUser, "indetermined_check", false);
                this.$set(this.toggleUser, "all_check", false);
            } else {
                this.$set(this.toggleUser, "indetermined_check", true);
                this.$set(this.toggleUser, "all_check", false);
            }
        },
        okHandler() {
            if (this.selectedType === 0) {
                let candidates = _.filter(this.managers, manager => {
                    return manager.is_checked;
                });
                candidates = _.map(candidates, "id");
                this.run();
                accountService
                    .setAssistants({
                        candidates: JSON.stringify(candidates)
                    })
                    .then(() => {
                        this.$emit("data-ready");
                        this.$parent.$emit("on-ok-assistant-add");
                        this.visible = false;
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            } else if (this.selectedType === 1) {
                let candidates = _.filter(this.users, user => {
                    return user.is_checked;
                });
                candidates = _.map(candidates, "id");
                this.run();
                accountService
                    .setAssistants({
                        candidates: JSON.stringify(candidates)
                    })
                    .then(() => {
                        this.$emit("data-ready");
                        this.$parent.$emit("on-ok-assistant-add");
                        this.visible = false;
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            } else {
                let params = {
                    ...this.newAssistant,
                    ...{
                        group_id: this.userInfo.manager_info.group_id,
                        company_id: this.userInfo.manager_info.company_id
                    }
                };
                this.run();
                if (this.userInfo.identity === 2) {
                    groupService
                        .addAssistant(params)
                        .then(() => {
                            this.$emit("data-ready");
                            this.$parent.$emit("on-ok-assistant-add");
                            this.visible = false;
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                } else {
                    groupService
                        .addCAssistant(params)
                        .then(() => {
                            this.$emit("data-ready");
                            this.$parent.$emit("on-ok-assistant-add");
                            this.visible = false;
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
            }
        },
        cancelHandler() {
            this.visible = false;
            this.$emit("on-cancel-assistant-add");
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.assistant-add-container {
    .col-form-label {
        padding: 0px;
        line-height: 31px;
    }
}
</style>