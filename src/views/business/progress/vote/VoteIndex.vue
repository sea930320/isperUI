<template>
    <div class="vote-index container mt-5">
        <loading v-if="isRunning"></loading>
        <!-- Tabs with card integration -->
        <b-card no-body>
            <b-tabs v-model="tabIndex" class="nav-fill" card>
                <b-tab title="General">
                    <b-button class="modeBtn" :variant="(voteMode === 1) ? 'primary' : 'outline-primary'" @click="modeSelected(1)">择一表决</b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 2) ? 'primary' : 'outline-primary'" @click="modeSelected(2)">多项表决</b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 3) ? 'primary' : 'outline-primary'" @click="modeSelected(3)">淘汰式表决</b-button>
                    <b-button class="modeBtn" :variant="(voteMode === 4) ? 'primary' : 'outline-primary'" @click="modeSelected(4)">自由表决</b-button>
                </b-tab>
                <b-tab title="Edit profile" :disabled="voteMode === null">
                    I'm the second tab
                    <b-card>I'm the card in tab</b-card>
                    <!-- Control buttons-->
                    <div class="text-center">
                        <b-button-group class="mt-2">
                            <b-button @click="tabIndex--">Previous</b-button>
                            <b-button @click="tabIndex++">Next</b-button>
                        </b-button-group>
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
    export default {
        name: "vote-index",
        components: {
            Loading,
        },
        data() {
            return {
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
                return true;
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