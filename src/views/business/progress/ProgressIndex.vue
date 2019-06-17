<template>
    <div class="progress-index" v-if="userInfo">
        <progress-menu @emit-viewxml="showFlowChart"></progress-menu>
        <div class="container" style="minHeight: calc(100vh - 210px); padding: 110px 0 0 0;">
            <router-view v-if="!XMLModal"></router-view>
        </div>
        <view-xml
            :visible="XMLModal"
            :xml="flowChart.xml"
            :options="flowChart.options"
            @on-close="XMLModal = false"
        ></view-xml>
        <loading v-if="loaderShow"></loading>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import businessService from "@/services/businessService";
import Loading from "@/components/loading/FullLoading";
import ViewXml from "@/components/workflowXML/ViewXML";
import ProgressMenu from "@/components/business/progress/Menu";
export default {
    name: "progress-index",
    components: { Loading, ViewXml, ProgressMenu },
    filters: {},
    data() {
        return {
            tipModal: 0,
            loaderShow: false,
            nodeTransShow: false,
            XMLModal: false,
            nodeTransTip: "主持人结束了本次环节，即将进入下一环节……",
            flowChart: {
                xml: "",
                options: {
                    parttern: 2,
                    currentTask: null,
                    paths: []
                }
            },
            taskId: null,
            WebimConn: null,
            metaInfo: {
                businessID: null,
                nodeID: null,
                roleAllocID: null,
                processType: null
            }
        };
    },
    created() {
        this.$nextTick(() => {
            this.init();
        });
    },
    computed: {
        ...mapState(["userInfo", "meta"]),
        trans() {
            return this.meta.trans;
        },
        currentRoleAllocation() {
            return this.meta.currentRoleAllocation;
        }
    },
    watch: {
        $route() {
            this.flowChart.options.parttern = 2;
            this.init();
        }
        // meta: {
        //     handler(val) {
        //         console.log(val);
        //     },
        //     deep: true
        // }
    },
    methods: {
        ...mapActions([
            "getBusinessDetail",
            "getBusinessNodeDetail",
            "setCurrentRoleAllocation",
            "getBusinessNodeMessages",
            "getBusinessNodeFunction",
            "getBusinessNodeDocs"
        ]),
        init() {
            this.loaderShow = false;
            if (this.$route.name !== "experience") {
                this.loaderShow = true;
            }
            this.fetchBusinessDetail();
        },
        fetchBusinessDetail() {
            this.getBusinessDetail({
                business_id: this.$route.params.bid
            }).then(data => {
                if (data.role_not_set) {
                    this.$toasted.error(data.role_not_set);
                    this.$router.go(-1);
                } else {
                    this.metaInfo.businessID = data.id;
                    this.metaInfo.nodeID = data.node.id;
                    this.metaInfo.processType = data.node.process_type;

                    if (
                        parseInt(this.$route.params.nid) !==
                        this.metaInfo.nodeID
                    ) {
                        this.$router.push({
                            path: `/business/progress/${
                                this.metaInfo.processType
                            }`,
                            params: {
                                eid: this.metaInfo.businessID,
                                nid: this.metaInfo.nodeID
                            }
                        });
                    }
                    // this.WebimConnInit(data.huanxin_id);
                    // if (data.user_role_allocs.length === 0) {
                    //     this.loadFlowChart(data.entire_graph);
                    //     this.$store.dispatch("geBusinessNodeDocs", {
                    //         business_id: this.metaInfo.businessID,
                    //         node_id: this.metaInfo.nodeID
                    //         // role_id: data.without_node_user_role_id
                    //     });
                    //     this.$router.push({ name: "wait" });
                    //     this.loaderShow = false;
                    //     return;
                    // }
                    this.metaInfo.roleAllocID =
                        data.user_role_allocs &&
                        data.user_role_allocs.length > 0
                            ? data.user_role_allocs[0].alloc_id
                            : "";
                    this.fetchBusinessNodeDetail();
                }
            });
        },
        fetchBusinessNodeDetail() {
            if (
                !this.metaInfo.businessID ||
                !this.metaInfo.nodeID ||
                !this.metaInfo.roleAllocID
            ) {
                return;
            }
            // 获取环节详情
            this.getBusinessNodeDetail({
                business_id: this.metaInfo.businessID,
                node_id: this.metaInfo.nodeID,
                roleAllocID: this.metaInfo.roleAllocID
            })
                .then(data => {
                    this.setCurrentRoleAllocation(data.role_allocs[0]);
                    if (this.$route.name !== "experience") {
                        this.loadFlowChart(data.entire_graph);
                    }
                })
                .catch(() => {
                    this.$router.go(-1);
                });
            this.initAnimationData();
        },
        // 加载流程图   type : 显示模式
        loadFlowChart(type) {
            if (type !== 1) {
                this.loaderShow = false;
            }
            // 完整显示
            if (type === 1) {
                // 获取流程图数据
                businessService
                    .getBusinessTransPath({
                        business_id: this.$route.params.bid
                    })
                    .then(data => {
                        this.flowChart.xml = data.xml;
                        this.flowChart.options.currentTask = data.node.task_id;
                        this.flowChart.options.paths = data.paths;
                        this.loaderShow = false;
                        this.XMLModal = true;
                    });
            }
            // 逐步显示
        },
        // 查看流程图
        showFlowChart() {
            // 获取流程图数据
            businessService
                .getBusinessTransPath({
                    business_id: this.$route.params.bid
                })
                .then(data => {
                    this.flowChart.xml = data.xml;
                    this.flowChart.options.parttern = 1;
                    this.flowChart.options.currentTask = data.node.task_id;
                    this.flowChart.options.paths = data.paths;
                    this.XMLModal = true;
                });
        },
        // 初始化动画（法庭）环节数据
        initAnimationData() {
            // 动画模块数据
            if (this.metaInfo.processType === 1) {
                // 获取实验历史消息
                this.getBusinessNodeMessages({
                    business_id: this.metaInfo.businessID,
                    node_id: this.metaInfo.nodeID,
                    is_paging: 0
                });
                // 获取功能按钮及其状态
                this.getBusinessNodeFunction({
                    business_id: this.metaInfo.businessID,
                    node_id: this.metaInfo.nodeID,
                    role_alloc_id: this.metaInfo.roleAllocID
                });
            }

            // // 投票环节
            // if (this.metaInfo.processType === 5) {
            //     // 获取项目提示
            //     this.$store.dispatch("getBusinessProjectTips", {
            //         business_id: this.metaInfo.businessID,
            //         node_id: this.metaInfo.nodeID,
            //         role_alloc_id: this.metaInfo.roleAllocID,
            //         usage: 7
            //     });
            // }

            // 获取实验素材
            this.getBusinessNodeDocs({
                business_id: this.metaInfo.businessID,
                node_id: this.metaInfo.nodeID,
                role_alloc_id: this.metaInfo.roleAllocID
            });
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.progress-index {
}
</style>