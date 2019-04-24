<template>
    <div class="projects-index">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col lg="3" md="6" sm="12" class="mb-3">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                </b-input-group>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center mb-3">
                <b-button-group class="float-right">
                    <b-button :size="template_size" variant="outline-primary"  @click="createProjectPage()">新建项目</b-button>
                    <b-button :size="template_size" variant="outline-primary" @click="checkedIds()">导出</b-button>
                    <b-button :size="template_size" variant="outline-primary"  v-b-modal.shareConfirmModal :disabled="this.shareButtonDisabled">共享</b-button>
                    <!--<b-button :size="template_size" variant="outline-primary"  v-b-modal.shareConfirmModal>共享</b-button>-->
                    <b-button :size="template_size" variant="outline-primary" v-b-modal.unshareConfirmModal :disabled="this.unshareButtonDisabled">取消共享</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <b-table :items="projects.list" small striped hover :fields="columns" head-variant>
            <template slot="selected" slot-scope="row">
                <b-form-checkbox v-model="row.item.checked" @change="changeCheckBox($event, row.item)">
                <!--<b-form-checkbox v-model="row.item.checked" @change="checkedIds()">-->
                </b-form-checkbox>
            </template>
            <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
            <template slot="is_share" slot-scope="row">
                <icon v-if="row.item.is_share = 1" name="share"></icon>
            </template>
            <template slot="is_protected" slot-scope="row">
                <icon v-if="row.item.protected = 1" name="lock"></icon>
            </template>

            <template slot="name" slot-scope="row">
                {{row.item.name}}
            </template>
            <template
                    slot="creator"
                    slot-scope="row"
            >{{row.item.created_by ? row.item.created_by.name : 'n/a'}}</template>
            <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
            <template slot="dependence" slot-scope="row">
                {{row.item.flow.name}}
            </template>
            <template slot="public_status" slot-scope="row">
                {{(row.item.created_by==1) ? "不自由" : "自由"}}
            </template>
            <template slot="mission_type" slot-scope="row">
                {{row.item.course}}
            </template>
            <template slot="edit_control" slot-scope="row">
                <b-button-group class="float-right">
                    <b-button :size="template_size" variant="outline-primary">
                        <icon name="cog"></icon> 设置
                    </b-button>
                    <b-button :size="template_size" variant="outline-danger" v-b-modal.deleteConfirmModal @click="deleteProjectConfirm(row.item)">
                        <icon name="trash"></icon> 删除
                    </b-button>
                </b-button-group>
            </template>

        </b-table>
        <b-row class="justify-content-center row-margin-tweak">
            <b-pagination
                    :size="template_size"
                    :total-rows="projects.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"

            />
        </b-row>
        <div class="container pt-3" style="min-height: calc(100vh - 62px)">
            <router-view></router-view>
        </div>
        <!-- 查看大图Modal -->
        <imageView :visible="bigImgModal" :src="animationImgSrc" @on-close=" bigImgModal=false"></imageView>
        <!--//Confirm Delete Project-->
        <b-modal id="deleteConfirmModal" title="Delete Project" @ok="deleteProject()">
            <p class="my-4">Do you want to delete "{{this.currentProjectID.name}}" Project?</p>
        </b-modal>
        <!--&lt;!&ndash;Confirm Share Project&ndash;&gt;-->
        <b-modal id="shareConfirmModal" title="Project Sharing" @ok="shareProject()">
            <p class="my-4">Do you want to share Project(s)?</p>
        </b-modal>
        <!--&lt;!&ndash;Confirm UnShare Project&ndash;&gt;-->
        <b-modal id="unshareConfirmModal" title="Cancel Project Sharing" @ok="unshareProject()">
            <p class="my-4">Do you want to not share Project(s)?</p>
        </b-modal>
    </div>

</template>

