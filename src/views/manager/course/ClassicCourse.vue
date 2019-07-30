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
          <b-form-group
            id="input-group-16"
            label-for="input-2"
            class="float-left w-30"
            style="margin-left: 5%"
          >
            <b-form-input v-model="newItem.experienceTime" required placeholder="实验学时"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-17" label-for="input-2" class="float-right w-30">
            <b-form-input v-model="newItem.studentCount" required placeholder="学生人数"></b-form-input>
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
            @click="this.$refs['editCourse'].hide()"
          >取 消</b-button>
        </b-form>
      </div>
    </b-modal>
    <b-modal hide-footer centered id="teacherEditCourse" ref="teacherEditCourse" title="关联指导者">
      <div>
        <b-form-select v-model="selectedTeacher" :options="teacherList"></b-form-select>
        <b-button
          variant="success"
          @click="teacherChangeSave"
          class="mt-5"
          :disabled="selectedTeacher === null"
        >确&emsp;定</b-button>
      </div>
    </b-modal>
    <b-modal size="lg" hide-footer centered id="detailView" ref="detailView" title="查看详情">
      <b-container class="modalContainer" v-if="selectedRow">
        <b-row>
          <b-col lg="3" md="4" sm="4" class="text-left">序号：{{selectedRow.id}}</b-col>
          <b-col lg="9" md="4" sm="4" class="text-left">课堂名称：{{selectedRow.courseFullName}}</b-col>
        </b-row>
        <b-row>
          <b-col lg="3" md="4" sm="12" class="text-left">课序号：{{selectedRow.courseSeqNum}}</b-col>
          <b-col lg="3" md="12" sm="12" class="text-left">课时：{{selectedRow.courseCount}}</b-col>
          <b-col md="3" sm="12" class="text-left">开课学期：{{selectedRow.courseSemester}}</b-col>
          <b-col md="3" sm="12" class="text-left">学生人数：{{selectedRow.studentCount}}</b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12" class="text-left">工号：{{selectedRow.teacherId}}</b-col>
          <b-col md="6" sm="12" class="text-left">实验学时：{{selectedRow.experienceTime}}</b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12" class="text-left">创建人：{{selectedRow.created_by}}</b-col>
          <b-col md="6" sm="12" class="text-left">创建时间：{{selectedRow.create_time}}</b-col>
        </b-row>
        <b-row class="justify-content-center mt-5" style="font-size: 20px;">业 务 清 单</b-row>
        <b-row class="my-2">
          <b-col md="2" sm="12">业务序号</b-col>
          <b-col md="5" sm="12">业务名称</b-col>
          <b-col md="5" sm="12">业务单位</b-col>
        </b-row>
        <b-row v-for="(item, index) in selectedRow.linked_business" :key="index">
          <b-col md="2" sm="12">{{item.id}}</b-col>
          <b-col md="5" sm="12">{{item.name}}</b-col>
          <b-col md="5" sm="12">{{item.target_company}}</b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal size="xl" hide-footer centered id="teamView" ref="teamView" title="团队管理">
      <b-container class="modalContainer" v-if="selectedRow">
        <b-row class="justify-content-center" style="font-size: 20px;">团 队 清 单</b-row>
        <b-row class="my-2">
          <b-col md="2" sm="12">团队序号</b-col>
          <b-col md="2" sm="12">团队名称</b-col>
          <b-col md="3" sm="12">团队领导人</b-col>
          <b-col md="3" sm="12">创建时间</b-col>
          <b-col md="2" sm="12">团队数</b-col>
        </b-row>
        <b-row v-for="(item, index) in selectedRow.linked_team" :key="'teamView' + index">
          <b-col md="2" sm="12">{{item.id}}</b-col>
          <b-col md="2" sm="12">{{item.name}}</b-col>
          <b-col md="3" sm="12">{{item.leader}}</b-col>
          <b-col md="3" sm="12">{{item.create_time}}</b-col>
          <b-col md="2" sm="12">{{item.member_count}}</b-col>
        </b-row>
      </b-container>
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
      newItem: {
        courseId: "",
        courseName: "",
        courseSeqNum: "",
        courseSemester: "",
        teacherName: "",
        teacherId: "",
        courseCount: "",
        experienceTime: "",
        studentCount: ""
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
          class: "text-center field-check"
        },
        id: {
          label: "序号",
          sortable: false,
          class: "text-center field-id"
        },
        courseFullName: {
          label: "课堂名称",
          sortable: false,
          class: "text-center field-courseFullName"
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
        created_by: {
          label: "创建人",
          sortable: false,
          class: "text-center field-created_by"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-create_time"
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
      selectedTeacher: null,
      teacherList: [],
      selectedRow: {}
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
          "任课老师",
          "工号",
          "课时",
          "实验学时",
          "学生人数",
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
    cancelExcel(errText) {
      confirm("没有填写好" + errText);
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
          teacherName:
            this.tableData[id].任课老师 === undefined
              ? this.cancelExcel("任课老师")
              : this.tableData[id].任课老师,
          teacherId:
            this.tableData[id].工号 === undefined
              ? this.cancelExcel("工号")
              : this.tableData[id].工号,
          courseCount:
            this.tableData[id].课时 === undefined
              ? this.cancelExcel("课时")
              : this.tableData[id].课时,
          experienceTime:
            this.tableData[id].实验学时 === undefined
              ? this.cancelExcel("实验学时")
              : this.tableData[id].实验学时,
          studentCount:
            this.tableData[id].学生人数 === undefined
              ? this.cancelExcel("学生人数")
              : this.tableData[id].学生人数,
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
      this.run();
      CourseService.saveNewCourse(this.newItem)
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
          this.selectedTeacher = null;
          this.teacherList = res.results;
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
        teacher: this.selectedTeacher
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
    width: 20%;
    text-align: left !important;
  }
  .field-courseSeqNum {
    width: 4%;
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
    width: 3%;
    text-align: left !important;
  }
  .field-experienceTime {
    width: 8%;
    text-align: left !important;
  }
  .field-studentCount {
    width: 5%;
    text-align: left !important;
  }
  .field-created_by {
    width: 5%;
    text-align: left !important;
  }
  .field-create_time {
    width: 5%;
    text-align: left !important;
  }
  .field-action {
    width: 16%;
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
