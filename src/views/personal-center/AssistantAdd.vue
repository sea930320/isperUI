<template>
    <b-modal
        v-model="visible"
        title="对应的程序模块"
        centered
        size="xl"
        ok-title="确定"
        cancel-title="取消"
        @cancel="cancelHandler"
        @ok="okHandler"
    >
        <div class="assistant-add-container">
            <b-row class="cardDiv">
                <b-col cols="12">
                    <b-form-group class="m-0 mt-1 mb-3 text-center">
                        <b-form-radio-group v-model="selectedType" :options="typeOptions"></b-form-radio-group>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
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
                            <b-form-input v-model.lazy="queryDebounceParam.name" placeholder/>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-form-group
                        label-cols="3"
                        label-cols-lg="3"
                        label="集群:"
                        class="m-0 text-left"
                    >
                        <b-form-select
                            v-model="queryParam.group_id"
                            value-field="id"
                            text-field="name"
                            size="sm"
                            :options="group"
                        ></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-form-group
                        label-cols="3"
                        label-cols-lg="3"
                        label="单位:"
                        class="m-0 text-left"
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
                <b-col cols="3">
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
                                >{{manager.username}}</b-form-checkbox>
                            </td>
                            <td>{{manager.group.name}}</td>
                            <td>{{manager.company && manager.company.name}}</td>
                            <td>{{manager.role && manager.role.name}}</td>
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
                                >用户名</b-form-checkbox>用户名
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
                                >{{user.username}}</b-form-checkbox>
                            </td>
                            <td>{{user.group.name}}</td>
                            <td>{{user.company && user.company.name}}</td>
                            <td>{{user.part && user.part.name}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="cardDiv" v-else>
                <b-form-group label-cols="4" label-cols-lg="2" label="姓 名 *" label-for="name">
                    <b-form-input
                        type="text"
                        v-model="newAssistant.name"
                        placeholder="请输入姓名"
                        name="name"
                    />
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" label="用户名 *" label-for="username">
                    <b-form-input
                        type="text"
                        v-model="newAssistant.username"
                        placeholder="请输入用户名"
                        name="username"
                    />
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" label="密 码 *" label-for="password">
                    <b-form-input
                        type="text"
                        v-model="newAssistant.password"
                        placeholder="请输入密码"
                        name="password"
                    />
                </b-form-group>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { mapState } from "vuex";
// import _ from "lodash";

export default {
    name: "assistant-add",
    components: {},
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
                group_id: null,
                company_id: null,
                part_id: null
            },
            queryDebounceParam: {
                name: ""
            },
            group: [
                {
                    id: 1,
                    name: "汉口区集群1"
                },
                {
                    id: 2,
                    name: "汉口区集群"
                }
            ],
            company: [
                {
                    id: 2,
                    name: "中南民族大学"
                },
                {
                    id: 5,
                    name: "中南财经政法大学"
                }
            ],
            parts: [
                {
                    id: 1,
                    name: "部门1"
                },
                {
                    id: 2,
                    name: "部门2"
                }
            ],
            newAssistant: {
                name: "",
                username: "",
                gender: "",
                email: "",
                phone: "",
                password: ""
            },
            toggleUser: {
                all_check: false,
                indetermined_check: false
            },
            users: [
                {
                    id: 1,
                    username: "user1",
                    group: {
                        id: 1,
                        name: "汉口区集群1"
                    },
                    company: {
                        id: 2,
                        name: "中南民族大学"
                    },
                    part: {
                        id: 1,
                        name: "部门1"
                    }
                },
                {
                    id: 2,
                    username: "user2",
                    group: {
                        id: 1,
                        name: "汉口区集群2"
                    },
                    company: {
                        id: 2,
                        name: "中南民族大学"
                    },
                    part: {
                        id: 1,
                        name: "部门1"
                    }
                }
            ],
            toggleManager: {
                all_check: false,
                indetermined_check: false
            },
            managers: [
                {
                    id: 1,
                    username: "user1",
                    group: {
                        id: 1,
                        name: "汉口区集群1"
                    },
                    company: {
                        id: 2,
                        name: "中南民族大学"
                    },
                    role: {
                        id: 3,
                        name: "单位管理员"
                    }
                },
                {
                    id: 2,
                    username: "user2",
                    group: {
                        id: 1,
                        name: "汉口区集群1"
                    },
                    company: {
                        id: 2,
                        name: "中南民族大学"
                    },
                    role: {
                        id: 3,
                        name: "单位管理员"
                    }
                }
            ]
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    created() {
        this.$parent.$on("openAssistantAddModal", () => {
            this.visible = true;
        });
    },
    methods: {
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
            this.$emit("on-ok");
        },
        cancelHandler() {
            this.$emit("on-cancel");
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