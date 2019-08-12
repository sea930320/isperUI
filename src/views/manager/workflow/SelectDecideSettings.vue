<template>
    <div class="select-decide-settings">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv px-0">
            <b-col md="3" sm="12">
                <div class style="border: 1px solid #eaeaea;">
                    <b-table
                        :items="roleAllcation"
                        borderless
                        small
                        hover
                        :fields="nodeColumns"
                        head-variant
                        @row-clicked="nodeOnSelect"
                    >
                        <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
                        <template slot="name" slot-scope="row">{{row.item.name}}</template>
                    </b-table>
                </div>
            </b-col>
            <b-col md="9" sm="12">
                <div class="p-5" style="border: 1px solid #eaeaea;">
                    <h3 class="aside-paint-title mt-4">&nbsp;&nbsp;{{process ? process.name : ''}}</h3>
                    <div class="workflow-body col-8 offset-2 text-left" style="padding: 10px;">
                        <b-row>
                            <b-col sm="3">
                                <label for="title">主 题 : </label>
                            </b-col>
                            <b-col sm="9">
                                <b-form-input id="title" type="text" v-model="settings.title"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col sm="3">
                                <label for="description">描 述 : </label>
                            </b-col>
                            <b-col sm="9">
                                <b-form-input id="description" type="text" v-model="settings.description"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3 justify-content-end">
                            <b-form-group>
                                <b-form-radio-group
                                        v-model="settings.mode"
                                        :options="mode_options"
                                        name="setting-mode"
                                ></b-form-radio-group>
                            </b-form-group>
                        </b-row>
                        <b-row class="mt-3" v-for="(item, index) in settings.items" :key="'setting'+index">
                            <b-col sm="4">
                                <b-form-input type="text" v-model="item.itemTitle" disabled></b-form-input>
                            </b-col>
                            <b-col sm="8">
                                <b-form-input type="text" v-model="item.itemDescription" disabled></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col sm="4">
                                <b-form-input placeholder="itemTitle" type="text" v-model="new_item.itemTitle"></b-form-input>
                            </b-col>
                            <b-col sm="7">
                                <b-form-input placeholder="itemDescription" type="text" v-model="new_item.itemDescription"></b-form-input>
                            </b-col>
                            <b-col sm="1">
                                <b-button variant="primary" @click="addItem"
                                          :disabled="new_item.itemTitle === '' || new_item.itemDescription === ''"> + </b-button>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col sm="3" class="offset-9">
                                <b-button variant="primary" @click="saveSettings" class="w-100"
                                          :disabled="settings.title === '' || settings.description === '' || settings.items.length < 2">设置保存</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import workflowService from "@/services/workflowService";

export default {
    name: "select-decide-settings",
    components: { Loading },
    data() {
        return {
            nodeColumns: {
                sn: {
                    label: "序号",
                    sortable: false,
                    class: "text-right field-node-sn"
                },
                name: {
                    label: "环节名称",
                    sortable: false,
                    class: "text-left field-node-name"
                }
            },
            workflow: {},
            activeNodeIndex: 0, // 当前环节index
            process: {}, // 当前环节的程序模块
            flowNodes: [],
            roleAllcation: [],
            settings: {
                title: '',
                description: '',
                mode: 0,
                items: []
            },
            mode_options: [
                { text: '单选', value: 0 },
                { text: '多选', value: 1 }
            ],
            new_item: {
                itemTitle: '',
                itemDescription: ''
            }
        };
    },
    computed: {
        ...mapState(["userInfo", "flowStep"]),
        flowId() {
            return this.$route.params.flow_id;
        }
    },
    created() {
        this.$nextTick(() => {
            this.init();
        });
    },
    watch: {},
    methods: {
        ...mapActions(["setFlowStep"]),
        init() {
            this.run();
            let param = { flow_id: this.flowId };
            const apis = [
                workflowService.getWorkflowDetail(param),
                workflowService.getWorkflowRoleAllcation(param)
            ];
            Promise.all(apis)
                .then(response => {
                    this.workflow = response[0];
                    this.flowNodes = response[0].nodes;

                    this.roleAllcation = response[1].filter(item => item.process.type === 12);
                    if (this.roleAllcation.length > 0) {
                        this.process =
                            this.roleAllcation[0].process.type === 12
                                ? this.roleAllcation[0].process
                                : null;
                    }
                    this.nodeOnSelect(this.roleAllcation[0], 0);
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        querySelectDecideSeetings(flowNode) {
            this.run();
            workflowService
                .getSelectDecideSeetings({ flowNode_id: flowNode.id })
                .then(data => {
                    this.settings = data;
                    this.$emit("data-ready");
                });
        },
        // Click Node
        nodeOnSelect(item, index) {
            this.activeNodeIndex = index;
            this.process = item.process;
            this.roleAllcation.map(node => {
                this.$set(node, "_rowVariant", "");
                return node;
            });
            this.$set(item, "_rowVariant", "primary");
            if (item.process.type === 12) {
                this.querySelectDecideSeetings(item);
            } else {
                this.settings = [];
            }
        },
        addItem() {
            this.settings.items.push({itemTitle: this.new_item.itemTitle, itemDescription: this.new_item.itemDescription});
            this.new_item = {
                itemTitle: '',
                itemDescription: ''
            }
        },
        saveSettings() {
            this.run();
            workflowService
                .setSelectDecideSeetings({ flowNode_id: this.roleAllcation[this.activeNodeIndex].id, data: JSON.stringify(this.settings) })
                .then(data => {
                    if (data.results === 'success') {
                        this.$toasted.success("成 功");
                        this.$emit("data-ready");
                    } else {
                        this.$emit("data-failed");
                    }
                });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.select-decide-settings {
    .field-node-sn {
        vertical-align: middle;
        width: 15%;
    }
    .field-node-name {
        vertical-align: middle;
        width: 45%;
    }
    .field-node-process_name {
        vertical-align: middle;
        width: 40%;
    }
    .field-role-alloc-type {
        vertical-align: middle;
        width: 30%;
    }
    .field-role-alloc-name {
        vertical-align: middle;
        width: 30%;
    }
    .field-role-alloc-action {
        vertical-align: middle;
        width: 20%;
    }
    .field-role-alloc-image {
        vertical-align: middle;
        width: 20%;
    }
    select {
        height: 25px;
        border: 1px solid #b8bbc5;
    }
    .position-img {
        width: 25px;
        height: 25px;
        margin-right: 10px;
        border-radius: 12.5px;
        border: 2px solid #03a9f4;
    }
    .position-name {
        cursor: pointer;
        font-size: 12px;
        color: black;
    }
    .position-set:hover {
        text-decoration: none;
    }
}
</style>
