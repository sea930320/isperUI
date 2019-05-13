<template>
    <div class="assistant-set">
        <loading v-if="isRunning"></loading>
        <PersonalCenterTab activeTab="2"/>
        <b-row class="cardDiv">
            <b-col cols="4">
                <b-card no-body>
                    <b-card-header class="assistant-add my-0 py-2">
                        配置助理
                        <b-button
                            variant="link"
                            class="float-right"
                            size="sm"
                            @click="addAssistant"
                        >
                            <icon name="plus-circle"></icon>
                        </b-button>
                    </b-card-header>
                    <b-card-body>
                        <b-list-group>
                            <b-list-group-item
                                v-for="(assistant, index) in assistants"
                                :key="index"
                                button
                                class="d-flex justify-content-between align-items-center py-2 my-0"
                                :active="assistant.active"
                                @click="selectAssistant(assistant)"
                            >
                                {{assistant.name || assistant.username}}
                                <b-button size="sm" @click="unsetAssistant(assistant)">取消绑定</b-button>
                            </b-list-group-item>
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
                            <td colspan="2" class="m-0 p-0 w-80" v-if="selectedAssistant">
                                <template v-if="selectAssistant">
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
                                                v-model="selectedAssistant.permissions_check[permission.id]"
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
                                                        v-model="selectedAssistant.actions_check[action.id]"
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
                                <template v-if="selectedAssistant">
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
                                                v-model="selectedAssistant.permissions_check[permission.id]"
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
                                                        v-model="selectedAssistant.actions_check[action.id]"
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
        <assistant-add/>

        <!-- Unset Assistant Modal -->
        <b-modal
            v-model="unsetModal"
            title="Unset Assistant"
            ok-title="确定"
            cancel-title="取消"
            @cancel="unsetModal=false"
            @ok="confirmUnset"
        >
            <div class="modal-msg">
                <p class="message">Are you Sure</p>
            </div>

            <div slot="modal-footer" class="w-100">
                <b-button variant="danger" class="float-center mr-2" @click="confirmUnset()">确定</b-button>
                <b-button variant="secondary" class="float-center" @click="unsetModal=false">取消</b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import accountService from "@/services/accountService";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
import AssistantAdd from "@/views/personal-center/AssistantAdd";
import _ from "lodash";
import Loading from "@/components/loading/Loading";

export default {
    name: "assistant-set",
    components: { PersonalCenterTab, AssistantAdd, Loading },
    data() {
        return {
            assistants: [],
            permissions: [],
            unsetModal: false,
            focusAssistant: null
        };
    },
    computed: {
        ...mapState(["userInfo"]),
        systemFunctionPermissions() {
            return this.permissions.filter(permission => {
                return permission.codename != "code_system_set_management";
            });
        },
        systemSettingPermissions() {
            return this.permissions.filter(permission => {
                return permission.codename == "code_system_set_management";
            });
        },
        selectedAssistant() {
            let assistant = _.find(this.assistants, {
                active: true
            });
            if (!assistant) {
                return null;
            }
            this.$set(assistant, "permissions_check", {});
            this.$set(assistant, "actions_check", {});
            assistant.permissions = _.mapValues(
                _.groupBy(assistant.actions, "permission_id")
            );
            for (let index in this.permissions) {
                let permission = this.permissions[index];
                let actions = permission.actions;
                this.$set(assistant.permissions_check, permission.id, false);
                for (let index1 in actions) {
                    let action = actions[index1];
                    this.$set(assistant.actions_check, action.id, false);
                }
            }

            for (let permission_id in assistant.permissions) {
                let permission = assistant.permissions[permission_id];
                assistant.permissions_check[permission_id] =
                    permission && permission.length > 0;
            }
            for (let index in assistant.actions) {
                let action = assistant.actions[index];
                assistant.actions_check[action.id] = true;
            }
            return assistant;
        }
    },
    created() {
        this.$nextTick(() => {
            this.getAssistants();
        });

        this.$on("on-ok-assistant-add", () => {
            this.getAssistants();
        });
    },
    methods: {
        ...mapActions({
            loginAction: "login"
        }),
        getAssistants() {
            this.run();
            let apis = [
                accountService.getAssistants(),
                accountService.getPermissions()
            ];
            Promise.all(apis)
                .then(repsonse => {
                    this.assistants = _.map(
                        repsonse[0].assistants,
                        assistant => {
                            assistant.active = false;
                            return assistant;
                        }
                    );
                    this.assistants.length > 0 &&
                        (this.assistants[0].active = true);
                    this.permissions = repsonse[1].permissions;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        addAssistant() {
            this.$emit("openAssistantAddModal");
        },
        unsetAssistant(assistant) {
            this.focusAssistant = assistant;
            this.unsetModal = true;
        },
        confirmUnset() {
            this.unsetModal = false;
            this.run();
            let params = {
                candidates: JSON.stringify([this.focusAssistant.id])
            };
            accountService
                .unsetAssistant(params)
                .then(() => {
                    this.$emit("data-ready");
                    this.getAssistants();
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        selectAssistant(assistant) {
            this.assistants = _.map(this.assistants, assistant => {
                assistant.active = false;
                return assistant;
            });
            this.$set(assistant, "active", true);
        },
        togglePermission(val, permission) {
            let actions = _.map(this.selectedAssistant.actions, _.clone);
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
            this.$set(this.selectedAssistant, "actions", actions);
        },
        toggleAction(val, action) {
            let actions = _.map(this.selectedAssistant.actions, _.clone);
            this.selectedAssistant.actions = [];
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
            this.$set(this.selectedAssistant, "actions", actions);
        },
        save() {
            let actions = this.assistants.map(assistant => {
                return {
                    actions: assistant.actions_check || null,
                    id: assistant.id
                };
            });
            this.run();
            accountService
                .setAssistantsActions({
                    assistants_actions: JSON.stringify(actions)
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
.assistant-set {
    .assistant-add {
        line-height: 31px;
        text-align: center;
        background: royalblue;
        font-weight: bold;
        color: white;
        button {
            color: white;
        }
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