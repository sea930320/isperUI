<template>
  <div class="student-guide-index container">
    <loading v-if="isRunning"></loading>
    <b-row>
      <b-col lg="3" md="3" sm="12">
        <div class="cardDiv course-selector p-0" style="background:#c7dbff">
          <b-list-group class="d-inline-flex m-0 p-0 w-100">
            <b-list-group-item class="course-name mb-1">课堂名称</b-list-group-item>
            <template v-for="(course, index) in courses">
              <b-list-group-item
                class="course-item"
                :key="'courseIndex' + index"
                :id="'courseIndex' + index"
                @click="selectCourse(course, index)"
                :active="activeItemId==='courseIndex' + index"
              >{{course.courseName}}</b-list-group-item>
            </template>
          </b-list-group>
        </div>
      </b-col>
      <b-col lg="9" md="9" sm="12">
        <b-form-group style="margin: 18px 0 0" class="text-left">
          <b-form-radio-group
            v-model="type"
            :options="options"
            buttons
            button-variant="primary"
            size="sm"
          ></b-form-radio-group>
        </b-form-group>
        <template v-if="type==0">
          <div class="cardDiv">
            <b-table
              :items="studentWatchingList.list"
              responsive
              small
              hover
              :fields="columns1"
              head-variant
            >
              <template slot="sn" slot-scope="row">{{ row.item.id }}</template>
              <template slot="name" slot-scope="row">{{row.item.business.name}}</template>
              <template
                slot="company_name"
                slot-scope="row"
              >{{row.item.business.company && row.item.business.company.name}}</template>
              <template slot="team_name" slot-scope="row">{{row.item.team.name}}</template>
              <template slot="create_time" slot-scope="row">{{row.item.business.create_time}}</template>
              <template slot="status" slot-scope="row">{{row.item.business.status| businessStatus}}</template>
              <template slot="action" slot-scope="row">
                <b-button
                  class="styledBtn"
                  variant="outline-primary"
                  v-if="row.item.business.status==9"
                >评论</b-button>
                <b-button
                  class="styledBtn"
                  variant="outline-primary"
                  v-if="row.item.business.status==2"
                  :to="'/student/enter-business/' + row.item.business.id"
                >进入指导</b-button>
              </template>
            </b-table>
          </div>
          <div class="cardDiv">
            <b-row class="justify-content-center row-margin-tweak">
              <b-pagination
                :size="template_size"
                :total-rows="studentWatchingList.total"
                :per-page="queryWatchingParam.size"
                limit="5"
                v-model="queryWatchingParam.page"
              />
            </b-row>
          </div>
        </template>
        <template v-else>
          <div class="cardDiv">
            <b-table :items="teamList.list" responsive small hover :fields="columns2" head-variant>
              <template slot="sn" slot-scope="row">{{ row.item.id }}</template>
              <template slot="name" slot-scope="row">{{row.item.name}}</template>
              <template slot="team_leader" slot-scope="row">{{row.item.team_leader.name}}</template>
              <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
              <template slot="status" slot-scope="row">{{row.item.type ?"开放":"不开放"}}</template>
              <template slot="action"></template>
            </b-table>
          </div>
          <div class="cardDiv">
            <b-row class="justify-content-center row-margin-tweak">
              <b-pagination
                :size="template_size"
                :total-rows="teamList.total"
                :per-page="queryTeamParam.size"
                limit="5"
                v-model="queryTeamParam.page"
              />
            </b-row>
          </div>
        </template>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import studentService from "@/services/studentService";
import Loading from "@/components/loading/Loading";
import { businessStatus } from "@/filters/fun";
export default {
  mixins: [],
  components: { Loading },
  filters: { businessStatus },
  data() {
    return {
      courses: [],
      activeItemId: null,
      activeCourse: null,
      type: 0,
      options: [
        { text: "课外下关注的业务", value: 0 },
        { text: "课堂下的团队", value: 1 }
      ],
      studentWatchingList: {
        list: [],
        total: 0
      },
      queryWatchingParam: {
        page: 1,
        size: 5
      },
      teamList: {
        list: [],
        total: 0
      },
      queryTeamParam: {
        page: 1,
        size: 5
      },
      columns1: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center w-5"
        },
        name: {
          label: "业务名称",
          sortable: false,
          class: "text-center w-20"
        },
        company_name: {
          label: "创建单位",
          sortable: false,
          class: "text-center w-20"
        },
        team_name: {
          label: "参与团队",
          sortable: false,
          class: "text-center w-10"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center w-15"
        },
        status: {
          label: "业务状态",
          sortable: false,
          class: "text-center w-20"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center w-10"
        }
      },
      columns2: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center w-5"
        },
        name: {
          label: "业务名称",
          sortable: false,
          class: "text-center w-20"
        },
        team_leader: {
          label: "队长",
          sortable: false,
          class: "text-center w-20"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center w-15"
        },
        status: {
          label: "开放邀请",
          sortable: false,
          class: "text-center w-20"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center w-10"
        }
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {},
  watch: {
    type() {
      if (this.courses.length > 0) {
        this.selectCourse(this.courses[0], 0);
      }
    }
  },
  methods: {
    init() {
      this.getCourseList();
    },
    getCourseList() {
      this.run();
      studentService
        .courseList()
        .then(data => {
          this.courses = data.results;
          if (this.courses.length > 0) {
            this.selectCourse(this.courses[0], 0);
          }
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    selectCourse(course, index) {
      this.activeItemId = "courseIndex" + index;
      this.activeCourse = course;
      if (this.type == 0) {
        this.getWatchingList();
      } else {
        this.getTeamList();
      }
    },
    getWatchingList() {
      this.run();
      studentService
        .watchingList({
          ...this.queryWatchingParam,
          ...{
            id: this.activeCourse.id
          }
        })
        .then(data => {
          this.studentWatchingList.list = data.results;
          this.studentWatchingList.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    getTeamList() {
      this.run();
      studentService
        .teamListByCourse({
          ...this.queryTeamParam,
          ...{
            id: this.activeCourse.id
          }
        })
        .then(data => {
          this.teamList.list = data.results;
          this.teamList.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.student-guide-index {
  .course-selector {
    .course-name {
      background: #4169e1;
      color: white;
    }
    .course-item {
      cursor: pointer;
    }
  }
  .list-group {
    .list-group-item {
      padding: 7px 8px 7px 15px;
      font-size: 15px;
    }
    .list-group-item.active {
      color: #fff;
      background-color: #4169e1;
      border-color: #4169e1;
    }
  }
}
</style>