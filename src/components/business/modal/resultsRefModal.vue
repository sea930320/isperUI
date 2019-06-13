<template>
    <b-modal v-model="visible" title="成果参考" size="lg" :hide-footer="true">
        <div class="results-ref-wrapper">
            <div v-if="templates.length == 0" class="no-result">
                <p class="text">没有配置相关数据</p>
            </div>
            <div v-else class="table-wrapper">
                <table class="table table-green table-border table-tac table-hover">
                    <thead>
                        <tr>
                            <th>文件名</th>
                            <th>类型</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(template, index) in templates" :key="index">
                            <td>{{template.name}}</td>
                            <td>{{template.type}}</td>
                            <td>
                                <a
                                    href="javascript:void(0);"
                                    class="btn-link"
                                    @click="previewFile(template.url)"
                                >预览</a>
                                <a :href="template.url" class="btn-link" target="_blank">下载</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </b-modal>
</template>
<script>
import { mapState } from "vuex";
import businessService from "@/services/businessService";
import { openFile } from "@/utils/previewFile";
export default {
    data() {
        return {
            visible: false,
            templates: []
        };
    },
    components: {},
    created() {
        this.$parent.$on("openResultsRefModal", () => {
            this.visible = true;
        });
    },
    computed: {
        ...mapState(["userInfo", "meta"]),
        metaInfo() {
            return this.meta.info;
        },
        currentRoleAllocation() {
            return this.meta.currentRoleAllocation;
        }
    },
    watch: {
        visible(val) {
            if (val) {
                if (!this.$route.params.bid) return;
                businessService
                    .getBusinessTemplates({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        role_alloc_id: this.currentRoleAllocation.alloc_id,
                        usage: 6
                    })
                    .then(data => {
                        this.templates = data;
                    });
            }
        }
    },
    methods: {
        cancelShow() {
            this.$emit("on-cancel");
        },
        previewFile(fileUrl) {
            openFile(fileUrl, this.userInfo.id);
        }
    }
};
</script>
