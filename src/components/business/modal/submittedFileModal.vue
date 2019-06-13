<template>
    <div>
        <loading v-if="isRunning"></loading>
        <!-- 已提交文件Modal -->
        <b-modal v-model="visible" title="已提交文件" size="lg" class :hide-footer="true">
            <div class="table-wrapper table-fixed-header">
                <div class="table-header">
                    <table class="table table-green table-border table-hover">
                        <colgroup>
                            <col width="30%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>文件名</th>
                                <th>提交环节</th>
                                <th>提交人</th>
                                <th>签字</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="table-body h440">
                    <table class="table table-green table-hover">
                        <colgroup>
                            <col width="30%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                        </colgroup>
                        <tbody>
                            <tr v-for="(doc, index) in docs.list" :key="index">
                                <td>
                                    <a href="javascript:;">{{doc.filename}}</a>
                                </td>
                                <td>{{doc.node_name}}</td>
                                <td>{{doc.created_by ? doc.created_by.name : ''}}</td>
                                <td>
                                    <div class="pr">
                                        <span
                                            class="btn-link"
                                            v-if="!doc.signs || doc.signs.length == 0"
                                        >暂无</span>
                                        <span
                                            class="btn-link"
                                            v-else
                                            target="_blank"
                                            @click.stop="showSignHandle(index)"
                                        >查看</span>
                                        <div class="sign-view-detail" v-show="signShow === index">
                                            <p v-if="doc.signs.length == 0">暂无</p>
                                            <p
                                                v-else
                                                v-for="(sign, index) in doc.signs"
                                                :key="index"
                                            >
                                                <span v-if="sign.sign_status == 1">{{sign.sign}}已签字</span>
                                                <span
                                                    v-if="sign.sign_status == 2"
                                                >{{sign.sign}}已拒绝签字</span>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="cz">
                                    <a
                                        href="javascript:void(0);"
                                        class="btn-link"
                                        @click="previewFile(doc.url)"
                                    >预览</a>
                                    <a :href="doc.url" class="btn-link" target="_blank">下载</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
import Loading from "@/components/loading/Loading";
import { openFile } from "@/utils/previewFile";
import businessService from "@/services/businessService";
import { mapState } from "vuex";
export default {
    components: { Loading },
    data() {
        return {
            visible: false,
            signShow: -1,
            checkSignModal: false,
            checkFileModal: false,
            fileViewerModal: false,
            pageParam: {
                page: 1,
                size: 10
            },
            docs: {
                list: [],
                total: 0
            }
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    created() {
        this.$parent.$on("openSubmittedFileModal", () => {
            this.visible = true;
        });
    },
    methods: {
        cancelCommit() {
            this.$emit("on-cancel");
        },
        previewFile(fileUrl) {
            openFile(fileUrl, this.userInfo.id);
        },
        init() {
            if (!this.$route.params.bid) return;
            businessService
                .getBusinessDisplayList({
                    business_id: this.$route.params.bid
                })
                .then(data => {
                    this.docs.list = data.results;
                    this.docs.total = data.paging.count;
                });
        },
        // 查看签字处理
        showSignHandle(index) {
            this.signShow === index
                ? (this.signShow = -1)
                : (this.signShow = index);
        }
    },
    mounted() {
        document.addEventListener("click", () => {
            this.signShow = -1;
        });
    },
    watch: {
        visible(val) {
            if (val) {
                this.init();
            }
        },
        pageParam: {
            handler() {
                this.init();
            },
            deep: true
        }
    }
};
</script>
