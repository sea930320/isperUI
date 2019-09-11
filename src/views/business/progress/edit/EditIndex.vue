<template>
    <div class="edit-main-body">
        <!-- main container -->
        <div class="edit-content-wrapper clearfix">
            <div class="editor-container">
                <div class="w-100 bordered">
                    <div v-if="edit_mode === 0" class="empty">
                        <p class="text">请选择应用模板</p>
                    </div>
                    <div v-if="edit_mode" style="height:600px!important;">
                        <vue-editor class="w-100 h-92" v-model="template_text" placeholder="请输入内容"></vue-editor>
                    </div>
                    <div v-if="edit_mode > 0 && sign_status > 0" class="sign">
                        <p v-if="sign_status === 1" class="mb-0">{{doc_sign}}</p>
                        <a
                                v-if="sign_status === 2"
                                class="btn-link mb-0"
                                @click="sign_image_dialog=true"
                                href="javascript:"
                        >图片</a>
                    </div>
                </div>
            </div>
            <div class="operate-container w-35">
                <div class="template-list-container border">
                    <h3 class="court-title">
                        {{metaInfo.name}}
                        <span class="node">【{{metaInfo.nodeName}}】</span>
                    </h3>
                    <div class="template-list-table">
                        <table class="table table-green">
                            <thead>
                            <tr>
                                <th style="width: 50%">文件名</th>
                                <!--<th style="width: 25%">提交人</th>-->
                                <th style="width: 25%">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(doc, index) in docs.list" :key="index">
                                <td>
                                    <a href="javascript:" @click="selectTemplate_link(doc)">{{doc.name}}</a>
                                </td>
                                <td>
                                    <a :href="doc.url" class="btn-link" target="_blank">下载</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- bottom button -->
        <div class="edit-bottom-button-content">
            <div class="spe-group">
                <a href="javascript:" class="btn-spe fl" @click="onUpload">
                    <icon name="upload"/>
                    <p class="mb-0">&nbsp;上传附件</p>
                </a>
                <a href="javascript:" class="btn-spe fl" @click="onNewTemplate">
                    <icon name="file-alt"/>
                    <p class="mb-0">&nbsp;新建文件</p>
                </a>
                <a href="javascript:" class="btn-spe fl" @click="onTemplateList">
                    <icon name="file-alt"/>
                    <p class="mb-0">&nbsp;应用模板</p>
                </a>
                <div href="javascript:" class="sign-container btn-spe" v-if="edit_mode !== 0">
                    <icon name="edit"/>
                    <p class="mb-0">&nbsp;签名:&nbsp;</p>
                    <p>(&nbsp;</p>
                    <a href="javascript:" @click="onSignImage">签名图片</a>
                    <p>&nbsp;|&nbsp;</p>
                    <a href="javascript:" @click="onSignText">签名体</a>
                    <p>&nbsp;)</p>
                </div>
                <a href="javascript:" class="btn-spe fl" v-if="sign_status > 0" @click="onRemoveSign">
                    <icon name="edit"/>
                    <p class="mb-0">&nbsp;取消签名</p>
                </a>
                <b-button
                        v-if="currentRoleAllocation.can_terminate"
                        size="sm"
                        variant="outline-primary"
                        @click="commit_end = true"
                        class="edit-bottom-button"
                >
                    <p class="mb-0">&nbsp;结束并走向</p>
                </b-button>
                <b-button
                        v-if="edit_mode"
                        size="sm"
                        variant="outline-primary"
                        @click="onSave"
                        class="edit-bottom-button"
                >
                    <p class="mb-0">&nbsp;&nbsp;保存</p>
                </b-button>
            </div>
        </div>

        <!-- upload template -->
        <upload-modal @on-uploadConfirm="uploadTemplates"></upload-modal>

        <!-- image sign -->
        <b-modal
                v-model="sign_image_upload_dialog"
                :hide-header="true"
                :hide-footer="true"
                :centered="true"
        >
            <upload
                    :url="sign_image_url"
                    :only-single="true"
                    field="file"
                    max-size="2480"
                    @uploadSuccess="onSignImageSuccess"
                    @uploadFail="onSignImageFail"
            />
        </b-modal>
        <image-view :visible="sign_image_dialog" :src="doc_sign" @on-close="sign_image_dialog=false"></image-view>

        <!-- template list -->
        <b-modal
                v-model="template_list_dlg"
                title="应用模板"
                ok-title="确定"
                cancel-title="取消"
                @ok="selectTemplate"
                @cancel="template_list_dlg=false"
        >
            <div class="template-list-content" v-loading="template_list_loading">
                <div v-if="!template_list_loading && templates.length === 0">
                    <div class="modal-message">
                        <p class="message">该身份没有模板可用，请使用新建文件功能编辑保存后，才可使用应用模板功能</p>
                    </div>
                </div>
                <div v-else class="max-height-box">
                    <b-form-radio-group v-model="selected_doc" stacked>
                        <b-form-radio
                                v-for="(template, index) in templates"
                                :key="index"
                                :value="template"
                        >{{template.name}}
                        </b-form-radio>
                    </b-form-radio-group>
                </div>
            </div>
        </b-modal>

        <!-- file save -->
        <b-modal
                v-model="template_save_dlg"
                title="提示"
                ok-title="确定"
                cancel-title="取消"
                @cancel="template_save_dlg=false"
                @ok="saveTemplate"
        >
            <div class="modal-message">
                <p class="message">确定要保存该新建的文件吗？</p>
                <p class="tip">请填写文件名后 点确定按钮</p>
                <div>
                    <input class="inp-new" type="text" placeholder="请填写文件名称" v-model.trim="template_name"/>
                </div>
            </div>
        </b-modal>

        <!-- end dialog -->
        <end-node-handle :isCommit="commit_end" @on-cancel="commit_end=false"></end-node-handle>
        <siderUserBar></siderUserBar>
    </div>
