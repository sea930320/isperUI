<template>
    <div class="end-node-wrap">
        <b-modal :visible="showType === 1" centered title="结束并走向选项" :showPerson="true" @ok="okHandler()" @hidden="cancelOk()">
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
                            <Radio v-for="(tran, index) in trans" :label="tran" :key="index" >
                                {{index + 1}}、{{tran.condition ? tran.condition : ''}}
                            </Radio>
                        </Radio-group>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal :visible="showType === 2" centered title="跳转设置" @hidden="cancelOk()">
            <h3>下一环节是跳转环节，请先配置要跳转项目的角色</h3>
            <p class="tip">如果组员数大于可选角色数，有些组员将无法配置角色；如果组员数小于等于角色数，所有角色必须被分配。</p>
            <div class="role-set-wrap">
                <div class="row">
                    <div class="col-xs-6">
                        <div class="member-table-handler clearfix">
                            <span class="fl text_blue member-text">小组成员</span>
                            <a href="javascript:" class="btn-spe btn-del fr" @click="delMembersBtn">删除小组成员</a>
                            <a href="javascript:" class="btn-spe btn-add fr" @click="addMembersBtn">增加小组成员</a>
                        </div>
                        <div class="table-wrapper table-fixed-header">
                            <div class="table-header">
                                <table class="table table-green table-tac">
                                    <colgroup>
                                        <col width="10%">
                                        <col width="20%">
                                        <col width="30%">
                                        <col width="30%">
                                        <col width="10%">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>用户号</th>
                                        <th>用户名</th>
                                        <th>姓名</th>
                                        <th>性别</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-body h440">
                                <table class="table table-green table-tac table-striped table-hover">
                                    <colgroup>
                                        <col width="10%">
                                        <col width="20%">
                                        <col width="30%">
                                        <col width="30%">
                                        <col width="10%">
                                    </colgroup>
                                    <tbody>
                                    <tr v-for="(member, index) in members" :key="index" :class="{'tr-choose': activeMemberIndex === index}" @click="selectMember(member,index)">
                                        <td>{{index + 1}}</td>
                                        <td>{{member.id}}</td>
                                        <td>{{member.username}}</td>
                                        <td>{{member.name}}</td>
                                        <td>{{member.gender | gender}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="member-table-handler">
                            <span class="text_blue member-text">待选角色</span>
                            <a href="javascript:" class="btn-spe btn-add fr" @click="randomAssign">随机分配</a>
                        </div>
                        <div class="table-wrapper table-fixed-header">
                            <div class="table-header">
                                <table class="table table-green table-tac">
                                    <colgroup>
                                        <col width="40%">
                                        <col width="60%">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>
                                            <div class="thead-top">分配权限</div>
                                            <div class="thead-bottom" v-if="members.length === 1"><checkbox v-model="allCheck"></checkbox>全选</div>
                                        </th>
                                        <th>角色名</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-body h440">
                                <table class="table table-green table-striped table-hover">
                                    <colgroup>
                                        <col width="40%">
                                        <col width="60%">
                                    </colgroup>
                                    <tbody>
                                    <tr v-for="(role, index) in roles" :key="index">
                                        <td><checkbox v-model="role.is_right" :disabled="role.is_disabled" @on-change="checkRight(role)"></checkbox></td>
                                        <td>{{role.role_name}}</td>
                                    </tr>
                                    <!-- <template v-for="type in roleTypes">
                                      <tr>
                                        <td colspan="4" class="check-style">{{type}}</td>
                                      </tr>
                                      <tr v-for="role in roles">
                                        <td><checkbox v-model="role.is_right" :disabled="role.is_disabled" @on-change="checkRight(role)"></checkbox></td>
                                        <td>{{role.name}}</td>
                                      </tr>
                                    </template> -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" slot="footer">
                <button class="btn btn-blue"  @click="jumpOKHandle($event)">确定</button>
                <button class="btn btn-green" @click="cancelOk">取消</button>
            </div>
        </b-modal>
<!--        <teamMemberModal :show="teamMemberModal" :members="members" @add-member="addMemberOk" @on-cancel="teamMemberModal = false"></teamMemberModal>-->
        <!-- 删除流程Modal -->
        <b-modal :visible="deleteModal" centered title="删除提醒" :showPerson="true" @ok="delMemberConfirm()" @cancel="deleteModal=false">
            <div class="modal-msg">
                <p class="message">是否确认删除当前选中的小组成员</p>
                <!-- <p class="tip">{{members[activeMemberIndex]}}</p> -->
            </div>
        </b-modal>
    </div>
</template>
<script >
import { mapState } from "vuex";
import Radio from '@/views/components/radio/radio'
import checkbox from '@/views/components/checkbox/checkbox'
import RadioGroup from '@/views/components/radio/radio-group'
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
            // 弹框显示类型，1：普通，2：跳转
            showType: 0,
            modalShow: false,
            jumpModalShow: false,
            teamMemberModal: false,
            deleteModal: false,
            selectedTran: null,
            trans: [],
            // 要跳转的项目id
            jumpProjectId: null,
            activeMemberIndex: -1,
            // 跳转设置数据
            roles: [],
            members: [],
            roleTypes: [],
            // 绑定权限属性的角色
            rolesForRight: []
        };
    },
    computed: {
        ...mapState(["userInfo", "meta"]),
        metaInfo() {
            return this.meta.info;
        },
        currentRoleAllocation() {
            return this.meta.currentRoleAllocation;
        },
        allCheck: {
            get() {
                return (
                    this.rolesForRight.length > 0 &&
                    this.rolesForRight.every(role => {
                        return role.is_right;
                    })
                );
            },
            set(val) {
                this.rolesForRight.forEach(role => {
                    role.is_right = val;
                    role.is_right
                        ? (role.user_id = this.members[0].id)
                        : (role.user_id = null);
                });
            }
        }
    },
    watch: {
        isCommit(val) {
            if (val === false) {
                this.modalShow = false;
            } else {
                this.queryWorkflowTrans();
                this.modalShow = true;
            }
        },
        $route() {
            this.init();
        }
    },
    methods: {
        init() {
            this.showType = 0;
            this.trans = [];
            this.selectedTran = null;
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
                // this.modalShow = false
                this.$emit("on-cancel");
            }
            this.showType = 0;
        },
        cancelOk() {
            this.showType = 0;
            this.modalShow = false;
            this.$emit("on-cancel");
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
                    this.showType = 1;
                });
        },
        queryJumpData(projectId) {
            projectService
                .getProjectDetail({
                    project_id: projectId
                })
                .then(data => {
                    data.roles.forEach(role => {
                        this.$set(role, "user_id", null);
                        this.$set(role, "is_disabled", false);
                        this.$set(role, "is_right", false);
                        // this.allCheck = false
                    });
                    this.roles = data.roles;
                    data.roles.forEach(role => {
                        if (this.roleTypes.indexOf(role.type) === -1) {
                            this.roleTypes.push(role.type);
                        }
                    });
                    // 获取小组成员
                    this.members = this.metaInfo.team;
                    this.activeMemberIndex = 0;
                    this.roleRightData(this.metaInfo.team[0].id);
                    this.showType = 2;
                });
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
        // 角色按类型过滤显示
        roleForType(type) {
            return this.rolesForRight.filter(item => {
                return item.type === type;
            });
        },
        // 选择角色权限
        checkRight(role) {
            if (!role.is_right) {
                role.user_id = this.members[this.activeMemberIndex].id;
            } else {
                role.user_id = null;
            }
        },
        // 重新生成角色权限数据
        roleRightData(selectMemberId) {
            this.rolesForRight = this.roles.map(item => {
                item.is_right =
                    item.user_id !== null && item.user_id === selectMemberId;
                item.is_disabled =
                    item.user_id !== null && item.user_id !== selectMemberId;
                return item;
            });
        },
        // 点击选择某个成员
        selectMember(member, index) {
            this.activeMemberIndex = index;
            // 切换角色权限数据
            this.roleRightData(member.id);
        },
        // 确定角色分配，并进行跳转
        jumpOKHandle(event) {
            /* let isAllot = this.rolesForRight.every(item => {
        return item.user_id
      })
      if (!isAllot) {
        this.$toasted.error('所有角色的权限必须全部分配')
        return
      } */

            /* if (this.members.length <= this.roles.length) {
        let isUseMemberIds = this.rolesForRight.map(role => role.user_id)
        // 验证所有组员是否分配角色
        let result = this.members.every(member => {
          return isUseMemberIds.indexOf(member.id) !== -1
        })
        if (!result) {
          this.$toasted.error('有些成员未分配角色')
          return
        }
      } */

            if (!this.jumpProjectId) return;
            event.target.disabled = true;
            setTimeout(function() {
                event.target.disabled = false;
            }, 500);
            let roleData = this.rolesForRight.map(role => {
                return {
                    id: role.id,
                    name: role.role_name,
                    type: role.type,
                    user_id: role.user_id
                };
            });
            businessService
                .jumpStart({
                    experiment_id: this.$route.params.eid,
                    project_id: this.jumpProjectId,
                    data: JSON.stringify(roleData)
                })
                .then(data => {
                    this.$toasted.success("设置成功，即将跳转");
                    if (data.tran_id && data.project_id) {
                        businessService.pushMessage({
                            experiment_id: this.$route.params.eid,
                            node_id: this.$route.params.nid,
                            role_id: this.currentRole.id,
                            type: "cmd",
                            msg: "结束并走向跳转项目",
                            cmd: ACTION_BUSINESS_NODE_END,
                            data: JSON.stringify({
                                tran_id: data.tran_id,
                                project_id: data.project_id
                            })
                        });
                        this.showType = 0;
                        this.$emit("on-end");
                    } else {
                        this.$toasted.error("参数错误不可跳转");
                    }
                });
        },
        randomAssign() {
            // 随机分配角色 成员：members 角色：roles
            // console.log('call randomAssign')
            /*       if (this.members.length > this.roles.length) {
        this.$toasted.info('小组成员多于待选角色，无法分配')
        return false
      } */

            let tmp = this.members.slice(0);
            this.roles.forEach(item => {
                if (tmp.length === 0) {
                    tmp = this.members.slice(0);
                }
                let idx = Math.floor(Math.random() * tmp.length);
                let member = tmp[idx];
                item.user_id = member.id;
            });

            if (this.members.length > 0) {
                // 选中第一个成员
                this.activeMemberIndex = 0;
                // 切换角色权限数据
                this.roleRightData(this.members[0].id);
            }
        },
        // 点击添加小组成员按钮
        addMembersBtn() {
            this.teamMemberModal = true;
        },
        // 选择用户添加
        addMemberOk(members) {
            members.forEach(item => {
                item.checked = false;
            });
            let membersIds = members.map(item => item.id);
            if (this.metaInfo.team_id) {
                // 添加组员数据
                businessService
                    .addTeamMember({
                        team_id: this.metaInfo.team_id,
                        data: JSON.stringify(membersIds)
                    })
                    .then(() => {
                        this.members = this.members.concat(members);
                    });
            }
            this.teamMemberModal = false;
        },
        // 删除小组成员
        delMembersBtn() {
            if (this.members.length === 0) {
                this.$toasted.error("小组成员为空");
                return false;
            }
            if (!this.members[this.activeMemberIndex]) {
                this.$toasted.error("没有选择小组成员");
                return false;
            }
            this.deleteModal = true;
        },
        delMemberConfirm() {
            this.deleteModal = false;
            if (this.metaInfo.team_id) {
                businessService
                    .deleteTeamMember({
                        team_id: this.metaInfo.team_id,
                        user_id: this.members[this.activeMemberIndex].id
                    })
                    .then(() => {
                        this.members.splice(this.activeMemberIndex, 1);
                    });
            }
        }
    }
};
</script>
<style>
</style>
