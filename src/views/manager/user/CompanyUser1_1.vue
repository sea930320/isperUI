<template>
    <div class="company-user-index1_1">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <b-col lg="2" md="6" sm="12" style="line-height: 32px;">单位用户管理</b-col>
            <b-col lg="3" md="6" sm="12">
                <b-input-group :size="template_size">
                    <b-input-group-prepend>
                        <span class="input-group-text">
                            <icon name="search"></icon>
                        </span>
                    </b-input-group-prepend>
                    <b-form-input v-model.lazy="queryDebounceParam.search" placeholder/>
                </b-input-group>
            </b-col>
            <b-col md="7" class="align-self-center">
                <b-button-group class="float-right">
                    <b-button
                        class="styledBtn fontedBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="()=>{this.$refs['uploadExcel'].show(); this.tableData=[]; this.tableHeader=[]}"
                        v-if="isActionAllowed('code_company_management', 'code_export_import_user_company')"
                    >导入人员</b-button>
                    <b-button
                        class="styledBtn fontedBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="handleDownload"
                        v-if="isActionAllowed('code_company_management', 'code_export_import_user_company')"
                    >导出人员</b-button>
                    <b-button
                        class="styledBtn fontedBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="()=>{
                        this.$refs['newUser'].show();
                        this.newItem={
                            username: '',
                            name: '',
                            email: '',
                            gender: '',
                            phone: '',
                            position: '',
                        };
                    }"
                        v-if="isActionAllowed('code_company_management', 'code_add_remove_user_company')"
                    >添加人员</b-button>
                    <b-button
                        class="styledBtn fontedBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="this.deleteUsers"
                        v-if="isActionAllowed('code_company_management', 'code_add_remove_user_company')"
                    >删除人员</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        <div class="cardDiv">
            <b-table
                :items="allData.list"
                small
                hover
                :fields="columns"
                head-variant
                style="fontSize: 18px"
            >
                <template slot="check" slot-scope="row">
                    <b-form-checkbox
                        :id="row.item.id.toString()"
                        v-model="selected"
                        name="checkbox"
                        :value="row.item.id"
                        unchecked-value
                    ></b-form-checkbox>
                </template>
                <template slot="id" slot-scope="row">{{ row.item.id }}</template>
                <template slot="username" slot-scope="row">
                    <span class="text">{{row.item.username}}</span>
                </template>
                <template slot="name" slot-scope="row">
                    <span class="text">{{row.item.name}}</span>
                </template>
                <template slot="gender" slot-scope="row">
                    <span class="text">{{row.item.gender}}</span>
                </template>
                <template slot="part" slot-scope="row">{{row.item.part ? row.item.part : ''}}</template>
                <template
                    slot="company"
                    slot-scope="row"
                >{{row.item.company ? row.item.company : ''}}</template>
                <template slot="action" slot-scope="row">
                    <b-button
                        class="styledBtn"
                        :key="row.item.id"
                        :size="template_size"
                        variant="outline-primary"
                        @click="resetOpen(row)"
                        v-if="isActionAllowed('code_user_management', 'code_reset_password_user')"
                    >重置密码</b-button>
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
        <b-modal hide-footer centered id="resetUserPassword" ref="resetUserPassword" title="重置密码">
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
                    <b-button
                        class="mt-3 my-4 col-5 float-left"
                        block
                        type="submit"
                        variant="primary"
                    >保 存</b-button>
                    <b-button
                        class="mt-3 my-4 col-5 float-right"
                        block
                        variant="primary"
                        @click="()=>{this.$refs['resetUserPassword'].hide(); reset = {id: null,password:''}}"
                    >取 消</b-button>
                </b-form>
            </div>
        </b-modal>
        <b-modal hide-footer centered size="xl" id="uploadExcel" ref="uploadExcel" title="导入人员">
            <div>
                <div class="app-container">
                    <div class="row justify-content-between">
                        <el-link
                            style="margin-left: 20px; color: #409EFF;font-size: 18px;"
                            href="/api/userManager/sampleUserExcel"
                            :underline="false"
                            download
                        >导入模板下载</el-link>
                        <el-button
                            style="margin: 10px;font-size: 18px;"
                            class="col-2"
                            type="primary"
                            @click="excelSave"
                            round
                        >完&emsp;成</el-button>
                    </div>
                    <upload-excel-component :on-success="handleSuccess"/>
                    <el-table
                        :data="tableData"
                        border
                        highlight-current-row
                        style="width: 100%;margin-top:20px;"
                    >
                        <el-table-column
                            v-for="item of tableHeader"
                            :key="item"
                            :prop="item"
                            :label="item"
                        />
                    </el-table>
                </div>
            </div>
        </b-modal>
        <b-modal hide-footer centered id="newUser" ref="newUser" title="新增用户">
            <div>
                <b-form @submit="newUserSave" class="container pt-3">
                    <b-form-group id="input-group-7" label-for="name">
                        <b-form-input v-model="newItem.name" required placeholder="姓名"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-8" label-for="input-2">
                        <b-form-input v-model="newItem.username" required placeholder="用户名"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-10" label-for="input-2">
                        <b-form-input v-model="newItem.email" required placeholder="邮箱"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-12" label-for="input-2" class="float-left w-50">
                        <b-form-input v-model="newItem.phone" required placeholder="手机号码"></b-form-input>
                    </b-form-group>
                    <b-form-group class="float-right w-25 my-0">
                        <b-form-select v-model="newItem.gender" class="mb-3">
                            <option value="1">男</option>
                            <option value="2">女</option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group class="my-0 w-100">
                        <b-form-select v-model="newItem.position" class="mb-3">
                            <optgroup
                                v-for="part in allData.positions"
                                :key="part.label"
                                :label="part.label"
                            >
                                <option
                                    v-for="pos in part.options"
                                    :key="pos.value"
                                    :value="pos.value"
                                >{{pos.text}}</option>
                            </optgroup>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group id="input-group-9" label-for="input-2">
                        <b-form-input
                            v-model="newItem.password"
                            required
                            type="password"
                            placeholder="密码"
                        ></b-form-input>
                    </b-form-group>
                    <b-button
                        class="mt-3 my-4 col-5 float-left"
                        block
                        type="submit"
                        variant="primary"
                    >保 存</b-button>
                    <b-button
                        class="mt-3 my-4 col-5 float-right"
                        block
                        variant="primary"
                        @click="this.$refs['newUser'].hide()"
                    >取 消</b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import UserManageService from "@/services/userManageService";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";

