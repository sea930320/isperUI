<template>
    <div class="meta-main-box">
        <loading v-if="isRunning"></loading>
        <div class="cardDiv ml-auto mr-auto w-50 p-5" style="margin-top: 10%" v-if="status === 1">
            <b-form class="text-left">
                <b-row class="mb-3">
                    <b-col sm="3">
                        <label for="input-1">投票主题 :</label>
                    </b-col>
                    <b-col sm="9">
                        <b-form-input
                                id="input-1"
                                v-model="pollData.pollTitle"
                                required
                                placeholder="请入主题"
                        ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col sm="3">
                        <label for="checkbox-1">投票人范围 :</label>
                    </b-col>
                    <b-col sm="9">
                        <b-form-checkbox-group
                                id="checkbox-1"
                                v-model="pollData.members"
                                :options="node_members"
                                name="setting-1"
                        ></b-form-checkbox-group>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col sm="3">
                        <label for="radio-1">投票方式 :</label>
                    </b-col>
                    <b-col sm="9">
                        <b-form-radio-group
                                id="radio-1"
                                v-model="pollData.pollMethod"
                                :options="method_options"
                                name="setting-2"
                        ></b-form-radio-group>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col sm="3">
                        <label for="datetime-1">投票用时 :</label>
                    </b-col>
                    <b-col sm="9">
                        <datetime
                                id="datetime-1"
                                v-model="pollData.pollEndTime"
                                :min-datetime="new Date().toISOString()"
                                type="datetime"
                        ></datetime>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col sm="3">
                        <label for="radio-1">投票结果 :</label>
                    </b-col>
                    <b-col sm="9">
                        <b-form-radio-group
                                id="radio-2"
                                v-model="pollData.pollShare"
                                :options="share_options"
                                name="setting-3"
                        ></b-form-radio-group>
                    </b-col>
                </b-row>
            </b-form>
            <!-- Control buttons-->
            <div class="text-center mt-4">
                <b-button variant="success" @click="savePollData" class="mr-5 w-100" :disabled="check_allSetting">确&emsp;定</b-button>
            </div>
        </div>
        <b-card
                overlay
                img-src="/media/waiting.gif"
                img-alt="Waiting..."
                text-variant="white"
                title="请耐心等待。。。"
                sub-title="正在进行投票，请等待"
                v-if="status === 2"
                style="margin-top: 10%"
                class="ml-auto mr-auto w-40 text-left"
        >
            <b-card-text>
                {{this.waitMsg}}
            </b-card-text>
        </b-card>
        <b-card
                :title="'投票主题 : ' + resultData.title"
                v-if="status === 4"
                class="text-left"
        >
            <b-card-text>
                投票结果 : {{(resultData.share === 0) ? '公开' : '不公开'}}
                &emsp;&emsp;投票方式 : {{(resultData.method === 0) ? '记名投票' : '无记名投票'}}
            </b-card-text>

            <div class="poll-result col-xs-6">
                <div class="poll-result-title">投票统计</div>
                <div class="poll-result-detail">
                    <dl>
                        <dt>{{agreePercent}}%</dt>
                        <dd>同意</dd>
                    </dl>
                    <dl>
                        <dt>{{disagreePercent}}%</dt>
                        <dd>不同意</dd>
                    </dl>
                    <dl>
                        <dt>{{quitPercent}}%</dt>
                        <dd>弃权</dd>
                    </dl>
                </div>
                <div class="poll-list">
                    <dl>
                        <dd v-for="(user, index) in resultData.items['1']" :key="index">
                            {{user}}
                        </dd>
                    </dl>
                    <dl>
                        <dd v-for="(user, index) in resultData.items['2']" :key="index">
                            {{user}}
                        </dd>
                    </dl>
                    <dl>
                        <dd v-for="(user, index) in resultData.items['3']" :key="index">
                            {{user}}
                        </dd>
                    </dl>
                </div>
            </div>
            <!-- Control buttons-->
            <div class="text-center mt-4" v-if="status === 4 && currentRoleAllocation.can_terminate">
                <b-button variant="success" @click="commitEnd = true" class="w-100">结束并走向</b-button>
            </div>
        </b-card>
        <b-card class="col-6 offset-3" style="margin-top: 10%;" v-if="status === 3">
            <div class="poll-options-wrap col-xs-6">
                <div class="poll-box" v-show="userInfo.identity === 5">
                    <div v-show="!metaInfo.has_poll" class="poll-options">
                        <h3 class="poll-options-hd mt-5">投票主题 : {{resultData.title}}</h3>
                        <h5 class="poll-options-hd m-4">
                            投票结果 : {{(resultData.share === 0)?'公开':'不公开'}}&emsp;&emsp;投票方式  : {{(resultData.method === 0)?'记名投票' : '无记名投票'}}
                        </h5>
                        <div class="poll-options-btn-group">
                            <a href="javascript:" class="poll-options-btn"
                               style="text-decoration: none !important;"
                               v-for="(option, index) in options"
                               :key="index"
                               @click="pollActionHandle(option)">
                                {{option.name}}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </b-card>
        <endNodeHandle :isCommit="commitEnd" @on-cancel="commitEnd = false"></endNodeHandle>
        <siderUserBar></siderUserBar>
    </div>
