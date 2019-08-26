<template>
  <div class="outside-course">
    <loading v-if="isRunning"></loading>
    <b-row class="cardDiv">
      <b-col lg="3" md="6" sm="12">
        <b-input-group :size="template_size">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryDebounceParam.search" placeholder />
        </b-input-group>
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
        <template slot="studentCount" slot-scope="row">{{getStudentCount(row.item.linked_team)}}</template>
        <template slot="action" slot-scope="row">
          <b-button
            class="styledBtn"
            :key="'c'+row.item.id"
            :size="template_size"
            variant="outline-primary"
            @click="detailOpen(row)"
          >查 看</b-button>
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
        <b-modal size="xl" hide-footer centered id="detailView" ref="detailView" title="查看详情">
      <div class="modalContainer" v-if="selectedRow">
        <table class="table b-table table-borderless table-sm">
          <thead role="rowgroup">
            <tr>
              <th class="text-center w-5">序号</th>
              <th class="text-center w-35">身份名称</th>
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
      <b-container class="modalContainer" v-if="selectedRow">
        <b-row class="justify-content-center" style="font-size: 20px;">团 队 清 单</b-row>
        <b-row class="my-2">
          <b-col md="2" sm="12">团队序号</b-col>
          <b-col md="2" sm="12">团队名称</b-col>
          <b-col md="3" sm="12">团队领导人</b-col>
          <b-col md="3" sm="12">创建时间</b-col>
          <b-col md="2" sm="12">团队数</b-col>
        </b-row>
        <b-row v-for="item in selectedRow.linked_team">
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
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";

export default {
  name: "outside-course",
  components: {
    BRow,
    Loading
  },
  data() {
    return {
      columns: {
        id: {
          label: "序号",
          sortable: false,
          class: "text-center field-id"
        },
        courseName: {
          label: "课堂名称",
          sortable: false,
          class: "text-left field-courseName"
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
        size: 5
      },
      queryDebounceParam: {
        search: ""
      },
      allData: {
        list: [],
        total: 0
      },
      selectedRow: {}
    };
  },
  created() {
    this.$nextTick(() => {
      this.queryGroupChanges();
    });
  },
  computed: {
    ...mapState(["userInfo"])
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
      handler: _.debounce(function() {
        this.queryGroupChanges();
      }, 500)
    }
  },
  methods: {
    queryGroupChanges() {
      this.run();
      CourseService.getHobbyCourseList({
        ...this.queryParam,
        ...this.queryDebounceParam
      })
        .then(data => {
          this.allData.list = data.results;
          this.allData.list = _.map(this.allData.list, item => {
            item.teacherId = "";
            item.teachers.forEach(element => {
              if (item.teacherId == "") {
                item.teacherId = element.teacher_id;
              } else {
                item.teacherId += ", " + element.teacher_id;
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
    detailOpen(row) {
      this.$refs["detailView"].show();
      this.selectedRow = row.item;
    },
    teamOpen(row) {
      this.$refs["teamView"].show();
      this.selectedRow = row.item;
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
.outside-course {
}
</style>
