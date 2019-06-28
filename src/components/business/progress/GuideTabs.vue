<template>
    <div class="guide-tabs-wrapper">
        <tab :tabtitles="['操作指南', '项目素材', '关联文件']" current-page="1" color="blue" type="border-card">
            <div class="tab-container" :style="tabsHeight">
                <p
                    v-for="(guide, index) in guides"
                    :key="index"
                    v-html="replaceContent(guide.content)"
                ></p>
            </div>
            <div class="tab-container" :style="tabsHeight">
                <tab
                    :tabtitles="['材料', '公文', '模板']"
                    type="capsule"
                    @tab-change-start="tabChangeHandler"
                >
                    <div class="tab-container" v-for="(type, index) in docType" :key="index">
                        <div class="select-radio">
                            <Radio-group v-model="is_current_node">
                                <label>请选择</label>
                                <Radio :label="true">当前环节</Radio>
                                <Radio :label="false">前面环节</Radio>
                            </Radio-group>
                        </div>
                        <div class="guide-doc-wrapper clearfix">
                            <div class="doc-item" v-for="(doc, index) in curDocs" :key="index">
                                【{{doc.type}}】{{doc.name}}
                                <a
                                    href="javascript:void(0);"
                                    class="btn-link btn-link-preview"
                                    @click="previewFile(doc.url)"
                                >预览</a>
                                <a :href="doc.url" class="btn-link" target="_blank">下载</a>
                            </div>
                        </div>
                    </div>
                </tab>
            </div>
            <div class="tab-container" :style="tabsHeight">
                <div class="guide-doc-wrapper clearfix">
                    <div class="doc-item" v-for="(doc, index) in related_files" :key="index">
                        【{{doc.type}}】{{doc.name}}
                        <a
                            href="javascript:void(0);"
                            class="btn-link btn-link-preview"
                            @click="previewFile(doc.url)"
                        >预览</a>
                        <a :href="doc.url" class="btn-link" target="_blank">下载</a>
                    </div>
                </div>
            </div>
        </tab>
    </div>
</template>
<script type="text/ecmascript-6">
import tab from "@/views/components/tabs/tabs";
import Radio from "@/views/components/radio/radio";
import RadioGroup from "@/views/components/radio/radio-group";
import businessService from "@/services/businessService";
import { openFile } from "@/utils/previewFile";
export default {
    name: "MetaGuideTabs",
    props: {
        height: {
            type: Number,
            default: 420
        }
    },
    data() {
        return {
            docType: [4, 5, 3],
            tabIndex: 1,
            is_current_node: true,
            curDocs: [],
            related_files: []
        };
    },
    computed: {
        metaInfo() {
            return this.$store.state.meta.info;
        },
        guides() {
            return this.$store.state.meta.guides;
        },
        projectDocs() {
            return this.$store.state.meta.project_docs;
        },
        tabsHeight() {
            if (this.height) {
                return {
                    height: this.height + "px"
                };
            }
            return "0px";
        },
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    mounted() {
        this.getRelatedFiles();
    },
    methods: {
        getRelatedFiles() {
            businessService
                .getBusinessTemplates({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    usage: 2
                })
                .then(data => {
                    this.related_files = data;
                });
        },
        docForType(type) {
            return this.projectDocs.cur_docs.filter(doc => {
                return doc.usage === type;
            });
        },
        replaceContent(con) {
            if (con) {
                return con.replace(/\r?\n|\r/g, "<br/>");
            } else {
                return "";
            }
        },
        tabChangeHandler(index) {
            this.tabIndex = index;
            this.is_current_node = true;
            this.curDocs = this.projectDocs.cur_docs.filter(doc => {
                return doc.usage === this.docType[index - 1];
            });
        },
        previewFile(fileUrl) {
            openFile(fileUrl, this.userInfo.id);
        }
    },
    watch: {
        is_current_node(val) {
            if (val) {
                this.curDocs = this.projectDocs.cur_docs.filter(doc => {
                    return doc.usage === this.docType[this.tabIndex - 1];
                });
            } else {
                this.curDocs = this.projectDocs.pre_docs.filter(doc => {
                    return doc.usage === this.docType[this.tabIndex - 1];
                });
            }
        },
        projectDocs: {
            handler(data) {
                this.curDocs = data.cur_docs.filter(doc => {
                    return doc.usage === this.docType[this.tabIndex - 1];
                });
            },
            deep: true
        }
    },
    components: { tab, Radio, RadioGroup }
};
</script>
