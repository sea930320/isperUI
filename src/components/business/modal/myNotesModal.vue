<template>
    <b-modal v-model="visible" title="我的笔记" :hide-footer="true" size="lg">
        <div class="collapse-wrapper my-notes-wrapper">
            <p>只有当前环节才可以编辑笔记，其他环节只可查看</p>
            <b-card no-body class="mb-1" v-for="(node, index) in noteList" :key="index">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                        block
                        href="#"
                        v-b-toggle="'accordion-' + index"
                        variant="info"
                    >{{node.node_name + (node.can_edit ? '(当前环节)' : '')}}</b-button>
                </b-card-header>
                <b-collapse :id="'accordion-' + index" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <div v-if="node.can_edit" class="note-container clearfix">
                            <div class="textarea-wrap">
                                <textarea
                                    class="note-textarea"
                                    placeholder="请输入笔记..."
                                    ref="note"
                                    :value="node.note ? node.note.content : ''"
                                ></textarea>
                                <p class="note-text-counter">
                                    <span class="note-limit"></span>最多1000个字符
                                </p>
                            </div>
                            <b-button variant="outline-info" class="fr" @click="saveNotes">保存</b-button>
                        </div>
                        <p v-else class="note-text">{{node.note ? node.note.content : '暂无'}}</p>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>
    </b-modal>
</template>
<script>
import businessService from "@/services/businessService";
export default {
    data() {
        return {
            visible: false,
            counter: 0,
            noteList: []
        };
    },
    components: {},
    created() {
        this.$parent.$on("openMyNotesModal", () => {
            this.visible = true;
        });
    },
    methods: {
        cancelNotes() {
            this.$emit("on-cancel");
        },
        saveNotes() {
            let noteContent = this.$refs.note[0].value;
            if (noteContent.trim() === "") {
                this.$toasted.error("请输入笔记后提交");
                return;
            }
            if (noteContent.trim().length > 1000) {
                this.$toasted.error("对多不可超过一千个字符");
                return;
            }
            if (
                this.$route.params.bid &&
                this.$route.params.nid &&
                noteContent
            ) {
                businessService
                    .saveBusinessNote({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        content: noteContent
                    })
                    .then(() => {
                        this.$toasted.success("保存成功");
                    });
            }
        },
        init() {
            if (!this.$route.params.bid) return;
            businessService
                .getBusinessNoteList({
                    business_id: this.$route.params.bid
                })
                .then(data => {
                    this.noteList = data;
                });
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.init();
            }
        }
    }
};
</script>
<style>
.note-container .textarea-wrap {
    position: relative;
    border: 1px solid #d3dce0;
    padding: 8px 10px;
    margin-bottom: 10px;
    transition: border-color 0.2s;
    -webkit-transition: border-color 0.2s;
    -moz-transition: border-color 0.2s;
    -o-transition: border-color 0.2s;
}
.note-text-counter {
    position: absolute;
    right: 5px;
    bottom: 3px;
    font-size: 12px;
    line-height: 1em;
    color: #ccc;
}
.note-textarea {
    width: 100%;
    height: 200px;
    border: none;
    font-size: 14px;
    line-height: 1.8;
    word-break: break-all;
}
.note-text {
    line-height: 24px;
    color: #666;
    font-size: 12px;
    word-break: break-all;
}
</style>
