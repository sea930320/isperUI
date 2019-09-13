<template>
    <div class="advertising_Index">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col sm="5"><br>
                <div class="cardDiv">
                    <b-table :items="advertising.list" responsive small hover :fields="columns" head-variant>
                        <template slot="name" slot-scope="row">
                            {{row.item.name}}
                        </template>
                        <template slot="creat_time" slot-scope="row">
                            {{row.item.create_time}}
                        </template>
                        <template slot="preview_icon" slot-scope="row">
                            <b-link :to="row.item.link" style="color:#007bff" target="_blank">
                                <icon name="eye"></icon>
                            </b-link>
                        </template>
                        <template slot="download_icon" slot-scope="row">
                            <a
                                    :href="row.item.path_docx"
                                    class="btn-link"
                                    title="下载"
                                    target="_blank"
                            >
                                <icon name="file-word"></icon>
                            </a>
                        </template>
                        <template slot="delete_icon" slot-scope="row">
                            <a
                                    href="javascript:;"
                                    class="btn-link"
                                    title="删除"
                                    @click="deleteAdvertisingConfirm(row.item)"
                                    v-b-modal.deleteConfirmModal
                            >
                                <icon name="trash"></icon>
                            </a>

                        </template>

                    </b-table>
                </div>
                <b-row class="justify-content-center row-margin-tweak cardDiv">
                    <b-pagination
                            :size="template_size"
                            :total-rows="advertising.total"
                            :per-page="queryParam.size"
                            limit="5"
                            v-model="queryParam.page"

                    />
                </b-row>
            </b-col>
            <b-col sm="7"><br><br>
                <b-row>
                    <!--<div class="cardDiv" style="width:100%">-->
                    <b-col sm="12">
                        <b-form-group
                                label-cols-sm="2"
                                label-cols-lg="3"
                                label="公告名称:"
                                label-for="input-horizontal"
                        >
                            <b-form-input id="input-horizontal" maxlength="32" v-model="ad_name"
                                          placeholder="请输入名称（32个字以下）" required></b-form-input>
                        </b-form-group>
                        <!--</div>-->
                    </b-col>
                </b-row>
                <b-row>
                        <b-col sm="12">
                        <b-form-group
                                label-cols-sm="2"
                                label-cols-lg="3"
                                label="发布时间:"
                                label-for="input-horizontal"
                        >
                            <b-form-input type="date" v-model="public_time"></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="12">
                        <b-form-group
                                label-cols-sm="2"
                                label-cols-lg="3"
                                label="公告内容:"
                                label-for="input-horizontal"
                        >
                            <div class="cardDiv">
                                <vue-editor v-model="ad_content"></vue-editor>
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="3"></b-col>
                    <b-col lg="9">
                        <div class="input-group">
                            <b-form-input v-model="uploadedURL" disabled></b-form-input>
                            <b-button @click="checkURL()" v-b-tooltip.hover variant="primary" title="检查链接"><icon name="eye"></icon></b-button>
                            <b-button @click="copyURL()" v-b-tooltip.hover variant="primary" title="链接复制"><icon name="copy"></icon></b-button>
                        </div>
                    </b-col>
                </b-row>
                <br>
                <b-row>
                    <b-col sm="4"></b-col>
                    <b-col sm="4">
                        <sub-adver-upload @getFileURL="getFileURL"></sub-adver-upload>
                    </b-col>
                    <b-col sm="4">
                        <b-button size="lg" class="styledBtn" variant="outline-primary" @click="saveDoc()"><icon name="save"></icon>&nbsp;保存</b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <br><br>
        <b-modal id="deleteConfirmModal" title="删除公告" ok-title="确定" cancel-title="取消" @ok="deleteAdvertisingConfirmFunction(deleteAdvertising)">
            <p class="my-4">是否确认删除公告</p>l
        </b-modal>
    </div>
</template>

