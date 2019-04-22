<template>
    <div class="group-index">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col lg="3" md="6" sm="12" class="mb-3 mt-4">
                <b-row style="fontSize: 18px">
                    <icon name="home" style="width: 22px; height: 25px;" class="ml-3 mb-3 mr-3"></icon>
                    集群管理
                </b-row>
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                          <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder=""/>
                </b-input-group>
            </b-col>
            <b-col lg="9" md="6" sm="12" class="align-self-center mb-3 mt-5">
                <b-button-group class="float-right">
                    <b-button :size="template_size" variant="outline-primary" v-b-modal.newGroup @click="newGroup = {
                        name: '',
                        comment: '',
                        default: null,
                        publish: null,
                        managerName: '',
                        managerPass: ''
                    }">添加集群
                    </b-button>
                    <b-modal hide-footer id="newGroup" ref="newGroup" title="添加集群">
                        <div>
                            <b-form @submit="onSubmit" class="container w-80 pt-3">
                                <b-form-group id="input-group-1" label-for="name">
                                    <b-form-input
                                            id="name"
                                            v-model="newGroup.name"
                                            required
                                            placeholder="集群名称"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group id="input-group-2" label-for="input-2">
                                    <b-form-textarea
                                            id="input-21"
                                            rows="3"
                                            no-resize
                                            v-model="newGroup.comment"
                                            required
                                            placeholder="集群描述"
                                    ></b-form-textarea>
                                </b-form-group>
                                <b-form-radio-group v-model="newGroup.default" :options="options1" :state="state1"
                                                    name="default">
                                    <span class="float-left">是否为默认集群 :</span>
                                </b-form-radio-group>
                                <br/>
                                <b-form-radio-group v-model="newGroup.publish" :options="options2" :state="state2"
                                                    name="publish">
                                    <span class="float-left">是否为公开集群 :</span>
                                </b-form-radio-group>
                                <br/>
                                <b-form-group id="input-group-2" class="text-left" label="创建管理员 :" label-for="input-2">
                                    <b-form-input
                                            id="input-22"
                                            v-model="newGroup.managerName"
                                            required
                                            placeholder="管理员账号"
                                            autocomplete="username"
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group id="input-group-2" label-for="input-2">
                                    <b-form-input
                                            id="input-23"
                                            v-model="newGroup.managerPass"
                                            required
                                            placeholder="管理员密码"
                                            type="password"
                                            autocomplete="new-password"
                                    ></b-form-input>
                                </b-form-group>
                                <b-button class="mt-3 my-4" block type="submit" variant="primary">保 存</b-button>
                            </b-form>
                        </div>
                    </b-modal>
                    <b-button :size="template_size" variant="outline-primary" @click="this.deleteGroup">删除集群</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <b-table :items="allgroup.list" small striped hover :fields="columns" head-variant style="fontSize: 18px">
            <template slot="check" slot-scope="row">
                <b-form-checkbox
                        :id="row.item.id.toString()"
                        v-model="selected"
                        name="checkbox"
                        :value="row.item.id"
                        unchecked-value=""
                >
                </b-form-checkbox>
            </template>
            <template slot="id" slot-scope="row">{{ row.item.id }}</template>
            <template slot="name" slot-scope="row">
                <span class="text">{{row.item.name}}</span>
                <span v-if="row.item.default" style="
                    font-size: 18px;
                    background-color: grey;
                    color: white;
                    padding: 3px 5px;
                    margin-left: 8px;
                    border-radius: 5px;">默认</span>
            </template>
            <template slot="comment" slot-scope="row">
                {{row.item.comment ? row.item.comment : ''}}
            </template>
            <template slot="publish" slot-scope="row">
                {{(row.item.publish)?'是':'否'}}
            </template>
            <template slot="groupManagers" slot-scope="row">
                <div>
                    <span v-for="manager in row.item.groupManagers" :key="manager.id">{{ manager.name + ', ' }}</span>
                </div>
            </template>
            <template slot="action">
                <b-button-group>
                    <b-button :size="template_size" variant="outline-primary">
                        <icon name="edit" style="width: 20px"></icon>
                        编辑
                    </b-button>
                    <b-button :size="template_size" variant="outline-primary">
                        <icon name="user-plus" style="width: 20px"></icon>
                        配置管理员
                    </b-button>
                </b-button-group>
            </template>
        </b-table>
        <b-row class="justify-content-end row-margin-tweak mx-0 mt-4">
            <b-pagination
                    :size="template_size"
                    :total-rows="allgroup.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <!-- 查看大图Modal -->
        <image-view :visible="bigImgModal" :src="animationImgSrc" @on-close="bigImgModal=false"></image-view>
    </div>
