<template>
    <div class="group-user-index1_2">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="2" md="6" sm="12" style="line-height: 32px;">非单位用户注册审核</b-col>
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
            <b-col md="7" class="align-self-center">
                <b-button-group class="float-right">
                    <b-button :size="template_size" class="styledBtn fontedBtn" variant="outline-primary" @click="setReview(1,null)">批量审核通过</b-button>
                    <b-button class="styledBtn fontedBtn" :size="template_size" variant="outline-primary" @click="setReview(2,null)">批量审核不通过</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="allData.list" small hover :fields="columns" head-variant style="fontSize: 18px">
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
                <template slot="username" slot-scope="row"><span class="text">{{row.item.username}}</span></template>
                <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                <template slot="phone" slot-scope="row">{{row.item.phone ? row.item.phone : ''}}</template>
                <template slot="action" slot-scope="row">
                    <b-button class="styledBtn" :size="template_size" variant="outline-primary" @click="setReview(1,row.item.id)">
                        <icon name="check"></icon>
                        审核通过
                    </b-button>
                    <b-button class="styledBtn" :size="template_size" variant="outline-primary" @click="setReview(2,row.item.id)">
                        <icon name="times"></icon>
                        审核不通过
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
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Loading from "@/components/loading/Loading";
    import UserManageService from "@/services/userManageService";
    import _ from "lodash";
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: "group-user-index1_2",
        components: {
            BRow,
            Loading,
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
                    username: {
                        label: "用户名",
                        sortable: false,
                        class: "text-center field-username"
                    },
                    name: {
                        label: "姓名",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    phone: {
                        label: "手机号码",
                        sortable: false,
                        class: "text-center field-phone"
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
                    .getGroupNonCompanyUsers({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.allData.list = data.results;
                        this.allData.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            setReview(value, id) {
                this.run();
                UserManageService
                    .set_Review({set: value, ids: id===null ? JSON.stringify(this.selected) : id})
                    .then((res) => {
                        if (res.results === 'success')
                            UserManageService
                                .getGroupNonCompanyUsers({...this.queryParam, ...this.queryDebounceParam})
                                .then(data => {
                                    this.allData.list = data.results;
                                    this.allData.total = data.paging.count;
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
    .group-user-index1_2 {
        .field-check {
            width: 15%;
            padding-top: 11px;
            text-align: right !important;
        }
        .field-username {
            width: 10%;
            text-align: left !important;
        }
        .field-name {
            width: 15%;
            text-align: left !important;
        }
        .field-phone {
            width: 30%;
            text-align: left !important;
        }
        .field-action {
            width: 25%;
            text-align: left !important;
        }
    }
</style>