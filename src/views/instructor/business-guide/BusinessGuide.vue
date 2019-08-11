<template>
    <div class="business-guide">
        <loading v-if="isRunning"></loading>
        <div class="cardDiv">
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="action" slot-scope="row">
                    <b-button
                            class="styledBtn"
                            :key="'c'+row.item.id"
                            :size="template_size"
                            variant="outline-primary"
                            @click="GuideOpen(row)"
                    >业务指导</b-button>
                </template>
            </b-table>
        </div>
        <b-modal size="lg" hide-footer centered id="GuideModal" ref="GuideModal" title="业务指导">
            <div class="p-4" v-if="guider.id">
                <guider-chat
                        :guider="guider"
                ></guider-chat>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import businessService from "@/services/businessService";
    import GuiderChat from "./GuiderChat";

    export default {
        name: "business-guide",
        components: {
            Loading,
            GuiderChat
        },
        data() {
            return {
                columns: {
                    id: {
                        label: "序号",
                        sortable: false,
                        class: "text-right field-id"
                    },
                    business_id: {
                        label: "业务序号",
                        sortable: false,
                        class: "text-right field-business_id"
                    },
                    business_name: {
                        label: "业务名称",
                        sortable: false,
                        class: "text-left field-business_name"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-left field-create_time"
                    },
                    request: {
                        label: "请求指导者姓名",
                        sortable: false,
                        class: "text-left field-request"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-left field-action"
                    }
                },
                allData: {
                    list: [],
                },
                guider: {}
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryBusinessGuide();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
        },
        methods: {
            queryBusinessGuide() {
                this.run();
                businessService
                    .getBusinessGuideList({})
                    .then(data => {
                        this.allData.list = data;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            GuideOpen(row) {
                this.$refs['GuideModal'].show();
                this.guider = row.item;
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .business-guide {
    }
</style>
