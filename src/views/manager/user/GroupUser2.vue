<template>
    <div class="group-user-index2">
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
            <b-col lg="4" md="6" sm="12" class="align-self-center">
                <b-form-radio-group v-model="queryParam.status">
                    <b-form-radio value="0">全部</b-form-radio>
                    <b-form-radio value="1">申请加入</b-form-radio>
                    <b-form-radio value="2">申请退出</b-form-radio>
                </b-form-radio-group>
            </b-col>
            <b-col md="5" class="align-self-center">
                <b-button-group class="float-right">
                    <b-button :size="template_size" class="styledBtn fontedBtn" variant="outline-primary" @click="setAgree(1,null)">批量审核通过</b-button>
                    <b-button class="styledBtn fontedBtn" :size="template_size" variant="outline-primary" @click="setAgree(0,null)">批量审核不通过</b-button>
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
                <template slot="name" slot-scope="row"><span class="text">{{row.item.name}}</span></template>
                <template slot="gender" slot-scope="row"><span class="text">{{row.item.gender}}</span></template>
                <template slot="sCompany" slot-scope="row"><span class="text">{{row.item.sCompany ? row.item.sCompany : ''}}</span></template>
                <template slot="sGroup" slot-scope="row"><span class="text">{{row.item.sGroup ? row.item.sGroup : ''}}</span></template>
                <template slot="phone" slot-scope="row">{{row.item.phone ? row.item.phone : ''}}</template>
                <template slot="reason" slot-scope="row">{{row.item.reason ? row.item.reason : ''}}</template>
                <template slot="state" slot-scope="row">{{row.item.state ? row.item.state : ''}}</template>
                <template slot="action" slot-scope="row">
                    <b-button class="styledBtn" :size="template_size" variant="outline-primary" @click="setAgree(1,row.item.id)">
                        <icon name="check"></icon>
                        审核通过
                    </b-button>
                    <b-button class="styledBtn" :size="template_size" variant="outline-primary" @click="setAgree(0,row.item.id)">
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
        name: "group-user-index2",
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
                    name: {
                        label: "姓名",
                        sortable: false,
                        class: "text-center field-name"
                    },
                    gender: {
                        label: "性别",
                        sortable: false,
                        class: "text-center field-gender"
                    },
                    sCompany: {
                        label: "原单位",
                        sortable: false,
                        class: "text-center field-sCompany"
                    },
                    sGroup: {
                        label: "原集群",
                        sortable: false,
                        class: "text-center field-sGroup"
                    },
                    phone: {
                        label: "手机号",
                        sortable: false,
                        class: "text-center field-phone"
                    },
                    reason: {
                        label: "加入/退出理由",
                        sortable: false,
                        class: "text-center field-reason"
                    },
                    state: {
                        label: "申请加入/退出",
                        sortable: false,
                        class: "text-center field-state"
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
                    status: 0
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
                this.queryGroupChanges();
            });
        },
        computed: {
            ...mapState(["userInfo"]),
        },
        watch: {
            queryParam: {
                handler() {
                    this.queryGroupChanges();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryGroupChanges();
                }, 500)
            }
        },
        methods: {
            queryGroupChanges() {
                this.run();
                UserManageService
                    .getGroupChangeList({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.allData.list = data.results;
                        this.allData.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            setAgree(value, id) {
                this.run();
                UserManageService
                    .set_gChange({set: value, ids: id===null ? JSON.stringify(this.selected) : JSON.stringify([id])})
                    .then((res) => {
                        if (res.results === 'success')
                            UserManageService
                                .getGroupChangeList({...this.queryParam, ...this.queryDebounceParam})
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
    .group-user-index2 {
        .field-check {
            width: 3%;
            padding-top: 11px;
            text-align: right !important;
        }
        .field-name {
            width: 10%;
            text-align: left !important;
        }
        .field-gender {
            width: 5%;
        }
        .field-sCompany {
            width: 12%;
            text-align: left !important;
        }
        .field-sGroup {
            width: 10%;
            text-align: left !important;
        }
        .field-phone {
            width: 10%;
            text-align: left !important;
        }
        .field-reason {
            width: 25%;
            text-align: left !important;
        }
        .field-state {
            width: 10%;
            text-align: left !important;
        }
        .field-action {
            width: 15%;
            text-align: left !important;
        }
    }
</style>