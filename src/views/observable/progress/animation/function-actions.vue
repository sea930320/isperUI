<template>
    <div class="function-action-wrapper">
        <div class="action-container clearfix">
            <a v-for="(action, index) in functionActions" :key="action.name + index"
               :class="['col-xs-3', 'btn-ex', {'btn-primary': !action.disable, 'btn-ex-blue': action.disable}]"
               href="javascript:"
               @click="commitAction(action)">
                {{action.name}}
            </a>
        </div>
        <div class="modals-wrapper">
            <!-- 请入Modal -->
            <b-modal :visible="modalShow === 1" centered title="选择被请入角色" @ok="roleLetinOk()" @hidden="modalShow = 0">
                <div v-if="roleInList.length === 0" class="modal-msg">
                    <p class="message">当前没有可被请入的角色</p>
                </div>
                <div v-else class="row">
                    <checkboxGroup v-model="roleInArr">
                        <div class="col-xs-3" v-for="(role, index) in roleInList" :key="role.name + index">
                            <checkbox :label="role.name" :value="role"></checkbox>
                        </div>
                    </checkboxGroup>
                </div>
            </b-modal>
            <!-- 送出Modal -->
            <b-modal :visible="modalShow === 2" centered title="选择被送出角色" @ok="roleLetoutOk()" @hidden="modalShow = 0">
                <div v-if="roleOutList.length === 0" class="modal-msg">
                    <p class="message">当前没有可被送出的角色</p>
                </div>
                <div v-else class="row">
                    <checkboxGroup v-model="roleOutArr">
                        <div class="col-xs-3" v-for="(role, index) in roleOutList" :key="role.name + index">
                            <checkbox :label="role.name" :value="role"></checkbox>
                        </div>
                    </checkboxGroup>
                </div>
            </b-modal>
            <!-- 约见 -->
            <b-modal :visible="modalShow === 3" centered title="约见" @ok="meetApplyOk()" @hidden="modalShow = 0">
                <div class="modal-msg">
                    <p class="message">确定提交约见申请？</p>
                </div>
            </b-modal>
            <!-- 申请发言 -->
            <b-modal :visible="modalShow === 4" centered title="申请发言" @ok="speakApplyOk()" @hidden="modalShow = 0">
                <div class="modal-msg">
                    <p class="message">确定向主持人提交发言申请？</p>
                </div>
            </b-modal>
            <!-- 表达管理 -->
            <b-modal :visible="modalShow === 5" centered title="表达管理" @ok="bannedOk()" ok-title="是" cancel-title="否" @hidden="modalShow = 0">
                <div class="modal-msg">
                    <p class="message">{{metaInfo.isBanned ? '是否取消发言、提交、展示控制' : '是否启动发言、提交、展示控制'}}</p>
                </div>
            </b-modal>
            <!-- 提交modal -->
            <upload-modal :modalShow="modalShow === 7" @on-uploadConfirm="submitDocOk" @on-cancel="modalShow = 0"></upload-modal>
            <!-- 展示modal -->
            <b-modal :visible="modalShow === 8" centered title="展示" :showPerson="true" @ok="displayOkHandler()" @hidden="modalShow = 0">
                <div v-if="displayFiles.length === 0" class="modal-msg">
                    <p class="message">没有任何可供展示的文件，请先上传</p>
                </div>
                <div v-else class="modal-msg">
                    <p class="message">请选择要申请展示的文件？</p>
                    <p class="tip">以下是实验中提交过的所有文件，一次只能选择一个</p>
                    <div class="detail max-hight-box">
                        <table class="table table-gray table-striped table-hover table-border">
                            <thead>
                            <tr>
                                <th>文件名称</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(file, index) in displayFiles" :key="'m' + index"
                                :class="{'tr-choose': index === activeDocIndex}"
                                @click="activeDocIndex = index">
                                <td><a :href="file.url" class="btn-underline" target="_blank">{{file.filename}}</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </b-modal>
            <!-- 要求签字 -->
            <b-modal :visible="modalShow === 9" centered title="选择需要签字的文件" :ok-only="true" @ok="requestSignOk()" @hidden="modalShow = 0">
                <div class="detail">
                    <div class="max-hight-box">
                        <table class="table table-gray table-striped table-hover table-border">
                            <thead>
                            <tr>
                                <th>文件名称</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(file, index) in displayFiles" :key="'n' + index"
                                :class="{'tr-choose': index === activeDocIndex}"
                                @click="activeDocIndex = index">
                                <td><a :href="file.url" class="btn-underline" target="_blank">{{file.filename}}</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 class="mr">要求签字的人员</h3>
                    <div class="max-hight-box">
                        <div class="row">
                            <radioGroup v-model="signRole">
                                <div class="col-xs-3" v-for="(role, index) in signRoles" :key="role.name + index">
                                    <radio :label="role">{{role.name}}</radio>
                                </div>
                            </radioGroup>
                        </div>
                    </div>
                </div>
            </b-modal>
            <!-- 安排报告 -->
            <b-modal :visible="modalShow === 10" centered title="选择需要安排报告的人员" :ok-only="true" @ok="requestReportOk()" @hidden="modalShow = 0">
                <div class="row text-left mx-5">
                    <radioGroup v-model="reportRole">
                        <div class="col-xs-3" v-for="(role, index) in roleReportList" :key="'r' + index">
                            <radio :label="role">{{role.name}}</radio>
                        </div>
                    </radioGroup>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
    import checkbox from '@/views/components/checkbox/checkbox'
    import checkboxGroup from '@/views/components/checkbox/checkbox-group'
    import radio from '@/views/components/radio/radio'
    import radioGroup from '@/views/components/radio/radio-group'
    // import modal from '@/views/components/modal/modal'
    import uploadModal from "@/components/common/uploadModal";
    import * as actionCmd from "@/components/business/common/actionCmds"
    import businessService from "@/services/businessService";
    import {mapState} from 'vuex'

    export default {
        name: 'MetaCourtFunctionBtns',
        components: {
            checkbox, checkboxGroup, radio, radioGroup, uploadModal
        },
        data() {
            return {
                // 0,隐藏 1,请入
                modalShow: 0,
                // 请入角色数据
                roleInList: [],
                // 请出角色数据
                roleOutList: [],
                // 可被安排报告的人
                roleReportList: [],
                // 已勾选的请入角色数据
                roleInArr: [],
                // 已勾选的请出角色数据
                roleOutArr: [],
                // 可供展示的文件
                displayFiles: [],
                // 可供选择签字的角色
                signRoles: [],
                // 选择签字的角色
                signRole: null,
                reportRole: null,
                uploadUrl: '/api/business/docs/create',
                docSubmitParam: {},
                activeDocIndex: 0
            }
        },
        computed: {
            ...mapState({
                metaInfo: state => state.meta.info,
                currentRoleAllocation: state => state.meta.currentRoleAllocation,
                functionActions: state => state.meta.function_actions,
                roles: state => state.meta.info.role_status
            }),
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                if (!this.metaInfo || !this.currentRoleAllocation) return;
                this.docSubmitParam = {
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    role_alloc_id: this.currentRoleAllocation.alloc_id,
                    cmd: actionCmd.ACTION_DOC_SUBMIT
                }
            },
            // 发送命令消息
            sendCMDMessage(msg, cmd, param, data) {
                businessService.pushMessage({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    role_alloc_id: this.currentRoleAllocation.alloc_id,
                    msg: msg,
                    type: 'cmd',
                    cmd: cmd,
                    param: param,
                    data: data
                })
            },
            // 触发动作
            commitAction(action) {
                if (action.disable) {
                    this.$toasted.info('当前无权操作该功能');
                    return
                }
                switch (action.cmd) {
                    case actionCmd.ACTION_ROLE_SHOW:
                        this.sendCMDMessage(
                            '入席',
                            actionCmd.ACTION_ROLE_SHOW,
                            null
                        );
                        break;
                    case actionCmd.ACTION_ROLE_HIDE:
                        this.sendCMDMessage(
                            '退席',
                            actionCmd.ACTION_ROLE_HIDE,
                            null
                        );
                        break;
                    case actionCmd.ACTION_ROLE_STAND:
                        this.sendCMDMessage(
                            '起立',
                            actionCmd.ACTION_ROLE_STAND,
                            null
                        );
                        break;
                    case actionCmd.ACTION_ROLE_SITDOWN:
                        this.sendCMDMessage(
                            '坐下',
                            actionCmd.ACTION_ROLE_SITDOWN,
                            null
                        );
                        break;
                    case actionCmd.ACTION_ROLE_LETIN:
                        businessService
                            .getBusinessRoleInList({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                role_alloc_id: this.currentRoleAllocation.alloc_id
                            })
                            .then(data => {
                                this.roleInList = data;
                                this.roleInArr = [];
                                this.modalShow = 1
                            });
                        break;
                    case actionCmd.ACTION_ROLE_LETOUT:
                        businessService
                            .getBusinessRoleOutList({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                role_alloc_id: this.currentRoleAllocation.alloc_id
                            })
                            .then(data => {
                                this.roleOutList = data;
                                this.roleOutArr = [];
                                this.modalShow = 2
                            });
                        break;
                    case actionCmd.ACTION_ROLE_MEET:
                        this.modalShow = 3;
                        break;
                    case actionCmd.ACTION_ROLE_APPLY_SPEAK:
                        if (this.currentRoleAllocation.can_terminate) {
                            this.$toasted.info('您是主持人始终拥有发言权限，无须申请发言');
                            return
                        }
                        if (!this.metaInfo.isBanned) {
                            this.$toasted.info('当前未启动表达管理，无须申请发言');
                            return
                        }
                        this.modalShow = 4;
                        break;
                    case actionCmd.ACTION_ROLE_BANNED:
                        if (!this.currentRoleAllocation.can_terminate) {
                            this.$toasted.error('您无权操作表达管理');
                            return
                        }
                        this.modalShow = 5;
                        break;
                    case actionCmd.ACTION_DOC_SUBMIT:
                        if (action.disable) {
                            this.$toasted.info('当前无权操作该功能');
                            return
                        }
                        this.docSubmitParam.cmd = actionCmd.ACTION_DOC_SUBMIT;
                        this.modalShow = 7;

                        this.$emit("openUploadModal", {
                            uploadUrl: "/api/business/docs/create",
                            uploadParams: this.docSubmitParam,
                            title: "提交上传文件",
                            cancelHide: true,
                            okText: "提交",
                        });
                        break;
                    case actionCmd.ACTION_DOC_APPLY_SUBMIT:
                        if (this.currentRoleAllocation.can_terminate) {
                            this.$toasted.info('您是主持人拥有所有权限，无须申请提交');
                            return
                        }
                        if (!this.metaInfo.isBanned) {
                            this.$toasted.info('当前未启动表达管理，无须申请提交');
                            return
                        }
                        this.sendCMDMessage('申请提交文件', actionCmd.ACTION_DOC_APPLY_SUBMIT);
                        break;
                    case actionCmd.ACTION_DOC_SHOW:
                        businessService
                            .getBusinessDisplayList({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                path_id: this.metaInfo.path_id,
                                is_paging: 0
                            })
                            .then(data => {
                                this.displayFiles = data.results
                            });
                        this.modalShow = 8;
                        break;
                    case actionCmd.ACTION_DOC_APPLY_SHOW:
                        if (this.currentRoleAllocation.can_terminate) {
                            this.$toasted.info('您是主持人拥有所有权限，无须申请展示');
                            return
                        }
                        if (!this.metaInfo.isBanned) {
                            this.$toasted.info('当前未启动表达管理，无须申请展示');
                            return
                        }
                        this.sendCMDMessage('申请展示', actionCmd.ACTION_DOC_APPLY_SHOW);
                        // this.modalShow = 9
                        break;
                    case actionCmd.ACTION_ROLE_REQUEST_SIGN:
                        businessService
                            .getBusinessDisplayList({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                path_id: this.metaInfo.path_id,
                                is_paging: 0
                            })
                            .then(data => {
                                this.displayFiles = data.results;
                                this.modalShow = 9
                            });
                        businessService
                            .querySignRoles({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                role_alloc_id: this.currentRoleAllocation.alloc_id
                            })
                            .then(data => {
                                this.signRoles = data
                            });
                        break;
                    case actionCmd.ACTION_ROLE_SCHEDULE_REPORT:
                        businessService
                            .getReportRoles({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid
                            })
                            .then(data => {
                                this.roleReportList = data;
                                this.modalShow = 10
                            });
                        break;
                    case actionCmd.ACTION_ROLE_TOWARD_REPORT:
                        this.sendCMDMessage(
                            `走向发言席`,
                            actionCmd.ACTION_ROLE_TOWARD_REPORT,
                            null,
                            null
                        );
                        break;
                    case actionCmd.ACTION_ROLE_END_REPORT:
                        this.sendCMDMessage(
                            `走下发言席`,
                            actionCmd.ACTION_ROLE_END_REPORT,
                            null,
                            null
                        );
                        break
                }
            },
            // 请入角色确定
            roleLetinOk() {
                if (this.roleInList.length === 0) {
                    this.modalShow = 0;
                    return
                }
                if (this.roleInArr.length === 0) {
                    this.$toasted.error('请选择需要请入的角色');
                    return false
                }
                let roleInNames = this.roleInArr.map((role) => {
                    return role.name
                });
                let roleInIds = this.roleInArr.map(role => role.id);
                // console.log(roleInNames)
                this.sendCMDMessage(`请入 ${roleInNames.join('、')}`, actionCmd.ACTION_ROLE_LETIN, null, JSON.stringify(roleInIds));
                this.modalShow = 0
            },
            // 请出角色确定
            roleLetoutOk() {
                if (this.roleOutList.length === 0) {
                    this.modalShow = 0;
                    return
                }
                if (this.roleOutArr.length === 0) {
                    this.$toasted.error('请选择需要送出的角色');
                    return false
                }
                let roleOutNames = this.roleOutArr.map((role) => {
                    return role.name
                });
                let roleOutIds = this.roleOutArr.map(role => role.id);
                this.sendCMDMessage(`送出 ${roleOutNames.join('、')}`, actionCmd.ACTION_ROLE_LETOUT, null, JSON.stringify(roleOutIds));
                this.modalShow = 0
            },
            // 申请约见确定
            meetApplyOk() {
                this.sendCMDMessage('申请约见成功，已加入请入列表', actionCmd.ACTION_ROLE_MEET);
                this.modalShow = 0
            },
            // 确定提交文件
            submitDocOk(docs) {
                let docIds = docs.map((doc) => {
                    return doc.id
                });
                this.sendCMDMessage('提交文件：' + docs.map(doc => doc.name).join('、'), actionCmd.ACTION_DOC_SUBMIT, null, JSON.stringify(docIds));
                this.modalShow = 0
            },
            // 展示确定操作
            displayOkHandler() {
                if (this.displayFiles.length === 0) {
                    this.modalShow = 0
                } else {
                    let doc = this.displayFiles[this.activeDocIndex];
                    this.sendCMDMessage(`展示文件: ${doc.filename}`, actionCmd.ACTION_DOC_SHOW, null, JSON.stringify({doc_id: doc.id}))
                }
                this.modalShow = 0
            },
            // 申请上传展示文件确定
            submitDocShowOk(docs) {
                let docIds = docs.map((doc) => {
                    return doc.id
                });
                let msg = '申请展示(请主持人处理)';
                this.sendCMDMessage(msg, actionCmd.ACTION_DOC_APPLY_SHOW, null, JSON.stringify(docIds));
                this.modalShow = 0
            },
            // 申请发言确定
            speakApplyOk() {
                let msg = '申请发言';
                this.sendCMDMessage(msg, actionCmd.ACTION_ROLE_APPLY_SPEAK);
                this.modalShow = 0
            },
            // 启动表达管理
            bannedOk() {
                let controlStatus = this.metaInfo.isBanned ? 1 : 2;
                let msg = this.metaInfo.isBanned ? '取消表达管理' : '启动表达管理';
                this.sendCMDMessage(msg, actionCmd.ACTION_ROLE_BANNED, null, JSON.stringify({'control_status': controlStatus}));
                this.modalShow = 0
            },
            // 要求签字确定
            requestSignOk() {
                if (this.displayFiles.length === 0) {
                    this.$toasted.error('当前没有可签字的文件，请先上传');
                    return
                }
                let selectDoc = this.displayFiles[this.activeDocIndex];
                if ('docx'.indexOf(selectDoc.filename.substring(selectDoc.filename.lastIndexOf('.') + 1).toLowerCase()) === -1) {
                    this.$toasted.error('您选择的文件不是docx格式的，无法签名，请重新选择');
                    return
                }
                if (!this.signRole || !this.signRole.id) {
                    this.$toasted.error('请选择要签字的对象');
                    return
                }
                this.sendCMDMessage(
                    `${this.signRole.name}，请您在《${selectDoc.filename}》上签字`,
                    actionCmd.ACTION_ROLE_REQUEST_SIGN,
                    null,
                    JSON.stringify({
                        'doc_id': selectDoc.id,
                        'doc_name': selectDoc.filename,
                        'role_alloc_id': this.signRole.id,
                        'role_name': this.signRole.name
                    })
                );
                this.modalShow = 0
            },
            // 确定安排报告
            requestReportOk() {
                if (!this.reportRole) {
                    this.$toasted.error('你未选择需要安排报告的人员');
                    return
                }
                this.sendCMDMessage(
                    `${this.reportRole.name}将向大会作报告`,
                    actionCmd.ACTION_ROLE_SCHEDULE_REPORT,
                    null,
                    JSON.stringify({role_alloc_id: this.reportRole.id, role_name: this.reportRole.name})
                );
                this.modalShow = 0
            }
        },
        watch: {
            $route(to) {
                this.docSubmitParam = {
                    business_id: to.params.bid,
                    node_id: to.params.nid,
                    role_id: this.currentRoleAllocation.alloc_id,
                    cmd: actionCmd.ACTION_DOC_SUBMIT
                }
            },
            modalShow(val) {
                if (val === 1) {
                    this.roleInArr = []
                }
                if (val === 2) {
                    this.roleOutArr = []
                }
            },
            'currentRoleAllocation': {
                handler(data) {
                    if (data) {
                        this.docSubmitParam = {
                            business_id: this.$route.params.bid,
                            node_id: this.$route.params.nid,
                            role_id: data.id,
                            cmd: actionCmd.ACTION_DOC_SUBMIT
                        }
                    }
                },
                deep: true
            }
        }
    }
</script>
