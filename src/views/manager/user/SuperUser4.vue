<template>
    <div class="super-user-index4">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                          <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder=""/>
                </b-input-group>
            </b-col>
            <b-col lg="2">
                <b-form-select
                        :size="template_size"
                        class="mx-1"
                        v-model="queryParam.group_id"
                        :options="groups"
                        value-field="id"
                        text-field="name"
                        style="flex:1"
                ></b-form-select>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="student_id" slot-scope="row">{{ row.item.student_id }}</template>
                <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                <template slot="gender" slot-scope="row"><span class="text">{{row.item.gender}}</span></template>
                <template slot="class_name" slot-scope="row"><span class="text">{{row.item.class_name}}</span></template>
                <template slot="company" slot-scope="row">{{row.item.company ? row.item.company : ''}}</template>
                <template slot="group" slot-scope="row">{{row.item.group ? row.item.group : ''}}</template>
                <template slot="action" slot-scope="row">
                    <b-button class="styledBtn" :key="row.item.id" :size="template_size" variant="outline-primary" @click="resetOpen(row)">
                        重置密码
                    </b-button>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-end row-margin-tweak mx-0 mt-4 cardDiv">
            <b-pagination
                    :size="template_size"
                    :total-rows="allData.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"
            ></b-pagination>
        </b-row>
        <b-modal hide-footer centered  id="resetUserPassword" ref="resetUserPassword" title="重置密码">
            <div>
                <b-form @submit="resetPassword" class="container pt-3">
                    <b-form-group id="input-group-11" label-for="input-2">
                        <b-form-input
                                v-model="reset.password"
                                required
                                autocomplete="new-password"
                                type="password"
                                placeholder="密码"
                        ></b-form-input>
                    </b-form-group>
                    <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存
                    </b-button>
                    <b-button class="mt-3 my-4 col-5 float-right" block variant="primary"
                              @click="()=>{this.$refs['resetUserPassword'].hide(); reset = {id: null,password:''}}">取 消
                    </b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import GroupService from "@/services/groupService";
    import UserManageService from "@/services/userManageService";
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "super-user-index4",
        components: {
            BRow,
            Loading,
        },
        data() {
            return {
                reset: {
                    id: null,
                    password: ''
                },
                groups: [],
                editItem: {
                    id: null,
                    name: '',
                    comment: '',
                    default: 0,
                    publish: 1
                },
                columns: {
                    student_id: {
                        label: "学号",
                        sortable: false,
                        class: "text-right field-student_id"
                    },
                    name: {
                        label: "姓名",
                        sortable: false,
                        class: "text-left field-name"
                    },
                    gender: {
                        label: "性别",
                        sortable: false,
                        class: "text-center field-gender"
                    },
                    class_name: {
                        label: "班级",
                        sortable: false,
                        class: "text-left field-class_name"
                    },
                    company: {
                        label: "学校",
                        sortable: false,
                        class: "text-left field-company"
                    },
                    group: {
                        label: "集群",
                        sortable: false,
                        class: "text-left field-group"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                queryParam: {
                    page: 1,
                    size: 10,
                    group_id: null
                },
                queryDebounceParam: {
                    search: ""
                },
                allData: {
                    list: [],
                    total: 0
                },
            };
        },
        created() {
            this.$nextTick(() => {
                this.getGroupList();
                this.queryDataList();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
            queryParam: {
                handler() {
                    this.queryDataList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryDataList();
                }, 500)
            }
        },
        methods: {
            getGroupList() {
                GroupService
                    .fetchAllGroupDetail()
                    .then(data => {
                        this.groups = data.results;
                        this.groups.unshift({
                            id: null,
                            name: "集群筛选"
                        });
                    })
                    .catch(() => {});
            },
            queryDataList() {
                this.run();
                UserManageService
                    .getStudentUsers({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.allData.list = data.results;
                        this.allData.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            resetOpen(row) {
                this.reset.id = row.item.id;
                this.reset.password = '';
                this.$refs['resetUserPassword'].show();
            },
            resetPassword(evt) {
                evt.preventDefault();
                this.run();
                UserManageService
                    .resetPass(this.reset)
                    .then((res) => {
                        if (res.results === 'success')
                            UserManageService
                                .getStudentUsers({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    this.allData.list = data.results;
                                    this.allData.total = data.paging.count;
                                    this.$emit("data-ready");
                                    this.$refs['resetUserPassword'].hide();
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
    .super-user-index4 {
        .field-student_id {
            width: 10%;
            text-align: left !important;
        }
        .field-name {
            width: 10%;
            text-align: left !important;
        }
        .field-gender {
            width: 5%;
        }
        .field-class_name {
            width: 20%;
            text-align: left !important;
        }
        .field-company {
            width: 25%;
            text-align: left !important;
        }
        .field-group {
            width: 20%;
            text-align: left !important;
        }
        .field-action {
            width: 10%;
        }
    }
</style>
