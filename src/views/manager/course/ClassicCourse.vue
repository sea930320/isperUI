<template>
  <div class="classic-course">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv">
      <b-col lg="5" md="6" sm="12">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder />
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
                                teacherName1: '',
                                teacherId1: '',
                                teacherName2: '',
                                teacherId2: '',
                                teacherName3: '',
                                teacherId3: '',
                                courseCount: '',
                                experienceTime: ''
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
            @click="deleteCourse"
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
        <template slot="studentCount" slot-scope="row">{{getStudentCount(row.item.linked_team)}}</template>
        <template slot="action" slot-scope="row">
          <b-button
            class="styledBtn"
            :key="'a'+row.item.id"
            :size="template_size"
            variant="outline-primary"
            @click="editOpen(row)"
          >编 辑</b-button>
          <b-button
            class="styledBtn"
            :key="'c'+row.item.id"
            :size="template_size"
            variant="outline-primary"
            @click="detailOpen(row)"
          >查 看</b-button>
          <b-button
            class="styledBtn"
            :key="'b'+row.item.id"
            :size="template_size"
            variant="outline-primary"
            @click="teacherEditOpen(row)"
          >关联指导者</b-button>
          <b-button
            class="styledBtn"
            :key="'d'+row.item.id"
            :size="template_size"
            variant="outline-primary"
            @click="teamOpen(row)"
          >团队管理</b-button>
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
    <b-modal
      hide-footer
      centered
      size="xl"
      id="uploadExcel"
      ref="uploadExcel"
      title="导入课堂"
      scrollable
    >
      <div>
        <div class="app-container">
          <div class="row justify-content-between">
            <el-link
              style="margin-left: 20px; color: #409EFF;font-size: 18px;"
              href="/api/course/sampleCourseExcel"
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
          <upload-excel-component :on-success="handleSuccess" />
          <el-table
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%;margin-top:20px;"
          >
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
          </el-table>
        </div>
      </div>
    </b-modal>
    <b-modal hide-footer centered id="newCourse" ref="newCourse" title="新建课堂">
      <div>
        <b-form @submit="newCourseSave" class="container pt-3">
          <b-form-group id="input-group-7" label-for="name">
            <b-form-input v-model="newItem.courseId" required placeholder="课程号 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-8" label-for="input-2">
            <b-form-input v-model="newItem.courseName" required placeholder="课程名 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-10" label-for="input-2" class="float-left w-40">
            <b-form-input v-model="newItem.courseSeqNum" required placeholder="课序号 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-12" label-for="input-2" class="float-right w-40">
            <b-form-input v-model="newItem.courseSemester" required placeholder="开课学期 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-13" label-for="input-2" class="float-left w-40">
            <b-form-input v-model="newItem.teacherName1" required placeholder="任课老师1 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-14" label-for="input-2" class="float-right w-40">
            <b-form-input v-model="newItem.teacherId1" required placeholder="工号1 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-13" label-for="input-2" class="float-left w-40">
            <b-form-input v-model="newItem.teacherName2" placeholder="任课老师2"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-14" label-for="input-2" class="float-right w-40">
            <b-form-input v-model="newItem.teacherId2" placeholder="工号2"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-13" label-for="input-2" class="float-left w-40">
            <b-form-input v-model="newItem.teacherName3" placeholder="任课老师3"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-14" label-for="input-2" class="float-right w-40">
            <b-form-input v-model="newItem.teacherId3" placeholder="工号3"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-15" label-for="input-2" class="float-left w-40">
            <b-form-input v-model="newItem.courseCount" required placeholder="课时 *"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-16" label-for="input-2" class="float-right w-40">
            <b-form-input v-model="newItem.experienceTime" required placeholder="实验学时"></b-form-input>
          </b-form-group>
          <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存</b-button>
          <b-button
            class="mt-3 my-4 col-5 float-right"
            block
            variant="primary"
            @click="this.$refs['newCourse'].hide()"
          >取 消</b-button>
        </b-form>
      </div>
    </b-modal>
    <b-modal hide-footer centered id="editCourse" ref="editCourse" title="编辑课堂">
      <div>
        <b-form @submit="editCourseSave" class="container pt-3">
          <b-form-group id="editCourse-8" label-for="input-2">
            <b-form-input v-model="editItem.courseName" required placeholder="课程名"></b-form-input>
          </b-form-group>
          <b-form-group id="editCourse-12" label-for="input-2" class="float-left w-30">
            <b-form-input v-model="editItem.courseSemester" required placeholder="开课学期"></b-form-input>
          </b-form-group>
          <b-form-group
            id="editCourse-15"
            label-for="input-2"
            class="float-left w-30"
            style="margin-left: 5%"
          >
            <b-form-input v-model="editItem.courseCount" required placeholder="课时"></b-form-input>
          </b-form-group>
          <b-form-group
            id="editCourse-16"
            label-for="input-2"
            class="float-left w-30"
            style="margin-left: 5%"
          >
            <b-form-input v-model="editItem.experienceTime" required placeholder="实验学时"></b-form-input>
          </b-form-group>
          <b-button class="mt-3 my-4 col-5 float-left" block type="submit" variant="primary">保 存</b-button>
          <b-button
            class="mt-3 my-4 col-5 float-right"
            block
            variant="primary"
            @click="hideEditCourse()"
          >取 消</b-button>
        </b-form>
      </div>
    </b-modal>
    <b-modal hide-footer centered id="teacherEditCourse" ref="teacherEditCourse" title="关联指导者">
      <div>
        <b-form-select class="mb-1" v-model="selectedTeacher1" :options="teacherList"></b-form-select>
        <b-form-select class="mb-1" v-model="selectedTeacher2" :options="teacherList"></b-form-select>
        <b-form-select v-model="selectedTeacher3" :options="teacherList"></b-form-select>
        <b-button variant="primary" @click="teacherChangeSave" class="mt-5">确&emsp;定</b-button>
      </div>
    </b-modal>
    <b-modal size="xl" hide-footer centered id="detailView" ref="detailView" title="查看详情">
      <div class="modalContainer" v-if="selectedRow">
        <table class="table b-table table-borderless table-sm">
          <thead role="rowgroup">
            <tr>
              <th class="text-center w-5">序号</th>
              <th class="text-center w-35">课堂名称</th>
              <th class="text-center w-10">课序号</th>
              <th class="text-center w-10">课时</th>
              <th class="text-center w-10">开课学期</th>
              <th class="text-center w-10">创建人</th>
              <th class="text-center w-20">创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{selectedRow.id}}</td>
              <td>{{selectedRow.courseFullName}}</td>
              <td>{{selectedRow.courseSeqNum}}</td>
              <td>{{selectedRow.courseCount}}</td>
              <td>{{selectedRow.courseSemester}}</td>
              <td>{{selectedRow.created_by}}</td>
              <td>{{selectedRow.create_time}}</td>
            </tr>
          </tbody>
        </table>
        <b-row class="m-0 p-0">
          <b-col class="pl-0">
            <table class="table b-table table-borderless table-sm mt-3">
              <thead role="rowgroup">
                <tr>
                  <th class="text-center">工号</th>
                  <th class="text-center">任课老师</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in selectedRow.students" :key="'student' + index">
                  <td>{{student.student_id}}</td>
                  <td>{{student.name}}</td>
                </tr>
              </tbody>
            </table>
          </b-col>
          <b-col class="pr-0">
            <table class="table b-table table-borderless table-sm mt-3">
              <thead role="rowgroup">
                <tr>
                  <th class="text-center">学号</th>
                  <th class="text-center">姓名</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(teacher, index) in selectedRow.teachers" :key="'teacher' + index">
                  <td>{{teacher.teacher_id}}</td>
                  <td>{{teacher.name}}</td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
        <!-- <b-row class="justify-content-center mt-5" style="font-size: 20px;">业 务 清 单</b-row> -->
        <table class="table b-table table-borderless table-sm mt-3">
          <thead role="rowgroup">
            <tr>
              <th class="text-center">业务序号</th>
              <th class="text-center">业务名称</th>
              <th class="text-center">业务单位</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedRow.linked_business" :key="index">
              <td>{{item.id}}</td>
              <td>{{item.name}}</td>
              <td>{{item.target_company}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    <b-modal size="xl" hide-footer centered id="teamView" ref="teamView" title="团队管理">
      <div class="modalContainer" v-if="selectedRow">
        <b-row class="justify-content-center" style="font-size: 20px;">团 队 清 单</b-row>
        <table class="table b-table table-borderless table-sm mt-3">
          <thead role="rowgroup">
            <tr>
              <th class="text-center">团队序号</th>
              <th class="text-center">团队名称</th>
              <th class="text-center">团队领导人</th>
              <th class="text-center">创建时间</th>
              <th class="text-center">团队数</th>
              <th class="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedRow.linked_team" :key="'teamview' + index">
              <td>{{item.id}}</td>
              <td>{{item.name}}</td>
              <td>{{item.leader}}</td>
              <td>{{item.create_time}}</td>
              <td>{{item.member_count}}</td>
              <td>
                <b-button
                  class="styledBtn"
                  :size="template_size"
                  variant="outline-primary"
                  @click="teamMemberModal(item.members)"
                >团队成员</b-button>
                <b-button
                  class="styledBtn"
                  :size="template_size"
                  variant="outline-primary"
                  @click="teamBusinessModal(item.businesses)"
                >业务信息</b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    <b-modal size="md" hide-footer centered id="teamMemberView" ref="teamMemberView" title="团队成员">
      <div class="modalContainer" v-if="selectedRow">
        <table class="table b-table table-borderless table-sm mt-3">
          <thead role="rowgroup">
            <tr>
              <th class="text-center">工号</th>
              <th class="text-center">任课老师</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in selectedTeamMembers" :key="'student1' + index">
              <td>{{student.student_id}}</td>
              <td>{{student.name}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    <b-modal
      size="md"
      hide-footer
      centered
      id="teamBusinessView"
      ref="teamBusinessView"
      title="团队成员"
    >
      <div class="modalContainer" v-if="selectedRow">
        <table class="table b-table table-borderless table-sm mt-3">
          <thead role="rowgroup">
            <tr>
              <th class="text-center">序号</th>
              <th class="text-center">业务名称</th>
              <th class="text-center">申请时间</th>
              <th class="text-center">申请人</th>
              <th class="text-center">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(business, index) in selectedTeamBusinesses" :key="'business' + index">
              <td>{{business.id}}</td>
              <td>{{business.name}}</td>
              <td>{{business.create_time}}</td>
              <td>{{business.create_by && business.create_by.name}}</td>
              <td>{{business.status | businessStatus}}</td>
            </tr>
          </tbody>
        </table>
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
import utils from "@/utils/util";
import { businessStatus } from "@/filters/fun";

export default {
  name: "classic-course",
  components: {
    BRow,
    Loading,
    UploadExcelComponent
  },
  filters: { businessStatus },
  data() {
    return {
      selected: [],
      tableData: [],
      tableHeader: [],
      excelDataError: false,
      newItem: {
        courseId: "",
        courseName: "",
        courseSeqNum: "",
        courseSemester: "",
        teacherName1: "",
        teacherId1: "",
        teacherName2: "",
        teacherId2: "",
        teacherName3: "",
        teacherId3: "",
        courseCount: "",
        experienceTime: ""
      },
      editItem: {
        id: null,
        courseName: "",
        courseSemester: "",
        courseCount: "",
        experienceTime: ""
      },
      columns: {
        check: {
          label: "",
          sortable: false,
          class: "text-left field-check"
        },
        id: {
          label: "序号",
          sortable: false,
          class: "text-right field-id"
        },
        courseFullName: {
          label: "课堂名称",
          sortable: false,
          class: "text-left field-courseFullName"
        },
        courseSeqNum: {
          label: "课序号",
          sortable: false,
          class: "text-right field-courseSeqNum"
        },
        courseSemester: {
          label: "开课学期",
          sortable: false,
          class: "text-left field-courseSemester"
        },
        teacherId: {
          label: "工号",
          sortable: false,
          class: "text-right field-teacherId"
        },
        courseCount: {
          label: "课时",
          sortable: false,
          class: "text-right field-courseCount"
        },
        experienceTime: {
          label: "实验学时",
          sortable: false,
          class: "text-right field-experienceTime"
        },
        created_by: {
          label: "创建人",
          sortable: false,
          class: "text-left field-created_by"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-create_time"
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
        total: 0
      },
      selectedId: null,
      selectedTeacher1: null,
      selectedTeacher2: null,
      selectedTeacher3: null,
      teacherList: [],
      selectedRow: {},
      selectedTeamMembers: [],
      selectedTeamBusinesses: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.getCourseFullList();
      if (!Array.prototype.equals)
        Array.prototype.equals = function(array) {
          if (!array) return false;

          if (this.length !== array.length) return false;

          for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
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
        this.getCourseFullList();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.getCourseFullList();
      }, 500)
    }
  },
  methods: {
    getCourseFullList() {
      this.run();
      CourseService.getCourseFullList({
        ...this.queryParam,
        ...this.queryDebounceParam
      })
        .then(data => {
          this.allData.list = data.results;
          this.allData.list = _.map(this.allData.list, item => {
            item.teacherId = "";
            item.teachers.forEach(element => {
              if (item.teacherId == "") {
                item.teacherId =
                  element.name + "-" + element.teacher_id;
              } else {
                item.teacherId +=
                  ", " + element.name + "-" + element.teacher_id;
              }
            });
            return item;
          });
          this.allData.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    handleSuccess({ results, header }) {
      if (
        !header.equals([
          "课程号",
          "课程名",
          "课序号",
          "开课学期",
          "任课老师1",
          "工号1",
          "任课老师2",
          "工号2",
          "任课老师3",
          "工号3",
          "课时",
          "实验学时",
          "学号",
          "姓名",
          "班级"
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
    hideEditCourse() {
      this.$refs["editCourse"].hide();
    },
    cancelExcel(errText) {
      confirm("没有填写好" + errText);
      this.excelDataError = true;
      this.$refs["uploadExcel"].hide();
    },
    /* eslint-disable */
    cancelExcel1(errText) {
      confirm("正确输入教师姓名和号码");
      this.excelDataError = true;
      this.$refs["uploadExcel"].hide();
    },
    excelSave() {
      let excelData = [];
      for (let id in this.tableData) {
        excelData.push({
          courseId:
            this.tableData[id].课程号 === undefined
              ? this.cancelExcel("课程号")
              : this.tableData[id].课程号,
          courseName:
            this.tableData[id].课程名 === undefined
              ? this.cancelExcel("课程名")
              : this.tableData[id].课程名,
          courseSeqNum:
            this.tableData[id].课序号 === undefined
              ? this.cancelExcel("课序号")
              : this.tableData[id].课序号,
          courseSemester:
            this.tableData[id].开课学期 === undefined
              ? this.cancelExcel("开课学期")
              : this.tableData[id].开课学期,
          teacherName1:
            this.tableData[id].任课老师1 === undefined
              ? this.cancelExcel("任课老师1")
              : this.tableData[id].任课老师1,
          teacherId1:
            this.tableData[id].工号1 === undefined
              ? this.cancelExcel("工号1")
              : this.tableData[id].工号1,
          teacherName2: utils.myXOR(
            this.tableData[id].任课老师2 === undefined,
            this.tableData[id].工号2 === undefined
          )
            ? this.cancelExcel1("任课老师2, 工号2")
            : this.tableData[id].任课老师2,
          teacherId2: utils.myXOR(
            this.tableData[id].任课老师2 === undefined,
            this.tableData[id].工号2 === undefined
          )
            ? ""
            : this.tableData[id].工号2,
          teacherName3: utils.myXOR(
            this.tableData[id].任课老师3 === undefined,
            this.tableData[id].工号3 === undefined
          )
            ? this.cancelExcel1("任课老师3, 工号3")
            : this.tableData[id].任课老师3,
          teacherId3: utils.myXOR(
            this.tableData[id].任课老师3 === undefined,
            this.tableData[id].工号3 === undefined
          )
            ? ""
            : this.tableData[id].工号3,
          courseCount:
            this.tableData[id].课时 === undefined
              ? this.cancelExcel("课时")
              : this.tableData[id].课时,
          experienceTime:
            this.tableData[id].实验学时 === undefined
              ? this.cancelExcel("实验学时")
              : this.tableData[id].实验学时,
          studentNo:
            this.tableData[id].学号 === undefined
              ? this.cancelExcel("学号")
              : this.tableData[id].学号,
          studentName:
            this.tableData[id].姓名 === undefined
              ? this.cancelExcel("姓名")
              : this.tableData[id].姓名,
          studentClassName:
            this.tableData[id].班级 === undefined
              ? null
              : this.tableData[id].班级
        });
      }
      if (this.excelDataError) {
        this.excelDataError = false;
        return;
      }
      excelData = _.chain(excelData)
        .groupBy("courseId")
        .map((item, courseId) => {
          return { item, courseId };
        })
        .value();
      this.run();
      CourseService.excelDataSave({
        excelData: JSON.stringify(excelData)
      })
        .then(res => {
          if (res.results === "success")
            CourseService.getCourseFullList({
              ...this.queryParam,
              ...this.queryDebounceParam
            })
              .then(data => {
                this.allData.list = data.results;
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
      let param = this.newItem;
      if (
        utils.myXOR(
          this.newItem.teacherName2.trim() == "",
          this.newItem.teacherId2.trim() == ""
        ) ||
        utils.myXOR(
          this.newItem.teacherName3.trim() == "",
          this.newItem.teacherId3.trim() == ""
        )
      ) {
        this.$toasted.error("正确输入教师姓名和号码");
        return;
      }
      this.run();
      let teachers = [
        {
          teacher_name: this.newItem.teacherName1,
          teacher_id: this.newItem.teacherId1
        }
      ];
      if (
        this.newItem.teacherId2.trim() != "" &&
        this.newItem.teacherName2.trim() != ""
      ) {
        teachers.push({
          teacher_name: this.newItem.teacherName2,
          teacher_id: this.newItem.teacherId2
        });
      }
      if (
        this.newItem.teacherId3.trim() != "" &&
        this.newItem.teacherName3.trim() != ""
      ) {
        teachers.push({
          teacher_name: this.newItem.teacherName3,
          teacher_id: this.newItem.teacherId3
        });
      }
      param.teachers = JSON.stringify(teachers);
      CourseService.saveNewCourse(param)
        .then(res => {
          if (res.results === "success")
            CourseService.getCourseFullList({
              ...this.queryParam,
              ...this.queryDebounceParam
            })
              .then(data => {
                this.allData.list = data.results;
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
    deleteCourse() {
      if (this.selected.length !== 0 && confirm("您确定要删除该课堂吗？")) {
        this.run();
        CourseService.deleteCourse({
          ids: JSON.stringify(this.selected)
        })
          .then(res => {
            if (res.results === "success")
              CourseService.getCourseFullList({
                ...this.queryParam,
                ...this.queryDebounceParam
              })
                .then(data => {
                  this.allData.list = data.results;
                  this.allData.total = data.paging.count;
                  this.$emit("data-ready");
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
    },
    editOpen(row) {
      this.$refs["editCourse"].show();
      this.editItem = {
        id: row.item.id,
        courseName: row.item.courseName,
        courseSemester: row.item.courseSemester,
        courseCount: row.item.courseCount,
        experienceTime: row.item.experienceTime
      };
    },
    teacherEditOpen(row) {
      this.selectedId = row.item.id;
      this.run();
      CourseService.getTeacherList({})
        .then(res => {
          this.teacherList = res.results;
          this.selectedTeacher1 = row.item.teachers[0]
            ? row.item.teachers[0].id
            : null;
          this.selectedTeacher2 = row.item.teachers[1]
            ? row.item.teachers[1].id
            : null;
          this.selectedTeacher3 = row.item.teachers[2]
            ? row.item.teachers[2].id
            : null;
          this.$emit("data-ready");
          this.$refs["teacherEditCourse"].show();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    detailOpen(row) {
      this.$refs["detailView"].show();
      this.selectedRow = row.item;
    },
    teamMemberModal(members) {
      this.$refs["teamMemberView"].show();
      this.selectedTeamMembers = members;
    },
    teamBusinessModal(businesses) {
      this.$refs["teamBusinessView"].show();
      this.selectedTeamBusinesses = businesses;
    },
    teamOpen(row) {
      this.$refs["teamView"].show();
      this.selectedRow = row.item;
    },
    editCourseSave(evt) {
      evt.preventDefault();
      this.run();
      CourseService.saveEditCourse(this.editItem)
        .then(res => {
          if (res.results === "success")
            CourseService.getCourseFullList({
              ...this.queryParam,
              ...this.queryDebounceParam
            })
              .then(data => {
                this.allData.list = data.results;
                this.allData.total = data.paging.count;
                this.$emit("data-ready");
                this.$refs["editCourse"].hide();
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
    teacherChangeSave(evt) {
      evt.preventDefault();
      this.run();
      CourseService.teacherChangeSave({
        id: this.selectedId,
        teacher1: this.selectedTeacher1,
        teacher2: this.selectedTeacher2,
        teacher3: this.selectedTeacher3
      })
        .then(res => {
          if (res.results === "success")
            CourseService.getCourseFullList({
              ...this.queryParam,
              ...this.queryDebounceParam
            })
              .then(data => {
                this.allData.list = data.results;
                this.allData.total = data.paging.count;
                this.$emit("data-ready");
                this.$refs["teacherEditCourse"].hide();
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
    getStudentCount(teams) {
      let count = 0;
      teams.forEach(team => {
        count += team.member_count;
      });
      return count;
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.classic-course {
  .field-check {
    width: 1%;
    padding-top: 11px;
    text-align: right !important;
  }
  .field-id {
    width: 5%;
    text-align: left !important;
  }
  .field-courseFullName {
    width: 16%;
    text-align: left !important;
  }
  .field-courseSeqNum {
    width: 6%;
    text-align: left !important;
  }
  .field-courseSemester {
    width: 6%;
    text-align: left !important;
  }
  .field-teacherId {
    width: 8%;
    text-align: left !important;
  }
  .field-courseCount {
    width: 6%;
    text-align: left !important;
  }
  .field-experienceTime {
    width: 8%;
    text-align: left !important;
  }
  .field-created_by {
    width: 5%;
    text-align: left !important;
  }
  .field-create_time {
    width: 10%;
    text-align: center !important;
  }
  .field-action {
    width: 20%;
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
