<template>
    <div class="role-management">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col cols="4">
                <b-card no-body>
                    <b-card-header class="left-header my-0 py-2">角色</b-card-header>
                    <b-card-body>
                        <b-list-group>
                            <b-list-group-item
                                v-for="(role, index) in roles"
                                :key="index"
                                button
                                class="d-flex justify-content-between align-items-center py-2 my-0"
                                :active="role.active"
                                @click="selectRole(role)"
                            >{{role.name}}</b-list-group-item>
                        </b-list-group>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col cols="8" class="func-limit">
                <table class="table b-table table-sm table-bordered">
                    <thead class>
                        <tr>
                            <th class="w-20">一级菜单</th>
                            <th class="w-20">二级菜单</th>
                            <th class="w-60">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="w-20">系统功能</td>
                            <td colspan="2" class="m-0 p-0 w-80" v-if="selectedRole">
                                <template v-if="selectedRole">
                                    <b-row
                                        v-for="(permission, index) in systemFunctionPermissions"
                                        :key="index"
                                        no-gutters
                                        class="permission-row"
                                    >
                                        <b-col
                                            cols="3"
                                            class="p-1 pl-3 text-left"
                                            style="border-right: 1px solid #dee2e6;"
                                        >
                                            <b-form-checkbox
                                                v-model="selectedRole.permissions_check[permission.id]"
                                                @change="togglePermission($event, permission)"
                                            >{{permission.name}}</b-form-checkbox>
                                        </b-col>
                                        <b-col
                                            cols="9"
                                            class="pl-3 text-left"
                                            style="overflow:hidden; text-overflow: ellipse"
                                        >
                                            <b-row>
                                                <b-col
                                                    cols="4"
                                                    v-for="(action, index1) in permission.actions"
                                                    :key="index1"
                                                    class="my-1"
                                                >
                                                    <b-form-checkbox
                                                        value-field="id"
                                                        text-field="name"
                                                        v-model="selectedRole.actions_check[action.id]"
                                                        @change="toggleAction($event, action)"
                                                    >
                                                        <div style="width: 100%;">{{action.name}}</div>
                                                    </b-form-checkbox>
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <td class="w-20 p-0">系统设置</td>
                            <td colspan="2" class="m-0 p-0 w-80">
                                <template v-if="selectedRole">
                                    <b-row
                                        v-for="(permission, index) in systemSettingPermissions"
                                        :key="index"
                                        no-gutters
                                        class="permission-row"
                                    >
                                        <b-col
                                            cols="3"
                                            class="p-2 pl-3 text-left"
                                            style="border-right: 1px solid #dee2e6;"
                                        >
                                            <b-form-checkbox
                                                v-model="selectedRole.permissions_check[permission.id]"
                                                @change="togglePermission($event, permission)"
                                            >{{permission.name}}</b-form-checkbox>
                                        </b-col>
                                        <b-col
                                            cols="9"
                                            class="pl-3 text-left"
                                            style="overflow:hidden; text-overflow: ellipse"
                                        >
                                            <b-row>
                                                <b-col
                                                    cols="4"
                                                    v-for="(action, index1) in permission.actions"
                                                    :key="index1"
                                                    class="my-1 py-1"
                                                >
                                                    <b-form-checkbox
                                                        value-field="id"
                                                        text-field="name"
                                                        v-model="selectedRole.actions_check[action.id]"
                                                        @change="toggleAction($event, action)"
                                                    >
                                                        <div style="width: 100%;">{{action.name}}</div>
                                                    </b-form-checkbox>
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-col>
            <b-col cols="12" class="mt-5">
                <b-button class="styledBtn" type="submit" variant="primary" @click="save()">保存</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import accountService from "@/services/accountService";
import _ from "lodash";
import Loading from "@/components/loading/Loading";