</template>
<script type="text/ecmascript-6">
    import uploadModal from "@/components/common/uploadModal";
    import endNodeHandle from "@/components/business/modal/endNodeHandle";
    import businessService from "@/services/businessService";
    import {VueEditor} from "vue2-editor";
    import * as actionCmd from "@/components/business/common/actionCmds";
    import upload from "@/components/upload/Upload";
    import ImageView from "@/components/imageView/ImageView";
    import siderUserBar from "@/components/business/common/SiderUserBar";

    export default {
        name: "edit",
        components: {
            endNodeHandle,
            VueEditor,
            uploadModal,
            upload,
            ImageView,
            siderUserBar
        },
        // socket io
        // get message and update ui
        sockets: {
            connect() {
            },

            getMessage(msg) {
                if (!msg.result) {
                    return;
                }
                if (!msg.result.business) {
                    return;
                }
                if (
                    msg.result.business === this.$route.params.bid &&
                    (msg.result.msg.startsWith("新建文件") ||
                        msg.result.msg.startsWith("上传文件") ||
                        msg.result.msg.startsWith("保存编辑模板"))
                ) {
                    this.updateList();
                }
            }
        },

        data() {
            return {
                // 0 : default, 1: template, 2: new
                edit_mode: 0,
                template_text: "",
                template_save_dlg: false,
                template_name: "",
                template_list_dlg: false,
                template_list_loading: false,
                commit_end: false,
                selected_doc: null,
                sign_status: 0,
                doc_sign: "",
                sign_image_url: "/api/file/upload",
                sign_doc_state: "",
                sign_image_upload_dialog: false,
                templates: [],
                sign_image_dialog: false,
                docs: {
                    list: [],
                    total: 0
                }
            };
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            },
            metaInfo() {
                return this.$store.state.meta.info;
            },
            currentRoleAllocation() {
                return this.$store.state.meta.currentRoleAllocation;
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            currentRoleAllocation: {
                handler() {
                    this.template_text = "";
                    this.edit_mode = false;
                },
                deep: true
            }
        },
        methods: {
            init() {
                this.template_text = "";
                this.edit_mode = 0;
                this.updateList();
            },

            // New button @click
            onNewTemplate() {
                this.edit_mode = 2;
                this.template_text = "";
                this.sign_status = 0;
                this.doc_sign = "";
            },

            // Upload button @click
            // call after upload call uploadTemplates
            onUpload() {
                this.$emit("openUploadModal", {
                    uploadUrl: "/api/business/docs/create",
                    uploadParams: {
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        role_alloc_id: this.currentRoleAllocation.alloc_id
                    }
                });
            },

            uploadTemplates(data) {
                businessService
                    .pushMessage({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        role_alloc_id: this.currentRoleAllocation.alloc_id,
                        msg: "上传文件: " + data.map(doc => doc.name).join("、"),
                        cmd: actionCmd.ACTION_DOC_REFRESH,
                        type: "cmd"
                    })
                    .then(() => {
                        this.$toasted.success("上传成功");
                    });
                //}
            },

            // set sign
            onSignImage() {
                this.sign_image_upload_dialog = true;
            },
            // sucess on upload sign image
            onSignImageSuccess(data) {
                this.sign_image_upload_dialog = false;
                this.$toasted.info("添加了签名");
                this.doc_sign = data.d.url;
                this.sign_status = 2;
            },
            onSignImageFail() {
                this.$toasted.error("上传签名图片失败");
            },
            onSignText() {
                this.sign_status = 1;
                this.doc_sign = `${this.userInfo.name}(${this.currentRoleAllocation.role.name})`;
                this.$toasted.info("添加了签名");
            },
            onRemoveSign() {
                this.sign_status = 0;
                this.doc_sign = "";
                this.$toasted.info("签名取消");
            },

            // save button clicked
            onSave() {
                if (this.template_text === "") {
                    this.$toasted.error("文件内容不能为空");
                    return;
                }
                if (this.edit_mode === 1) {
                    // save from template
                    businessService
                        .createBusinessTemplate({
                            business_id: this.$route.params.bid,
                            node_id: this.$route.params.nid,
                            doc_id: this.selected_doc.id,
                            content: this.template_text
                        })
                        .then(() => {
                            businessService
                                .pushMessage({
                                    business_id: this.$route.params.bid,
                                    node_id: this.$route.params.nid,
                                    role_alloc_id: this.currentRoleAllocation.alloc_id,
                                    force_txt_mode: 1,
                                    msg: `保存编辑模板"${this.selected_doc.name}"`,
                                    type: "txt"
                                })
                                .then(() => {
                                    this.$toasted.success("保存编辑模板成功");
                                });
                        });

                    this.updateSignInfo();
                    this.selected_doc.content = this.template_text;
                } else if (this.edit_mode === 2) {
                    // new file
                    // show file save dialog
                    this.template_name = "";
                    this.template_save_dlg = true;
                }
            },

            // this will be saved in t_business_doc_content
            saveTemplate() {
                if (!this.template_name) {
                    this.$toasted.error("请输入文件名称");
                    return;
                }
                if (this.template_name.length > 20) {
                    this.$toasted.error("文件名称不能超过20个字符");
                    return;
                }
                // save docs
                businessService
                    .newBusinessTemplate({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        role_alloc_id: this.currentRoleAllocation.alloc_id,
                        name: this.template_name,
                        content: this.template_text
                    })
                    .then(doc => {
                        this.selected_doc = doc;
                        this.updateSignInfo();
                        businessService
                            .pushMessage({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                role_alloc_id: this.currentRoleAllocation.alloc_id,
                                force_txt_mode: 1,
                                msg: `新建文件"${this.template_name}"`,
                                type: "txt"
                            })
                            .then(() => {
                                this.edit_mode = 0;
                                this.$toasted.success("新建文件成功");
                                this.template_save_dlg = false;
                            });
                    });
            },

            updateSignInfo() {
                businessService
                    .templateSign({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        project_role_id: this.currentRoleAllocation.role.project_role_id,
                        doc_id: this.selected_doc.id,
                        status: this.sign_status,
                        content: this.doc_sign
                    })
                    .then(() => {
                        this.selected_doc.sign_status = this.sign_status;
                        this.selected_doc.sign = this.doc_sign; // temp code
                        businessService
                            .pushMessage({
                                business_id: this.$route.params.bid,
                                node_id: this.$route.params.nid,
                                role_alloc_id: this.currentRoleAllocation.alloc_id,
                                force_txt_mode: 1,
                                msg:
                                    this.sign_status > 1
                                        ? `${this.currentRoleAllocation.role.name}已经在《${this.selected_doc.name}》上签收`
                                        : `${this.currentRoleAllocation.role.name}已经在《${this.selected_doc.name}》取消签收`,
                                type: "txt"
                            })
                            .then(() => {
                            });
                    });
            },

            // select the application template
            selectTemplate() {
                if (!this.selected_doc || (this.selected_doc && !this.selected_doc.id)) {
                    this.$toasted.info("请选择一个应用模板");
                    return;
                }

                this.edit_mode = 1;
                this.template_text = this.selected_doc.content;
                this.sign_status = this.selected_doc.sign_status;

                if (this.sign_status > 0) {
                    this.doc_sign = this.selected_doc.sign;
                }
                businessService.pushMessage({
                    business_id: this.$route.params.bid,
                    node_id: this.$route.params.nid,
                    role_alloc_id: this.currentRoleAllocation.alloc_id,
                    force_txt_mode: 1,
                    msg: `查看模板"${this.selected_doc.name}"`,
                    type: "txt"
                });
            },

            // select the application template from right side
            selectTemplate_link(doc) {
                this.selected_doc = doc;
                this.selectTemplate();
            },
            // show template list
            onTemplateList() {
                // get template list
                this.template_list_loading = true;
                this.selected_doc = null;
                this.updateList();
                // show list dialog
                this.template_list_dlg = true;
            },

            // update right side template list
            updateList() {
                businessService
                    .getBusinessTemplates({
                        business_id: this.$route.params.bid,
                        node_id: this.$route.params.nid,
                        role_alloc_id: this.currentRoleAllocation.alloc_id,
                        edit_module: 1,
                        usage: 3
                    })
                    .then(data => {
                        this.templates = data;
                        if (data.length !== 0) {
                            this.docs.list = data;
                        }
                        this.template_list_loading = false;
                    });
            }
        }
    };
</script>

<style lang='css' scoped>
    @import "./edit.css";
</style>
