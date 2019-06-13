<template>
    <div class="project-guide-wrap">
        <b-tabs>
            <template slot="tabs">
                <b-nav-item
                    href="#"
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :active="tabIndex == index"
                    @click="tabChangeHandler(index)"
                >{{tab}}</b-nav-item>
            </template>
        </b-tabs>

        <div class="select-radio my-3">
            <b-form-group label="请选择">
                <b-form-radio-group v-model="is_current_node" :options="options"></b-form-radio-group>
            </b-form-group>
        </div>
        <div class="guide-doc-wrapper clearfix">
            <div class="doc-item text-left" v-for="(doc, index) in curDocs" :key="index">
                【{{doc.type}}】{{doc.name}}
                <a
                    href="javascript:void(0);"
                    class="btn-link btn-link-preview fr mx-2"
                    @click="previewFile(doc.url)"
                >预览</a>
                <a :href="doc.url" class="btn-link fr mx-2" target="_blank">下载</a>
            </div>
        </div>
    </div>
</template>
<script>
import { openFile } from "@/utils/previewFile";
export default {
    name: "ProgressProjectDoc",
    components: {},
    data() {
        return {
            tabs: ["材料", "公文", "模板", "关联文件"],
            tabIndex: 0,
            docType: [4, 5, 3, 2],
            is_current_node: true,
            curDocs: [],
            options: [
                { text: "当前环节", value: true },
                { text: "前面环节", value: false }
            ]
        };
    },
    computed: {
        metaInfo() {
            return this.$store.state.meta.info;
        },
        projectDocs() {
            return this.$store.state.meta.project_docs;
        },
        userInfo() {
            return this.$store.state.userInfo;
        }
    },
    methods: {
        previewFile(fileUrl) {
            openFile(fileUrl, this.userInfo.id);
        },
        tabChangeHandler(index) {
            this.tabIndex = index;
        }
    },
    watch: {
        tabIndex(val) {
            this.is_current_node = true;
            this.curDocs = this.projectDocs.cur_docs.filter(doc => {
                return doc.usage === this.docType[val];
            });
        },
        is_current_node(val) {
            if (val) {
                this.curDocs = this.projectDocs.cur_docs.filter(doc => {
                    return doc.usage === this.docType[this.tabIndex];
                });
            } else {
                this.curDocs = this.projectDocs.pre_docs.filter(doc => {
                    return doc.usage === this.docType[this.tabIndex];
                });
            }
        },
        projectDocs: {
            handler(data) {
                this.curDocs = data.cur_docs.filter(doc => {
                    return doc.usage === this.docType[this.tabIndex];
                });
            },
            deep: true
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.project-guide-wrap {
    .select-radio {
        border-bottom: 1px solid #e1e3e8;
    }
    .doc-item {
        border-bottom: 1px dashed grey;
    }
}
</style>