export default {
    name: "company-user-index1_1",
    components: {
        BRow,
        Loading,
        UploadExcelComponent
    },
    data() {
        return {
            selected: [],
            tableData: [],
            tableHeader: [],
            reset: {
                id: null,
                password: ""
            },
            newItem: {
                username: "",
                name: "",
                password: "",
                email: "",
                gender: "",
                phone: "",
                position: ""
            },
            columns: {
                check: {
                    label: "",
                    sortable: false,
                    class: "text-center field-check"
                },
                id: {
                    label: "ID",
                    sortable: false,
                    class: "text-center field-id"
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
                gender: {
                    label: "性别",
                    sortable: false,
                    class: "text-center field-gender"
                },
                part: {
                    label: "部门",
                    sortable: false,
                    class: "text-center field-part"
                },
                position: {
                    label: "职务",
                    sortable: false,
                    class: "text-center field-position"
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
                positions: [],
                total: 0
            }
        };
    },
    created() {
        this.$nextTick(() => {
            this.queryCompanyUsers();
            if (!Array.prototype.equals)
                Array.prototype.equals = function(array) {
                    if (!array) return false;

                    if (this.length !== array.length) return false;

                    for (var i = 0, l = this.length; i < l; i++) {
                        if (
                            this[i] instanceof Array &&
                            array[i] instanceof Array
                        ) {
                            if (!this[i].equals(array[i])) return false;
                        } else if (this[i] !== array[i]) {
                            return false;
                        }
                    }
                    return true;
                };
            Object.defineProperty(Array.prototype, "equals", {
                enumerable: false
            });
        });
    },
    computed: {
        ...mapState(["userInfo"])
    },
    watch: {
        queryParam: {
            handler() {
                this.queryCompanyUsers();
            },
            deep: true
        },
        queryDebounceParam: {
            deep: true,
            handler: _.debounce(function() {
                this.queryCompanyUsers();
            }, 500)
        }
    },
    methods: {
        queryCompanyUsers() {
            this.run();
            UserManageService.queryCompanyUsers({
                ...this.queryParam,
                ...this.queryDebounceParam
            })
                .then(data => {
                    this.allData.list = data.results;
                    this.allData.positions = data.positions;
                    this.allData.total = data.paging.count;
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        resetOpen(row) {
            this.reset.id = row.item.id;
            this.reset.password = "";
            this.$refs["resetUserPassword"].show();
        },
        resetPassword(evt) {
            evt.preventDefault();
            this.run();
            UserManageService.resetPass(this.reset)
                .then(res => {
                    if (res.results === "success")
                        UserManageService.queryCompanyUsers({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allData.list = data.results;
                                this.allData.positions = data.positions;
                                this.allData.total = data.paging.count;
                                this.$emit("data-ready");
                                this.$refs["resetUserPassword"].hide();
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        handleSuccess({ results, header }) {
            if (
                !header.equals([
                    "姓名",
                    "用户名",
                    "性别",
                    "手机号",
                    "邮箱",
                    "部门",
                    "职务"
                ])
            ) {
                this.$message.error("文件格式不符合。");
                this.tableData = [];
                this.tableHeader = [];
            } else {
                this.tableData = results;
                this.tableHeader = header;
            }
        },
        excelSave() {
            this.run();
            let excelData = [];
            for (let id in this.tableData)
                excelData.push({
                    name: this.tableData[id].姓名,
                    username: this.tableData[id].用户名,
                    gender: this.tableData[id].性别,
                    phone: this.tableData[id].手机号,
                    email: this.tableData[id].邮箱,
                    part: this.tableData[id].部门,
                    position: this.tableData[id].职务
                });
            UserManageService.excelDataSave({
                excelData: JSON.stringify(excelData)
            })
                .then(res => {
                    if (res.results === "success")
                        UserManageService.queryCompanyUsers({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allData.list = data.results;
                                this.allData.positions = data.positions;
                                this.allData.total = data.paging.count;
                                this.$emit("data-ready");
                                this.$refs["uploadExcel"].hide();
                                this.tableData = [];
                                this.tableHeader = [];
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        handleDownload() {
            this.run();
            import("@/components/UploadExcel/Export2Excel").then(excel => {
                const tHeader = [
                    "姓名",
                    "用户名",
                    "性别",
                    "手机号",
                    "邮箱",
                    "部门",
                    "职务"
                ];
                const filterVal = [
                    "name",
                    "username",
                    "gender",
                    "phone",
                    "email",
                    "part",
                    "position"
                ];
                const list = this.allData.list;
                const data = this.formatJson(filterVal, list);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "用户列表",
                    autoWidth: true,
                    bookType: "xlsx"
                });
            });
            this.$emit("data-ready");
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => {
                    return v[j];
                })
            );
        },
        newUserSave(evt) {
            evt.preventDefault();
            this.run();
            UserManageService.newUserSet(this.newItem)
                .then(res => {
                    if (res.results === "success")
                        UserManageService.queryCompanyUsers({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allData.list = data.results;
                                this.allData.positions = data.positions;
                                this.allData.total = data.paging.count;
                                this.$emit("data-ready");
                                this.$refs["newUser"].hide();
                            })
                            .catch(() => {
                                this.$emit("data-failed");
                            });
                    else this.$emit("data-failed");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        deleteUsers() {
            if (confirm("您确定要删除该用户吗？")) {
                this.run();
                UserManageService.deleteUsers({
                    ids: JSON.stringify(this.selected)
                })
                    .then(res => {
                        if (res.results === "success")
                            UserManageService.queryCompanyUsers({
                                ...this.queryParam,
                                ...this.queryDebounceParam
                            })
                                .then(data => {
                                    this.allData.list = data.results;
                                    this.allData.positions = data.positions;
                                    this.allData.total = data.paging.count;
                                    this.$emit("data-ready");
                                    this.$refs["newUser"].hide();
                                })
                                .catch(() => {
                                    this.$emit("data-failed");
                                });
                        else this.$emit("data-failed");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            }
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.company-user-index1_1 {
    .field-check {
        width: 3%;
        padding-top: 11px;
        text-align: right !important;
    }
    .field-id {
        width: 9%;
        text-align: left !important;
    }
    .field-username {
        width: 10%;
        text-align: left !important;
    }
    .field-name {
        width: 10%;
        text-align: left !important;
    }
    .field-gender {
        width: 7%;
        text-align: left !important;
    }
    .field-part {
        width: 18%;
        text-align: left !important;
    }
    .field-position {
        width: 18%;
        text-align: left !important;
    }
    .field-phone {
        width: 15%;
        text-align: left !important;
    }
    .field-action {
        width: 10%;
        text-align: left !important;
    }
    .el-link.el-link--default:hover {
        transform: scale(1.1) !important;
        transition: all 0.2s ease-in-out !important;
    }
    .el-table__empty-text {
        font-size: 18px;
    }
}
</style>