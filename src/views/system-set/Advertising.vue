<template>
    <div class="advertising_Index">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col  sm="6"><br>
                <div class="cardDiv">
                    <b-table :items="advertising.list" responsive small hover :fields="columns" head-variant>
                        <template slot="name" slot-scope="row">
                            {{row.item.name}}
                        </template>
                        <template slot="creat_time" slot-scope="row">
                            {{row.item.create_time}}
                        </template>
                        <template slot="preview_icon" slot-scope="row">
                            <a
                                    href="javascript:;"
                                    class="btn-link"
                                    title="预览"
                                    @click="previewFile(row.item.path)"
                            >
                                <icon name="eye"></icon>
                            </a>
                        </template>
                        <template slot="download_icon" slot-scope="row">
                            <a
                                    :href="row.item.path"
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
                            >
                                <icon name="trash-alt"></icon>
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
            <b-col  sm="6"><br><br>
                <b-row>
                    <!--<div class="cardDiv" style="width:100%">-->
                    <b-col sm="12">
                        <b-form-group
                                id="fieldset-horizontal"
                                label-cols-sm="4"
                                label-cols-lg="3"
                                label="公告名称:"
                                label-for="input-horizontal"
                        >
                            <b-form-input id="input-horizontal" v-model="ad_name" required ></b-form-input>
                        </b-form-group>
                    <!--</div>-->
                    </b-col>
                </b-row>
                <b-row>
                    <!--<div class="cardDiv" style="width:100%">-->
                    <b-col sm="12">
                        <b-form-group
                                id="fieldset-horizontal"
                                label-cols-sm="4"
                                label-cols-lg="3"
                                label="发布时间:"
                                label-for="input-horizontal"
                        >
                            <b-form-input type="date" v-model="public_time"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <!--</div>-->
                </b-row>
                <b-row>
                    <div class="cardDiv">
                        <!--<button @click="saveContent"></button>-->
                        <!--<button @click="setEditorContent">Set Editor Contents</button>-->
                        <vue-editor v-model="ad_content"></vue-editor>
                        <!--<div v-html="content"></div>-->
                        <!--<vue-editor-->
                                <!--:customModules="customModulesForEditor"-->
                                <!--:editorOptions="editorSettings"-->
                                <!--v-model="content">-->
                        <!--</vue-editor>-->
                    </div>
                </b-row>
                <b-row>
                    <b-col sm="12">
                        <b-button size="lg"  class="styledBtn" variant="outline-primary"  @click="saveDoc()">保存</b-button>
                    </b-col>
                </b-row>
            </b-col>

        </b-row>
        <br><br>
    </div>
</template>

<script>
    import Loading from "@/components/loading/Loading";
    import _ from "lodash";
    import AdvertisingService from "@/services/advertisingService";
    import  { openFile }  from "@/components/previewFile";
    import { mapState } from "vuex";
    import { VueEditor} from 'vue2-editor'
//    import { ImageDrop } from 'quill-image-drop-module'
//    import ImageResize from 'quill-image-resize-module'
//    Quill.register('modules/imageDrop', ImageDrop);
//    Quill.register('modules/imageResize', ImageResize);


    export default {
        name: "dictionary_index",
        components: {
            Loading,
            VueEditor,
        },
        created() {
            this.$nextTick(() => {
                this.queryAdvertisingList();
            });
        },
        data() {
            return {
                ad_name:"",
                public_time:"",
                ad_content:null,
                advertising: {
                    list: [],
                    total: 0
                },
                columns: {
                    name: {
                        label: "公告名称",
                        sortable: false,
                        class: "text-center field-50"
                    },
                    create_time:{
                        label: "创建时间",
                        sortable: false,
                        class: "text-center field-20"
                    },
                    preview_icon:{
                        label: "预览",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    download_icon:{
                        label: "下载",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    delete_icon: {
                        label: "删除",
                        sortable: false,
                        class: "text-center field-10"
                    },
                },
                queryParam: {
                    page: 1,
                    size: 7
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
                    .getAdvertisingList({ ...this.queryParam, ...this.queryDebounceParam })
                    .then(data => {
                        this.advertising.list = data.results;
                        this.advertising.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            saveDoc(){
//                this.run();
                AdvertisingService
                    .createAdvertising({"ad_name":this.ad_name,"public_time":this.public_time,"ad_content":this.ad_content})
                    .then(() => {
                        this.$toasted.success('保存成功');
                        this.ad_name = "";
                        this.public_time = null;
                        this.ad_content = "";
                        this.queryAdvertisingList();
                    })
                    .catch(() => {
                        return;
                    });
            },
            deleteAdvertisingConfirm(item){
                this.run();
                AdvertisingService
                    .deleteAdvertising({advertising_id:parseInt(item.id)})
                    .then(() => {
                        this.queryAdvertisingList();
                    })
            },
            previewFile(fileUrl) {
                alert(this.userInfo.id)
                openFile(fileUrl, this.userInfo.id)
            },
            saveContent: function() {
                // You have the content to save
                alert(this.content);
            },
//            setEditorContent: function() {
//                this.content = '<h1>Html For Editor</h1>'
//            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .field-50{
        width:50%
    }
    .field-20{
        width:20%
    }
    .field-10{
        width:10%
    }
    .advertising_Index {
        .plusBtn {
            font-size: 13.8px !important;
            font-weight: bold;
            width: 20px;
            height: 20px;
            margin-top: 2px;
            float: right;
            padding: 0;
        }
        .cardDiv1 {
            padding: 15px;
            background-color: white;
            margin: 8px 0;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.2), 0 6px 25px 0 rgba(0, 0, 0, 0.19);
        }
        .align-items-center.d-flex.justify-content-between.list-group-item {
            padding: 7px 8px 7px 15px;
        }
        .subListItem {
            padding: 3px 8px 3px 30px !important;
            font-size: 16px !important;
            color: darkgrey !important;
        }
        .d-inline-flex.list-group.py-2 {
            width: 22%;
        }
        .cardDiv1.d-inline-flex.py-2 {
            width: 22%;
        }
        .cycle {
            -webkit-transition-duration: 0.3s;
            -moz-transition-duration: 0.3s;
            -o-transition-duration: 0.3s;
            transition-duration: 0.3s;
            -webkit-transition-property: -webkit-transform;
            -moz-transition-property: -moz-transform;
            -o-transition-property: -o-transform;
            transition-property: transform;
        }
    }
</style>