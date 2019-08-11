<template>
  <div class="interest-course container">
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
      <b-col lg="9" md="6" class="align-self-center">
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
          >新建兴趣课堂</b-button>
          <b-button
            class="styledBtn fontedBtn"
            :size="template_size"
            variant="outline-primary"
            @click="deleteCourse"
          >删除兴趣课堂</b-button>
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
        <template slot="id" slot-scope="row">
          <b-form-checkbox
            :id="row.item.id.toString()"
            v-model="selected"
            name="checkbox"
            :value="row.item.id"
            unchecked-value
          >{{row.item.id}}</b-form-checkbox>
        </template>
        <template slot="action" slot-scope="row">
          <b-button
            class="styledBtn"
            :size="template_size"
            variant="outline-primary"
            @click="editOpen(row)"
          >编 辑</b-button>
          <b-button
            class="styledBtn"
            :size="template_size"
            variant="outline-primary"
            @click="detailOpen(row)"
          >查 看</b-button>
          <b-button
            class="styledBtn"
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
    <b-modal size="lg" hide-footer centered id="detailView" ref="detailView" title="查看详情">
      <b-container class="modalContainer" v-if="selectedRow">
        <b-row>
          <b-col md="4" sm="4" class="text-left">序号：{{selectedRow.id}}</b-col>
          <b-col md="4" sm="4" class="text-left">课堂名称：{{selectedRow.courseName}}</b-col>
        </b-row>
        <b-row>
          <b-col md="4" sm="12" class="text-left">创建人：{{selectedRow.created_by}}</b-col>
          <b-col md="4" sm="12" class="text-left">创建时间：{{selectedRow.create_time}}</b-col>
          <b-col md="4" sm="12" class="text-left">关联课程：{{selectedRow.teacherName}}</b-col>
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
        <b-row v-for="item in selectedRow.linked_team" :key="'teamView' + item.id">
          <b-col md="2" sm="12">{{item.id}}</b-col>
          <b-col md="2" sm="12">{{item.name}}</b-col>
          <b-col md="3" sm="12">{{item.leader}}</b-col>
          <b-col md="3" sm="12">{{item.create_time}}</b-col>
          <b-col md="2" sm="12">{{item.member_count}}</b-col>
        </b-row>
      </b-container>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import CourseService from "@/services/courseService";
import _ from "lodash";
import BRow from "bootstrap-vue/src/components/layout/row";

export default {
  name: "interest-course",
  components: {
    BRow,
    Loading
  },
  data() {
    return {
      selected: [],
      columns: {
        id: {
          label: "序号",
          sortable: false,
          class: "text-right field-id"
        },
        courseName: {
          label: "课堂名称",
          sortable: false,
          class: "text-left field-courseName"
        },
        created_by: {
          label: "创建人",
          sortable: false,
          class: "text-left field-created_by"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-right field-create_time"
        },
        teacherName: {
          label: "关联课程",
          sortable: false,
          class: "text-left field-teacherName"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-left field-action"
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
      selectedRow: {},
      newItem: {
        courseId: "",
        courseName: "",
        courseSeqNum: "",
        courseSemester: "",
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
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.queryInterestCourse();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    queryParam: {
      handler() {
        this.queryInterestCourse();
      },
      deep: true
    },
    queryDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.queryInterestCourse();
      }, 500)
    }
  },
  methods: {
    queryInterestCourse() {
      this.run();
      CourseService.getHobbyCourseList({
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
    detailOpen(row) {
      this.$refs["detailView"].show();
      this.selectedRow = row.item;
    },
    teamOpen(row) {
      this.$refs["teamView"].show();
      this.selectedRow = row.item;
    },
    newCourseSave(evt) {
      evt.preventDefault();
      this.run();
      CourseService.saveNewCourse(this.newItem)
        .then(res => {
          if (res.results === "success") {
            this.queryInterestCourse();
            this.$refs["newCourse"].hide();
          } else this.$emit("data-failed");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
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
    editCourseSave(evt) {
      evt.preventDefault();
      this.run();
      CourseService.saveEditCourse(this.editItem)
        .then(res => {
          if (res.results === "success") {
            this.queryInterestCourse();
            this.$refs["editCourse"].hide();
          } else this.$emit("data-failed");
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
            if (res.results === "success") this.queryInterestCourse();
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
.interest-course {
}
</style>
