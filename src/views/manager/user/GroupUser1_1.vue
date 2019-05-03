<template>
    <div class="group-user-index1_1">
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
        </b-row>
        <div class="cardDiv">
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
                <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                <template slot="company" slot-scope="row">{{row.item.company ? row.item.company : ''}}</template>
                <template slot="companyType" slot-scope="row">{{row.item.companyType ? row.item.companyType : ''}}</template>
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
    import UserManageService from "@/services/userManageService";
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "group-user-index1_1",
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
                editItem: {
                    id: null,
                    name: '',
                    comment: '',
                    default: 0,
                    publish: 1
                },
                columns: {
                    id: {
                        label: "ID",
                        sortable: false,
                        class: "text-center field-id"
                    },
                    name: {
                        label: "姓名",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    company: {
                        label: "所在单位",
                        sortable: false,
                        class: "text-center field-company"
                    },
                    companyType: {
                        label: "部门",
                        sortable: false,
                        class: "text-center field-companyType"
                    },
                    action: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-action"
                    }
                },
                queryParam: {
                    page: 1,
                    size: 5,
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
            queryDataList() {
                this.run();
                UserManageService
                    .getGroupUsers({...this.queryParam, ...this.queryDebounceParam})
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
                                .getGroupUsers({...this.queryParam, ...this.queryDebounceParam})
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
    .group-user-index1_1 {
        .field-id {
            width: 10%;
            text-align: left !important;
        }
        .field-name {
            width: 20%;
            text-align: left !important;
        }
        .field-company {
            width: 25%;
            text-align: left !important;
        }
        .field-companyType {
            width: 10%;
            text-align: left !important;
        }
        .field-action {
            width: 10%;
            text-align: left !important;
        }
    }
</style>