</template>
<script>
    import Loading from "@/components/loading/Loading";
    import endNodeHandle from "@/components/business/modal/endNodeHandle";
    import pollService from "@/services/pollService";
    import {mapState} from "vuex";
    import { Datetime } from 'vue-datetime';
    import 'vue-datetime/dist/vue-datetime.css';
    import siderUserBar from "@/components/business/common/SiderUserBar";

    export default {
        name: 'MetaPoll',
        components: {Loading, endNodeHandle, Datetime, siderUserBar},
        data() {
            return {
                node_members: [],
                method_options: [
                    { text: '记名投票', value: 0 },
                    { text: '无记名投票', value: 1 }
                ],
                share_options: [
                    { text: '公开', value: 0 },
                    { text: '不公开', value: 1 }
                ],
                status: null,
                waitMsg: "",
                pollData: {
                    pollTitle: '',
                    members: [],
                    pollMethod: 0,
                    pollEndTime: "",
                    pollShare: 0,
                },
                resultData: {},
                commitEnd: false,
                options: [
                    {
                        type: 1,
                        name: '同意'
                    },
                    {
                        type: 2,
                        name: '不同意'
                    },
                    {
                        type: 3,
                        name: '弃权'
                    }
                ]
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
            agreePercent() {
                let total = this.resultData.items['1'].length + this.resultData.items['2'].length + this.resultData.items['3'].length;
                return (this.resultData.items['1'].length / total * 100).toFixed(2)
            },
            disagreePercent() {
                let total = this.resultData.items['1'].length + this.resultData.items['2'].length + this.resultData.items['3'].length;
                return (this.resultData.items['2'].length / total * 100).toFixed(2)
            },
            quitPercent() {
                let total = this.resultData.items['1'].length + this.resultData.items['2'].length + this.resultData.items['3'].length;
                return (this.resultData.items['3'].length / total * 100).toFixed(2)
            },
            check_allSetting() {
                return !(this.pollData.pollTitle !== "" && this.pollData.members.length !== 0 && this.pollData.pollEndTime !== "")
            },
        },
        created() {
            this.$nextTick(() => {
                this.getInitPollData();
            });
        },
        methods: {
            getInitPollData() {
                if (this.currentRoleAllocation.role) {
                    this.run();
                    pollService
                        .getInitPollData({
                            'business_id': this.$route.params.bid,
                            'node_id': this.$route.params.nid,
                            'role': (this.currentRoleAllocation.can_terminate) ? 1 : 0
                        })
                        .then(data => {
                            this.status = data.status;
                            if (data.status === 1)
                                this.node_members = data.data.node_members;
                            else if (data.status === 2)
                                this.waitMsg = data.data;
                            else if (data.status === 3)
                                this.resultData = data.data;
                            else if (data.status === 4)
                                this.resultData = data.data;
                            this.$emit("data-ready");
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
                }
            },
            savePollData() {
                this.run();
                pollService
                    .savePollData({
                        'business_id': this.currentRoleAllocation.role.business,
                        'node_id': this.metaInfo.node_id,
                        'data': JSON.stringify(this.pollData)
                    })
                    .then(data => {
                        this.status = data.status;
                        if (this.status === 3)
                            this.resultData = {
                                title: data.data.title,
                                share: data.data.share,
                                method: data.data.method,
                            };
                        this.waitMsg = data.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            // 投票操作
            pollActionHandle(option) {
                this.run();
                pollService
                    .userPollSave({
                        'business_id': this.currentRoleAllocation.role.business,
                        'node_id': this.metaInfo.node_id,
                        'poll': option.type
                    })
                    .then(data => {
                        this.status = data.status;
                        if (data.status === 2)
                            this.waitMsg = data.data;
                        else if (data.status === 4)
                            this.resultData = data.data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
        }
    }
</script>
<style>
    .project-tip-containar p {
        word-break: break-all;
    }

    .poll-result-title {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        font-size: 16px;
        text-align: left;
        background-color: #3b7ce0;
        color: #fff;
    }

    .poll-result-detail {
        overflow: hidden;
        padding: 20px 0;
        border: 1px solid #cdcdcd;
        border-top: none;
    }

    .poll-result-detail dl {
        float: left;
        width: 33.3%;
        text-align: center;
    }

    .poll-list dl {
        float: left;
        width: 33.3%;
        text-align: center;
    }

    .poll-result-detail dl dt {
        font-size: 18px;
        line-height: 2.8;
        color: #3b7ce0;
    }

    .poll-result-detail dl dd {
        font-size: 14px;
        line-height: 1.4;
        color: #a0a0a0;
    }

    .poll-list {
        height: 300px;
        padding: 10px 0 10px 0;
        border: 1px solid #cdcdcd;
        border-top: none;
        overflow-y: auto;
    }

    .poll-list > ul > li {
        font-size: 14px;
        line-height: 2;
    }

    .poll-list > ul > li > span {
        float: right;
        color: #ababab;
    }

    .poll-box {
        height: 225px;
        border: 1px solid #cdcdcd;
        background-color: #efefef;
    }

    .poll-options-btn-group {
        text-align: center;
    }

    .poll-options-btn {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width: 92px;
        margin-right: 32px;
        font-size: 14px;
        text-align: center;
        color: #397de0;
        border: 1px solid #397de0;
        border-radius: 4px;
    }

    .poll-options-btn:last-child {
        margin-right: 0;
    }
</style>