export default {
    name: "assistant-set",
    components: { Loading },
    data() {
        return {
            roles: [
                {
                    id: 2,
                    name: "集群管理员"
                },
                {
                    id: 3,
                    name: "单位管理员"
                }
            ],
            permissions: []
        };
    },
    computed: {
        ...mapState(["userInfo"]),
        selectedRole() {
            let role = _.find(this.roles, {
                active: true
            });
            if (!role) {
                return null;
            }
            this.$set(role, "permissions_check", {});
            this.$set(role, "actions_check", {});
            role.permissions = _.mapValues(
                _.groupBy(role.actions, "permission_id")
            );
            for (let index in this.permissions) {
                let permission = this.permissions[index];
                let actions = permission.actions;
                this.$set(role.permissions_check, permission.id, false);
                for (let index1 in actions) {
                    let action = actions[index1];
                    this.$set(role.actions_check, action.id, false);
                }
            }

            for (let permission_id in role.permissions) {
                let permission = role.permissions[permission_id];
                role.permissions_check[permission_id] =
                    permission && permission.length > 0;
            }
            for (let index in role.actions) {
                let action = role.actions[index];
                role.actions_check[action.id] = true;
            }
            return role;
        },
        selectedRoleID() {
            if (!this.selectedRole) return null;
            return this.selectedRole.id;
        },
        systemFunctionPermissions() {
            return this.permissions.filter(permission => {
                if (this.selectedRoleID == 2) {
                    if (
                        ["code_company_management"].includes(
                            permission.codename
                        )
                    ) {
                        return false;
                    }
                } else if (this.selectedRoleID == 3) {
                    if (
                        [
                            "code_business_management",
                            "code_group_company_management"
                        ].includes(permission.codename)
                    ) {
                        return false;
                    }
                }
                return permission.codename != "code_system_set_management";
            });
        },
        systemSettingPermissions() {
            return this.permissions.filter(permission => {
                return permission.codename == "code_system_set_management";
            });
        }
    },
    created() {
        this.$nextTick(() => {
            this.getRoles();
        });
    },
    methods: {
        ...mapActions({
            loginAction: "login"
        }),
        getRoles() {
            this.run();
            let apis = [
                accountService.getRoles(),
                accountService.getPermissions()
            ];
            Promise.all(apis)
                .then(repsonse => {
                    this.roles = _.filter(
                        _.map(repsonse[0].roles, role => {
                            role.active = false;
                            return role;
                        }),
                        role => {
                            if ([2, 3].includes(role.id)) return true;
                            else return false;
                        }
                    );
                    this.roles.length > 0 && (this.roles[0].active = true);
                    this.permissions = repsonse[1].permissions;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        selectRole(role) {
            this.roles = _.map(this.roles, role => {
                role.active = false;
                return role;
            });
            this.$set(role, "active", true);
        },
        togglePermission(val, permission) {
            let actions = _.map(this.selectedRole.actions, _.clone);
            if (val) {
                actions = _.unionBy(permission.actions, actions, "id");
            } else {
                _.remove(actions, action => {
                    return _.includes(
                        _.map(permission.actions, "id"),
                        action.id
                    );
                });
            }
            this.$set(this.selectedRole, "actions", actions);
        },
        toggleAction(val, action) {
            let actions = _.map(this.selectedRole.actions, _.clone);
            this.selectedRole.actions = [];
            if (val) {
                let existAction = _.find(actions, {
                    id: action.id
                });
                if (!existAction) {
                    actions.push(action);
                }
            } else {
                _.remove(actions, {
                    id: action.id
                });
            }
            this.$set(this.selectedRole, "actions", actions);
        },
        save() {
            let actions = this.roles.map(role => {
                return {
                    actions: role.actions_check || null,
                    id: role.id
                };
            });
            this.run();
            accountService
                .setRolesActions({
                    roles_actions: JSON.stringify(actions)
                })
                .then(() => {
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.role-management {
    .left-header {
        line-height: 31px;
        text-align: center;
        background: royalblue;
        font-weight: bold;
        color: white;
    }
    .role-select-card {
        .row > [class*="col-"] {
            border: 1px solid rgba(86, 61, 124, 0.2);
            height: 49px;
        }
    }
    .list-group-item-action:hover,
    .list-group-item-action:focus,
    .list-group-item-action.active {
        color: #345fe0;
        background-color: rgba(73, 133, 255, 0.37);
        outline: 0px !important;
    }
    .list-group-item {
        border: 1px solid #dee2e6;
        border-top: 0px;
    }
    .list-group-item:first-child {
        border-top: 1px solid #dee2e6;
    }
    .func-limit {
        table {
            thead {
                tr th {
                    height: 50px;
                    vertical-align: middle;
                }
            }
        }
        .permission-row {
            border-bottom: 1px solid #dee2e6;
        }
        .permission-row:last-child {
            border-bottom: 0px;
        }
    }
    .custom-control-label {
        width: 100%;
        div {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>