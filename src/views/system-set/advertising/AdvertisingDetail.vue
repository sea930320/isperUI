<template>
    <div class="manager-container main-bg" style="height:100%">
        <div class="container" style="min-height: calc(100vh - 210px); padding: 40px 0 0 0;">
            <loading v-if="isRunning"></loading>
            <!--<h3><a @click="$router.go(-1)">返回</a></h3>-->
            <h1> {{html_title}} </h1>
            <iframe :src="html_link" :key="'html-iframe-'+html_link" class="iframeFull"></iframe>
        </div>
    </div>
</template>
<script>
    import _ from "lodash";
    import AdvertisingService from "@/services/advertisingService";
    import  {openFile}  from "@/components/previewFile";
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    export default {
        name: "advertising_detail",
        components: {
            Loading,
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
                html_link:"",
                html_title:"",
                advertising: {
                    list: [],
                    total: 0
                },
                deleteAdvertising: '',
                columns: {
                    name: {
                        label: "公告名称",
                        sortable: false,
                        class: "text-center field-50"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-center field-20"
                    },
                    preview_icon: {
                        label: "预览",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    download_icon: {
                        label: "下载",
                        sortable: false,
                        class: "text-center field-10"
                    },
                },
                queryParam: {
                    page: 1,
                    size: 8
                },
                queryDebounceParam: {
                    search: "",
                    html_id:this.$route.params.Pid
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
                    .getAdvertisingListHome({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.advertising.list = data.results;
                        this.advertising.total = data.paging.count;
                        this.html_link = this.advertising.list[0].path_html;
                        this.html_title = this.advertising.list[0].name;
//                        this.$refs.iframe.contentWindow.location.replace("https://www.google.com")
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            previewFile(fileUrl) {
                openFile(fileUrl, this.userInfo.id)
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
    .iframeFull{
        width: 100%;
        height: 100%;
        border: none;
        min-height: calc(100vh - 210px);
    }
</style>

