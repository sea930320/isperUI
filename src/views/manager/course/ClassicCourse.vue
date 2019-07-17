<template>
    <div class="classic-course">
        <loading v-if="isRunning"></loading>
        <b-row class="cardDiv">
            <!-- <b-col lg="2" md="6" sm="12" style="line-height: 32px;">单位用户管理</b-col> -->
            <b-col lg="5" md="6" sm="12">
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
                        @click="()=>{
                            this.$refs['newCourse'].show();
                            this.newItem={
                                courseId: '',
                                courseName: '',
                                courseSeqNum: '',
                                courseSemester: '',
                                teacherName: '',
                                teacherId: '',
                                courseCount: '',
                                experienceTime: '',
                                studentCount: '',
                            };
                        }"
                    >新建课堂</b-button>
                    <b-button
                        class="styledBtn fontedBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="()=>{this.$refs['uploadExcel'].show(); this.tableData=[]; this.tableHeader=[]}"
                    >导入课堂</b-button>
                    <b-button
                        class="styledBtn fontedBtn"
                        :size="template_size"
                        variant="outline-primary"
                        @click="this.deleteUsers"
                    >删除课堂</b-button>
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
        <b-modal hide-footer centered id="newCourse" ref="newCourse" title="新增用户">
            <div>
                <b-form @submit="newCourseSave" class="container pt-3">
                    <b-form-group id="input-group-7" label-for="name">
                        <b-form-input v-model="newItem.courseId" required placeholder="课程号"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-8" label-for="input-2">
                        <b-form-input v-model="newItem.courseName" required placeholder="课程名"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-10" label-for="input-2" class="float-left w-40">
                        <b-form-input v-model="newItem.courseSeqNum" required placeholder="课序号"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-12" label-for="input-2" class="float-right w-40">
                        <b-form-input v-model="newItem.courseSemester" required placeholder="开课学期"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-13" label-for="input-2" class="float-left w-40">
                        <b-form-input v-model="newItem.teacherName" required placeholder="任课老师"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-14" label-for="input-2" class="float-right w-40">
                        <b-form-input v-model="newItem.teacherId" required placeholder="工号"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-15" label-for="input-2" class="float-left w-30">
                        <b-form-input v-model="newItem.courseCount" required placeholder="课时"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-16" label-for="input-2" class="float-left w-30" style="margin-left: 5%">
                        <b-form-input v-model="newItem.experienceTime" required placeholder="实验学时"></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-17" label-for="input-2" class="float-right w-30">
                        <b-form-input v-model="newItem.studentCount" required placeholder="学生人数"></b-form-input>
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
                        @click="this.$refs['newCourse'].hide()"
                    >取 消</b-button>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import CourseService from "@/services/courseService";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";

export default {
    name: "classic-course",
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
            excelDataError: false,
            reset: {
                id: null,
                password: ""
            },
            newItem: {
                courseId: '',
                courseName: '',
                courseSeqNum: '',
                courseSemester: '',
                teacherName: '',
                teacherId: '',
                courseCount: '',
                experienceTime: '',
                studentCount: '',
            },
            columns: {
                check: {
                    label: "",
                    sortable: false,
                    class: "text-center field-check"
                },
                courseName: {
                    label: "课堂名称",
                    sortable: false,
                    class: "text-center field-courseName"
                },
                courseSeqNum: {
                    label: "课序号",
                    sortable: false,
                    class: "text-center field-courseSeqNum"
                },
                courseSemester: {
                    label: "开课学期",
                    sortable: false,
                    class: "text-center field-courseSemester"
                },
                teacherId: {
                    label: "工号",
                    sortable: false,
                    class: "text-center field-teacherId"
                },
                courseCount: {
                    label: "课时",
                    sortable: false,
                    class: "text-center field-courseCount"
                },
                experienceTime: {
                    label: "实验学时",
                    sortable: false,
                    class: "text-center field-experienceTime"
                },
                studentCount: {
                    label: "学生人数",
                    sortable: false,
                    class: "text-center field-studentCount"
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
                positions: [],
                total: 0
            }
        };
    },
    created() {
        this.$nextTick(() => {
            // this.queryCompanyUsers();
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
            CourseService.queryCompanyUsers({
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
            CourseService.resetPass(this.reset)
                .then(res => {
                    if (res.results === "success")
                        CourseService.queryCompanyUsers({
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
        cancelExcel(errText) {
            confirm('没有填写好' + errText);
            this.excelDataError = true;
            this.$refs["uploadExcel"].hide();
        },
        excelSave() {
            let excelData = [];
            for (let id in this.tableData) {
                excelData.push({
                    name: this.tableData[id].姓名 === undefined ? this.cancelExcel('姓名') : this.tableData[id].姓名,
                    username: this.tableData[id].用户名 === undefined ? this.cancelExcel('用户名') : this.tableData[id].用户名,
                    gender: this.tableData[id].性别 === undefined ? this.cancelExcel('性别') : this.tableData[id].性别,
                    phone: this.tableData[id].手机号 === undefined ? this.cancelExcel('手机号') : this.tableData[id].手机号,
                    email: this.tableData[id].邮箱 === undefined ? this.cancelExcel('邮箱') : this.tableData[id].邮箱,
                    part: this.tableData[id].部门 === undefined ? '' : this.tableData[id].部门,
                    position: this.tableData[id].职务 === undefined ? '' : this.tableData[id].职务
                });
            }
            if (this.excelDataError) {
                this.excelDataError = false;
                return;
            }
            else
                this.run();
            CourseService.excelDataSave({
                excelData: JSON.stringify(excelData)
            })
                .then(res => {
                    if (res.results === "success")
                        CourseService.queryCompanyUsers({
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
        newCourseSave(evt) {
            evt.preventDefault();
            this.run();
            CourseService.newCourseSet(this.newItem)
                .then(res => {
                    if (res.results === "success")
                        CourseService.queryCompanyUsers({
                            ...this.queryParam,
                            ...this.queryDebounceParam
                        })
                            .then(data => {
                                this.allData.list = data.results;
                                this.allData.positions = data.positions;
                                this.allData.total = data.paging.count;
                                this.$emit("data-ready");
                                this.$refs["newCourse"].hide();
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
                CourseService.deleteUsers({
                    ids: JSON.stringify(this.selected)
                })
                    .then(res => {
                        if (res.results === "success")
                            CourseService.queryCompanyUsers({
                                ...this.queryParam,
                                ...this.queryDebounceParam
                            })
                                .then(data => {
                                    this.allData.list = data.results;
                                    this.allData.positions = data.positions;
                                    this.allData.total = data.paging.count;
                                    this.$emit("data-ready");
                                    this.$refs["newCourse"].hide();
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
.classic-course {
    .field-check {
        width: 3%;
        padding-top: 11px;
        text-align: right !important;
    }
    .field-courseName {
        width: 9%;
        text-align: left !important;
    }
    .field-courseSeqNum {
        width: 10%;
        text-align: left !important;
    }
    .field-courseSemester {
        width: 10%;
        text-align: left !important;
    }
    .field-teacherId {
        width: 7%;
        text-align: left !important;
    }
    .field-courseCount {
        width: 18%;
        text-align: left !important;
    }
    .field-experienceTime {
        width: 18%;
        text-align: left !important;
    }
    .field-studentCount {
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
