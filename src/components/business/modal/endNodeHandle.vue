<template>
    <div class="end-node-wrap">
        <b-modal v-model="modalShow" centered title="结束并走向选项">
            <div class="node-trans-modal">
                <div v-if="trans.length === 1" class="only-one">
                    <div class="modal-msg">
                        <p class="message">确定要结束本环节并进入下一环节吗？</p>
                        <p class="tip">下一步：{{trans[0].condition}}</p>
                    </div>
                </div>
                <div v-if="trans.length > 1" class="multi-select-container">
                    <div class="modal-msg">
                        <p class="message">请选择以下选项</p>
                        <p class="tip">只有选择正确才能进入下一环节</p>
                    </div>
                    <div class="template-modal-content">
                        <Radio-group v-model="selectedTran" vertical>
                            <Radio
                                v-for="(tran, index) in trans"
                                :label="tran"
                                :key="index"
                            >{{index + 1}}、{{tran.condition ? tran.condition : ''}}</Radio>
                        </Radio-group>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="w-100">
                <b-button variant="primary" class="float-center mr-2" @click="okHandler()">确定</b-button>
                <b-button variant="secondary" class="float-center" @click="cancelOk()">取消</b-button>
            </div>
        </b-modal>
    </div>
</template>
<script >
import { mapState } from "vuex";
import Radio from "@/views/components/radio/radio";
import checkbox from "@/views/components/checkbox/checkbox";
import RadioGroup from "@/views/components/radio/radio-group";
// import teamMemberModal from 'pages/common/teamMemberModal'
import businessService from "@/services/businessService";
import projectService from "@/services/projectService";
import { gender } from "@/filters/fun";
import { ACTION_BUSINESS_NODE_END } from "@/components/business/common/actionCmds";
export default {
    components: { Radio, checkbox, RadioGroup },
    filters: { gender },
    props: {
        isCommit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            modalShow: false,
            trans: [],
            selectedTran: null,
            jumpModalShow: false,
            jumpProjectId: null,
            role_allocs: []
        };
    },
    computed: {
        ...mapState(["userInfo", "meta"]),
        metaInfo() {
            return this.meta.info;
        },
        currentRoleAllocation() {
            return this.meta.currentRoleAllocation;
        }
    },
    watch: {
        isCommit(val) {
            if (val) {
                this.queryWorkflowTrans();
            }
        },
        $route() {
            this.init();
        }
    },
    methods: {
        init() {
            this.trans = [];
            this.selectedTran = null;
        },
        queryWorkflowTrans() {
            businessService
                .queryWorkflowTrans({
                    node_id: this.$route.params.nid,
                    flow_id: this.metaInfo.flow_id,
                    project_id: this.metaInfo.project.id,
                    direction: "forward"
                })
                .then(data => {
                    if (data.length === 0) {
                        return;
                    }
                    this.trans = data;
                    this.modalShow = true;
                });
        },
        okHandler() {
            if (this.trans.length > 1) {
                if (!this.selectedTran) {
                    this.$toasted.error("请选择一个分支环节");
                    return;
                }
                if (!this.selectedTran.id) {
                    this.$toasted.error("选择错误");
                    return;
                }
                this.transHandler(this.selectedTran);
            } else if (this.trans.length === 1) {
                this.transHandler(this.trans[0]);
            }
        },
        transHandler(tran) {
            if (tran.process_type !== 6) {
                businessService.pushMessage({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    role_alloc_id: this.currentRoleAllocation.alloc_id,
                    type: "cmd",
                    msg: "结束并走向",
                    cmd: ACTION_BUSINESS_NODE_END,
                    data: JSON.stringify({ tran_id: tran.id })
                });
                this.$emit("on-end");
            } else {
                let first = tran;
                if (!first.jump_project_id) {
                    this.$toasted.error("跳转环节没有配置");
                } else {
                    this.jumpProjectId = first.jump_project_id;
                    this.queryJumpData(first.jump_project_id);
                }
            }
        },
        cancelOk() {
            this.modalShow = false;
            this.$emit("on-cancel");
        },
        queryJumpData(projectId) {
            console.log(projectId)
            console.log(this.currentRoleAllocation)
            console.log(this.metaInfo)
            // projectService
            //     .getProjectDetail({
            //         project_id: projectId
            //     })
            //     .then(data => {
            //         data.role_allocs.forEach(role_alloc => {
            //             this.$set(role_alloc, "user_id", null);
            //             this.$set(role_alloc, "is_disabled", false);
            //             this.$set(role_alloc, "is_right", false);
            //         });
            //         this.role_allocs = data.role_allocs;
            //         data.role_allocs.forEach(role_alloc => {
            //             if (this.roleTypes.indexOf(role_alloc.type) === -1) {
            //                 this.roleTypes.push(role_alloc.type);
            //             }
            //         });
            //         console.log(this.metaInfo);
            //         // 获取小组成员
            //         this.members = this.metaInfo.team;
            //         this.activeMemberIndex = 0;
            //         this.roleRightData(this.metaInfo.team[0].id);
            //         this.showType = 2;
            //     });
            // businessService.jumpStart({
            //     business_id: this.$route.params.bid,
            //     project_id: projectId
            // })
        }
        // 确定角色分配，并进行跳转
        // jumpOKHandle(event) {
        //     if (!this.jumpProjectId) return;
        //     event.target.disabled = true;
        //     setTimeout(function() {
        //         event.target.disabled = false;
        //     }, 500);
        //     let roleData = this.rolesForRight.map(role => {
        //         return {
        //             id: role.id,
        //             name: role.role_name,
        //             type: role.type,
        //             user_id: role.user_id
        //         };
        //     });
        //     businessService
        //         .jumpStart({
        //             experiment_id: this.$route.params.eid,
        //             project_id: this.jumpProjectId,
        //             data: JSON.stringify(roleData)
        //         })
        //         .then(data => {
        //             this.$toasted.success("设置成功，即将跳转");
        //             if (data.tran_id && data.project_id) {
        //                 businessService.pushMessage({
        //                     experiment_id: this.$route.params.eid,
        //                     node_id: this.$route.params.nid,
        //                     role_id: this.currentRole.id,
        //                     type: "cmd",
        //                     msg: "结束并走向跳转项目",
        //                     cmd: ACTION_BUSINESS_NODE_END,
        //                     data: JSON.stringify({
        //                         tran_id: data.tran_id,
        //                         project_id: data.project_id
        //                     })
        //                 });
        //                 this.showType = 0;
        //                 this.$emit("on-end");
        //             } else {
        //                 this.$toasted.error("参数错误不可跳转");
        //             }
        //         });
        // }
    }
};
</script>
<style>
</style>
