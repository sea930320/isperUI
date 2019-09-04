<template>
    <div class="meta-main-box">
        <loading v-if="isRunning"></loading>
        <div class="cardDiv ml-auto mr-auto w-50 p-5" style="margin-top: 10%" v-if="settings.status === 2">
            <b-form class="text-left">
                <b-row class="mb-3">
                    <b-col sm="12" class="text-center">
                        <h3>{{settings.title}}</h3>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col sm="12" class="text-center">
                        {{settings.description}} : {{(settings.mode === 0)? '(单选)' : '(多选)'}}
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col sm="12" class="text-center">
                        <b-form-checkbox-group
                                id="checkbox-1"
                                v-model="resultData"
                                :options="settings.items"
                                name="setting-1"
                        ></b-form-checkbox-group>
                    </b-col>
                </b-row>
                <b-row class="text-center" v-for="(item, index) in settings.items.filter(x=>resultData.includes(x.value))" :key="index">
                    {{item.text}} : {{item.description}}
                </b-row>
            </b-form>
            <!-- Control buttons-->
            <div class="text-center mt-4">
                <b-button variant="success" @click="saveResult" class="mr-5 w-100" :disabled="check_allSetting">确&emsp;定</b-button>
            </div>
        </div>
        <b-card
                overlay
                img-src="/media/waiting.gif"
                img-alt="Waiting..."
                text-variant="white"
                title="您已经选好了。。。"
                v-if="settings.status === 1"
                style="margin-top: 10%"
                class="ml-auto mr-auto w-40 text-left"
        >
        </b-card>
        <b-card
                overlay
                img-src="/media/waiting.gif"
                img-alt="Waiting..."
                text-variant="white"
                title="没有设置判断与选择。。。"
                v-if="settings.status === 0"
                style="margin-top: 10%"
                class="ml-auto mr-auto w-40 text-left"
        >
        </b-card>
    </div>
</template>
<script>
    import Loading from "@/components/loading/Loading";
    import selectDecideService from "@/services/selectDecideService";
    import { mapState } from "vuex";

    export default {
        name: 'select_decide',
        components: {Loading},
        data() {
            return {
                node_members: [],
                waitMsg: "",
                settings: {
                    title: '',
                    description: '',
                    mode: 0,
                    items: [],
                    status: null
                },
                resultData: [],
                commitEnd: false,
            }
        },
        computed: {
            ...mapState(["meta"]),
            metaInfo() {
                return this.meta.info;
            },
            currentRoleAllocation() {
                return this.meta.currentRoleAllocation;
            },
            check_allSetting() {
                if (this.settings.mode === 0)
                    return !(this.resultData.length === 1);
                else
                    return !(this.resultData.length > 0);
            },
        },
        created() {
            this.$nextTick(() => {
                this.getSetting();
            });
        },
        methods: {
            getSetting() {
                this.run();
                selectDecideService
                    .getSetting({
                        'flowNode_id': this.metaInfo.node_id,
                        'alloc_id': 'observable'
                    })
                    .then(data => {
                        this.settings = data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            saveResult() {
                this.run();
                selectDecideService
                    .saveResult({
                        'selectedItems': JSON.stringify(this.resultData),
                        'alloc_id': this.currentRoleAllocation.alloc_id
                    })
                    .then(data => {
                        if (data.results === 'success') {
                            this.settings.status = 1;
                            this.$emit("data-ready");
                        }
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

    .poll-list > ul > li {
        font-size: 14px;
        line-height: 2;
    }

    .poll-list > ul > li > span {
        float: right;
        color: #ababab;
    }
</style>
