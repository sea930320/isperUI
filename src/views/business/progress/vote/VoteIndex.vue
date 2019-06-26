<template>
    <div class="vote-index container mt-5">
        <loading v-if="isRunning"></loading>
        <!-- Tabs with card integration -->
        <b-card no-body v-if="status === 1">
            <b-tabs v-model="tabIndex" class="nav-fill" card>
                <b-tab title="General">
                    <b-button class="modeBtn" :variant="(voteMode === 1) ? 'primary' : 'outline-primary'" @click="modeSelected(1)">择一表决</b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 2) ? 'primary' : 'outline-primary'" @click="modeSelected(2)">多项表决</b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 3) ? 'primary' : 'outline-primary'" @click="modeSelected(3)">淘汰式表决</b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 4) ? 'primary' : 'outline-primary'" @click="modeSelected(4)">自由表决</b-button>
                </b-tab>
                <b-tab title="Edit profile" :disabled="voteMode === null">
                    <b-card>
                        <b-form class="text-left">
                            <b-row>
                                <b-col cols="4">
                                    <b-form-group
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
                                        ></b-form-input>
                                    </b-form-group>

                                    <b-form-group id="input-group-2" label="表决说明 :" label-for="input-2">
                                        <b-form-input
                                                id="input-2"
                                                v-model="voteData.voteDescription"
                                                required
                                                placeholder="请入说明"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-form>
                    </b-card>
                    <!-- Control buttons-->
                    <div class="text-center mt-4">
                        <b-button variant="primary" @click="tabIndex--" class="mr-5">下一步</b-button>
                        <b-button variant="primary" @click="tabIndex++">上一步</b-button>
                    </div>
                </b-tab>
                <b-tab title="Info" :disabled="check_voteData">I'm the last tab</b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import VoteService from "@/services/voteService";
    import VueTagsInput from '@johmun/vue-tags-input';
    export default {
        name: "vote-index",
        components: {
            Loading,
            VueTagsInput,
        },
        data() {
            return {
                tag: '',
                status: null,
                tabIndex: 1,
                voteMode: null,
                voteData: {
                    voteItems: [],
                    voteTitle: '',
                    voteDescription: ''
                },
                voteSetting: {
                    members: [],
                    voteMethod: 0,
                    voteEndTime: null,
                    voteMaxVote: 1,
                    voteLostVote: 1
                }
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
                return !!!(this.voteData.voteItems.length > 1 && this.voteData.voteTitle && this.voteData.voteDescription);
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
                setTimeout(()=>{this.tabIndex = 1}, 10);
            },
            getInitVoteData() {
                this.run();
                if (this.currentRoleAllocation.can_terminate)
                    VoteService
                        .getInitVoteData({'business_id': this.currentRoleAllocation.role.business, 'node_id': this.metaInfo.node_id})
                        .then(data => {
                            this.status = data.status;
                            this.$emit("data-ready");
                        })
                        .catch(() => {
                            this.$emit("data-failed");
                        });
            },
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
            font: 22px 'Microsoft Yahei',Tahoma, Helvetica, Arial, "\5B8B\4F53", sans-serif;
        }
        .nav-tabs .nav-link.active {
            color: #4169e1;
            background-color: #c7dbff;
            border-color: #c7dbff;
            border-width: 0 0 2px;
        }
    }
</style>