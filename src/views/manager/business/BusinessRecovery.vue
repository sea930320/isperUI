<template>
    <div class="business-show" v-if="userInfo">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="4" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                            <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                </b-input-group>
            </b-col>
            <b-col lg="8" md="6" sm="12" class="align-self-center">
                <b-button-group class="float-right" >
                    <b-button
                            :size="template_size"
                            class="styledBtn"
                            variant="outline-primary"
                            v-if="isActionAllowed('code_workflow_management', 'code_share_unshare_workflow')"
                            @click="handleDownload"
                    >导出
                    </b-button>
                    <b-button
                            :size="template_size"
                            class="styledBtn"
                            variant="outline-primary"
                            @click="recoveryBusiness"
                    >恢复
                    </b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table :items="business.list" small hover :fields="columns" head-variant>
                <template slot="HEAD_sn" slot-scope="head">
                    <b-form-checkbox v-model="allChecked">{{ head.label }}</b-form-checkbox>
                </template>
                <template slot="sn" slot-scope="row">
                    <b-form-checkbox v-model="row.item.checked"></b-form-checkbox>
                </template>
                <template slot="id" slot-scope="row">
                    {{ row.item.id }}
                </template>
                <template slot="name" slot-scope="row">
                    {{ row.item.name }}
                </template>
                <template slot="class" slot-scope="row">
                    {{ row.item.officeItem }}
                </template>
                <template slot="created_time" slot-scope="row">
                    <span v-if="row.item.start_time">{{ row.item.start_time }}</span>
                    <span v-else> -- </span>
                </template>
                <template slot="creator" slot-scope="row">
                    {{ row.item.created_by }}
                </template>
                <template slot="status" slot-scope="row">
                    <span>{{ row.item.status }}</span>
                </template>
                <template slot="control" slot-scope="row">
                    <!--<b-button variant="danger" class="float-center mr-2" @click="confirmDelete()">确定</b-button>-->
                    <a
                            href="javascript:"
                            class="btn-link"
                            title="查看"
                            @click="showBusiness(row.item)"
                            v-if="row.item.status === '已完成'"
                    >
                        <icon name="eye"></icon>
                    </a>
                </template>
            </b-table>
        </div>
        <b-row class="justify-content-center row-margin-tweak cardDiv">
            <b-pagination
                    :size="template_size"
                    :total-rows="business.total"
                    :per-page="queryParam.size"
                    limit="5"
                    v-model="queryParam.page"
            ></b-pagination>
        </b-row>

        <b-modal
                title="恢复业务"
                v-model="recoveryBusinessModal"
                ok-title="确定"
                cancel-title="取消"
                size="xl"
                @cancel="recoveryBusinessModal=false"
                @ok="confirmRecoveryBusiness"
        >
            <div class="modal-msg">
                <p class="message">您能恢复以下业务:</p>
            </div>
            <b-container fluid>
                <table class="table table-border" style="max-height: 150px;overflow-y: scroll;">
                    <thead>
                    <tr class="table-active">
                        <th>序号</th>
                        <th>ID</th>
                        <th>业务名称</th>
                        <th>事务类型</th>
                        <th>启动时间</th>
                        <th>启动人</th>
                        <th>状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                            v-for="(accessableItem, index) in checkedItems"
                            :key="accessableItem.id"
                    >
                        <td>{{ index+1 }}</td>
                        <td>{{ accessableItem.id }}</td>
                        <td>{{ accessableItem.name }}</td>
                        <td>{{ accessableItem.officeItem }}</td>
                        <td>{{ accessableItem.start_time ? accessableItem.start_time : " -- " }}</td>
                        <td>{{ accessableItem.created_by }}</td>
                        <td>{{ accessableItem.status }}</td>
                    </tr>
                    </tbody>
                </table>
            </b-container>
        </b-modal>

        <b-modal
                title="业务报告"
                v-model="showBusinessModal"
                size="xl"
                scrollable
                hide-footer
        >
            <h1 style="color:blue">业 务 报 告</h1>
            <b-container class="modalContainer" v-if="selectedBusiness">
                <b-row>
                    <b-col lg="4" md="4" sm="4" class="text-left">
                        业务名称：{{selectedBusiness.name}}
                    </b-col>
                    <b-col lg="4" md="4" sm="4" class="text-left">
                        项目名称：{{selectedBusiness.project_name}}
                    </b-col>
                    <b-col lg="4" md="4" sm="4" class="text-left">
                        流程名称：{{selectedBusiness.workflow_name}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4" md="4" sm="12" class="text-left">
                        创建时间：{{selectedBusiness.start_time}}
                    </b-col>
                    <b-col lg="4" md="4" sm="12" class="text-left">
                        实际完成时间：{{selectedBusiness.end_time}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="12" sm="12" class="text-left">
                        成员名单：{{selectedBusiness.members ? selectedBusiness.members.join(', ') : ''}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="4" md="12" sm="12" class="text-left">
                        启动人：{{selectedBusiness.created_by}}
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
    import {expType, level, abilityTarget} from "@/filters/fun";
    import {mapState, mapActions} from "vuex";
    import Loading from "@/components/loading/Loading";
    import businessService from "@/services/businessService";
    import _ from "lodash";

    export default {
        name: "business-recovery",
        props: ['selectedTab'],
        components: {
            Loading,
        },
        filters: {
            expType,
            level,
            abilityTarget
        },
        data() {
            return {
                columns: {
                    sn: {
                        label: "",
                        sortable: false,
                        class: "text-center field-5"
                    },
                    id: {
                        label: "ID",
                        sortable: false,
                        class: "text-center field-5"
                    },
                    name: {
                        label: "业务名称",
                        sortable: false,
                        class: "text-center field-25"
                    },
                    class: {
                        label: "事务类型",
                        sortable: false,
                        class: "text-center field-25"
                    },
                    created_time: {
                        label: "启动时间",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    creator: {
                        label: "启动人",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    status: {
                        label: "状态",
                        sortable: false,
                        class: "text-center field-10"
                    },
                    control: {
                        label: "操作",
                        sortable: false,
                        class: "text-center field-10"
                    },
                },
                selectedBusiness:{},
                // 查询参数
                queryParam: {
                    status: "",
                    page: 1,
                    size: 15
                },
                queryDebounceParam: {
                    search: ""
                },
                // 事务列表
                business: {
                    list: [],
                    total: 0
                },
                allChecked: false,
                recoveryBusinessModal: false,
                showBusinessModal:false,
                // 流程相关项目
            };
        },
        created() {
        },
        computed: {
            ...mapState(["userInfo", "userPermission"]),
            checkedItems() {
                return this.business.list.filter(item => item.checked === true);
            },
        },
        watch: {
            // 监控查询参数，如有变化 查询列表数据
            queryParam: {
                handler() {
                    this.queryBusinessList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryBusinessList();
                }, 500)
            },
            allChecked: {
                handler(val) {
                    if (val) {
                        this.business.list.map(item => {
                            item.checked = true;
                            return item;
                        });
                    } else {
                        this.business.list.map(item => {
                            item.checked = false;
                            return item;
                        });
                    }
                }
            },
            selectedTab: function(newVal) {
                if (newVal === 1)
                    this.queryBusinessList();
            }
        },
        methods: {
            ...mapActions(["setFlowStep"]),
            // 查询流程列表数据
            queryBusinessList() {
                this.allChecked = false;
                this.run();
                businessService
                    .getBusinessListDel({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        data.results.forEach(item => {
                            if (item.checked === undefined) {
                                item.checked = false;
                            }
                            if (item.locked === undefined) {
                                item.locked = false;
                            }
                        });
                        this.business.list = data.results;
                        this.business.total = data.paging.count;
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            recoveryBusiness() {
                if (this.checkedItems.length > 0) {
                    this.recoveryBusinessModal = true;
                } else {
                    this.$toasted.error("请勾选要恢复的业务");
                }
            },
            confirmRecoveryBusiness(){
                this.run();
                businessService
                    .getBusinessRecovery({data: JSON.stringify(this.checkedItems.map(it => it.id))}).then(() => {
                    this.checkedItems.forEach(item => {
                        let index = this.business.list.indexOf(item);
                        this.business.list.splice(index, 1)
                    });
                    this.$emit("data-ready");
                });
                this.recoveryBusinessModal = false;
                this.queryBusinessList();
            },
            showBusiness(data){
                this.selectedBusiness = data;
                this.showBusinessModal = true;
            },
            handleDownload() {
                this.run();
                import("@/components/UploadExcel/Export2Excel").then(excel => {
                    const tHeader = [
                        "ID",
                        "业务名称",
                        "项目名称",
                        "流程名称",
                        "事务类型",
                        "启动时间",
                        "完成时间",
                        "成员名单",
                        "启动人",
                        "状态"
                    ];
                    let list = this.checkedItems;
                    if (list.length === 0)
                        list = this.business.list;
                    const data = this.formatJson(list);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: "业务刪除列表",
                        autoWidth: true,
                        bookType: "xlsx"
                    });
                });
                this.$emit("data-ready");
            },
            formatJson(jsonData) {
                return jsonData.map(v =>
                    [
                        v.id,
                        v.name,
                        v.project_name,
                        v.workflow_name,
                        v.officeItem,
                        v.start_time,
                        v.end_time,
                        v.members.join(', '),
                        v.created_by,
                        v.status
                    ]
                );
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .business-show {
        padding-bottom: 10px;

        .field-sn {
            text-align: left !important;
            padding-left: 20px;
            width: 6%;
        }
        .field-5 {
            width: 5%;
        }
        .field-10 {
            width: 10%;
        }

        .field-20 {
            width: 20%;
        }

        .field-30 {
            width: 30%;
        }

        .table th,
        .table td {
            vertical-align: middle;
        }

        .modal-body {
            .message {
                font-size: 16px;
            }

            .tip {
                font-size: 14px;
                color: #999;
            }
        }
        .modalContainer{
            padding:10px 0 40px 0;
        }
        .modalContainer div{
            padding:15px 10px 0 10px;
            font-size: 15px;
        }
    }
</style>