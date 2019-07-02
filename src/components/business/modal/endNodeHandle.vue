<template>
    <div>
        <loading v-if="isRunning"></loading>
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
            <b-modal centered hide-footer id="selectUse_to" ref="selectUse_to" title="关联课程">
                <div class="row">
                    <b-form-select
                        v-model="jumpProject.use_to_company"
                        class="col-7 offset-1"
                        :options="company_list"
                    ></b-form-select>
                    <b-button
                        variant="success"
                        class="float-center col-2 offset-1"
                        @click="queryJumpData(true)"
                    >确定</b-button>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script >
import { mapState } from "vuex";
import Radio from "@/views/components/radio/radio";
import RadioGroup from "@/views/components/radio/radio-group";
import businessService from "@/services/businessService";
import projectService from "@/services/projectService";
import groupService from "@/services/groupService";
import { ACTION_BUSINESS_NODE_END } from "@/components/business/common/actionCmds";
import Loading from "@/components/loading/Loading";
export default {
    components: { Radio, RadioGroup, Loading },
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
            jumpProject: {},
            company_list: []
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
        modalShow(val) {
            if (!val) {
                this.$emit("on-cancel");
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
            this.run();
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
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
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
                this.run();
                businessService.pushMessage({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    role_alloc_id: this.currentRoleAllocation.alloc_id,
                    type: "cmd",
                    msg: "结束并走向",
                    cmd: ACTION_BUSINESS_NODE_END,
                    data: JSON.stringify({ tran_id: tran.id })
                });
                this.modalShow = false;
                this.$emit("data-ready");
            } else {
                if (!tran.jump_project_id) {
                    this.$toasted.error("跳转环节没有配置");
                } else {
                    this.selectCompanyForJump(tran.jump_project_id);
                }
            }
        },
        cancelOk() {
            this.modalShow = false;
        },
        selectCompanyForJump(projectId) {
            this.run();
            projectService
                .getProjectDetail({
                    project_id: projectId
                })
                .then(data => {
                    this.jumpProject = data;
                    if (this.jumpProject.created_role == 2) {
                        groupService
                            .getCompanyListOfGroup({
                                groupID: this.jumpProject.group_id
                            })
                            .then(res => {
                                this.company_list = res.results;
                                this.$emit("data-ready");
                                this.$refs["selectUse_to"].show();
                            });
                    } else {
                        this.queryJumpData();
                        this.$emit("data-ready");
                    }
                })
                .catch(() => {});
        },
        queryJumpData(is_group = false) {
            if (!this.jumpProject.use_to_company) {
                this.$toasted.error("You must select company");
                return;
            }
            this.$refs["selectUse_to"].hide();
            this.modalShow = false;
            let param = is_group
                ? {
                      business_id: this.$route.params.bid,
                      project_id: this.jumpProject.id,
                      use_to: this.jumpProject.use_to_company
                  }
                : {
                      business_id: this.$route.params.bid,
                      project_id: this.jumpProject.id
                  };
            businessService
                .jumpStart(param)
                .then(() => {})
                .catch(() => {});
        }
    }
};
</script>
<style>
</style>