</template>

<script>
    import {expType, level, abilityTarget} from "@/filters/fun";
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import GroupService from "@/services/groupService";
    import ImageView from "@/components/imageView/ImageView";
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "group-index",
        components: {
            BRow,
            Loading,
            ImageView,
        },
        filters: {
            expType,
            level,
            abilityTarget
        },
        data() {
            return {
                selected: [],
                columns: {
                    check: {
                        label: "",
                        sortable: false,
                        class: "text-center field-check"
                    },
                    id: {
                        label: "ID",
                        sortable: false,
                        class: "text-center field-sn"
                    },
                    name: {
                        label: "集群名称",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    comment: {
                        label: "集群描述",
                        sortable: false,
                        class: "text-center field-creator"
                    },
                    publish: {
                        label: "是否为公开集群",
                        sortable: false,
                        class: "text-center field-create_time"
                    },
                    groupManagers: {
                        label: "集群管理员",
                        sortable: false,
                        class: "text-center field-rend_ani_1"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-rend_ani_2"
                    }
                },
                // 查询参数
                queryParam: {
                    page: 1,
                    size: 15
                },
                queryDebounceParam: {
                    search: ""
                },
                // 流程列表
                allgroup: {
                    list: [],
                    total: 0
                },
                // 流程相关项目
                relatedProjects: [],
                animationImgSrc: "",
                copyModalName: "",
                workflowXml: null,
                deleteModal: false,
                publishModal: false,
                copyModal: false,
                bigImgModal: false,
                xmlModalShow: false,
                relatedShow: false,
                isSuperFlag: false,
                shareModal: false,
                newGroup: {
                    name: '',
                    comment: '',
                    default: null,
                    publish: null,
                    managerName: '',
                    managerPass: ''
                },
                options1: [
                    {text: '是', value: 1},
                    {text: '否', value: 0}
                ],
                options2: [
                    {text: '是', value: 1},
                    {text: '否', value: 0}
                ]
            };
        },
        created() {
            this.$nextTick(() => {
                this.queryWorkflowList();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
            state1() {
                return Boolean(this.newGroup.default !== null)
            },
            state2() {
                return Boolean(this.newGroup.publish !== null)
            }
        },
        watch: {
            queryParam: {
                handler() {
                    this.queryWorkflowList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryWorkflowList();
                }, 500)
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                this.$refs['newGroup'].hide();
                this.run();
                GroupService
                    .create(this.newGroup)
                    .then((res) => {
                        if (res.results === 'success')
                            GroupService
                                .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    data.results.forEach(item => {
                                        if (item.checked === undefined) {
                                            item.checked = false;
                                        }
                                        if (item.locked === undefined) {
                                            item.locked = false;
                                        }
                                    });
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    this.$emit("data-ready");
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else
                            this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            // 查询流程列表数据
            queryWorkflowList() {
                this.run();
                GroupService
                    .fetchList({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        data.results.forEach(item => {
                            if (item.checked === undefined) {
                                item.checked = false;
                            }
                            if (item.locked === undefined) {
                                item.locked = false;
                            }
                        });
                        this.allgroup.list = data.results;
                        this.allgroup.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            deleteGroup() {
                this.run();
                GroupService
                    .deleteGroups({ids: JSON.stringify(this.selected)})
                    .then(res => {
                        if (res.results === 'success')
                            GroupService
                                .fetchList({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    data.results.forEach(item => {
                                        if (item.checked === undefined) {
                                            item.checked = false;
                                        }
                                        if (item.locked === undefined) {
                                            item.locked = false;
                                        }
                                    });
                                    this.allgroup.list = data.results;
                                    this.allgroup.total = data.paging.count;
                                    this.$emit("data-ready");
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else
                            this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .group-index {
        .field-check {
            width: 2%;
            text-align: left !important;
        }
        .field-sn {
            width: 7%;
            text-align: left !important;
        }
        .field-name {
            width: 15%;
            text-align: left !important;
        }
        .field-creator {
            width: 33%;
            text-align: left !important;
        }
        .field-create_time {
            width: 12%;
            text-align: left !important;
        }
        .field-rend_ani_1 {
            width: 18%;
            text-align: left !important;
        }
        .field-rend_ani_2 {
            width: 15%;
            text-align: left !important;
        }
    }
</style>