<script>
    import Loading from "@/components/loading/Loading";
    import _ from "lodash";
    import AdvertisingService from "@/services/advertisingService";
    import  {openFile}  from "@/components/previewFile";
    import {mapState} from "vuex";
    import {VueEditor} from 'vue2-editor'
    import SubAdverUpload from "@/components/upload/SubAdverUpload";


    export default {
        name: "dictionary_index",
        components: {
            Loading,
            VueEditor,
            SubAdverUpload
        },
        created() {
            this.$nextTick(() => {
                this.queryAdvertisingList();
            });
        },
        data() {
            return {
                ad_name: "",
                public_time: "",
                ad_content: null,
                advertising: {
                    list: [],
                    total: 0
                },
                uploadedBackupURL:"",
                uploadedURL:"",
                deleteAdvertising: '',
                columns: {
                    name: {
                        label: "公告名称",
                        sortable: false,
                        class: "text-left field-50"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-right field-20"
                    },
                    preview_icon: {
                        label: "预览",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    download_icon: {
                        label: "下载",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    delete_icon: {
                        label: "删除",
                        sortable: false,
                        class: "text-left field-10"
                    },
                },
                queryParam: {
                    page: 1,
                    size: 7,
                    is_home:false
                },
                queryDebounceParam: {
                    search: ""
                },
            };
        },

        watch: {
            queryParam: {
                handler() {
                    this.queryAdvertisingList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryAdvertisingList();
                }, 500)
            },
        },
        computed: {
            ...mapState(["userInfo"])
        },
        methods: {
            queryAdvertisingList(){
                this.run();
                AdvertisingService
                    .getAdvertisingList({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.advertising.list = data.results;
                        this.advertising.total = data.paging.count;
                        for (let j = 0; j < this.advertising.list.length; j++) {
                            var arr = this.advertising.list[j].path_html.split("/");
                            this.advertising.list[j].link = "/advertising/" + arr[arr.length - 1].replace(".html", "");
                        }
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            saveDoc(){

                AdvertisingService
                    .createAdvertising({
                        "ad_name": this.ad_name,
                        "public_time": this.public_time,
                        "ad_content": this.ad_content
                    })
                    .then(() => {
                        this.ad_name = "";
                        this.public_time = null;
                        this.ad_content = "";
                        this.queryAdvertisingList();
                        this.$toasted.success('保存成功');
                    })
                    .catch(() => {
                        return;
                    });
            },
            deleteAdvertisingConfirm(item){
                this.deleteAdvertising = item;
            },
            deleteAdvertisingConfirmFunction(item){
                this.run();
                AdvertisingService
                    .deleteAdvertising({advertising_id: parseInt(item.id)})
                    .then(() => {
                        this.queryAdvertisingList();
                    })
            },
            previewFile(fileUrl) {
                openFile(fileUrl, this.userInfo.id)
            },
            getFileURL(data){
                this.uploadedURL = data.fileURL;
                let tempURL = data.fileURL;
                this.uploadedBackupURL = tempURL;
            },
            copyURL(){
                if (this.uploadedURL.trim() == ""){
                    this.$toasted.error('请上传文件');
                    return
                }
                if (this.uploadedBackupURL == this.uploadedURL.trim()){
                    this.$copyText(this.uploadedURL.trim())
                        .then(() => {
                            this.$toasted.success("链接复制完了");
                        })
                        .catch(() => {
                            this.$toasted.error("链接复制失败");
                        });
                } else {
                    this.$toasted.error('链接错了');
                }
            },
            checkURL(){
                if (this.uploadedURL.trim() == ""){
                    this.$toasted.error('请上传文件');
                    return
                } else {
                    window.open(this.uploadedURL.trim(), "_blank");
                }
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .field-50 {
        width: 50%
    }

    .field-20 {
        width: 20%
    }

    .field-10 {
        width: 10%
    }

    .advertising_Index {
        padding: 10px;
    }
</style>