<template>
    <div class="vote-index container" style="margin-top: 10%;">
        <loading v-if="isRunning"></loading>
        <!-- Tabs with card integration -->
        <b-card no-body v-if="status === 1 || status === 3">
            <b-tabs v-model="tabIndex" class="nav-fill" card>
                <b-tab title="表决模式" :disabled="nextStepVote">
                    <b-button class="modeBtn" :variant="(voteMode === 1) ? 'primary' : 'outline-primary'"
                              @click="modeSelected(1)">择一表决
                    </b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 2) ? 'primary' : 'outline-primary'"
                              @click="modeSelected(2)">多项表决
                    </b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 3) ? 'primary' : 'outline-primary'"
                              @click="modeSelected(3)">淘汰式表决
                    </b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 4) ? 'primary' : 'outline-primary'"
                              @click="modeSelected(4)" :disabled="startVote">自由表决
                    </b-button>
                </b-tab>
                <b-tab title="编辑表决选项" :disabled="voteMode === null || nextStepVote">
                    <b-card>
                        <b-form class="text-left">
                            <b-row>
                                <b-col cols="4">
                                    <b-form-group
                                            v-if="voteMode !== 4"
                                            id="input-group-0"
                                            label="输入表决支 :"
                                            label-for="input-0"
                                            description="候选项（可以增加）"
                                    >
                                        <vue-tags-input
                                                v-model="tag"
                                                :tags="voteData.voteItems"
                                                @tags-changed="newTags => voteData.voteItems = newTags"
                                                placeholder="+"
                                                :disabled="startVote"
                                        />
                                    </b-form-group>
                                </b-col>
                                <b-col cols="8">
                                    <b-form-group id="input-group-1" label="表决主题 :" label-for="input-1">
                                        <b-form-input
                                                id="input-1"
                                                v-model="voteData.voteTitle"
                                                required
                                                placeholder="请入主题"
                                                :disabled="startVote"
                                        ></b-form-input>
                                    </b-form-group>

                                    <b-form-group id="input-group-2" label="表决说明 :" label-for="input-2">
                                        <b-form-input
                                                id="input-2"
                                                v-model="voteData.voteDescription"
                                                required
                                                placeholder="请入说明"
                                                :disabled="startVote"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-form>
                    </b-card>
                    <!-- Control buttons-->
                    <div class="text-center mt-4">
                        <b-button variant="primary" @click="tabIndex--" class="mr-5">下一步</b-button>
                        <b-button variant="primary" @click="tabIndex++" :disabled="check_voteData || voteMode === null">上一步</b-button>
                    </div>
                </b-tab>
                <b-tab title="设置表决属性" :disabled="check_voteData || voteMode === null">
                    <b-card no-body>
                        <b-tabs pills card>
                            <b-tab title="表决人范围" active>
                                <b-card-text>
                                    <b-form-group>
                                        <b-form-checkbox-group
                                            id="checkbox-group-1"
                                            v-model="voteSetting.members"
                                            :options="node_members"
                                            name="setting-1"
                                        ></b-form-checkbox-group>
                                    </b-form-group>
                                </b-card-text>
                            </b-tab>
                            <b-tab title="表决方式" v-if="voteMode !== 4 && !nextStepVote">
                                <b-card-text>
                                    <b-form-group>
                                        <b-form-radio-group
                                            v-model="voteSetting.voteMethod"
                                            :options="method_options"
                                            name="setting-2"
                                        ></b-form-radio-group>
                                    </b-form-group>
                                </b-card-text>
                            </b-tab>
                            <b-tab title="表决用时">
                                <b-card-text>
                                    <datetime
                                        v-model="voteSetting.voteEndTime"
                                        :min-datetime="new Date().toISOString()"
                                        type="datetime"
                                    ></datetime>
                                </b-card-text>
                            </b-tab>
                            <b-tab title="淘汰设置" v-if="voteMode === 3">
                                <b-card-text class="col-8 offset-2">
                                    <b-row class="mb-3">
                                        <b-col sm="3">
                                            <label for="setting-4">选出设置 :</label>
                                        </b-col>
                                        <b-col sm="9">
                                            <b-form-input
                                                    id="setting-4"
                                                    type="number"
                                                    v-model="voteSetting.voteMaxVote"
                                                    :min="1"
                                                    :max="this.voteData.voteItems.length"
                                            ></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="3">
                                            <label for="setting-5">每轮淘汰数 :</label>
                                        </b-col>
                                        <b-col sm="9">
                                            <b-form-input
                                                    id="setting-5"
                                                    type="number"
                                                    v-model="voteSetting.voteLostVote"
                                                    :min="1"
                                                    :max="this.voteData.voteItems.length -1"
                                            ></b-form-input>
                                        </b-col>
                                    </b-row>
                                </b-card-text>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                    <!-- Control buttons-->
                    <div class="text-center mt-4">
                        <b-button variant="primary" @click="tabIndex--" class="mr-5">下一步</b-button>
                        <b-button variant="success" @click="saveVoteData" class="mr-5" :disabled="check_allSetting">确&emsp;定</b-button>
                    </div>
                </b-tab>
            </b-tabs>
        </b-card>
        <b-card
                overlay
                img-src="/media/waiting.gif"
                img-alt="Waiting..."
                text-variant="white"
                title="请耐心等待。。。"
                sub-title="正在进行表决或者输入表决选项，请等待"
                v-if="status === 2"
                class="ml-auto mr-auto w-40 text-left"
        >
            <b-card-text>
                {{this.waitMsg}}
            </b-card-text>
        </b-card>
        <b-card
            :title="(status === 4) ? '表决中间结果 : ' + resultData.title : '表决结果 : ' + resultData.title"
            :sub-title="resultData.description"
            v-if="status === 5 || status === 4"
            class="text-left"
        >
            <b-card-text>
                表决模式 : {{(resultData.mode === 1) ? '择一表决' : (resultData.mode === 2) ? '多项表决' : '淘汰式表决'}}
                &emsp;&emsp;表决方式 : {{(resultData.method === 0) ? '记名表决' : '无记名表决'}}
            </b-card-text>

            <div v-if="resultData.method === 0" class="text-center">
                <b-table
                    :bordered="true"
                    :items="
                        [
                            resultData.items.map(x=>x.text).concat('未按表决器').map((x, i)=>x + ' : ' +resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i] + '/' + resultData.members.length + ' ('
                                        + Math.round(resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i]*100/resultData.members.length) + '%) ').reduce((obj, cur, i) => {
                                return { ...obj, [cur]: resultData.items.map(x=>x.voted_users.join(' , ')).concat(resultData.members.filter(x=>x.voted === 0).map(x=>x.username).join(' , '))[i]};
                            }, {})
                        ]
                    "
                    :fields="resultData.items.map(x=>x.text).concat('未按表决器').map((x, i)=>x + ' : ' +resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i] + '/' + resultData.members.length + ' ('
                                        + Math.round(resultData.items.map(x=>x.voted_users.length).concat(resultData.members.filter(x=>x.voted === 0).length)[i]*100/resultData.members.length) + '%) ')"
                ></b-table>
            </div>
            <div v-if="resultData.method === 1" class="text-center">
                <b-table
                    :bordered="true"
                    :items="
                        [
                            resultData.items.map(x=>x.text).concat('未按表决器').reduce((obj, cur, i) => {
                                return { ...obj, [cur]:
                                        resultData.items.map(x=>x.voted_count).concat(resultData.members.filter(x=>x.voted === 0).length)[i] + '/' + resultData.members.length + ' ('
                                        + Math.round(resultData.items.map(x=>x.voted_count).concat(resultData.members.filter(x=>x.voted === 0).length)[i]*100/resultData.members.length) + '%) '
                                    };
                            }, {})
                        ]
                    "
                    :fields="resultData.items.map(x=>x.text).concat('未按表决器')"
                ></b-table>
            </div>
            <!-- Control buttons-->
            <div class="text-center mt-4" v-if="status === 4">
                <b-button variant="primary" @click="nextVote" class="mr-5" :disabled="resultData.items.length < 2">下次表决</b-button>
                <b-button variant="success" @click="finishVote" class="mr-5">完成表决</b-button>
            </div>
            <div class="text-center mt-4" v-if="status === 5 && currentRoleAllocation.can_terminate">
                <b-button variant="success" @click="commitEnd = true" class="mr-5">结束并走向</b-button>
            </div>
        </b-card>
        <b-card :title="resultData.title" :sub-title="resultData.description" v-if="status === 7" class="text-left">
            <b-card-text>
                表决模式 : {{(resultData.mode === 1) ? '择一表决' : (resultData.mode === 2) ? '多项表决' : '淘汰式表决'}}
                &emsp;&emsp;表决方式 : {{(resultData.method === 0) ? '记名表决' : '无记名表决'}}
                {{(resultData.mode === 3) ? '&emsp;&emsp;可以选的最大选项数 : ' + resultData.max_vote : ''}}
            </b-card-text>
            <b-form-group label="表 决 选 项" class="text-center">
                <b-form-checkbox-group
                        id="checkbox-group-2"
                        v-model="voteSelected"
                        :options="resultData.items"
                        name="flavour-1"
                        :state="state"
                        size="2"
                >
                </b-form-checkbox-group>
            </b-form-group>
            <!-- Control buttons-->
            <div class="text-center mt-4">
                <b-button variant="success" @click="userVoteSave" :disabled="!state" class="mr-5">表 决 保 存</b-button>
            </div>
        </b-card>
        <b-card :title="resultData.title" :sub-title="resultData.description" v-if="status === 6" class="col-4 offset-4">
            <b-row class="my-1 mt-4">
                <b-col sm="4">
                    <label for="item">表决意向 ：</label>
                </b-col>
                <b-col sm="8">
                    <b-form-input id="item" type="text" v-model="newVoteItem"></b-form-input>
                </b-col>
            </b-row>
            <!-- Control buttons-->
            <div class="text-center mt-4">
                <b-button variant="success" @click="userVoteItemSave" :disabled="newVoteItem === ''" class="mr-5">意 向 保 存</b-button>
            </div>
        </b-card>
        <end-node-handle :isCommit="commitEnd" @on-cancel="endNodeCancel"></end-node-handle>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import VoteService from "@/services/voteService";
    import VueTagsInput from '@johmun/vue-tags-input';
    import { Datetime } from 'vue-datetime';
    import 'vue-datetime/dist/vue-datetime.css';
    import endNodeHandle from "@/components/business/modal/endNodeHandle";

    export default {
        name: "vote-index",
        components: {
            Loading,
            VueTagsInput,
            Datetime,
            endNodeHandle
        },
        data() {
            return {
                tag: '',
                node_members: [],
                method_options: [
                    { text: '记名表决', value: 0 },
                    { text: '无记名表决', value: 1 }
                ],
                voteSelected: [],
                newVoteItem: "",
                status: null,
                waitMsg: "",
                tabIndex: 1,
                voteMode: null,
                nextStepVote: false,
                startVote: false,
                voteData: {
                    voteItems: [],
                    voteTitle: '',
                    voteDescription: ''
                },
                voteSetting: {
                    members: [],
                    voteMethod: 0,
                    voteEndTime: "",
                    voteMaxVote: 1,
                    voteLostVote: 1
                },
                resultData: {},
                commitEnd: false,
            }
        },
        computed: {
            ...mapState(["userInfo", "meta"]),
            metaInfo() {
                return this.meta.info;
            },
            currentRoleAllocation() {
                return this.meta.currentRoleAllocation;
            },
            check_voteData() {
                if (this.voteMode === 4)
                    return !(this.voteData.voteTitle && this.voteData.voteDescription);
                else
                    return !(this.voteData.voteItems.length > 1 && this.voteData.voteTitle && this.voteData.voteDescription);
            },
            check_allSetting() {
                if (this.voteMode === null)
                    return true;
                if (this.voteMode === 1 || this.voteMode === 2 || this.voteMode === 3)
                    return !(
                        this.voteData.voteItems.length > 1 &&
                        this.voteData.voteTitle &&
                        this.voteData.voteDescription &&
                        this.voteSetting.members.length > 0 &&
                        this.voteSetting.voteEndTime !== ""
                    );
                else if (this.voteMode === 4)
                    return !(
                        this.voteData.voteTitle &&
                        this.voteData.voteDescription &&
                        this.voteSetting.members.length > 0 &&
                        this.voteSetting.voteEndTime !== ""
                    );
                return false;
            },
            state() {
                return (this.resultData.mode === 1) ? this.voteSelected.length === 1 :
                    (this.resultData.mode === 2) ? this.voteSelected.length > 0 :
                    (this.resultData.mode === 3) ? this.voteSelected.length > 0 && this.voteSelected.length <= this.resultData.max_vote : false;
            }
        },
        created() {
            this.$nextTick(() => {
                this.getInitVoteData();
            });
        },
        methods: {
            modeSelected(index) {
                this.voteMode = index;
                setTimeout(() => {
                    this.tabIndex = 1
                }, 10);
            },
            getInitVoteData() {
                this.run();
                VoteService
                    .getInitVoteData({
                        'business_id': this.currentRoleAllocation.role.business,
                        'node_id': this.metaInfo.node_id,
                        'role': (this.currentRoleAllocation.can_terminate) ? 1 : 0
                    })
                    .then(data => {
                        this.status = data.status;
                        if (data.status === 1)
                            this.node_members = data.data.node_members;
                        else if (data.status === 2)
                            this.waitMsg = data.data;
                        else if (data.status === 3) {
                            this.voteMode = null;
                            this.voteData.voteTitle = data.data.title;  // fix
                            this.voteData.voteDescription = data.data.description;  // fix
                            this.voteData.voteItems = data.data.items.map(x => {return {text: x.text}});  // fix
                            this.node_members = data.data.node_members;
                            this.voteSetting.members = [];
                            this.voteSetting.voteEndTime = "";
                            this.voteSetting.voteLostVote = 1;
                            this.voteSetting.voteMaxVote = 1;
                            this.voteSetting.voteMethod = 0;
                            this.startVote = true;
                        }
                        else if (data.status === 4)
                            this.resultData = data.data;
                        else if (data.status === 5)
                            this.resultData = data.data;
                        else if (data.status === 6)
                            this.resultData = data.data;
                        else if (data.status === 7)
                            this.resultData = data.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            saveVoteData() {
                this.run();
                VoteService
                    .saveVoteData({
                        business_id: this.currentRoleAllocation.role.business,
                        node_id: this.metaInfo.node_id,
                        voteMode: this.voteMode,
                        voteData: JSON.stringify(this.voteData),
                        voteSetting: JSON.stringify(this.voteSetting)
                    })
                    .then(res => {
                        this.status = res.status;
                        if (res.status === 2)
                            this.waitMsg = res.data;
                        else if (res.status === 6)
                            this.resultData = res.data;
                        else if (res.status === 7)
                            this.resultData = res.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            nextVote() {
                if (this.resultData.method === 0)
                    this.resultData.items.sort((a,b)=>(a.voted_users.length < b.voted_users.length)? 1: -1);
                else
                    this.resultData.items.sort((a,b)=>(a.voted_count < b.voted_count)? 1: -1);
                this.resultData.items.splice(-this.resultData.lost_vote);
                this.status = 1;
                this.voteMode = 3; // fix
                this.voteData.voteTitle = this.resultData.title;  // fix
                this.voteData.voteDescription = this.resultData.description;  // fix
                this.voteData.voteItems = this.resultData.items.map(x=>{return {text: x.text}});  // fix
                this.node_members = this.resultData.node_members;
                this.voteSetting.members = [];
                this.voteSetting.voteEndTime = "";
                this.voteSetting.voteLostVote = 1;
                this.voteSetting.voteMaxVote = 1;
                this.voteSetting.voteMethod = this.resultData.method;  // fix
                this.nextStepVote = true;
            },
            finishVote() {
                this.run();
                VoteService
                    .finishVote({
                        business_id: this.currentRoleAllocation.role.business,
                        node_id: this.metaInfo.node_id,
                    })
                    .then(res => {
                        this.status = res.status;
                        this.resultData = res.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            userVoteSave() {
                this.run();
                VoteService
                    .userVoteSave({
                        business_id: this.currentRoleAllocation.role.business,
                        node_id: this.metaInfo.node_id,
                        items: JSON.stringify(this.voteSelected)
                    })
                    .then(res => {
                        this.status = res.status;
                        this.waitMsg = res.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            userVoteItemSave() {
                this.run();
                VoteService
                    .userVoteItemSave({
                        business_id: this.currentRoleAllocation.role.business,
                        node_id: this.metaInfo.node_id,
                        new_item: this.newVoteItem
                    })
                    .then(res => {
                        this.status = res.status;
                        this.waitMsg = res.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            endNodeCancel() {
                this.commitEnd = false;
            }
        }
    }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .vote-index {
        .modeBtn {
            height: 70px;
            width: 180px;
            border-radius: 10px;
            margin: 40px 45px;
            font: 22px 'Microsoft Yahei', Tahoma, Helvetica, Arial, "\5B8B\4F53", sans-serif;
        }

        .nav-tabs .nav-link.active {
            color: #4169e1;
            background-color: #c7dbff;
            border-color: #c7dbff;
            border-width: 0 0 2px;
        }
        .vdatetime-input {
            text-align: center !important;
            padding-left: 3rem !important;
            padding-right: 3rem !important;
        }
    }
</style>