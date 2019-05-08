<template>
    <div class="assistant-set">
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
                                {{assistant.name}}
                                <b-button size="sm">取消绑定</b-button>
                            </b-list-group-item>
                        </b-list-group>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col cols="8" class="func-limit">
                <table class="table b-table table-sm table-bordered">
                    <thead class>
                        <tr>
                            <th class="w-25">一级菜单</th>
                            <th class="w-25">二级菜单</th>
                            <th class="w-50">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>系统功能</td>
                            <td colspan="2" class="m-0 p-0">
                                <b-row
                                    v-for="(operation, index) in operations"
                                    :key="index"
                                    no-gutters
                                    class="permission-row"
                                >
                                    <b-col
                                        cols="4"
                                        class="p-1 pl-3 text-left"
                                        style="border-right: 1px solid #dee2e6;"
                                    >
                                        <b-form-checkbox
                                            v-model="selectedAssistant.operations[operation.id]"
                                        >{{operation.name}}</b-form-checkbox>
                                    </b-col>
                                    <b-col cols="8" class="pl-3 text-left">
                                        <b-form-checkbox-group
                                            :options="operation.actions"
                                            buttons
                                            button-variant="outline-primary"
                                            size="sm"
                                            value-field="id"
                                            text-field="name"
                                            v-model="selectedAssistant.actions[operation.id]"
                                            style="vertical-align: unset"
                                        ></b-form-checkbox-group>
                                    </b-col>
                                </b-row>
                            </td>
                        </tr>
                        <tr>
                            <td>系统设置</td>
                            <td colspan="2"></td>
                        </tr>
                    </tbody>
                </table>
            </b-col>
            <b-col cols="12" class="mt-5">
                <b-button class="styledBtn" type="submit" variant="primary">保存</b-button>
            </b-col>
        </b-row>
        <assistant-add/>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import accountService from "@/services/accountService";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";
import AssistantAdd from "@/views/personal-center/AssistantAdd";
import _ from "lodash";

export default {
    name: "assistant-set",
    components: { PersonalCenterTab, AssistantAdd },
    data() {
        return {
            assistants: [
                {
                    name: "Assistant1",
                    username: "assistant1",
                    active: true,
                    operations: {},
                    actions: {}
                },
                {
                    name: "Assistant2",
                    username: "assistant2",
                    active: false,
                    operations: {},
                    actions: {}
                },
                {
                    name: "Assistant3",
                    username: "assistant3",
                    active: false,
                    operations: {},
                    actions: {}
                },
                {
                    name: "Assistant4",
                    username: "assistant4",
                    active: false,
                    operations: {},
                    actions: {}
                },
                {
                    name: "Assistant5",
                    username: "assistant5",
                    active: false,
                    operations: {},
                    actions: {}
                }
            ],
            operations: [
                {
                    id: 1,
                    name: "workflow",
                    actions: [
                        {
                            id: 4,
                            name: "create"
                        },
                        {
                            id: 5,
                            name: "delete"
                        },
                        {
                            id: 6,
                            name: "update"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "project",
                    actions: [
                        {
                            id: 7,
                            name: "create"
                        },
                        {
                            id: 8,
                            name: "delete"
                        },
                        {
                            id: 9,
                            name: "update"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "user",
                    actions: [
                        {
                            id: 10,
                            name: "create"
                        },
                        {
                            id: 11,
                            name: "delete"
                        },
                        {
                            id: 12,
                            name: "update"
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        ...mapState(["userInfo"]),
        selectedAssistant() {
            return _.find(this.assistants, {
                active: true
            });
        }
    },
    created() {},
    methods: {
        ...mapActions({
            loginAction: "login"
        }),
        addAssistant() {
            this.$emit("openAssistantAddModal");
        },
        selectAssistant(assistant) {
            this.assistants = _.map(this.assistants, assistant => {
                assistant.active = false;
                return assistant;
            });
            this.$set(assistant, "active", true);
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
}
</style>