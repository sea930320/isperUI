<template>
    <div class="position-settings">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv px-0">
            <b-col md="3" sm="12">
                <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
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
            <b-col md="5" sm="12">
                <div class style="height: 460px; border: 1px solid #eaeaea; overflow: hidden">
                    <h3 class="aside-paint-title">&nbsp;&nbsp;{{process ? process.name : ''}}</h3>
                    <div v-if="flowNodeRoles.length == 0" class="not-anime">
                        <p class="text">非动画模块无法展示</p>
                    </div>
                    <div v-else class="workflow-body" style="padding: 10px;">
                        <img :src="process.image" alt width="100%" height="100%">
                    </div>
                </div>
            </b-col>
            <b-col md="4" sm="12">
                <div class style="height: 460px; border: 1px solid #eaeaea; overflow: auto">
                    <table
                        class="table b-table table-hover table-borderless table-sm role-allocation"
                    >
                        <thead role="rowgroup">
                            <tr>
                                <th class="text-center field-role-alloc-type">身份类型</th>
                                <th class="text-center field-role-alloc-name">身份名称</th>
                                <th class="text-center field-role-alloc-image">身份形象</th>
                                <th class="text-center field-role-alloc-action">配置动作</th>
                            </tr>
                        </thead>
                        <tbody role="rowgroup">
                            <tr
                                class="tr-allocation"
                                v-for="(item, index) in flowNodeRoles"
                                :key="index"
                            >
                                <td>{{item.role_type}}</td>
                                <td>{{item.role_name}}</td>
                                <td>
                                    <a
                                        href="javascript:;"
                                        class="btn-link position-set"
                                        @click="setImage(item)"
                                    >
                                        <template v-if="item.image">
                                            <img :src="item.image.file || item.image.avatar" class="position-img">
                                            <span
                                                class="position-name"
                                            >{{item.image.name}}({{item.image.gender == 1 ? '男':'女'}})</span>
                                        </template>
                                        <icon v-else name="portrait"></icon>
                                    </a>
                                </td>
                                <td>
                                    <select
                                        name="position"
                                        v-model="item.position_id"
                                        @change="changePosition(item)"
                                    >
                                        <option value>----</option>
                                        <option
                                            v-for="(item, index) in flowNodePositions"
                                            :value="item.id"
                                            :key="index"
                                        >{{item.position}}</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-col>
        </b-row>
        <!-- 添加角色Modal -->
        <role-alloc-image-modal @on-ok="setRoleAllocImageConfirm"></role-alloc-image-modal>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/loading/Loading";
import workflowService from "@/services/workflowService";
import RoleAllocImageModal from "@/components/workflow/role-alloc-image-modal";

export default {
    name: "position-settings",
    components: { Loading, RoleAllocImageModal },
    data() {
        return {
            nodeColumns: {
                sn: {
                    label: "序号",
                    sortable: false,
                    class: "text-center field-node-sn"
                },
                name: {
                    label: "环节名称",
                    sortable: false,
                    class: "text-center field-node-name"
                }
            },
            workflow: {},
            activeNodeIndex: 0, // 当前环节index
            process: {}, // 当前环节的程序模块
            flowNodes: [],
            flowNodeRoles: [],
            roleAllcation: [],
            flowNodePositions: [],
            selectedAlloc: null
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

                    this.roleAllcation = response[1];
                    if (this.roleAllcation.length > 0) {
                        this.process =
                            this.roleAllcation[0].process.type === 1
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
        queryProcessPositions(flow) {
            workflowService
                .getProcessPositions({ process_id: flow.process.id })
                .then(data => {
                    this.flowNodePositions = data;
                    this.flowNodeRoles =
                        flow.process.type == 1 ? flow.allocation_list : [];
                });
        },
        // 删选环节对应的角色分配数据
        getFlowNodeRoles() {
            if (this.flowNodes.length === 0) return [];
            this.flowNodeRoles = this.roleAllcation.filter(item => {
                return item.node_id === this.flowNodes[this.activeNodeIndex].id;
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
            if (item.process.type == 1) {
                this.queryProcessPositions(item);
            } else {
                this.flowNodeRoles = [];
            }
        },
        // 切换站位
        changePosition(role) {
            if (!this.flowId || this.flowNodes.length < 1) {
                return;
            }
            workflowService.updateRolePosition({
                flow_id: this.flowId,
                node_id: this.flowNodes[this.activeNodeIndex].id,
                role_id: role.role_id,
                no: role.no,
                position_id: role.position_id
            });
        },
        setImage(alloc) {
            this.selectedAlloc = alloc;
            this.selectedAlloc["node_id"] = this.flowNodes[
                this.activeNodeIndex
            ].id;
            this.$emit("openRoleAllocImageModal", alloc);
        },
        setRoleAllocImageConfirm(roleAlloc) {
            this.selectedAlloc.image = roleAlloc.image;
            this.selectedAlloc.image_id = roleAlloc.image.id;
            this.run();
            workflowService
                .updateWorkflowRoleAllocImage(this.selectedAlloc)
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
.position-settings {
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