<script>
    import { expType, level, abilityTarget } from "@/filters/fun";
    import { mapState } from "vuex";
    import Loading from "@/components/loading/Loading";
    import ProjectService from "@/services/projectService";
    import imageView from "@/components/imageView/ImageView";
    import _ from "lodash";
    // import arrayUtils from "@/utils/arrayUtils";
    // import dateUtils from "@/utils/dateUtils";

    export default {
        name: "project-index",
        components: {
            Loading,
            imageView
        },
        filters: {
            expType,
            level,
            abilityTarget
        },
        data() {
            return {
                columns: {
                    selected:{
                        label: "选择",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    sn: {
                        label: "序号",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    is_share:{
                        label: "",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    is_protected:{
                        label: "",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "项目名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    creator: {
                        label: "创建者",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-center field-create_time"
                    },
                    dependence: {
                        label: "渲染动画1",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    public_status: {
                        label: "开放模式",
                        sortable: false,
                        class: "text-center field-experiment_type_label"
                    },
                    mission_type: {
                        label: "事务类型",
                        sortable: false,
                        class: "text-center field-experiment_task_label"
                    },
                    edit_control: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                // 查询参数
                queryParam: {
                    status: "",
                    page: 1,
                    size: 5
                },
                queryDebounceParam: {
                    search: ""
                },
                // 流程列表
                projects: {
                    list: [],
                    total: 0
                },
                // 流程相关项目
                animationImgSrc: "",
                bigImgModal: false,
                currentProjectID:{},
                shareButtonDisabled: true,
                unshareButtonDisabled: true,
                checkedSharedItemsID:[],
                checkedUnsharedItemsID:[],
                checkedSharedItems:[],
                checkedUnsharedItems:[],
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryProjectList();
            });
        },
        computed: {
            ...mapState(["userInfo"])
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
                    this.queryProjectList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function() {
                    this.queryProjectList();
                }, 500)
            }
        },
        methods: {
            // 查询流程列表数据
            queryProjectList() {
                this.run();
                ProjectService
                    .getProjectList({ ...this.queryParam, ...this.queryDebounceParam })
                    .then(data => {
                        data.results.forEach(item => {
                            if (item.checked === undefined) {
                                item.checked = false;
                            }
                            if (item.locked === undefined) {
                                item.locked = false;
                            }
                        });
                        this.projects.list = data.results;
                        this.projects.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            //Delete Project Confirm
            deleteProjectConfirm(idValue){
                this.currentProjectID = idValue;
            },
            // Delete Project
            deleteProject(){
                alert(this.userInfo);
                this.run();
//                ProjectService
//                    .deleteProject({project_id:parseInt(this.currentProjectID.id)})
//                    .then(() => {
//                        this.queryProjectList();
//                    })
            },
            shareProject(){
                let ids = JSON.stringify(this.checkedUnsharedItemsID);
                alert(ids);
                this.run();
                ProjectService
                    .shareProject({data: ids})
                    .then(() => {
                        this.queryProjectList();
                    })
            },
            unshareProject(){
                let ids = JSON.stringify(this.checkedSharedItemsID);
                alert(ids);
                this.run();
                ProjectService
                    .unshareProject({data:ids})
                    .then(() => {
                        this.queryProjectList();
                    })
            },
            //check checked or not
            changeCheckBox(val, rowObj){
                this.$set(rowObj,'checked',val);
                this.checkedSharedItems = this.checkedItems().filter(item => item.is_share === 1 );
                this.checkedUnsharedItems = this.checkedItems().filter(item => item.is_share === 0 );
                if (this.checkedSharedItems.length > 0){
                    this.unshareButtonDisabled = false;
                }
                if (this.checkedUnsharedItems.length > 0){
                    this.unshareButtonDisabled = false;
                }
                this.checkedSharedItemsID = this.checkedSharedItems.map(item => item.id);
                this.checkedUnsharedItemsID = this.checkedUnsharedItems.map(item => item.id);
            },
            checkedItems() {
                return this.projects.list.filter(item =>item.checked === true)
            },
            // 查看渲染动画的大图
            showBigImg(animation) {
                this.animationImgSrc = animation.url;
                this.bigImgModal = true;
            },

            // Go To Create Project Page
            createProjectPage(){
                this.$router.push('/manager/project/create_project_wizard');
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .projects-index {
        .field-sn {
            width: 7%;
        }
        .field-name {
            width: 10%;
        }
        .field-creator {
            width: 9%;
        }
        .field-create_time {
            width: 9%;
        }
        .field-rend_ani_1 {
            width: 10%;
        }
        .field-rend_ani_2 {
            width: 10%;
        }
        .field-experiment_type_label {
            width: 10%;
        }
        .field-experiment_task_label {
            width: 10%;
        }
        .field-status {
            width: 5%;
        }
        .field-action {
            width: 20%;
        }
    }
</style>